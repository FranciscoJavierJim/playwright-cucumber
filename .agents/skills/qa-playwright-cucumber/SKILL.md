---
name: qa-playwright-cucumber
description: >-
  End-to-end QA Automation workflow for Playwright, Cucumber JS, strict
  TypeScript, and Page Object Model (POM). Activate this skill whenever the user
  asks to design or refactor Gherkin .feature scenarios, create or update Page
  Objects and Step Definitions, inspect DOM locators via Playwright MCP, run
  tests across environments (desa, test, pre, prod), generate HTML reports,
  diagnose test failures/traces, or audit test suite architecture.
---

# QA Automation Suite — Playwright + Cucumber JS + TypeScript (POM)

Runbook unificado de trabajo para diseñar, implementar, ejecutar, diagnosticar y auditar pruebas E2E bajo la directriz **Zero Assumptions & Clarification First**.

## Regla Previa Común: Zero Assumptions

Antes de ejecutar cualquiera de los 4 flujos siguientes:

- Si falta cualquier detalle funcional, regla de negocio, ruta, selector del DOM, contrato de datos o entorno objetivo, **detente inmediatamente y pregunta al usuario** ofreciendo opciones claras (`ask_question`).
- Nunca inventes selectores ni criterios de aceptación.

---

## Flujo 1: Diseño y Refactorización BDD / Gherkin (`src/features/`)

1. **Reutilización:** Revisa `src/features/*.feature` y `src/steps/*.steps.ts` para reutilizar pasos existentes sin crear ambigüedades.
2. **Sintaxis híbrida estricta:**
   - **Keywords siempre en inglés:** `Feature`, `Background`, `Scenario`, `Scenario Outline`, `Examples`, `Given`, `When`, `Then`, `And`, `But` (prohibido `# language: es`).
   - **Contenido semántico siempre en castellano declarativo:** Enfocado en valor e intención de negocio (`Como / Quiero / Para`), sin pasos imperativos de clics ni selectores UI.
3. **Datos y etiquetado:** Agrupa variaciones con `Scenario Outline` + `Examples` (columnas en `snake_case` sin tildes) y etiqueta con tag de dominio + `@smoke` o `@regression`.
4. **Plantillas de apoyo:** Consulta [examples/feature-templates.md](./examples/feature-templates.md) para ejemplos de `Scenario Outline`, `DataTable` y tabla de anti-patrones.

---

## Flujo 2: Implementación POM, `CustomWorld` y Step Definitions

1. **Verificación real del DOM:**
   - Si dispones de URL autorizada y `@playwright/mcp` activo, inspecciona el árbol de accesibilidad real para obtener `getByRole`, `getByLabel` o `getByTestId`.
   - Sin acceso al DOM real, solicita los atributos HTML al usuario antes de codificar.
2. **Contratos tipados (`src/types/`):** Modela interfaces `readonly` para payloads y formularios complejos, y registra claves de estado compartido en `ScenarioStateMap` (`src/types/environment.types.ts`). Prohibido usar `any`.
3. **Page Object (`src/pages/<vista>.page.ts`):**
   - Extiende [`BasePage`](../../../src/pages/base.page.ts), declara visibilidad (`public`/`protected`/`private`) y tipos de retorno explícitos (`Promise<void>`).
   - **Prohibido incluir `expect` de negocio ni `waitForTimeout`** en Page Objects.
4. **Inyección en [`CustomWorld`](../../../src/support/custom-world.ts):** Expón el nuevo Page Object mediante getter _lazy_ y límpialo en `attachBrowserSession` y `clearBrowserSession`.
5. **Step Definitions (`src/steps/<dominio>.steps.ts`):**
   - Usa siempre `async function (this: CustomWorld, ...): Promise<void>` (jamás arrow functions).
   - Consume acciones vía `this.<nombre>Page` y escribe aquí todas las aserciones _web-first_ (`await expect(...).toBeVisible()`, `toContainText()`, `toHaveURL()`).
6. **Patrones avanzados:** Consulta [references/pom-and-steps-patterns.md](./references/pom-and-steps-patterns.md) para tablas dinámicas, intercepción tipada `waitForResponse` y estado compartido en `CustomWorld`.

---

## Flujo 3: Ejecución, Reportes y Diagnóstico de Fallos

> **Nota Windows PowerShell:** Si `ExecutionPolicy` bloquea scripts `.ps1`, invoca `npm.cmd` y `npx.cmd`.

1. **Pre-flight:** Ejecuta `npm run test:dry` antes de abrir navegador.
2. **Ejecución controlada:** Usa los scripts por entorno (`test:desa`, `test:test`, `test:pre`, `test:prod`), tag (`test:smoke`, `test:regression`) o navegador (`test:chromium`, `test:firefox`, `test:webkit`). En `prod` lanza únicamente `@smoke` salvo autorización explícita.
3. **Reporte HTML y diagnóstico:** Genera el dashboard con `npm run report` y analiza fallos inspeccionando `reports/cucumber-report.json`, capturas en `reports/screenshots/` y trazas en `reports/traces/`.
4. **Guía detallada:** Consulta [references/execution-and-audit-guide.md](./references/execution-and-audit-guide.md) para la matriz completa de comandos y clasificación de causa raíz.

---

## Flujo 4: Auditoría de Calidad y Quality Gates Obligatorios

Para auditar el repositorio o cerrar cualquier cambio de código, consulta la lista de verificación en [references/execution-and-audit-guide.md](./references/execution-and-audit-guide.md) y comprueba siempre estos 4 controles en verde:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run format:check` (o `npm run format`)
4. `npm run test:dry`
