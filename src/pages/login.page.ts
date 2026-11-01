import { Locator, Page } from '@playwright/test';
import { CredentialsData } from '../types/environment.types';
import { BasePage } from './base.page';

/**
 * Page Object plantilla para la vista de Inicio de Sesión.
 *
 * Responsabilidades:
 * 1. Centralizar localizadores resilientes orientados al usuario (getByLabel, getByRole, getByTestId).
 * 2. Exponer interacciones atómicas y flujos compuestos de interfaz sin incluir aserciones de negocio.
 *
 * Adapta las etiquetas accesibles o testIds de este archivo a los contratos reales de tu aplicación (AUT).
 */
export class LoginPage extends BasePage {

  public readonly usernameInput: Locator;
  public readonly passwordInput: Locator;
  public readonly submitButton: Locator;
  public readonly errorAlert: Locator;
  public readonly dashboardHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.getByLabel('Usuario');
    this.passwordInput = this.page.getByLabel('Contraseña');
    this.submitButton = this.page.getByRole('button', { name: 'Iniciar sesión' });
    this.errorAlert = this.page.getByRole('alert');
    this.dashboardHeading = this.page.getByTestId('dashboard-heading');
  }

  public async open(): Promise<void> {
    await this.navigateTo("");
  }

  public async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  public async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  public async submitCredentials(): Promise<void> {
    await this.submitButton.click();
  }

  public async loginWithCredentials(credentials: CredentialsData): Promise<void> {
    await this.enterUsername(credentials.username);
    await this.enterPassword(credentials.password);
    await this.submitCredentials();
  }
}
