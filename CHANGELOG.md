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

## Próximos Hitos

### Etapa 2 - Core Notas (Semana 2)
- [ ] Implementar package `@keep-plus-plus/core`
- [ ] CRUD de notas completo
- [ ] Sistema de etiquetas
- [ ] Pin/archivo/papelera
- [ ] Colores por nota
- [ ] Almacenamiento local (IndexedDB)

### Etapa 3 - Propiedades Tipadas (Semanas 3-4)
- [ ] Modelo PropertyDef/PropertyVal
- [ ] Tipos: texto, número, fecha, checkbox, select, multiselect, URL
- [ ] Validación por tipo
- [ ] UI de gestión de propiedades

Ver [roadmap.md](./docs/roadmap.md) para el plan completo.

---

## Estado del Proyecto

**Actual**: 🟢 Etapa 1 completada (Fundaciones)

**Próximo**: Etapa 2 - Core Notas (CRUD básico)

**Meta**: Beta GA en Semana 10
