export type TargetEnvironment = 'desa' | 'test' | 'pre' | 'prod';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export interface ViewportDimensions {
  readonly width: number;
  readonly height: number;
}

export interface EnvironmentConfig {
  readonly env: TargetEnvironment;
  readonly baseUrl: string;
  readonly browser: BrowserName;
  readonly headless: boolean;
  readonly slowMoMs: number;
  readonly defaultTimeoutMs: number;
  readonly navigationTimeoutMs: number;
  readonly traceOnFailure: boolean;
  readonly screenshotOnFailure: boolean;
  readonly viewport: ViewportDimensions;
}

export interface CredentialsData {
  readonly username: string;
  readonly password: string;
}

/**
 * Mapa tipado de claves permitidas en el estado compartido por escenario (CustomWorld).
 * Registra aquí cada clave de contexto con su tipo estricto para validación en tiempo de compilación.
 */
export interface ScenarioStateMap {
  readonly credentials: CredentialsData;
  readonly attemptCount: number;
}
