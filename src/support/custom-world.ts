import { setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ScenarioStateMap } from '../types/environment.types';

/**
 * Contexto aislado por escenario de Cucumber (CustomWorld).
 * Gestiona el ciclo de vida de Page, BrowserContext, instancias POM y estado compartido entre Steps
 * evitando el uso de variables globales acopladas.
 */
export class CustomWorld extends World {
  private browserContextInstance: BrowserContext | undefined;
  private pageInstance: Page | undefined;
  private loginPageInstance: LoginPage | undefined;
  private readonly scenarioState = new Map<
    keyof ScenarioStateMap,
    ScenarioStateMap[keyof ScenarioStateMap]
  >();

  public get hasActiveSession(): boolean {
    return this.browserContextInstance !== undefined && this.pageInstance !== undefined;
  }

  public get context(): BrowserContext {
    if (this.browserContextInstance === undefined) {
      throw new Error(
        'BrowserContext no ha sido inicializado. Verifica que el Hook Before se haya ejecutado correctamente.',
      );
    }
    return this.browserContextInstance;
  }

  public get page(): Page {
    if (this.pageInstance === undefined) {
      throw new Error(
        'Page no ha sido inicializada. Verifica que el Hook Before se haya ejecutado correctamente.',
      );
    }
    return this.pageInstance;
  }

  public get loginPage(): LoginPage {
    if (this.loginPageInstance === undefined) {
      this.loginPageInstance = new LoginPage(this.page);
    }
    return this.loginPageInstance;
  }

  public attachBrowserSession(context: BrowserContext, page: Page): void {
    this.browserContextInstance = context;
    this.pageInstance = page;
    this.loginPageInstance = undefined;
  }

  public clearBrowserSession(): void {
    this.browserContextInstance = undefined;
    this.pageInstance = undefined;
    this.loginPageInstance = undefined;
    this.scenarioState.clear();
  }

  public setScenarioData<K extends keyof ScenarioStateMap>(
    key: K,
    value: ScenarioStateMap[K],
  ): void {
    this.scenarioState.set(key, value);
  }

  public getScenarioData<K extends keyof ScenarioStateMap>(
    key: K,
  ): ScenarioStateMap[K] | undefined {
    return this.scenarioState.get(key) as ScenarioStateMap[K] | undefined;
  }
}

setWorldConstructor(CustomWorld);
