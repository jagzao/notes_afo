# Keep++ 📝

> Aplicación de notas extensibles con propiedades tipadas - Google Keep + Notion

## 🎯 Descripción

Keep++ combina la simplicidad y rapidez de Google Keep con el poder de las propiedades tipadas de Notion. Una aplicación **offline-first** multiplataforma para capturar, organizar y gestionar notas con propiedades personalizables.

## ✨ Características principales (MVP)

- **Notas rápidas**: Captura, organiza con etiquetas, colores, pin, archivado
- **Propiedades tipadas**: Texto, número, fecha, checkbox, select, multi-select, URL
- **Búsqueda y filtros**: Full-text + filtros combinables por etiquetas y propiedades
- **Offline-first**: Funciona sin conexión con sincronización automática
- **Recordatorios**: Notificaciones puntuales multiplataforma
- **Import/Export**: Google Keep JSON, export JSON/Markdown
- **Multiplataforma**: Web (PWA), Android, Windows Desktop

## 🏗️ Arquitectura

Este es un monorepo que contiene:

```
keep-plus-plus/
├── apps/
│   ├── web/              # PWA (React/Vue/Svelte)
│   ├── mobile/           # Android (Capacitor)
│   └── desktop/          # Windows (Tauri)
├── packages/
│   ├── core/             # Lógica de negocio compartida
│   ├── ui/               # Componentes UI compartidos
│   ├── types/            # TypeScript types compartidos
│   ├── sync/             # Motor de sincronización offline
│   └── storage/          # Capa de persistencia
├── docs/
│   ├── adr/              # Architectural Decision Records
│   ├── domain-map.md     # Mapa de dominios
│   └── dod.md            # Definition of Done/Ready
└── tools/
    └── scripts/          # Scripts de utilidad
```

## 🚀 Inicio rápido

### Prerequisitos

- Node.js 18+
- pnpm 8+
- Git

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd notes_afo

# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Tests
pnpm test

# Build
pnpm build
```

## 📋 Roadmap

### Etapa 0 - Pre-flight (Semana 0) ✅
- [x] PRD y arquitectura
- [x] Configuración de monorepo
- [x] Linters, formatters, CI básica

### Etapa 1 - Fundaciones (Semana 1) 🚧
- [ ] Diseño UI/UX base
- [ ] Componentes base y theming
- [ ] Router y auth stub
- [ ] CI/CD completo

### Etapa 2 - Core Notas (Semana 2)
- [ ] CRUD de notas
- [ ] Etiquetas y colores
- [ ] Pin, archivo, papelera

### Etapas 3-12
Ver [docs/roadmap.md](./docs/roadmap.md) para el plan completo

## 🧪 Testing

- **Unit tests**: `pnpm test:unit`
- **Integration tests**: `pnpm test:integration`
- **E2E tests**: `pnpm test:e2e`
- **Coverage**: Meta de 80% en módulos core

## 📚 Documentación

- [PRD](./docs/prd.md) - Product Requirements Document
- [Roadmap](./docs/roadmap.md) - Plan detallado por etapas
- [Architecture](./docs/architecture.md) - Decisiones arquitectónicas
- [Contributing](./CONTRIBUTING.md) - Guía de contribución
- [Domain Map](./docs/domain-map.md) - Mapa de dominios

## 🤝 Contribución

Lee nuestra [Guía de Contribución](./CONTRIBUTING.md) para detalles sobre:
- Flujo de trabajo con Git
- Estándares de código
- Proceso de code review
- Definition of Ready/Done

## 📊 Métricas de éxito

- D1 activación ≥70%
- D7 retención ≥35%
- Crash-free sessions ≥99.8%
- P95 búsqueda <200ms (5k notas)
- TTI <2.5s (4G)

## 🔒 Seguridad y Privacidad

- TLS en todas las comunicaciones
- Cifrado en reposo en servidor
- Telemetría opt-in y anonimizada
- Export/borrado completo de datos

## 📄 Licencia

[Definir licencia]

## 👥 Equipo

[Información del equipo]

---

**Estado del proyecto**: 🚧 En desarrollo activo - Etapa 0
