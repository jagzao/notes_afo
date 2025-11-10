# Arquitectura de Keep++

## Visión General

Keep++ sigue una arquitectura **modular, offline-first, event-driven** con separación clara entre capas.

## Principios Arquitectónicos

### 1. Offline-First

Todas las operaciones se realizan primero localmente, luego se sincronizan con el servidor.

```
User Action → Local Storage → Sync Queue → Server
                    ↓
                  UI Update
```

### 2. Separation of Concerns

```
┌─────────────────────────────────────┐
│     Presentation (UI/UX)            │
├─────────────────────────────────────┤
│     Application (Use Cases)         │
├─────────────────────────────────────┤
│     Domain (Business Logic)         │
├─────────────────────────────────────┤
│     Infrastructure (I/O, Storage)   │
└─────────────────────────────────────┘
```

### 3. Dependency Inversion

Domain no depende de Infrastructure. Infrastructure implementa interfaces definidas por Domain.

```typescript
// Domain define interface
interface INotesRepository {
  save(note: Note): Promise<void>;
  findById(id: string): Promise<Note | null>;
}

// Infrastructure implementa
class IndexedDBNotesRepository implements INotesRepository {
  // Implementation
}
```

### 4. Event-Driven

Módulos se comunican mediante eventos para desacoplamiento.

```typescript
// Notes emite evento
eventBus.emit('note.created', { noteId: '123' });

// Search escucha y reacciona
eventBus.on('note.created', async (event) => {
  await searchIndex.index(event.noteId);
});
```

## Capas de la Arquitectura

### Presentation Layer

**Responsabilidad:** Interfaz de usuario, interacción con usuario.

**Tecnologías:**
- Web: React/Vue/Svelte (TBD en Etapa 1)
- Mobile: Capacitor
- Desktop: Tauri

**Componentes:**
- Pages/Screens
- Components
- Routing
- State Management (UI state only)

### Application Layer

**Responsabilidad:** Orquestación de casos de uso, coordinación entre dominio e infraestructura.

**Componentes:**
- Use Cases (Application Services)
- DTOs (Data Transfer Objects)
- Event Handlers
- Adapters (Domain ↔ Infrastructure)

**Ejemplo:**

```typescript
class CreateNoteUseCase {
  constructor(
    private notesRepo: INotesRepository,
    private syncQueue: ISyncQueue,
    private eventBus: IEventBus
  ) {}

  async execute(dto: CreateNoteDTO): Promise<Note> {
    // 1. Create domain entity
    const note = Note.create(dto);

    // 2. Persist locally
    await this.notesRepo.save(note);

    // 3. Queue for sync
    await this.syncQueue.enqueue({
      type: 'CREATE',
      entity: 'note',
      data: note,
    });

    // 4. Emit event
    this.eventBus.emit('note.created', { noteId: note.id });

    return note;
  }
}
```

### Domain Layer

**Responsabilidad:** Lógica de negocio pura, reglas de dominio, entidades.

**Componentes:**
- Entities (Note, Tag, Property, etc.)
- Value Objects (Color, PropertyType, etc.)
- Domain Services (complex business logic)
- Domain Events
- Interfaces for Repositories

**Características:**
- No dependencias externas (excepto tipos)
- Pura TypeScript/JavaScript
- Testeable sin mocks

**Ejemplo:**

```typescript
// Entity
class Note {
  private constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public color: Color,
    public pinned: boolean,
    public archived: boolean,
    public trashed: boolean,
    public createdAt: Date,
    public updatedAt: Date
  ) {
    this.validate();
  }

  static create(data: CreateNoteData): Note {
    return new Note(
      uuid(),
      data.title,
      data.description || '',
      data.color || Color.DEFAULT,
      false,
      false,
      false,
      new Date(),
      new Date()
    );
  }

  pin(): void {
    this.pinned = true;
    this.updatedAt = new Date();
  }

  archive(): void {
    this.archived = true;
    this.pinned = false;
    this.updatedAt = new Date();
  }

  moveToTrash(): void {
    this.trashed = true;
    this.pinned = false;
    this.updatedAt = new Date();
  }

  private validate(): void {
    if (!this.title && !this.description) {
      throw new Error('Note must have at least title or description');
    }
  }
}

// Value Object
class Color {
  static readonly DEFAULT = new Color('#FFFFFF');
  static readonly BLUE = new Color('#D7E8FF');
  static readonly GREEN = new Color('#CCFF90');
  // ... more colors

  private constructor(public readonly value: string) {
    if (!this.isValidHex(value)) {
      throw new Error('Invalid color format');
    }
  }

  private isValidHex(color: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(color);
  }
}
```

### Infrastructure Layer

**Responsabilidad:** I/O, persistencia, APIs externas, frameworks.

**Componentes:**
- Repositories (implementaciones)
- API Clients
- Storage adapters (IndexedDB, SQLite)
- Notification services
- Crypto services

**Ejemplo:**

```typescript
class IndexedDBNotesRepository implements INotesRepository {
  constructor(private db: IDBDatabase) {}

  async save(note: Note): Promise<void> {
    const transaction = this.db.transaction(['notes'], 'readwrite');
    const store = transaction.objectStore('notes');
    await store.put(this.toDTO(note));
  }

  async findById(id: string): Promise<Note | null> {
    const transaction = this.db.transaction(['notes'], 'readonly');
    const store = transaction.objectStore('notes');
    const dto = await store.get(id);
    return dto ? this.toDomain(dto) : null;
  }

  private toDTO(note: Note): NoteDTO {
    // Map domain entity to storage DTO
  }

  private toDomain(dto: NoteDTO): Note {
    // Map storage DTO to domain entity
  }
}
```

## Flujos Principales

### Flujo de Creación de Nota

```
User Input
    ↓
[Presentation] CreateNoteForm
    ↓
[Application] CreateNoteUseCase
    ↓
[Domain] Note.create()
    ↓
[Infrastructure] NotesRepository.save()
    ↓
[Infrastructure] SyncQueue.enqueue()
    ↓
[Application] EventBus.emit('note.created')
    ↓
[Application] SearchIndex.index() (listener)
    ↓
[Presentation] UI Update
```

### Flujo de Sincronización

```
[Infrastructure] Network Available
    ↓
[Application] SyncService.start()
    ↓
[Infrastructure] SyncQueue.getNext(batch: 100)
    ↓
[Infrastructure] APIClient.post('/sync', operations)
    ↓
Server Response (success/conflict)
    ↓
If Conflict:
    [Domain] ConflictResolver.resolve()
    ↓
    [Infrastructure] NotesRepository.update()
    ↓
    [Application] EventBus.emit('note.conflict-resolved')
    ↓
[Infrastructure] SyncQueue.markSynced()
    ↓
[Presentation] UI Update (sync indicator)
```

### Flujo de Búsqueda

```
User Types Query
    ↓
[Presentation] SearchInput (debounced)
    ↓
[Application] SearchUseCase.search(query)
    ↓
[Domain] SearchService.search()
    ↓
[Infrastructure] SearchIndex.query()
    ↓
[Infrastructure] NotesRepository.findByIds(resultIds)
    ↓
[Application] Map to DTOs
    ↓
[Presentation] Display Results
```

## Decisiones Técnicas Clave

### Storage

| Platform | Technology | Rationale |
|----------|------------|-----------|
| Web | IndexedDB | Native, async, sizeable |
| Mobile | SQLite (Capacitor) | Fast, relational, offline |
| Desktop | SQLite (Tauri) | Same as mobile, consistency |

### Sync Strategy

- **Client-Server** (no P2P en MVP)
- **Optimistic UI** (apply locally first)
- **Event Sourcing** (queue de operaciones)
- **LWW + Duplicado** para conflictos

### State Management

- **Domain state**: En repositories (source of truth)
- **UI state**: Framework-specific (React Context, Vuex, etc.)
- **Sync state**: En SyncQueue
- **Search state**: En SearchIndex

### Communication Patterns

- **Intra-layer**: Direct function calls
- **Cross-layer**: Dependency injection
- **Inter-module**: Event bus (pub/sub)

## Patrones de Diseño

### Repository Pattern

Abstrae acceso a datos.

```typescript
interface IRepository<T> {
  save(entity: T): Promise<void>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: string): Promise<void>;
}
```

### Use Case Pattern

Cada caso de uso es una clase con un método `execute`.

```typescript
interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
```

### Factory Pattern

Creación de entidades complejas.

```typescript
class NoteFactory {
  createFromGoogleKeep(keepNote: GoogleKeepNote): Note {
    // Complex mapping logic
  }
}
```

### Strategy Pattern

Resolución de conflictos.

```typescript
interface IConflictStrategy {
  resolve(local: Note, remote: Note): Note;
}

class LWWStrategy implements IConflictStrategy {
  resolve(local: Note, remote: Note): Note {
    return local.updatedAt > remote.updatedAt ? local : remote;
  }
}

class DuplicateStrategy implements IConflictStrategy {
  resolve(local: Note, remote: Note): Note {
    // Create duplicate and mark for review
  }
}
```

### Observer Pattern

Event bus para comunicación desacoplada.

```typescript
class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  emit(event: string, data: unknown): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
}
```

## Performance

### Optimizaciones

1. **Lazy loading**: Módulos y componentes
2. **Memoization**: Resultados de búsqueda, propiedades calculadas
3. **Virtualization**: Listas largas (react-window)
4. **Debouncing**: Búsqueda, auto-save
5. **Indexing**: Índices en storage para queries rápidas
6. **Batching**: Sync operations, renders

### Budgets

- Initial load (TTI): <2.5s (4G)
- Search P95: <200ms
- CRUD local: <100ms
- Sync batch (100 ops): <5s

## Seguridad

### Threat Model

- **XSS**: Sanitize user input, CSP
- **Injection**: Validate, use prepared statements (SQLite)
- **CSRF**: Tokens en requests
- **Man-in-the-middle**: TLS only
- **Data at rest**: Encrypt on server (E2E future)

### Implementación

```typescript
// Input validation
class NoteValidator {
  static validateTitle(title: string): void {
    if (title.length > 1000) {
      throw new Error('Title too long');
    }
    // XSS prevention handled by framework
  }
}

// Output sanitization (framework-specific)
// React: Automatic escaping
// Vue: v-html avoided, use v-text

// API security
class APIClient {
  async post(endpoint: string, data: unknown): Promise<Response> {
    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
        'X-CSRF-Token': this.getCSRFToken(),
      },
      body: JSON.stringify(data),
    });
  }
}
```

## Testing Strategy

### Pyramid

```
       E2E (10%)
      /         \
  Integration (20%)
  /               \
 Unit (70%)
```

### Por capa

- **Domain**: 100% unit tests (lógica pura)
- **Application**: Unit + integration (use cases con mocks)
- **Infrastructure**: Integration (real storage, API)
- **Presentation**: E2E (flujos de usuario)

## Monitoreo

### Métricas

- **Performance**: TTI, LCP, FID, CLS
- **Errors**: Crash-free rate, error rate
- **Usage**: DAU, MAU, D7 retention
- **Sync**: Queue length, conflict rate, sync duration

### Logging

```typescript
interface ILogger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error: Error, meta?: Record<string, unknown>): void;
}

// Structured logging
logger.info('Note created', {
  noteId: note.id,
  userId: user.id,
  offline: !navigator.onLine,
});
```

## Escalabilidad

### Límites MVP

- 10,000 notas por usuario
- 50 propiedades por nota
- 100 MB export size

### Escala futura

- Paginación de notas
- Índices parciales (ventana de tiempo)
- Compresión de storage
- CDN para assets
- Sharding de usuarios (backend)

## Referencias

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design (Eric Evans)](https://www.domainlanguage.com/ddd/)
- [Offline First](https://offlinefirst.org/)
- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)
