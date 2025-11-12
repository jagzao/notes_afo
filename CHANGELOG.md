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

### Etapa 3 - Animaciones y Tema Negro/Rojo (2025-11-12)

#### Changed
- ✅ **Tema de colores actualizado** de naranja/azul a negro/rojo
  - Color primario: Rojo (#DC2626)
  - Modo oscuro: Negro profundo (#0A0A0A)
  - Todos los botones, bordes, focus y selección actualizados
  - Scrollbar personalizado con tema

#### Added
- ✅ **Framer Motion** para animaciones
  - Animaciones de entrada escalonadas (stagger) en NoteCard
  - Efectos hover (lift 4px, scale 1.02, shadow mejorado)
  - Feedback táctil (tap scale 0.98)
  - Curvas de easing suaves para 60fps
- ✅ **Animaciones en NoteList**
  - Stagger a nivel de contenedor
  - Delay de 50ms entre cada tarjeta
  - Aplicado a secciones pinned y unpinned

#### Features
- Animaciones fluidas y profesionales
- Tema personalizado negro/rojo consistente
- Dark mode optimizado con contraste alto

---

### Etapa 4 - Editor de Notas con ColorPicker (2025-11-12)

#### Added
- ✅ **NoteEditor Modal Component**
  - Modal completo con animaciones Framer Motion
  - Campos editables de título y descripción
  - Auto-guardado con debounce de 500ms
  - Atajos de teclado (Esc cerrar, Ctrl+Enter guardar)
  - Indicador de estado (guardando/guardado)
  - Toolbar con acciones (pin, archive, delete, color)
  - Click fuera para cerrar
  - Animaciones fade y scale suaves

- ✅ **ColorPicker Component**
  - 9 opciones de color (default, coral, peach, sand, mint, sage, fog, storm, dusk)
  - Dropdown animado con Framer Motion
  - Click-outside-to-close
  - Integrado en toolbar del editor
  - Indicador visual de color seleccionado

- ✅ **Integración con HomePage**
  - Click en NoteCard abre editor
  - Todas las operaciones CRUD conectadas
  - Actualizaciones optimistas en UI

#### Features
- Editor completo y funcional de notas
- Cambio de color en tiempo real
- UX pulida con auto-guardado

---

### Etapa 5 - Sistema de Tags (2025-11-12)

#### Added
- ✅ **TagsContext** para gestión de estado global
  - CRUD de tags (create, delete)
  - Asociaciones nota-tag (assign, remove, getForNote)
  - Persistencia con IndexedDB
  - Auto-inicialización

- ✅ **TagBadge Component**
  - Display de tags reutilizable
  - Modo removable con botón X
  - Modo clickable con callback
  - Integración con tema rojo/negro
  - Dark mode support

- ✅ **TagInput Component** con autocompletado
  - Filtrado en tiempo real de tags disponibles
  - Navegación por teclado (Arrows, Enter, Esc, Backspace)
  - Crear tags inline con sugerencia "Create..."
  - Tags seleccionados como badges removables
  - Click-outside-to-close
  - Dropdown animado

- ✅ **Integración en NoteEditor**
  - TagInput en modal de edición
  - Carga automática de tags
  - Asignar/remover tags
  - Crear tags directamente

- ✅ **Display en NoteCard**
  - Tags visibles en cada nota
  - Auto-carga al renderizar
  - Layout responsivo con flex-wrap

#### Features
- Sistema completo de tags funcional
- Autocompletado inteligente
- Persistencia automática en IndexedDB

---

### Etapa 6 - Búsqueda y Filtros (2025-11-12)

#### Added
- ✅ **Búsqueda en tiempo real** en HomePage
  - Buscar por título de nota
  - Buscar por descripción
  - Filtrado live mientras se escribe
  - Barra de búsqueda con focus states

- ✅ **Filtros por tags**
  - Muestra hasta 5 tags más usados
  - Toggle múltiples tags (filtrado AND)
  - Estado visual de filtro activo
  - Chips clicables con tema

- ✅ **Filtros por color**
  - Filtrar por colores de nota (Coral, Peach, Sand, Mint, Salvia)
  - Selección múltiple de colores
  - Indicadores con emoji de colores

- ✅ **Botón "Clear filters"**
  - Visible solo cuando hay filtros activos
  - Limpia todos los filtros a la vez

- ✅ **Estado vacío mejorado**
  - Mensaje diferente cuando no hay resultados por filtros
  - vs. cuando no hay notas

#### Features
- Búsqueda instantánea sin latencia
- Filtrado combinado (search + tags + colors)
- UX intuitiva con feedback visual

---

## Estado del Proyecto

**Actual**: 🟢 Etapa 6 completada (Búsqueda y Filtros)

**Próximo**: Etapa 7 - Propiedades Tipadas (Notion-style)

**Progreso**: 6/12 etapas (50%)

**Meta**: MVP funcional alcanzado

## Build Statistics (Actual)

- **@keep-plus-plus/types**: 11.63 KB
- **@keep-plus-plus/ui**: 16.34 KB + themes
- **@keep-plus-plus/storage**: 15.66 KB
- **@keep-plus-plus/web**: 321.72 KB (gzipped: 104.90 KB)

## Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **Animaciones**: Framer Motion 11.0.3
- **Styling**: CSS Modules, tema personalizado negro/rojo
- **Estado**: React Context API
- **Storage**: IndexedDB (via idb library)
- **Build**: Vite
- **Package Manager**: pnpm (workspaces)

Ver [roadmap.md](./docs/roadmap.md) para el plan completo.
