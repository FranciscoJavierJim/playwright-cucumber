# Plugin Local: Playwright MCP (`qa-playwright-mcp`)

Este plugin de workspace expone el servidor oficial **Playwright MCP (`@playwright/mcp`)** dentro de Antigravity para este repositorio, permitiendo versionarlo en Git sin requerir configuración manual global en cada máquina del equipo.

## Propósito en la Arquitectura QA

Apoya directamente la directriz **Zero Assumptions & Clarification First**:

- Permite al agente abrir o inspeccionar las vistas autorizadas de la aplicación bajo prueba (AUT).
- Obtiene el árbol de accesibilidad real para construir localizadores orientados al usuario (`getByRole`, `getByLabel`, `getByTestId`) en `src/pages/` sin inventar selectores.

## Activación

Antigravity descubre automáticamente los plugins ubicados en `.agents/plugins/`. Si acabas de clonar el repositorio o crear este plugin por primera vez, reinicia la ventana de Antigravity (o verifica su estado en **Additional Options (...) > MCP Servers**).
