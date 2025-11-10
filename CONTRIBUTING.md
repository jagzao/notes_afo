# Guía de Contribución — Keep++

¡Gracias por contribuir a Keep++! Este documento describe nuestro flujo de trabajo, estándares y mejores prácticas.

---

## Tabla de Contenidos

1. [Inicio Rápido](#inicio-rápido)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Flujo de Trabajo con Git](#flujo-de-trabajo-con-git)
4. [Estándares de Código](#estándares-de-código)
5. [Testing](#testing)
6. [Code Review](#code-review)
7. [Definition of Ready/Done](#definition-of-readydone)
8. [Comunicación](#comunicación)

---

## Inicio Rápido

### Prerequisitos

- **Node.js** 18+ ([instalar](https://nodejs.org/))
- **pnpm** 8+ (`npm install -g pnpm`)
- **Git** 2.30+

### Setup

```bash
# Clonar repositorio
git clone <repository-url>
cd notes_afo

# Instalar dependencias
pnpm install

# Verificar que todo funciona
pnpm test
pnpm lint

# Iniciar desarrollo
pnpm dev
```

### Scripts Útiles

```bash
# Desarrollo
pnpm dev              # Todas las apps
pnpm dev:web          # Solo web
pnpm dev:mobile       # Solo mobile
pnpm dev:desktop      # Solo desktop

# Testing
pnpm test             # Todos los tests
pnpm test:unit        # Solo unit
pnpm test:e2e         # Solo e2e
pnpm test:coverage    # Con coverage

# Build
pnpm build            # Todo
pnpm build:web        # Solo web

# Linting
pnpm lint             # Check
pnpm lint:fix         # Fix automático
pnpm format           # Prettier
pnpm typecheck        # TypeScript
```

---

## Estructura del Proyecto

```
keep-plus-plus/
├── apps/                  # Aplicaciones
│   ├── web/              # PWA
│   ├── mobile/           # Android (Capacitor)
│   └── desktop/          # Windows (Tauri)
├── packages/             # Código compartido
│   ├── core/            # Lógica de negocio
│   ├── ui/              # Componentes UI
│   ├── types/           # TypeScript types
│   ├── storage/         # Persistencia
│   └── sync/            # Sincronización
├── docs/                 # Documentación
│   ├── adr/             # Decision records
│   ├── prd.md
│   ├── roadmap.md
│   └── domain-map.md
└── tools/               # Scripts y utilidades
```

### Packages

Cada package en `packages/` debe tener:

- `package.json` con nombre `@keep-plus-plus/<name>`
- `src/` con código fuente
- `tests/` con tests
- `README.md` con propósito y API

---

## Flujo de Trabajo con Git

### Branches

- **`main`**: Siempre estable, deployable
- **`feature/<nombre>`**: Nuevas features
- **`fix/<nombre>`**: Bug fixes
- **`refactor/<nombre>`**: Refactoring
- **`docs/<nombre>`**: Solo documentación

### Workflow

1. **Crear branch desde main**

```bash
git checkout main
git pull origin main
git checkout -b feature/add-note-colors
```

2. **Hacer cambios**

```bash
# Editar archivos
pnpm lint:fix
pnpm test
git add .
git commit -m "feat: add color picker to notes"
```

3. **Mantener actualizado**

```bash
git fetch origin main
git rebase origin/main
```

4. **Push y PR**

```bash
git push origin feature/add-note-colors
# Crear Pull Request en GitHub
```

### Commit Messages

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: Nueva feature
- `fix`: Bug fix
- `refactor`: Cambio sin alterar comportamiento
- `docs`: Solo documentación
- `test`: Añadir o modificar tests
- `chore`: Cambios en build, deps, etc.
- `perf`: Mejora de performance
- `style`: Formatting, no cambia lógica

**Ejemplos:**

```bash
feat(notes): add color picker to note editor
fix(sync): resolve conflict when editing same field
refactor(ui): extract button component
docs(adr): add decision for offline-first architecture
test(notes): add e2e test for note deletion
chore(deps): upgrade typescript to 5.3.3
```

**Scope** opcional: `notes`, `properties`, `sync`, `ui`, `storage`, etc.

### Pull Requests

**Título**: Igual que commit principal

**Descripción** debe incluir:

```markdown
## What

Breve descripción del cambio

## Why

Razón del cambio (link a issue, user story)

## How

Approach técnico tomado

## Testing

Cómo se probó (manual, automatizado)

## Screenshots (si aplica)

[Adjuntar imágenes]

## Checklist

- [ ] Tests añadidos/actualizados
- [ ] Docs actualizadas
- [ ] DoD cumplido
```

---

## Estándares de Código

### TypeScript

- **Strict mode** habilitado
- **No `any`** (usar `unknown` si es necesario)
- Usar tipos explícitos en parámetros de funciones
- Interfaces sobre types (salvo casos específicos)

```typescript
// ✅ Bueno
interface Note {
  id: string;
  title: string;
  description?: string;
}

function createNote(title: string, description?: string): Note {
  // ...
}

// ❌ Malo
function createNote(title, description) {
  // Sin tipos
}
```

### Naming

- **camelCase**: variables, funciones
- **PascalCase**: classes, interfaces, types, React components
- **UPPER_CASE**: constantes globales
- **kebab-case**: archivos

```typescript
// Variables y funciones
const noteTitle = 'My Note';
function createNote() {}

// Interfaces y tipos
interface NoteMetadata {}
type NoteStatus = 'active' | 'archived';

// Constantes
const MAX_NOTES_PER_USER = 10000;

// Archivos
// note-service.ts
// use-notes.hook.ts
```

### Organización de imports

```typescript
// 1. External libs
import React from 'react';
import { useState } from 'react';

// 2. Internal packages
import { Note } from '@keep-plus-plus/types';
import { createNote } from '@keep-plus-plus/core';

// 3. Relative imports
import { Button } from '../components/Button';
import { useNotes } from './hooks/useNotes';
```

(ESLint configura orden automáticamente)

### Funciones

- **Pequeñas**: Una responsabilidad (SRP)
- **Puras** donde sea posible
- **Max 20 líneas** (guideline, no regla estricta)

```typescript
// ✅ Bueno
function isNotePinned(note: Note): boolean {
  return note.pinned === true;
}

function filterPinnedNotes(notes: Note[]): Note[] {
  return notes.filter(isNotePinned);
}

// ❌ Malo
function doStuff(notes) {
  // 100 líneas de lógica mezclada
}
```

### Comments

- **Código autodocumentado** preferido
- Comentarios para **por qué**, no **qué**

```typescript
// ❌ Malo
// Incrementa counter
counter++;

// ✅ Bueno
// Fallback to local notifications if user denied permissions
if (!hasNotificationPermission) {
  scheduleLocalReminder(note);
}
```

---

## Testing

### Pirámide de Testing

```
      E2E (10%)
     /         \
  Integration (20%)
  /               \
 Unit (70%)
```

### Unit Tests

- **Vitest** como framework
- Archivos: `*.test.ts` o `*.spec.ts` junto al código
- Coverage: ≥80% en `packages/core`

```typescript
// note-service.test.ts
import { describe, it, expect } from 'vitest';
import { createNote } from './note-service';

describe('createNote', () => {
  it('should create note with title', () => {
    const note = createNote({ title: 'Test' });
    expect(note.title).toBe('Test');
  });

  it('should throw if title is empty', () => {
    expect(() => createNote({ title: '' })).toThrow();
  });
});
```

### Integration Tests

- Testan interacciones entre módulos
- En `tests/integration/` de cada package

### E2E Tests

- **Playwright** para web
- Flujos críticos completos
- En `apps/*/tests/e2e/`

```typescript
// note-crud.e2e.ts
test('should create, edit and delete note', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="new-note-btn"]');
  await page.fill('[data-testid="note-title"]', 'Test Note');
  await page.click('[data-testid="save-btn"]');
  expect(await page.textContent('.note-card')).toContain('Test Note');
});
```

### Running Tests

```bash
# Watch mode durante desarrollo
pnpm test --watch

# Coverage
pnpm test:coverage

# Solo un archivo
pnpm test note-service.test.ts
```

---

## Code Review

### Proceso

1. **Self-review**: Revisar tu propio código antes de PR
2. **Automated checks**: CI debe pasar (tests, lints)
3. **Peer review**: Mínimo **2 aprobaciones**
4. **Address comments**: Resolver todos los comentarios
5. **Merge**: Squash and merge (mantiene historia limpia)

### Qué revisar

- [ ] Cumple criterios de aceptación
- [ ] Tests adecuados
- [ ] Sin code smells (duplicación, complejidad excesiva)
- [ ] Performance aceptable
- [ ] Seguridad (validación, sanitización)
- [ ] Accesibilidad básica (si aplica)
- [ ] Documentación actualizada

### Feedback

- **Constructivo**: Sugiere alternativas
- **Específico**: Señala línea exacta
- **Priorizado**: Distingue blockers de nits

```markdown
# ❌ Malo
"Este código es malo"

# ✅ Bueno
"Esta función tiene complejidad ciclomática alta. Considera extraer la validación a una función separada, por ejemplo:

```typescript
function validateNote(note: Note): void {
  // validations
}
```

Esto mejorará testability y legibilidad."
```

### Tipos de comentarios

- **[BLOCKER]**: Debe resolverse antes de merge
- **[SUGGESTION]**: Mejora recomendada, no bloqueante
- **[QUESTION]**: Necesita clarificación
- **[NIT]**: Detalle menor, estético

---

## Definition of Ready/Done

Ver [docs/dod.md](./docs/dod.md) para detalles completos.

### Quick Checklist (DoD)

- [ ] Código implementado y revisado
- [ ] Tests escritos y pasando
- [ ] Linters pasando
- [ ] Documentación actualizada
- [ ] CI verde
- [ ] Demo a stakeholders

---

## Comunicación

### Daily Standup (async en Slack/Discord)

```
# ✅ Ayer
- Implementé color picker en editor de notas

# 🚧 Hoy
- Integrar color picker con sync
- Escribir tests E2E

# 🚨 Blockers
- Esperando diseño de iconos de colores
```

### Issues

Usar templates de issue:

- **Feature request**
- **Bug report**
- **Documentation**

### Discusiones técnicas

- **ADR** para decisiones arquitectónicas (en `docs/adr/`)
- **RFC** para cambios grandes (en `docs/rfcs/`)
- Discusiones en PR para cambios específicos

---

## Troubleshooting

### Problemas comunes

**pnpm install falla**

```bash
# Limpiar cache
pnpm store prune
rm -rf node_modules
pnpm install
```

**Tests fallan localmente pero pasan en CI**

```bash
# Verificar versión de Node
node --version  # Debe ser 18+

# Reinstalar
pnpm clean
pnpm install
```

**TypeScript errors después de pull**

```bash
# Rebuild project references
pnpm build
```

### Recursos

- [Docs completas](./docs/)
- [Roadmap](./docs/roadmap.md)
- [PRD](./docs/prd.md)
- [Domain Map](./docs/domain-map.md)

---

## Onboarding Checklist

- [ ] Setup local completo
- [ ] Leer PRD y Roadmap
- [ ] Revisar Domain Map
- [ ] Correr tests y build exitosamente
- [ ] Crear branch de prueba y PR de práctica
- [ ] Pair con teammate en primera tarea
- [ ] Preguntar dudas sin miedo 🙂

---

**¡Gracias por contribuir a Keep++!** 🚀
