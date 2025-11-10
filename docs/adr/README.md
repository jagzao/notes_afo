# Architectural Decision Records (ADR)

Este directorio contiene las decisiones arquitectónicas clave del proyecto Keep++.

## Índice de ADRs

1. [ADR-001: Monorepo con pnpm](./001-monorepo-pnpm.md)
2. [ADR-002: TypeScript como lenguaje principal](./002-typescript.md)
3. [ADR-003: Arquitectura offline-first](./003-offline-first.md)
4. [ADR-004: IndexedDB para Web, SQLite para Mobile/Desktop](./004-storage-strategy.md)
5. [ADR-005: Capacitor para Android, Tauri para Windows](./005-native-platforms.md)
6. [ADR-006: Resolución de conflictos LWW + Duplicado](./006-conflict-resolution.md)
7. [ADR-007: Sistema de propiedades extensible](./007-properties-system.md)
8. [ADR-008: Búsqueda local con índice invertido](./008-local-search.md)

## Formato de ADR

Cada ADR sigue el formato:

- **Estado**: Propuesto | Aceptado | Rechazado | Obsoleto
- **Contexto**: ¿Qué problema estamos resolviendo?
- **Decisión**: ¿Qué decidimos hacer?
- **Consecuencias**: ¿Cuáles son las implicaciones?
- **Alternativas consideradas**: ¿Qué más evaluamos?
