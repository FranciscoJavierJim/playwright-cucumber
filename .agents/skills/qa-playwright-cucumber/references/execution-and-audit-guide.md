# Guía de Ejecución, Diagnóstico de Trazas y Auditoría QA

## 1. Matriz de Ejecución Multi-Entorno y Multi-Navegador

- **Por entorno:**
  - `npm run test:desa` -> `.env.desa` (entorno por defecto en `npm test`)
  - `npm run test:test` -> `.env.test`
  - `npm run test:pre` -> `.env.pre`
  - `npm run test:prod` -> `.env.prod` (ejecuta únicamente perfil `smoke`)
- **Por etiquetas (Tags):**
  - `npm run test:smoke` (`@smoke and not @ignore`)
  - `npm run test:regression` (`@regression and not @ignore`)
  - Filtro puntual: `npx cucumber-js --profile default --tags "@auth and not @ignore"`
- **Por motor de navegador / modo visual:**
  - `npm run test:chromium` | `npm run test:firefox` | `npm run test:webkit`
  - `npm run test:headed` (`HEADLESS=false`)
- **Generación del Dashboard HTML:**
  - `npm run report` -> genera `reports/html-report/index.html` a partir de `reports/cucumber-report.json`.

---

## 2. Protocolo de Diagnóstico ante Fallos

Nunca aumentes timeouts arbitrariamente ni añadas parches sin aislar la causa raíz:

1. **Revisa `reports/cucumber-report.json`:** Identifica el step fallido, el mensaje de error exacto y la duración.
2. **Inspecciona `reports/screenshots/<slug>-<timestamp>.png`:** Comprueba visualmente el estado real de la pantalla en el instante del fallo.
3. **Analiza `reports/traces/<slug>-<timestamp>.zip`:**
   - Para inspección visual interactiva del usuario:
     `npx playwright show-trace reports/traces/<archivo>.zip`
   - Para inspección técnica desde el agente: extrae temporalmente el `.zip` en `scratch/` y revisa eventos de red y snapshots DOM.
4. **Clasificación de causa raíz:**
   - **Bug del AUT:** Reporta la evidencia sin alterar una aserción de negocio válida.
   - **Deriva de selector:** Verifica el nuevo rol/etiqueta accesible y actualiza solo el `Locator` en `src/pages/`.
   - **Sincronización asíncrona:** Reemplaza lecturas prematuras por aserciones web-first o `waitForResponse` tipado (jamás `waitForTimeout`).
   - **Entorno / Datos:** Reporta la configuración o precondición ausente en `.env.<entorno>`.

---

## 3. Checklist de Auditoría Arquitectónica QA

Cuando el usuario solicite auditar o revisar la calidad de la suite:

1. **Controles estáticos:** Ejecuta `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:dry`.
2. **Pureza POM (`src/pages/`):**
   - Cero importaciones o llamadas a `expect`.
   - Todas las clases extienden `BasePage` y están registradas en `CustomWorld`.
   - Localizadores basados en `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText` o `getByTestId` (sin XPaths ni selectores CSS acoplados a estilos).
3. **Aislamiento en Steps (`src/steps/`):**
   - Todos los callbacks usan `async function (this: CustomWorld, ...): Promise<void>` (cero arrow functions).
   - Cero instanciación directa de `this.page.locator(...)` en los steps.
   - Cero variables mutables globales; uso exclusivo de `ScenarioStateMap` + `setScenarioData` / `getScenarioData`.
4. **Gherkin Híbrido (`src/features/`):**
   - Cero `# language: es` o keywords traducidas (`Característica`, `Escenario`, `Dado`, `Cuando`, `Entonces`).
   - Redacción 100 % declarativa en castellano con tags de dominio y cobertura (`@smoke` / `@regression`).
