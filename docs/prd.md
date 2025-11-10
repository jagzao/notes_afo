# PRD — Keep++ (Notas extensibles tipo Keep + propiedades estilo Notion)

## 1) Objetivo

Captura y organiza notas rápidas con **propiedades tipadas por nota**, filtros potentes y sincronización **offline-first** en **Web (PWA)**, **Android** y **Windows Desktop**.

## 2) Usuarios

* Individual productivo (rápida captura).
* Power user (propiedades, filtros, plantillas).
* Pequeños equipos (compartir en fase 2).

## 3) Alcance (MVP)

* **Notas**: título, descripción, color, etiquetas, pin, archivado, papelera (30 días), recordatorios puntuales.
* **Propiedades** por nota (crear/editar/eliminar): **texto**, **número**, **fecha/hora**, **checkbox**, **select**, **multi-select**, **URL**.
* **Búsqueda** full-text local + **filtros** combinables (etiquetas/propiedades) + orden (creación, edición, numérico, fecha).
* **Offline-first**: cache local, cola de cambios, resolución básica de conflictos (LWW por campo + duplicado seguro).
* **Sync** multi-dispositivo; autenticación básica (email/pass; proveedores sociales opc.).
* **Vistas**: tarjetas y lista; archivo y papelera; panel de propiedades en el editor.
* **Import/Export**: import de Google Keep (JSON), export JSON/Markdown.
* **Apps**: PWA instalable; Android (Capacitor) con hoja de compartir; Windows (Tauri/Electron) con notificaciones.

### Backlog cercano (post-MVP)

* Propiedades: **Archivo/Imagen** (con vista previa), **Relación**, **Fórmula** (sandbox).
* Plantillas de nota; recordatorios recurrentes.
* Compartición y colaboración en tiempo real.
* Cifrado **E2E** por espacio; API pública; OCR local para imágenes.

## 4) Requisitos funcionales (criterios de aceptación)

* Crear nota con mínimo título o descripción.
* Añadir/eliminar propiedades sin pérdida de datos; validación por tipo.
* Filtros combinables (etiquetas + ≥1 propiedad) y orden estable.
* Recordatorios puntuales con notificación (Web/Android/Windows).
* Papelera con restauración; auto-purga a 30 días.
* Operación completa **sin Internet**; al reconectar, sincroniza; si conflicto en el mismo campo, duplicar versión y marcar para revisión.

## 5) Requisitos no funcionales

* **Rendimiento**: TTI < 2.5 s (4G), P95 búsqueda < 200 ms con 5k notas locales.
* **Confiabilidad**: ≥99.5% uptime; cero pérdida en cortes de red.
* **Seguridad**: TLS; cifrado en reposo en servidor; rate-limit de auth.
* **Privacidad**: consentimiento, export/borrado de cuenta y datos.
* **Accesibilidad**: WCAG 2.1 AA; navegación por teclado.
* **I18n**: ES/EN.

## 6) Modelo de datos (MVP)

* **User**(id, email, name, settings).
* **Note**(id, userId, title, description, color, pinned, archived, trashed, createdAt, updatedAt).
* **Tag**(id, userId, name, color) ↔ **NoteTag**(noteId, tagId).
* **PropertyDef**(id, noteId, key, type: text|number|date|checkbox|select|multiselect|url, options?).
* **PropertyVal**(id, noteId, key, valueText|valueNumber|valueDate|valueBool|valueSelect[]|valueUrl).
* **Reminder**(id, noteId, fireAt, completed).

> Límites sugeridos: ≤50 propiedades por nota; indexar `noteId+key`, `type`, `updatedAt`.

## 7) Estados & Vistas

* **Home** (Pinned / Others), **Filtros**, **Búsqueda**, **Archivo**, **Papelera**, **Ajustes**.
* **Editor**: cuerpo + panel de propiedades (crear, tipo, validación, reordenar).
* **Permisos**: notificaciones; export local.

## 8) Sync & Offline

* Almacenamiento local (IndexedDB/SQLite); cola idempotente; backoff exponencial.
* Conflictos: **LWW por campo** + opción "ver versiones y fusionar".
* Background sync cuando recupera red; reloj desalineado tolerado.

## 9) Plataforma

* **Web PWA**: manifest, Service Worker, push.
* **Android (Capacitor)**: notifs, share sheet ("Compartir a Keep++").
* **Windows (Tauri/Electron)**: notifs nativas, almacenamiento local.

## 10) Seguridad/Privacidad

* Auth con rate-limit y bloqueo progresivo; 2FA en backlog.
* Cifrado servidor; E2E opcional en fase 2.
* Telemetría **opt-in** mínima y anonimizada.

## 11) Métricas de éxito

* D1 activación ≥70%; **D7 retención ≥35%**.
* ≥60% crean ≥5 notas en semana 1.
* Crash-free sessions ≥99.8%.
* P95 búsqueda <200 ms con 5k notas.

## 12) Riesgos & Mitigación

* **Conflictos complejos** → UI de merge por campo + duplicado seguro.
* **Límites de Push iOS** → recordatorios locales fallback.
* **Escala de propiedades** → índices, paginación, límites y profiling.
* **Portabilidad multi-plataforma** → smoke tests por SO en CI.

## 13) Roadmap por etapas (resumen)

* **E0 Pre-flight (S0)**: PRD firmado, arquitectura, CI, linters.
* **E1 Fundaciones (S1)**: monorepo, diseño IA/UX base, theming, router, auth stub, CI/CD.
* **E2 Core Notas (S2)**: CRUD, etiquetas, pin/archivo/papelera.
* **E3 Propiedades (S3–S4)**: tipos, validación, migraciones; rendimiento local.
* **E4 Búsqueda/Filtros (S4)**: full-text + filtros; orden avanzado.
* **E5 Offline & Sync (S5–S6)**: cache, cola, conflictos, resiliencia.
* **E6 Recordatorios (S6)**: notifs multi-plataforma; precisión ±1 min.
* **E7 I/O (S7)**: import Keep, export JSON/MD, backups manuales.
* **E8 Apps (S8)**: PWA instalable, Android (AAB), Windows (bundle).
* **E9 Seguridad/Privacidad (S8–S9)**: cifrado en reposo, borrado/descarga de datos.
* **E10 A11y & Perf (S9)**: WCAG, budgets LCP/TTI.
* **E11 Telemetría/Obs (S9)**: opt-in, panel básico.
* **E12 Beta & Hardening (S10)**: fixes P0/P1, guías, runbook → **GA**.

## 14) Historias clave (muestra)

* Como usuario, **añado un campo Fecha** a una nota y la app valida e indexa.
* Como usuario, **filtro** por etiqueta "Trabajo" y `status: checkbox=true`.
* Como usuario, **edito offline** y al volver la red la app sincroniza sin pérdidas.
* Como usuario, **recibo un recordatorio** puntual en Android/Windows/Web.

## 15) Criterios de salida (MVP)

* Paridad Keep en captura/organización + **propiedades tipadas** funcionales.
* PWA, Android y Windows publicados (canales internos o store).
* Métricas mínimas cumplidas y **sin P0** abiertos.
