# Mapa de Dominios — Keep++

## Visión General

Este documento describe la arquitectura de dominios de Keep++, definiendo los límites entre módulos, sus responsabilidades y dependencias.

---

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Web PWA  │  │ Android  │  │ Windows  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Shared UI Components                      │ │
│  │  (Buttons, Forms, Cards, Modals, Theming)             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ │
│  │ Notes  │ │ Props  │ │ Search │ │ Sync   │ │ Reminders│ │
│  └────────┘ └────────┘ └────────┘ └────────┘ └──────────┘ │
│  ┌────────┐ ┌────────┐ ┌────────┐                          │
│  │ Auth   │ │ Tags   │ │ I/O    │                          │
│  └────────┘ └────────┘ └────────┘                          │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐              │
│  │Storage │ │ API    │ │ Notifs │ │ Crypto │              │
│  └────────┘ └────────┘ └────────┘ └────────┘              │
└─────────────────────────────────────────────────────────────┘
```

---

## Dominios y Bounded Contexts

### 1. Notes Domain

**Responsabilidad:** Gestión del ciclo de vida completo de las notas.

**Conceptos principales:**
- Note (entidad raíz)
- NoteMetadata (color, timestamps)
- NoteState (active, archived, trashed)

**Operaciones:**
- CRUD de notas
- Pin/unpin
- Archive/unarchive
- Soft delete (papelera)
- Hard delete (purga)

**Dependencias:**
- Storage (persistencia)
- Sync (sincronización)
- Tags Domain (relación)

**Límites:**
- No conoce cómo se sincronizan las notas (responsabilidad de Sync)
- No conoce detalles de storage (usa interfaces)

---

### 2. Properties Domain

**Responsabilidad:** Sistema de propiedades tipadas extensible.

**Conceptos principales:**
- PropertyDefinition (esquema)
- PropertyValue (datos)
- PropertyType (enum: text, number, date, etc.)
- PropertyValidator

**Operaciones:**
- Definir propiedades en notas
- Validar valores según tipo
- Migrar esquemas
- Indexar para búsqueda

**Dependencias:**
- Notes Domain (pertenecen a notas)
- Storage (persistencia)
- Search (indexación)

**Límites:**
- No conoce UI de renderizado (solo validación)
- Agnóstico al motor de búsqueda

---

### 3. Tags Domain

**Responsabilidad:** Taxonomía mediante etiquetas.

**Conceptos principales:**
- Tag (entidad)
- TagColor
- NoteTagRelation

**Operaciones:**
- CRUD de tags
- Asignar/desasignar tags a notas
- Búsqueda por tags

**Dependencias:**
- Notes Domain (relación many-to-many)
- Storage (persistencia)

**Límites:**
- Tags son entidades independientes
- No conocen propiedades (diferente dominio)

---

### 4. Search Domain

**Responsabilidad:** Búsqueda full-text y filtrado.

**Conceptos principales:**
- SearchIndex
- SearchQuery
- SearchFilter
- SearchResult

**Operaciones:**
- Indexar notas y propiedades
- Ejecutar búsquedas full-text
- Aplicar filtros combinables
- Ordenar resultados

**Dependencias:**
- Notes Domain (fuente de datos)
- Properties Domain (indexa propiedades)
- Tags Domain (filtra por tags)
- Storage (índice persistente)

**Límites:**
- No modifica datos, solo lee
- Usa índice invertido local (no servidor)

---

### 5. Sync Domain

**Responsabilidad:** Sincronización offline-first y resolución de conflictos.

**Conceptos principales:**
- SyncQueue
- SyncOperation
- ConflictResolver
- SyncState

**Operaciones:**
- Encolar operaciones offline
- Sincronizar con servidor
- Resolver conflictos (LWW, duplicado)
- Reintentos con backoff

**Dependencias:**
- Notes, Properties, Tags (datos a sincronizar)
- Storage (cola persistente)
- API Client (comunicación)

**Límites:**
- No conoce detalles de UI
- Idempotencia garantizada
- Event sourcing interno

---

### 6. Reminders Domain

**Responsabilidad:** Programación de recordatorios y notificaciones.

**Conceptos principales:**
- Reminder (entidad)
- ReminderScheduler
- ReminderTrigger

**Operaciones:**
- CRUD de recordatorios
- Programar notificaciones
- Disparar en tiempo correcto
- Marcar como completado

**Dependencias:**
- Notes Domain (asociados a notas)
- Notifications Infrastructure (envío)
- Storage (persistencia)

**Límites:**
- No conoce plataforma de notificaciones
- Tolerante a drift de reloj (±1 min)

---

### 7. Auth Domain

**Responsabilidad:** Autenticación y autorización.

**Conceptos principales:**
- User (entidad)
- Session
- Credentials
- AuthToken

**Operaciones:**
- Login/logout
- Registro
- Recuperación de contraseña
- Gestión de sesiones
- Rate limiting

**Dependencias:**
- API Client
- Storage (tokens, sesión)
- Crypto (hashing)

**Límites:**
- No conoce dominios de negocio
- Solo provee identidad

---

### 8. Import/Export Domain

**Responsabilidad:** Migración de datos desde/hacia otros formatos.

**Conceptos principales:**
- Importer (Google Keep, etc.)
- Exporter (JSON, Markdown)
- ImportReport
- DataValidator

**Operaciones:**
- Importar desde Google Keep JSON
- Exportar a JSON/Markdown
- Validar integridad
- Generar reportes

**Dependencias:**
- Notes, Properties, Tags (datos)
- Storage (persistencia)

**Límites:**
- Idempotente (no duplica)
- Streaming para grandes volúmenes

---

## Infrastructure Layer

### Storage

**Responsabilidad:** Abstracción de persistencia.

**Implementaciones:**
- IndexedDB (Web)
- SQLite (Mobile/Desktop)

**Interfaces:**
- `INotesRepository`
- `IPropertiesRepository`
- `ITagsRepository`
- `ISyncQueueRepository`

### API Client

**Responsabilidad:** Comunicación con backend.

**Features:**
- HTTP client con reintentos
- Request/response interceptors
- Rate limiting client-side
- Error handling

### Notifications

**Responsabilidad:** Envío de notificaciones multiplataforma.

**Implementaciones:**
- Web Push API
- Capacitor Local Notifications
- Tauri Notification

**Interface:**
- `INotificationService`

### Crypto

**Responsabilidad:** Operaciones criptográficas.

**Features:**
- Hashing (passwords)
- Cifrado simétrico (futuro E2E)
- Generación de IDs seguros

---

## Dependencias entre Dominios

### Reglas de dependencia

1. **Presentation** → **Application** → **Domain** → **Infrastructure**
2. Domain no depende de Infrastructure (inversión de dependencia)
3. Dominios se comunican mediante eventos o interfaces

### Diagrama de dependencias

```
Notes ← Properties
  ↓       ↓
Tags ←  Search
  ↓       ↓
      Sync
        ↓
    Reminders

Auth (independiente)
I/O (depende de todos los dominios de datos)
```

---

## Eventos de Dominio

### NoteCreated
- Emitido por: Notes Domain
- Escuchado por: Search (indexar), Sync (encolar)

### NoteUpdated
- Emitido por: Notes Domain
- Escuchado por: Search (re-indexar), Sync (encolar)

### NoteDeleted
- Emitido por: Notes Domain
- Escuchado por: Search (eliminar índice), Sync (encolar)

### PropertyAdded
- Emitido por: Properties Domain
- Escuchado por: Search (indexar), Sync (encolar)

### TagAssigned
- Emitido por: Tags Domain
- Escuchado por: Search (actualizar filtros)

### SyncCompleted
- Emitido por: Sync Domain
- Escuchado por: UI (actualizar estado)

### ReminderTriggered
- Emitido por: Reminders Domain
- Escuchado por: Notifications (enviar)

---

## Módulos en el Monorepo

### Packages Structure

```
packages/
├── core/                 # Lógica de dominio pura
│   ├── notes/
│   ├── properties/
│   ├── tags/
│   ├── search/
│   ├── sync/
│   ├── reminders/
│   ├── auth/
│   └── io/
├── storage/              # Implementaciones de persistencia
│   ├── indexeddb/
│   ├── sqlite/
│   └── interfaces/
├── ui/                   # Componentes compartidos
│   ├── components/
│   ├── theme/
│   └── hooks/
└── types/                # TypeScript types compartidos
    ├── entities/
    ├── dtos/
    └── events/
```

---

## Principios de Diseño

### 1. Single Responsibility
Cada dominio tiene una única razón de cambio.

### 2. Open/Closed
Extensible vía interfaces (ej: nuevos tipos de propiedades).

### 3. Dependency Inversion
Domain no depende de Infrastructure, usa interfaces.

### 4. Interface Segregation
Interfaces pequeñas y específicas (no god interfaces).

### 5. Don't Repeat Yourself
Lógica compartida en `core`, no duplicada.

### 6. Separation of Concerns
UI, lógica de negocio, e infraestructura separadas.

---

## Límites y Constraints

### Límites de Datos
- Max 50 propiedades por nota
- Max 100 MB por export
- Max 10,000 notas en índice local

### Límites de Performance
- Búsqueda P95 < 200ms (5k notas)
- CRUD < 100ms local
- Sync batch < 5s

### Límites de Seguridad
- Rate limit: 100 req/min por usuario
- Session timeout: 30 días inactivo
- Password min 12 caracteres

---

## Testing Strategy por Dominio

### Unit Tests (80% coverage)
- Toda lógica de dominio
- Validaciones
- Algoritmos

### Integration Tests
- Interacciones entre dominios
- Eventos
- Repositories

### Contract Tests
- API client ↔ Backend
- Storage interfaces

### E2E Tests
- Flujos completos
- Multi-dominio

---

## Próximos Pasos

1. Implementar interfaces de Storage
2. Definir eventos de dominio (Event Bus)
3. Crear DTOs para comunicación entre capas
4. Documentar contratos de API
