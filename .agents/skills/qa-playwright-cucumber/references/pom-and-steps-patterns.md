# Patrones Avanzados POM, CustomWorld y Step Definitions

## 1. Localizadores Parametrizados (Filas de Tabla o Listados)

Cuando un selector depende de un identificador de negocio dinámico, expón un método fábrica tipado que retorne `Locator` (sin ejecutar aserciones dentro del Page Object):

```ts
import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class OrdersPage extends BasePage {
  public static readonly ROUTE = '/pedidos';
  public readonly ordersTable: Locator;

  constructor(page: Page) {
    super(page);
    this.ordersTable = this.page.getByRole('table', { name: 'Listado de pedidos' });
  }

  public getOrderRowByCode(orderCode: string): Locator {
    return this.ordersTable.getByRole('row').filter({ hasText: orderCode });
  }

  public async openOrderDetail(orderCode: string): Promise<void> {
    await this.getOrderRowByCode(orderCode).getByRole('link', { name: 'Ver detalle' }).click();
  }
}
```

En el Step Definition correspondiente (`src/steps/pedidos.steps.ts`):

```ts
Then(
  'el pedido {string} figura con estado {string}',
  async function (this: CustomWorld, orderCode: string, expectedStatus: string): Promise<void> {
    const row = this.ordersPage.getOrderRowByCode(orderCode);
    await expect(row).toBeVisible();
    await expect(row).toContainText(expectedStatus);
  },
);
```

## 2. Registro de un Nuevo Page Object en `CustomWorld`

En `src/support/custom-world.ts`:

```ts
private ordersPageInstance: OrdersPage | undefined;

public get ordersPage(): OrdersPage {
  if (this.ordersPageInstance === undefined) {
    this.ordersPageInstance = new OrdersPage(this.page);
  }
  return this.ordersPageInstance;
}
```

Recuerda restablecer `this.ordersPageInstance = undefined;` tanto en `attachBrowserSession` como en `clearBrowserSession`.

## 3. Sincronización con Respuestas de Red Tipadas (Sin `waitForTimeout`)

```ts
export interface OrderCreatedResponse {
  readonly orderId: string;
  readonly status: 'CREATED' | 'PENDING';
}

// Dentro del Page Object:
public async confirmOrderAndCaptureResponse(): Promise<OrderCreatedResponse> {
  const responsePromise = this.page.waitForResponse(
    (response) =>
      response.url().includes('/api/orders') && response.request().method() === 'POST',
  );
  await this.confirmButton.click();
  const response = await responsePromise;
  const payload: unknown = await response.json();
  return payload as OrderCreatedResponse;
}
```

## 4. Estado Compartido Tipado entre Steps (`ScenarioStateMap`)

Declara primero la clave tipada en `ScenarioStateMap` (`src/types/environment.types.ts`):

```ts
export interface ScenarioStateMap {
  readonly credentials: CredentialsData;
  readonly attemptCount: number;
  readonly lastOrderId: string;
}
```

Y consúmela con tipado inferido en tus Step Definitions:

```ts
// En When:
const createdOrder = await this.checkoutPage.confirmOrderAndCaptureResponse();
this.setScenarioData('lastOrderId', createdOrder.orderId);

// En Then:
const orderId = this.getScenarioData('lastOrderId');
if (orderId === undefined) {
  throw new Error('No se encontró "lastOrderId" en el contexto del escenario.');
}
await expect(this.ordersPage.getOrderRowByCode(orderId)).toBeVisible();
```
