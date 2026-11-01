import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  ITestCaseHookParameter,
  setDefaultTimeout,
  Status,
} from '@cucumber/cucumber';
import { Browser, BrowserType, chromium, firefox, webkit } from '@playwright/test';
import { envConfig } from '../config/env.config';
import { BrowserName } from '../types/environment.types';
import { CustomWorld } from './custom-world';

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'reports', 'screenshots');
const TRACES_DIR = path.resolve(process.cwd(), 'reports', 'traces');

const BROWSER_ENGINES: Readonly<Record<BrowserName, BrowserType>> = {
  chromium,
  firefox,
  webkit,
};

setDefaultTimeout(envConfig.defaultTimeoutMs);

let sharedBrowser: Browser | undefined;

function toSafeFileSlug(scenarioName: string): string {
  const slug = scenarioName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug.length > 0 ? slug.slice(0, 80) : 'escenario';
}

BeforeAll(async function (): Promise<void> {
  await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });
  await fs.mkdir(TRACES_DIR, { recursive: true });

  const browserEngine = BROWSER_ENGINES[envConfig.browser];
  sharedBrowser = await browserEngine.launch({
    headless: envConfig.headless,
    slowMo: envConfig.slowMoMs,
  });
});

Before(async function (this: CustomWorld): Promise<void> {
  if (sharedBrowser === undefined) {
    throw new Error('El navegador compartido no fue inicializado en BeforeAll.');
  }

  const context = await sharedBrowser.newContext({
    baseURL: envConfig.baseUrl,
    viewport: envConfig.viewport,
  });

  context.setDefaultTimeout(envConfig.defaultTimeoutMs);
  context.setDefaultNavigationTimeout(envConfig.navigationTimeoutMs);

  if (envConfig.traceOnFailure) {
    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });
  }

  const page = await context.newPage();
  this.attachBrowserSession(context, page);
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter): Promise<void> {
  if (!this.hasActiveSession) {
    return;
  }

  const isFailed = scenario.result?.status === Status.FAILED;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const scenarioSlug = toSafeFileSlug(scenario.pickle.name);

  try {
    if (isFailed && envConfig.screenshotOnFailure) {
      const screenshotPath = path.join(SCREENSHOTS_DIR, `${scenarioSlug}-${timestamp}.png`);
      const screenshotBuffer = await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
      this.attach(screenshotBuffer, 'image/png');
    }

    if (envConfig.traceOnFailure) {
      if (isFailed) {
        const tracePath = path.join(TRACES_DIR, `${scenarioSlug}-${timestamp}.zip`);
        await this.context.tracing.stop({ path: tracePath });
      } else {
        await this.context.tracing.stop();
      }
    }
  } finally {
    await this.page.close();
    await this.context.close();
    this.clearBrowserSession();
  }
});

AfterAll(async function (): Promise<void> {
  if (sharedBrowser !== undefined) {
    await sharedBrowser.close();
    sharedBrowser = undefined;
  }
});
