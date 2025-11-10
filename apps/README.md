# Applications

Este directorio contiene las aplicaciones multiplataforma de Keep++.

## Estructura

```
apps/
├── web/         # Progressive Web App
├── mobile/      # Android (Capacitor)
└── desktop/     # Windows (Tauri)
```

## Aplicaciones

### Web (PWA)

**Tecnología**: React/Vue/Svelte (TBD en Etapa 1) + PWA APIs

**Features:**
- Progressive Web App instalable
- Service Worker para offline
- Web Push notifications
- Responsive design

**Desarrollo:**
```bash
pnpm dev:web
```

**Build:**
```bash
pnpm build:web
```

---

### Mobile (Android)

**Tecnología**: Capacitor

**Features:**
- Instalación desde Play Store
- Share sheet integration ("Compartir a Keep++")
- Notificaciones nativas
- Storage local (SQLite)

**Desarrollo:**
```bash
pnpm dev:mobile
npx cap run android
```

**Build:**
```bash
pnpm build:mobile
npx cap build android
```

---

### Desktop (Windows)

**Tecnología**: Tauri

**Features:**
- Instalador nativo de Windows
- System tray integration
- Notificaciones nativas
- Storage local (SQLite)

**Desarrollo:**
```bash
pnpm dev:desktop
```

**Build:**
```bash
pnpm build:desktop
```

---

## Shared Code

Todas las apps comparten:

- **@keep-plus-plus/core**: Lógica de negocio
- **@keep-plus-plus/ui**: Componentes UI
- **@keep-plus-plus/types**: Types compartidos
- **@keep-plus-plus/storage**: Abstracciones de persistencia
- **@keep-plus-plus/sync**: Motor de sincronización

## Decisiones por Plataforma

### Storage

| Platform | Technology | Location |
|----------|------------|----------|
| Web | IndexedDB | Browser storage |
| Mobile | SQLite | App data directory |
| Desktop | SQLite | User data directory |

### Notifications

| Platform | Technology | Permissions |
|----------|------------|-------------|
| Web | Web Push API | Prompt on first reminder |
| Mobile | Capacitor Local Notifications | Runtime permission |
| Desktop | Tauri Notification API | OS settings |

### Offline

Todas las plataformas soportan funcionamiento completo offline con sincronización automática.

## Testing

### Unit Tests
```bash
# Todas las apps
pnpm test

# Solo una app
pnpm --filter @keep-plus-plus/web test
```

### E2E Tests
```bash
# Web
pnpm --filter @keep-plus-plus/web test:e2e

# Mobile (requiere emulador)
pnpm --filter @keep-plus-plus/mobile test:e2e

# Desktop
pnpm --filter @keep-plus-plus/desktop test:e2e
```

## Deployment

### Web
- Deploy: Vercel/Netlify/Cloudflare Pages
- Environment: Production, Staging

### Mobile
- Store: Google Play Store
- Tracks: Internal, Beta, Production

### Desktop
- Distribution: GitHub Releases, Microsoft Store
- Auto-update: Tauri updater

## Roadmap

Ver [roadmap.md](../docs/roadmap.md) para el plan de implementación por etapas.

### Etapa 1 (Semana 1)
- Scaffolding de las 3 apps
- Componentes UI base
- Routing

### Etapa 8 (Semana 8)
- PWA instalable
- Android AAB para Play Store
- Windows installer
