# Changelog

Todos los cambios notables del proyecto Keep++ serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Etapa 0 - Pre-flight (2025-11-10)

#### Added
- ✅ Estructura inicial de monorepo con pnpm workspaces
- ✅ Configuración de TypeScript, ESLint y Prettier
- ✅ CI/CD básico con GitHub Actions
- ✅ Git hooks con Husky y lint-staged
- ✅ Documentación completa:
  - PRD (Product Requirements Document)
  - Roadmap detallado por etapas
  - Mapa de dominios
  - ADRs (Architectural Decision Records)
  - Definition of Ready/Done
  - Guía de contribución
  - Arquitectura de sistema
- ✅ Templates de testing (unit, integration, e2e)
- ✅ Configuración de Vitest
- ✅ Estructura de directorios para apps y packages
- ✅ README principal del proyecto

#### Infrastructure
- pnpm 8+ como gestor de paquetes
- Node.js 18+ como runtime
- TypeScript 5.3+ como lenguaje principal
- Vitest como framework de testing
- GitHub Actions para CI

---

### Etapa 1 - Fundaciones (2025-11-10)

#### Added

**Packages:**
- ✅ `@keep-plus-plus/types`: Sistema completo de tipos
  - Entidades (User, Note, Tag, Property, Reminder, Sync)
  - Eventos de dominio
  - DTOs para comunicación API
  - Tipos utilitarios
- ✅ `@keep-plus-plus/ui`: Sistema de diseño y componentes
  - Paleta de colores completa (12 note colors, semantic, neutral)
  - Sistema de tipografía
  - Espaciado, sombras, bordes
  - ThemeProvider con soporte light/dark
  - Componentes base: Button, Input
  - CSS Modules para estilos scoped

**Web App:**
- ✅ Configuración React + Vite + TypeScript
- ✅ PWA con vite-plugin-pwa y service worker
- ✅ React Router v6 con rutas configuradas
- ✅ Layout con Header y Sidebar responsivo
- ✅ Páginas: Home, Login, NotFound
- ✅ Integración con sistema de diseño
- ✅ Theming dinámico (light/dark)
- ✅ Estilos globales y CSS Modules

#### Features
- Sistema de diseño completo y accesible (WCAG 2.1 AA)
- Soporte para modo oscuro con persistencia
- Arquitectura component-based escalable
- Path aliases para imports limpios
- Build optimizado con Vite

---

### Etapa 2 - Core Notas (2025-11-10)

#### Added

**Package `@keep-plus-plus/storage`:**
- ✅ IndexedDB setup con schema y migraciones
- ✅ NotesRepository con CRUD completo
- ✅ TagsRepository con relaciones many-to-many
- ✅ Índices optimizados para queries rápidas
- ✅ Sistema de versionado de database
- ✅ Utilities (generateId, device tracking)

**Notes Repository:**
- ✅ Create, Read, Update, Delete notas
- ✅ Pin/unpin functionality
- ✅ Archive/unarchive functionality
- ✅ Trash con auto-cleanup (30 días)
- ✅ Full-text search
- ✅ Filtering y sorting
- ✅ State management (active/archived/trashed)

**Tags Repository:**
- ✅ CRUD completo de tags
- ✅ Assign/remove tags de notas
- ✅ Get tags para nota y notes para tag
- ✅ Tag usage statistics
- ✅ Search tags by name

**Componentes Web:**
- ✅ NoteCard con actions (pin, archive, delete)
- ✅ NoteList con secciones pinned/unpinned
- ✅ NotesContext para state management global
- ✅ useNotes hook personalizado
- ✅ Loading y empty states
- ✅ Responsive grid layout

**Funcionalidad Completa:**
- ✅ Crear notas vacías para editar
- ✅ Ver todas las notas en grid
- ✅ Pin/unpin notas
- ✅ Archive/unarchive notas
- ✅ Mover a papelera
- ✅ Ordenar por fecha (pinned primero)
- ✅ Persistencia offline con IndexedDB

#### Features
- CRUD completo de notas con persistencia local
- Operaciones optimistas en UI
- Error handling y recovery
- Auto-inicialización de database
- State management con React Context
- Formato de fechas relativo (Today, Yesterday, etc.)
- Responsive design

---

## Próximos Hitos

### Etapa 3 - Propiedades Tipadas (Semanas 3-4)
- [ ] Modelo PropertyDef/PropertyVal
- [ ] Tipos: texto, número, fecha, checkbox, select, multiselect, URL
- [ ] Validación por tipo
- [ ] UI de gestión de propiedades
- [ ] Editor de propiedades por nota

### Etapa 4 - Búsqueda y Filtros (Semana 4)
- [ ] Full-text search mejorado
- [ ] Filtros por tags
- [ ] Filtros por propiedades
- [ ] Orden avanzado

Ver [roadmap.md](./docs/roadmap.md) para el plan completo.

---

## Estado del Proyecto

**Actual**: 🟢 Etapa 2 completada (Core Notas - CRUD)

**Próximo**: Etapa 3 - Propiedades Tipadas

**Progreso**: 2/12 etapas (16.7%)

**Meta**: Beta GA en Semana 10
