# ADR-003: Arquitectura Offline-First

**Estado**: Aceptado

**Fecha**: 2025-11-10

**Autores**: Equipo Keep++

---

## Contexto

Keep++ debe funcionar completamente sin conexión a Internet y sincronizar cambios cuando haya red. Los usuarios esperan:

1. Crear/editar notas sin conexión
2. Cero pérdida de datos en cortes de red
3. Sincronización automática al reconectar
4. Resolución de conflictos cuando múltiples dispositivos editan la misma nota

Los enfoques tradicionales (online-first con cache) no garantizan estas necesidades.

## Decisión

Implementaremos una arquitectura **offline-first** con los siguientes componentes:

### 1. Local Storage como fuente de verdad

- **Web**: IndexedDB
- **Mobile**: SQLite (Capacitor)
- **Desktop**: SQLite (Tauri)

Todas las operaciones se escriben primero localmente, luego se sincronizan.

### 2. Cola de sincronización persistente

```typescript
interface SyncOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'note' | 'property' | 'tag';
  data: unknown;
  timestamp: number;
  retries: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
}
```

Operaciones se encolan localmente y procesan con backoff exponencial.

### 3. Idempotencia garantizada

- Operaciones tienen IDs únicos (UUID v4)
- Servidor rechaza duplicados (deduplication)
- Reintentos son seguros

### 4. Resolución de conflictos

**Estrategia base: Last-Write-Wins (LWW) por campo**

```typescript
interface FieldVersion {
  value: unknown;
  timestamp: number;
  deviceId: string;
}
```

**Estrategia de seguridad: Duplicación en conflictos complejos**

Si múltiples campos tienen conflicto, se crea copia y se marca para revisión manual.

### 5. Background Sync

- **Web**: Background Sync API + Service Worker
- **Mobile/Desktop**: Tarea en background cuando hay conexión

### 6. Estado de sincronización visible

UI muestra:
- 🟢 Sincronizado
- 🟡 Cambios pendientes
- 🔴 Error de sincronización

## Consecuencias

### Positivas

✅ **Experiencia offline completa**: App usable sin Internet

✅ **Cero pérdida de datos**: Todo se guarda localmente primero

✅ **Resiliencia**: Tolerante a cortes de red

✅ **Performance**: Lectura/escritura local es instantánea

✅ **Multi-dispositivo**: Sincronización automática

✅ **Confianza del usuario**: Datos siempre seguros

### Negativas

⚠️ **Complejidad**: Sync engine no es trivial

⚠️ **Storage límites**: IndexedDB tiene límites del navegador

⚠️ **Conflictos**: Resolución requiere lógica cuidadosa

⚠️ **Testing**: Requiere tests de caos (cortes aleatorios)

⚠️ **Debugging**: Más difícil rastrear bugs de sync

### Mitigación

- **Límites de storage**: Alertar al usuario cerca del límite, ofrecer export
- **Conflictos**: UI clara de revisión, duplicado es seguro por defecto
- **Testing**: Suite de chaos tests en CI
- **Debugging**: Logs detallados de sync, telemetría opt-in

## Alternativas Consideradas

### 1. Online-First con cache

**Pros**: Más simple, menos lógica
**Contras**: No funciona offline, pérdida de datos posible

**Razón de rechazo**: No cumple requisitos de offline completo

### 2. CRDT (Conflict-Free Replicated Data Types)

**Pros**: Resolución automática de conflictos sin LWW
**Contras**: Complejidad alta, overhead de metadata, difícil debuggear

**Razón de rechazo**: Overhead no justificado para notas simples, LWW + duplicado es suficiente

### 3. Operational Transformation (OT)

**Pros**: Usado en Google Docs, colaboración real-time
**Contras**: Extremadamente complejo, requiere servidor central

**Razón de rechazo**: MVP no requiere real-time, OT es overkill

## Flujo de Sincronización

### Escritura

```
User Action
    ↓
Apply Locally (Optimistic)
    ↓
Save to Local Storage
    ↓
Add to Sync Queue
    ↓
[When online]
    ↓
Send to Server
    ↓
Server confirms
    ↓
Mark as synced
```

### Lectura

```
User Request
    ↓
Read from Local Storage
    ↓
[Background] Fetch from Server
    ↓
Merge changes (if any)
    ↓
Update Local Storage
    ↓
Update UI
```

### Resolución de Conflictos

```
Server returns conflict
    ↓
Compare timestamps por campo
    ↓
If single field conflict:
    Apply LWW
Else:
    Duplicate note
    Mark for review
    ↓
Update Local + UI
```

## Modelo de Datos

### Version Tracking

Cada entidad tiene:

```typescript
interface Versioned {
  id: string;
  version: number; // Incremental
  lastModified: number; // Timestamp
  deviceId: string;
}
```

### Sync Metadata

```typescript
interface SyncMetadata {
  lastSyncAt: number;
  pendingOperations: number;
  conflictsCount: number;
}
```

## Performance

### Objetivos

- Lectura local: <50ms
- Escritura local: <100ms
- Sync batch (100 ops): <5s
- Resolución de conflicto: <200ms

### Optimizaciones

- Batch de operaciones (max 100 por request)
- Compresión de payloads (gzip)
- Delta sync (solo cambios desde lastSyncAt)
- Índices en local storage

## Seguridad

- Operations firmadas con deviceId
- Server valida ownership (userId)
- Timestamps validados (no futuro)
- Rate limiting en servidor

## Testing

### Unit Tests

- Lógica de merge
- LWW por campo
- Generación de duplicados

### Integration Tests

- Sync queue
- Batch processing
- Reintentos

### Chaos Tests

- Cortes de red aleatorios
- Latencia variable
- Relojes desalineados
- Concurrencia multi-dispositivo

### E2E Tests

- Offline → edit → online → sync
- Conflictos multi-dispositivo
- Error recovery

## Monitoreo

Métricas clave:

- `sync.queue.length`: Operaciones pendientes
- `sync.conflicts.count`: Conflictos detectados
- `sync.errors.rate`: Tasa de errores
- `sync.duration.p95`: Tiempo de sync

## Fecha de Revisión

Se evaluará CRDT en **post-MVP** si:
- Conflictos frecuentes (>5% de syncs)
- Usuarios reportan pérdida percibida de datos
- Se implementa colaboración en tiempo real

## Referencias

- [Offline First](https://offlinefirst.org/)
- [Background Sync API](https://developer.chrome.com/blog/background-sync/)
- [IndexedDB Best Practices](https://web.dev/indexeddb-best-practices/)
- [Conflict Resolution Strategies](https://martinfowler.com/articles/patterns-of-distributed-systems/version-vector.html)
