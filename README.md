# QA Automation E2E — Playwright + Cucumber JS + TypeScript (POM)

Plantilla base de automatización End-to-End diseñada bajo principios estrictos de ingeniería de calidad e integrada nativamente con **Google Antigravity**:

- **TypeScript en modo estricto (`strict: true`)**: Tipado explícito en localizadores, datos de prueba, configuración y retornos. Cero uso de `any`.
- **Playwright + Cucumber JS**: Aislamiento por escenario mediante `CustomWorld` tipado y ciclo de vida controlado en `Hooks` (`BeforeAll`, `Before`, `After`, `AfterAll`).
- **Page Object Model (POM) puro**: Separación estricta entre encapsulación de selectores/acciones (`src/pages/`) y aserciones de negocio con `expect` (`src/steps/`).
- **Localizadores resilientes y sincronización nativa**: Uso prioritario de `getByRole`, `getByLabel` y `getByTestId`. Prohibición por arquitectura (ESLint) de esperas arbitrarias (`waitForTimeout`).
- **BDD & Gherkin**: Palabras reservadas en inglés (`Feature`, `Scenario`, `Scenario Outline`, `Examples`, `Given`, `When`, `Then`, `And`, `But`) y semántica de negocio en castellano.
- **Multi-entorno y Multi-navegador**: Soporte validado para `.env.desa`, `.env.test`, `.env.pre` y `.env.prod` en `chromium`, `firefox` y `webkit`.
- **Dashboard HTML enriquecido**: Reportes generados con `multiple-cucumber-html-reporter`, incluyendo capturas automáticas adjuntas y trazas (`.zip`) ante fallos.
- **Ecosistema Antigravity listo para equipo**: Reglas jerárquicas (`AGENTS.md`), skill unificada bajo demanda (`.agents/skills/qa-playwright-cucumber/`) e integración MCP con Playwright (`.agents/plugins/playwright-mcp/`).

---

## Estructura del Proyecto

```text
qa-playwright-cucumber-ts/
├── AGENTS.md                                   # Regla compacta always-on (Rol QA + Zero Assumptions + Economía de Tokens)
├── .agents/
│   ├── hooks.json                              # Guardrail PreToolUse que bloquea subagentes en paralelo
│   ├── scripts/
│   │   └── deny-subagents.cjs                  # Handler de bloqueo de invoke_subagent / define_subagent
│   ├── plugins/
│   │   └── playwright-mcp/                     # Plugin MCP local (@playwright/mcp) para inspección DOM real
│   └── skills/
│       └── qa-playwright-cucumber/             # Skill única consolidada (BDD, POM/Steps, Ejecución/Trazas y Auditoría)
│           ├── SKILL.md
│           ├── examples/
│           │   └── feature-templates.md
│           └── references/
│               ├── pom-and-steps-patterns.md
│               └── execution-and-audit-guide.md
├── .env.example
├── .env.desa
├── .env.test
├── .env.pre
├── .env.prod
├── cucumber.js                                 # Perfiles de ejecución (default, smoke, regression, dry)
├── eslint.config.mjs                           # Reglas estrictas TS + bloqueo de any y waitForTimeout
├── tsconfig.json                               # Configuración estricta del compilador TypeScript
└── src/
    ├── config/
    │   └── env.config.ts                       # Validación y carga tipada de variables de entorno
    ├── features/
    │   └── autenticacion.feature               # Especificaciones Gherkin declarativas
    ├── pages/
    │   ├── base.page.ts                        # Operaciones estructurales comunes POM
    │   └── login.page.ts                       # Page Object plantilla orientado al usuario
    ├── reporters/
    │   └── generate-html-report.ts             # Generador de dashboard HTML con metadatos OS/Browser
    ├── steps/
    │   └── autenticacion.steps.ts              # Step Definitions y aserciones web-first (expect)
    ├── support/
    │   ├── custom-world.ts                     # Estado aislado por escenario (CustomWorld)
    │   └── hooks.ts                            # Inicialización, screenshots y Playwright Traces
    └── types/
        ├── environment.types.ts                # Contratos e interfaces de configuración y datos
        └── multiple-cucumber-html-reporter.d.ts
```

---

## Requisitos Previos e Instalación

1. **Node.js >= 20 LTS** instalado en el sistema.
2. Instalar dependencias del proyecto:
   ```bash
   npm install
   ```
3. Instalar los binarios de navegadores de Playwright:
   ```bash
   npm run browsers:install
   ```

---

## Comandos Principales

| Comando                   | Descripción                                                                             |
| :------------------------ | :-------------------------------------------------------------------------------------- |
| `npm run typecheck`       | Verifica el tipado estricto con `tsc --noEmit`                                          |
| `npm run lint`            | Ejecuta ESLint con reglas estrictas sobre `src/**/*.ts`                                 |
| `npm run format:check`    | Valida el formato de código y archivos `.feature` con Prettier                          |
| `npm run test:dry`        | Valida el acoplamiento entre archivos `.feature` y Step Definitions sin abrir navegador |
| `npm test`                | Ejecuta la suite completa usando el entorno por defecto (`desa`)                        |
| `npm run test:smoke`      | Ejecuta únicamente escenarios etiquetados con `@smoke`                                  |
| `npm run test:regression` | Ejecuta únicamente escenarios etiquetados con `@regression`                             |
| `npm run test:desa`       | Ejecuta la suite contra la configuración de `.env.desa`                                 |
| `npm run test:test`       | Ejecuta la suite contra la configuración de `.env.test`                                 |
| `npm run test:pre`        | Ejecuta la suite contra la configuración de `.env.pre`                                  |
| `npm run test:prod`       | Ejecuta las pruebas `@smoke` contra `.env.prod`                                         |
| `npm run test:firefox`    | Ejecuta las pruebas en Firefox (`test:chromium` / `test:webkit` disponibles)            |
| `npm run test:headed`     | Fuerza la ejecución con interfaz gráfica visible (`HEADLESS=false`)                     |
| `npm run report`          | Genera el dashboard HTML en `reports/html-report/index.html`                            |

---

## Trabajo Asistido con Antigravity

Al abrir este repositorio en Antigravity, el agente carga automáticamente:

1. **Regla Compacta Always-On (`AGENTS.md`)**: Garantiza **Zero Assumptions & Clarification First**, **Economía de Tokens (cero subagentes)** y todas las reglas técnicas POM/BDD con mínimo coste de contexto por turno.
2. **Bloqueo Técnico de Subagentes (`.agents/hooks.json`)**: Hook `PreToolUse` que deniega automáticamente cualquier intento de invocar `invoke_subagent` o `define_subagent` sin añadir latencia al resto de herramientas.
3. **Skill Unificada (`.agents/skills/qa-playwright-cucumber/`)**: Se activa bajo demanda con carga progresiva (`examples/` y `references/`) para diseñar escenarios BDD, implementar POM + Steps, ejecutar/diagnosticar trazas o auditar la arquitectura.
4. **Playwright MCP (`.agents/plugins/playwright-mcp/`)**: Expone `@playwright/mcp` para inspeccionar el árbol de accesibilidad real de tu aplicación y extraer localizadores resilientes. _(Recuerda reiniciar la ventana de Antigravity tras clonar o crear el plugin por primera vez para que se registre el servidor MCP)._

---

## Cómo Conectar tu Propia Aplicación (AUT)

1. Configura tu `BASE_URL` real en `.env.desa`, `.env.test`, `.env.pre` y `.env.prod`.
2. Ajusta los localizadores accesibles en `src/pages/login.page.ts` (o solicita al agente en Antigravity que inspeccione tu AUT con Playwright MCP y cree nuevos Page Objects heredando de `BasePage` y exponiéndolos en `CustomWorld`).
3. Ejecuta `npm run test:dry` para comprobar que todos los pasos Gherkin están enlazados antes de lanzar `npm test`.
4. Si un escenario falla, inspecciona la traza interactiva generada en `reports/traces/` mediante:
   ```bash
   npx playwright show-trace reports/traces/<nombre-escenario>.zip
   ```
