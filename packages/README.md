# Packages

Este directorio contiene todos los paquetes compartidos entre las aplicaciones de Keep++.

## Estructura

```
packages/
├── core/        # Lógica de negocio y casos de uso
├── ui/          # Componentes UI compartidos
├── types/       # TypeScript types y interfaces compartidas
├── storage/     # Abstracciones e implementaciones de persistencia
└── sync/        # Motor de sincronización offline-first
```

## Principios

1. **Separation of Concerns**: Cada package tiene una única responsabilidad
2. **Dependency Direction**: Los packages pueden depender de `types`, pero evitan dependencias circulares
3. **Platform Agnostic**: La mayoría de packages son agnósticos a la plataforma (web/mobile/desktop)
4. **Testability**: Cada package debe tener alta cobertura de tests

## Convenciones

### Naming

- Package name: `@keep-plus-plus/<name>`
- Export principal: `src/index.ts`
- Tests: Junto al código en `*.test.ts`

### Structure

Cada package debe tener:

```
package-name/
├── src/
│   ├── index.ts          # Main export
│   ├── module-a/
│   │   ├── index.ts
│   │   ├── file.ts
│   │   └── file.test.ts
│   └── module-b/
├── tests/
│   └── integration/      # Integration tests
├── package.json
├── tsconfig.json
└── README.md
```

### package.json

```json
{
  "name": "@keep-plus-plus/package-name",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src/"
  }
}
```

## Dependencias entre Packages

### Permitido

```
core → types
ui → types
storage → types
sync → types, storage
```

### No permitido

- Dependencias circulares
- UI → core (UI no debe conocer lógica de negocio)
- types → cualquier otro package

## Próximos Pasos

Los siguientes packages se implementarán en orden según el roadmap:

1. **types** (Etapa 1): Tipos base
2. **core** (Etapa 2): Lógica de notas
3. **storage** (Etapa 2): Persistencia local
4. **ui** (Etapa 1): Componentes base
5. **sync** (Etapa 5): Sincronización

Ver [roadmap.md](../docs/roadmap.md) para detalles.
