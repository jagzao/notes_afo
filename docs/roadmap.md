# Roadmap Keep++ — Plan por Etapas

## Visión General

Este documento describe el plan de desarrollo de Keep++ en 12 etapas a lo largo de aproximadamente 10 semanas, desde la configuración inicial hasta el lanzamiento de la beta cerrada.

---

## Etapa 0 — Pre-flight (Semana 0)

**Objetivo:** Alinear visión, riesgos y cimientos.

### Entregables
- [x] PRD final firmado
- [x] Mapa de dominios y módulos
- [x] Decisiones arquitectónicas documentadas (ADR)
- [x] Backlog priorizado con épicas e historias
- [x] Definition of Ready/Done
- [x] CI básica configurada
- [x] Linters y formatters (ESLint, Prettier)
- [x] Plantilla de pruebas

### Definition of Done
- PRD aprobado por stakeholders
- Tablero con épicas e historias priorizadas
- Pipeline CI verde en main
- Linters/formatters funcionando
- Guía de contribución disponible

---

## Etapa 1 — Fundaciones (Semana 1)

**Objetivo:** Monorepo, diseño UX base y pipeline completo.

### Entregables
- [ ] Diseño de información y flujos de usuario
- [ ] Sistema de diseño base (colores, tipografía, espaciado)
- [ ] Componentes UI base (Button, Input, Card, Modal)
- [ ] Sistema de theming (light/dark)
- [ ] Router configurado
- [ ] Stub de autenticación
- [ ] CI/CD completo para Web

### Definition of Done
- Build en main siempre verde
- 80% cobertura en módulos base
- Guía de contribución actualizada
- Componentes documentados en Storybook/similar
- Tests unitarios para componentes base

---

## Etapa 2 — Core Notas (Semana 2)

**Objetivo:** CRUD de notas y taxonomías básicas.

### Entregables
- [ ] CRUD completo de notas (título, descripción)
- [ ] Sistema de etiquetas (crear, asignar, filtrar)
- [ ] Pin/unpin notas
- [ ] Archivar/desarchivar
- [ ] Papelera con restauración
- [ ] Colores por nota
- [ ] Ordenamiento básico (fecha creación, edición)

### Definition of Done
- Tests e2e para crear/editar/borrar/restaurar
- Vaciado automático de papelera tras 30 días
- Validación de límites (título, descripción)
- Performance: CRUD operations <100ms (local)

---

## Etapa 3 — Propiedades Tipadas (Semanas 3-4)

**Objetivo:** Sistema de propiedades extensible estilo Notion.

### Entregables
- [ ] Modelo PropertyDef/PropertyVal
- [ ] Tipos soportados:
  - Texto
  - Número
  - Fecha/hora
  - Checkbox
  - Select (opciones únicas)
  - Multi-select
  - URL
- [ ] Validación por tipo
- [ ] UI para añadir/editar/eliminar propiedades
- [ ] Sistema de migración de esquema

### Definition of Done
- Añadir/eliminar/editar propiedades sin pérdida de datos
- Migración versionada de esquema
- Performance: 1k props/100 notas <200ms lectura local
- Tests de validación por cada tipo
- Límite de 50 propiedades por nota enforced

---

## Etapa 4 — Búsqueda y Filtros (Semana 4)

**Objetivo:** Encontrar información rápidamente.

### Entregables
- [ ] Búsqueda full-text local (título, descripción, propiedades)
- [ ] Índice de búsqueda optimizado
- [ ] Filtros combinables:
  - Por etiquetas (AND/OR)
  - Por propiedades
  - Por estado (pinned, archived, trashed)
- [ ] Ordenamiento avanzado:
  - Por fecha (creación, edición)
  - Por valores numéricos
  - Por valores de fecha

### Definition of Done
- P95 búsqueda <200ms con 5k notas
- Tests de relevancia de resultados
- No bloquea UI durante búsqueda
- Highlighting de términos encontrados

---

## Etapa 5 — Offline-first & Sync (Semanas 5-6)

**Objetivo:** Trabajar completamente offline con sincronización robusta.

### Entregables
- [ ] Cache local (IndexedDB para web, SQLite para mobile/desktop)
- [ ] Cola de operaciones idempotente
- [ ] Resolución de conflictos (LWW por campo)
- [ ] Duplicado seguro en conflictos complejos
- [ ] Sistema de reintentos con backoff exponencial
- [ ] Indicadores de estado de sync
- [ ] Background sync cuando hay conexión

### Definition of Done
- Modo avión completo funcional
- Tests de conflictos multi-dispositivo
- Cero pérdida de datos en cortes de red
- Tests de caos (cortes aleatorios)
- Tolerancia a relojes desalineados

---

## Etapa 6 — Recordatorios & Notificaciones (Semana 6)

**Objetivo:** Sistema de recordatorios multiplataforma.

### Entregables
- [ ] Modelo de recordatorios puntuales
- [ ] Scheduler multi-plataforma
- [ ] Web Push notifications
- [ ] Capacitor notifications (Android)
- [ ] Tauri notifications (Windows)
- [ ] UI para crear/editar/eliminar recordatorios
- [ ] Manejo de permisos de notificaciones

### Definition of Done
- Disparo puntual con tolerancia ±1 min
- Permisos correctamente manejados
- Fallback local si no hay permisos
- Tests de precisión de recordatorios

---

## Etapa 7 — Import/Export (Semana 7)

**Objetivo:** Importación y exportación de datos.

### Entregables
- [ ] Import de Google Keep (formato JSON)
- [ ] Export a JSON
- [ ] Export a Markdown
- [ ] Backups manuales
- [ ] UI de import/export
- [ ] Reporte de importación (éxitos/errores)

### Definition of Done
- Idempotencia (no duplica en re-imports)
- Reporte detallado de import
- Validación de formatos
- Tests con datasets grandes (1k+ notas)

---

## Etapa 8 — PWA + Android + Windows (Semana 8)

**Objetivo:** Aplicaciones nativas para cada plataforma.

### Entregables
- [ ] PWA instalable (manifest, service worker)
- [ ] Android app con Capacitor:
  - AAB para Play Store
  - Share sheet integration
  - Almacenamiento local
- [ ] Windows app con Tauri:
  - Instalador
  - Notificaciones nativas
  - System tray integration
- [ ] Documentación de deployment

### Definition of Done
- Instalaciones reales probadas en dispositivos
- Tamaños de bundle documentados
- Performance equivalente entre plataformas
- Tests smoke en cada plataforma

---

## Etapa 9 — Seguridad & Privacidad (Semanas 8-9)

**Objetivo:** Proteger datos y privacidad del usuario.

### Entregables
- [ ] TLS en todas las comunicaciones
- [ ] Cifrado en reposo en servidor
- [ ] Rate limiting en endpoints críticos
- [ ] Sesiones seguras con tokens
- [ ] Flujo de borrado de cuenta
- [ ] Flujo de exportación completa de datos
- [ ] Política de privacidad
- [ ] Términos de servicio

### Definition of Done
- Pentest ligero realizado
- Checklist OWASP Top-10 relevante completado
- DPIA (Data Privacy Impact Assessment) básica
- Documentación de seguridad para developers

---

## Etapa 10 — Accesibilidad & Performance (Semana 9)

**Objetivo:** Uso universal y rendimiento óptimo.

### Entregables
- [ ] WCAG 2.1 AA compliance:
  - Navegación completa por teclado
  - ARIA labels apropiados
  - Contrastes adecuados
  - Screen reader support
- [ ] Performance budgets:
  - TTI < 2.5s en 4G
  - LCP P95 optimizado
  - FID/INP optimizado
- [ ] Lighthouse audits en CI
- [ ] Bundle size budgets

### Definition of Done
- Auditoría a11y pasada
- Budgets de rendimiento con alertas en CI
- Lighthouse score >90 en todas las categorías
- Tests con lectores de pantalla

---

## Etapa 11 — Telemetría (opt-in) & Observabilidad (Semana 9)

**Objetivo:** Medir uso sin invadir privacidad.

### Entregables
- [ ] Sistema de eventos opt-in:
  - Crear nota
  - Añadir propiedad
  - Búsqueda realizada
  - Sync completado
- [ ] Logs estructurados
- [ ] Trazas distribuidas
- [ ] Panel de métricas (Grafana/similar)
- [ ] Alertas básicas
- [ ] Anonimización de datos

### Definition of Done
- Opt-in claro y explícito
- Anonimización verificada
- Tableros de métricas activos
- Documentación de eventos

---

## Etapa 12 — Beta Cerrada & Hardening (Semana 10)

**Objetivo:** Estabilizar para lanzamiento GA.

### Entregables
- [ ] Programa de beta testers
- [ ] Fix de todos los P0 y P1
- [ ] Migradores de datos listos
- [ ] Guía de usuario completa
- [ ] FAQ
- [ ] Runbook de incidentes
- [ ] Plan de rollout
- [ ] Criterios de éxito GA definidos

### Definition of Done
- Crash-free rate ≥99.8%
- D7 retención ≥35% en beta
- Cero P0 abiertos
- P1s documentados para post-GA
- Documentación completa

---

## Épicas y Módulos

### E-Auth — Autenticación
- Login/registro
- Sesión persistente
- Recuperación de contraseña
- Rate limiting
- 2FA (backlog)

**DoD:** Flows felices + errores, rate-limit implementado, tests e2e

### E-Notes — Notas Core
- CRUD completo
- Pin/archivo/papelera
- Colores
- Etiquetas

**DoD:** Tests e2e completos, límites razonables (50 MB export)

### E-Props — Propiedades Tipadas
- Todos los tipos MVP
- Validación
- UI de gestión

**DoD:** Añadir/eliminar sin pérdida, migración versionada

### E-Search — Búsqueda y Filtros
- Índice local
- Filtros combinables
- Performance

**DoD:** P95 <200ms, no bloquea render

### E-Sync — Sincronización Offline
- Cache local
- Cola de operaciones
- Resolución de conflictos

**DoD:** Tests de caos (cortes aleatorios)

### E-Reminders — Recordatorios
- Scheduler multiplataforma
- Notificaciones

**DoD:** Exactitud ±1min, reintentos

### E-I/O — Import/Export
- Import Google Keep
- Export JSON/Markdown
- Backups

**DoD:** Idempotencia, reporte de resultados

### E-Platforms — Aplicaciones
- PWA
- Android
- Windows

**DoD:** Instalación y notificaciones en cada SO

### E-Sec — Seguridad
- Cifrado
- Borrado de datos
- Políticas

**DoD:** Checklist OWASP pasada

### E-A11y/Perf — Accesibilidad y Performance
- WCAG compliance
- Performance budgets

**DoD:** Auditorías verdes

### E-Telemetry — Telemetría
- Eventos opt-in
- Panel de métricas

**DoD:** Eventos mínimos, trazas útiles

---

## Cadencia de Sprints

### Planning (2h)
- Revisión de metas
- Estimación de capacidad
- Selección de historias (DoR verificado)

### Daily (15min)
- Bloqueadores
- Progreso
- Próximos pasos

### Code Review
- Mínimo 2 aprobaciones
- Checklist de seguridad
- Tests pasando

### QA Semanal
- Regresión
- Tests e2e
- Smoke tests por plataforma

### Demo & Retro (1.5h)
- Demostración de features
- Métricas (LCP, crash-free, D1/D7)
- Retrospectiva y mejoras

---

## Matriz de Pruebas

### Unit Tests (80% coverage)
- Lógica de dominio
- Validación de propiedades
- Algoritmos de sync

### Contract/API Tests
- Validación de esquemas
- Códigos de respuesta
- Contratos entre cliente/servidor

### E2E Tests
- Flujos críticos:
  - Captura de nota
  - Búsqueda
  - Offline → edit → sync
  - Recordatorios

### Chaos Tests
- Cortes de red aleatorios
- Relojes desalineados
- Concurrencia multi-dispositivo

### Accessibility Tests
- Navegación por teclado
- Screen readers
- Contrastes

### Performance Tests
- 5k notas
- 1k notas con propiedades
- Búsquedas complejas

---

## Riesgos y Mitigación

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Conflictos complejos de sync | Alto | Media | UI de merge + duplicado seguro |
| Límites de Push Web | Medio | Alta | Fallback a recordatorios locales |
| Crecimiento de datos | Alto | Media | Budgets, paginación, índices |
| Portabilidad Android/Windows | Medio | Media | Suites smoke por plataforma en CI |
| Performance con muchas props | Alto | Media | Límites, indexación, profiling |

---

## Hitos Clave

| Semana | Hito | Criterio |
|--------|------|----------|
| S2 | CRUD Notas Usable | Crear, editar, borrar notas funciona |
| S4 | Props + Búsqueda | Propiedades tipadas y filtros básicos |
| S6 | Offline Estable | Sync sin pérdida de datos |
| S7 | Import/Export | Migración desde Google Keep |
| S8 | Apps Nativas | PWA/Android/Windows instalables |
| S10 | Beta → GA | Métricas cumplidas, P0s cerrados |

---

## Próximos Pasos (Post-MVP)

- Propiedades avanzadas (Archivo, Relación, Fórmula)
- Recordatorios recurrentes
- Colaboración en tiempo real
- Cifrado E2E
- API pública
- OCR para imágenes
- Templates de notas
- iOS app
