import { Page } from '@playwright/test';

/**
 * Clase base del patrón Page Object Model (POM).
 * Encapsula únicamente operaciones estructurales de navegación y consulta del documento,
 * delegando todas las aserciones de negocio a las Step Definitions.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async navigateTo(relativePath: string): Promise<void> {
    await this.page.goto(relativePath);
  }

  public getCurrentUrl(): string {
    return this.page.url();
  }

  public async getTitle(): Promise<string> {
    return this.page.title();
  }
}
