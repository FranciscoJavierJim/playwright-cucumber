import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as reporter from 'multiple-cucumber-html-reporter';
import { envConfig } from '../config/env.config';

function mapPlatformName(nodePlatform: NodeJS.Platform): string {
  switch (nodePlatform) {
    case 'win32':
      return 'windows';
    case 'darwin':
      return 'osx';
    case 'linux':
      return 'linux';
    default:
      return nodePlatform;
  }
}

function buildHtmlReport(): void {
  const reportsDir = path.resolve(process.cwd(), 'reports');
  const cucumberJsonPath = path.join(reportsDir, 'cucumber-report.json');
  const htmlOutputDir = path.join(reportsDir, 'html-report');

  if (!fs.existsSync(cucumberJsonPath)) {
    throw new Error(
      `No se encontró el archivo JSON de resultados en "${cucumberJsonPath}". Ejecuta primero la suite de pruebas (ej. npm test).`,
    );
  }

  reporter.generate({
    jsonDir: reportsDir,
    reportPath: htmlOutputDir,
    reportName: 'Reporte de Ejecución E2E - QA Automation',
    pageTitle: 'QA Automation Dashboard',
    displayDuration: true,
    displayReportTime: true,
    openReportInBrowser: false,
    metadata: {
      browser: {
        name: envConfig.browser,
      },
      device: os.hostname(),
      platform: {
        name: mapPlatformName(os.platform()),
        version: os.release(),
      },
    },
    customData: {
      title: 'Contexto de Ejecución',
      data: [
        { label: 'Proyecto', value: 'qa-playwright-cucumber-ts' },
        { label: 'Entorno (TEST_ENV)', value: envConfig.env.toUpperCase() },
        { label: 'Base URL', value: envConfig.baseUrl },
        { label: 'Navegador', value: envConfig.browser },
        { label: 'Modo Headless', value: String(envConfig.headless) },
        {
          label: 'Viewport',
          value: `${envConfig.viewport.width}x${envConfig.viewport.height}`,
        },
        { label: 'Generado el', value: new Date().toISOString() },
      ],
    },
  });
}

buildHtmlReport();
