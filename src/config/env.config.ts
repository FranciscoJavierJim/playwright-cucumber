import * as path from 'node:path';
import * as fs from 'node:fs';
import * as dotenv from 'dotenv';
import { BrowserName, EnvironmentConfig, TargetEnvironment } from '../types/environment.types';

function parseTargetEnvironment(rawValue: string | undefined): TargetEnvironment {
  const normalized = (rawValue ?? 'test').trim().toLowerCase();
  if (
    normalized === 'desa' ||
    normalized === 'test' ||
    normalized === 'pre' ||
    normalized === 'prod'
  ) {
    return normalized;
  }
  throw new Error(
    `Valor inválido para TEST_ENV: "${rawValue ?? ''}". Valores permitidos: desa, test, pre, prod.`,
  );
}

function parseBrowserName(rawValue: string | undefined): BrowserName {
  const normalized = (rawValue ?? 'chromium').trim().toLowerCase();
  if (normalized === 'chromium' || normalized === 'firefox' || normalized === 'webkit') {
    return normalized;
  }
  throw new Error(
    `Valor inválido para BROWSER: "${rawValue ?? ''}". Valores permitidos: chromium, firefox, webkit.`,
  );
}

function parseBoolean(
  rawValue: string | undefined,
  defaultValue: boolean,
  variableName: string,
): boolean {
  if (rawValue === undefined || rawValue.trim() === '') {
    return defaultValue;
  }
  const normalized = rawValue.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1') {
    return true;
  }
  if (normalized === 'false' || normalized === '0') {
    return false;
  }
  throw new Error(
    `Valor booleano inválido para ${variableName}: "${rawValue}". Utiliza "true" o "false".`,
  );
}

function parseInteger(
  rawValue: string | undefined,
  defaultValue: number,
  variableName: string,
  allowZero = false,
): number {
  if (rawValue === undefined || rawValue.trim() === '') {
    return defaultValue;
  }
  const parsed = Number.parseInt(rawValue.trim(), 10);
  const isInvalid = Number.isNaN(parsed) || (allowZero ? parsed < 0 : parsed <= 0);
  if (isInvalid) {
    throw new Error(
      `Valor numérico inválido para ${variableName}: "${rawValue}". Se esperaba un entero ${allowZero ? 'mayor o igual a 0' : 'positivo'}.`,
    );
  }
  return parsed;
}

function parseBaseUrl(rawValue: string | undefined, targetEnv: TargetEnvironment): string {
  if (rawValue === undefined || rawValue.trim() === '') {
    throw new Error(
      `La variable BASE_URL es obligatoria y no está definida para el entorno "${targetEnv}". Revisa el archivo .env.${targetEnv}.`,
    );
  }
  const trimmed = rawValue.trim();
  try {
    const parsedUrl = new URL(trimmed);
    return parsedUrl.toString().replace(/\/$/, '');
  } catch {
    throw new Error(
      `El valor de BASE_URL ("${trimmed}") no tiene un formato de URL válido (ej. https://dominio.com).`,
    );
  }
}

function loadEnvironmentConfig(): EnvironmentConfig {
  const targetEnv = parseTargetEnvironment(process.env.TEST_ENV);
  const envFilePath = path.resolve(process.cwd(), `.env.${targetEnv}`);

  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath, override: false });
  }

  return Object.freeze({
    env: targetEnv,
    baseUrl: parseBaseUrl(process.env.BASE_URL, targetEnv),
    browser: parseBrowserName(process.env.BROWSER),
    headless: parseBoolean(process.env.HEADLESS, true, 'HEADLESS'),
    slowMoMs: parseInteger(process.env.SLOW_MO_MS, 0, 'SLOW_MO_MS', true),
    defaultTimeoutMs: parseInteger(process.env.DEFAULT_TIMEOUT_MS, 30_000, 'DEFAULT_TIMEOUT_MS'),
    navigationTimeoutMs: parseInteger(
      process.env.NAVIGATION_TIMEOUT_MS,
      30_000,
      'NAVIGATION_TIMEOUT_MS',
    ),
    traceOnFailure: parseBoolean(process.env.TRACE_ON_FAILURE, true, 'TRACE_ON_FAILURE'),
    screenshotOnFailure: parseBoolean(
      process.env.SCREENSHOT_ON_FAILURE,
      true,
      'SCREENSHOT_ON_FAILURE',
    ),
    viewport: Object.freeze({
      width: parseInteger(process.env.VIEWPORT_WIDTH, 1440, 'VIEWPORT_WIDTH'),
      height: parseInteger(process.env.VIEWPORT_HEIGHT, 900, 'VIEWPORT_HEIGHT'),
    }),
  });
}

export const envConfig: EnvironmentConfig = loadEnvironmentConfig();
