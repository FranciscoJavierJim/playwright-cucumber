'use strict';

let rawInput = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  rawInput += chunk;
});

process.stdin.on('end', () => {
  let toolName = 'subagent';
  try {
    const parsed = JSON.parse(rawInput);
    if (parsed && parsed.toolCall && typeof parsed.toolCall.name === 'string') {
      toolName = parsed.toolCall.name;
    }
  } catch {
    // Fallback to default denial if stdin is empty or malformed
  }

  const response = {
    decision: 'deny',
    reason: `Herramienta "${toolName}" bloqueada por politica de ahorro de tokens (cuenta personal limitada): prohibido ejecutar subagentes en paralelo. Resuelve la tarea secuencialmente en el agente principal.`,
  };

  process.stdout.write(`${JSON.stringify(response)}\n`);
});

