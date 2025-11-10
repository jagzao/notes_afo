# ADR-001: Monorepo con pnpm

**Estado**: Aceptado

**Fecha**: 2025-11-10

**Autores**: Equipo Keep++

---

## Contexto

Keep++ es una aplicación multiplataforma (Web, Android, Windows) que comparte lógica de negocio, tipos, y componentes UI. Necesitamos decidir cómo organizar el código para:

1. Compartir código efectivamente entre plataformas
2. Mantener boundaries claros entre módulos
3. Facilitar desarrollo, testing y deployment
4. Optimizar velocidad de instalación y builds

## Decisión

Usaremos un **monorepo** gestionado con **pnpm workspaces**.

### Estructura

```
keep-plus-plus/
├── apps/
│   ├── web/
│   ├── mobile/
│   └── desktop/
├── packages/
│   ├── core/
│   ├── ui/
│   ├── storage/
│   ├── sync/
│   └── types/
└── tools/
```

### Herramientas

- **pnpm**: Gestor de paquetes con workspaces
- **Turbo**: Orquestación de builds y caching
- **TypeScript Project References**: Compilación incremental

## Consecuencias

### Positivas

✅ **Código compartido fácilmente**: Packages se referencian entre sí sin publicar a npm

✅ **Tipos sincronizados**: TypeScript types compartidos garantizan consistencia

✅ **Refactors atómicos**: Cambios en core se reflejan inmediatamente en apps

✅ **CI optimizado**: Turbo cachea builds, reduce tiempos

✅ **Espacio en disco**: pnpm usa hard links, ahorra espacio vs npm/yarn

✅ **Velocidad**: pnpm es más rápido que npm/yarn en instalación

✅ **Boundaries claros**: Estructura fuerza separación de concerns

### Negativas

⚠️ **Complejidad inicial**: Configurar workspace, paths, project references

⚠️ **Tooling**: No todas las herramientas soportan monorepos perfectamente

⚠️ **Onboarding**: Developers nuevos necesitan entender estructura

⚠️ **Build order**: Dependencias entre packages requieren orden correcto

### Mitigación de negativos

- Documentar claramente en CONTRIBUTING.md
- Scripts de npm root para comandos comunes
- Pre-commit hooks validan estructura
- Turbo maneja orden de builds automáticamente

## Alternativas Consideradas

### 1. Múltiples repositorios

**Pros**: Independencia completa, deploys separados
**Contras**: Duplicación de código, sincronización manual de types, versioning complejo

**Razón de rechazo**: Overhead de mantener código compartido, sincronización de versiones

### 2. npm/yarn workspaces

**Pros**: Más maduro, más documentación
**Contras**: Más lento, más espacio en disco, menos eficiente

**Razón de rechazo**: pnpm es superior en performance y espacio

### 3. Nx

**Pros**: Herramienta completa de monorepo con generadores
**Contras**: Overhead, opinionated, curva de aprendizaje

**Razón de rechazo**: Turbo + pnpm es más ligero y suficiente para nuestras necesidades

## Referencias

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turbo](https://turbo.build/)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

## Notas de Implementación

### Scripts útiles

```json
{
  "dev": "turbo run dev",
  "build": "turbo run build",
  "test": "turbo run test"
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
```

### Dependencias entre packages

```json
{
  "dependencies": {
    "@keep-plus-plus/core": "workspace:*",
    "@keep-plus-plus/types": "workspace:*"
  }
}
```

## Fecha de Revisión

Se revisará esta decisión en **Etapa 6** (post-MVP) si surgen problemas significativos.
