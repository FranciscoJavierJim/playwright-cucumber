import { Given } from '@cucumber/cucumber';
import { envConfig } from '../config/env.config';
import { CustomWorld } from '../support/custom-world';

Given(
  'el usuario abre la pagina principal',
  async function (this: CustomWorld): Promise<void> {
    await this.page.goto(envConfig.baseUrl);
  },
);

/*
  public getCurrentUrl(): string {
    return this.page.url();
  }

  public async getTitle(): Promise<string> {
    return this.page.title();
  }
*/
