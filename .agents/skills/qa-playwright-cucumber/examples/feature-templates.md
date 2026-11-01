# Plantillas de Referencia Gherkin (Keywords EN + Semántica ES)

## 1. Flujo Crítico (`@smoke`) + Variaciones de Datos (`@regression`)

```gherkin
@pedidos
Feature: Gestión y confirmación de pedidos de compra
  Como cliente autenticado con productos en su cesta
  Quiero confirmar mi pedido indicando mis datos de envío
  Para recibir los artículos adquiridos en mi domicilio

  Background:
    Given el cliente autenticado dispone de artículos válidos en su cesta de compra
    And el cliente se encuentra en la vista de confirmación de pedido

  @smoke
  Scenario: Confirmación exitosa de pedido con envío estándar
    When el cliente confirma el pedido seleccionando la modalidad de envío "Estándar"
    Then el sistema registra el pedido y muestra un código de seguimiento
    And el sistema informa el estado del pedido como "Confirmado"

  @regression
  Scenario Outline: Rechazo de confirmación ante código postal inválido
    When el cliente intenta confirmar el pedido con el código postal "<codigo_postal>"
    Then el sistema muestra el mensaje de validación "<mensaje_validacion>"
    And el pedido no llega a procesarse

    Examples:
      | codigo_postal | mensaje_validacion                                |
      |               | El código postal es obligatorio                   |
      | 123           | El código postal debe contener 5 dígitos exactos  |
      | ABCDE         | El código postal solo admite caracteres numéricos |
```

## 2. Uso de `DataTable` Declarativo

```gherkin
  @regression
  Scenario: Alta de dirección de facturación completa
    When el cliente registra una nueva dirección de facturación con los siguientes datos:
      | alias      | calle                | ciudad | codigo_postal |
      | Oficina HQ | Paseo Castellana 100 | Madrid | 28046         |
    Then la dirección "Oficina HQ" aparece disponible en su libreta de direcciones
```

## 3. Anti-patrones Prohibidos vs Estándar Declarativo

| Anti-patrón (Imperativo / Acoplado a UI)                          | Estándar del Proyecto (Declarativo)                                                   |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| `Dado que navego a "/login"`                                      | `Given el usuario se encuentra en la página de inicio de sesión`                      |
| `When hago click en "#user", escribo "ana" y pulso "#btn-submit"` | `When el usuario intenta autenticarse con el usuario "ana" y la contraseña "secreto"` |
| `Then el div ".toast-error" tiene texto "Error"`                  | `Then el sistema muestra el mensaje de alerta "Las credenciales no son válidas"`      |
