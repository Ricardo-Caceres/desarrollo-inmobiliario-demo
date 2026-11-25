# desarrollo-inmobiliario-demo

Demo ficticia de sitio para desarrollos inmobiliarios ("Orvale Desarrollos"; desarrollos "Lumarel Tulum" y "Obsidia Polanco"). Los nombres son ficticios y el disclaimer es obligatorio en footer y metadata (en: "Fictional demo project — designed and built by Ricardo Cáceres"; es: "Proyecto ficticio de demostración — diseñado y desarrollado por Ricardo Cáceres").

## Stack

Next 16 (App Router) + React 19.3 + TypeScript 6 + Tailwind 4 + zod + vitest. ESLint 9. Gestor: **pnpm** (no npm). i18n propio en `i18n/` (en, es; rutas `/en` y `/es`).

## Comandos

- `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm start`

## Flujo

- Rama principal: `main`. Cada fase va en su propia rama y PR; nunca directo a `main`.
- Verificar siempre con lint + typecheck + test + build, y en el navegador a 1280 y 375 px en `/en` y `/es`.
- Código temporal (parche, flag, workaround, TODO) lleva `EXPIRA AAAA-MM-DD: motivo`.
- NUNCA líneas de atribución de IA en commits ni PRs (ni "Co-Authored-By" ni "Generated with").

## Reparto de modelos

| Tipo de trabajo | Quién | Modelo |
|---|---|---|
| Planes, arquitectura, riesgos | agente `planificador` | Opus |
| Implementar pasos ya decididos | agente `ejecutor` | Sonnet |
| Buscar, leer, correr build y reportar | agente `explorador` | Haiku |
