import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
//import { LoginPage } from '../pages/login.page';
import { CustomWorld } from '../support/custom-world';

Given(
  'el usuario se encuentra en la página de inicio de sesión',
  async function (this: CustomWorld): Promise<void> {
    await this.loginPage.open();
  },
);

When(
  'el usuario intenta autenticarse con el usuario {string} y la contraseña {string}',
  async function (
    this: CustomWorld,
    username: string,
    password: string,
  ): Promise<void> {
    await this.loginPage.loginWithCredentials({ username, password });
  },
);

Then(
  'el usuario accede correctamente al panel principal de la aplicación',
  async function (this: CustomWorld): Promise<void> {
    await expect(this.loginPage.dashboardHeading).toBeVisible();
  },
);

Then(
  'el sistema muestra el mensaje de alerta {string}',
  async function (this: CustomWorld, expectedMessage: string): Promise<void> {
    await expect(this.loginPage.errorAlert).toBeVisible();
    await expect(this.loginPage.errorAlert).toContainText(expectedMessage);
  },
);

Then(
  'el usuario permanece en la página de inicio de sesión',
  async function (this: CustomWorld): Promise<void> {
    //await expect(this.page).toHaveURL(new RegExp(`${LoginPage.ROUTE}$`));
    await expect(this.loginPage.submitButton).toBeVisible();
  },
);

