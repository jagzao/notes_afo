# Definition of Ready & Definition of Done

## Definition of Ready (DoR)

Una historia de usuario está **ready** para el sprint cuando cumple todos estos criterios:

### 1. Historia bien formada

- [ ] Sigue formato: "Como [rol], quiero [acción] para [beneficio]"
- [ ] Tiene criterios de aceptación claros y medibles
- [ ] Incluye casos de error y edge cases
- [ ] Tiene mockups/wireframes si implica UI

### 2. Alcance definido

- [ ] Historia es suficientemente pequeña (completable en 1-3 días)
- [ ] Dependencias identificadas y resueltas
- [ ] No bloqueada por otras historias
- [ ] Technical spikes completados si era necesario

### 3. Entendimiento compartido

- [ ] Equipo entiende la historia (discutida en planning/refinement)
- [ ] UX/UI aprobado por diseño (si aplica)
- [ ] Approach técnico acordado
- [ ] Riesgos identificados

### 4. Preparación técnica

- [ ] Schema de datos definido
- [ ] Endpoints de API especificados (si aplica)
- [ ] Contratos entre frontend/backend acordados
- [ ] Estrategia de testing clara

### 5. Estimación

- [ ] Historia estimada (story points o tiempo)
- [ ] Estimación consensuada por el equipo
- [ ] Capacidad del sprint verificada

---

## Definition of Done (DoD)

Una historia está **done** cuando cumple todos estos criterios:

### 1. Código

- [ ] Implementación completa según criterios de aceptación
- [ ] Código revisado (mínimo 2 aprobaciones)
- [ ] Sin comentarios pendientes de resolver en PR
- [ ] Cumple estándares de código (linters pasan)
- [ ] Sin warnings de TypeScript
- [ ] Formateo correcto (Prettier)

### 2. Tests

- [ ] **Unit tests** escritos para nueva lógica (80% coverage en core)
- [ ] **Integration tests** si interactúa con múltiples módulos
- [ ] **E2E tests** para flujos críticos de usuario
- [ ] Todos los tests pasan (local y CI)
- [ ] Edge cases cubiertos
- [ ] Tests de error/fallback implementados

### 3. Documentación

- [ ] Código autodocumentado (nombres claros)
- [ ] JSDoc en funciones públicas complejas
- [ ] README actualizado si es nuevo módulo
- [ ] API docs actualizados (si aplica)
- [ ] Comentarios en lógica no obvia
- [ ] ADR creado si hay decisión arquitectónica

### 4. UI/UX (si aplica)

- [ ] UI coincide con diseño aprobado
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Theming funciona (light/dark)
- [ ] Estados de loading/error/vacío implementados
- [ ] Animaciones fluidas (60 fps)
- [ ] Accesibilidad básica (navegación por teclado, ARIA labels)

### 5. Performance

- [ ] No degrada performance existente
- [ ] Cumple budgets de performance:
  - Operaciones locales <100ms
  - Búsquedas <200ms (P95)
  - Renders <16ms (60 fps)
- [ ] Profiling realizado si es código crítico
- [ ] Lazy loading implementado donde corresponde

### 6. Seguridad

- [ ] No introduce vulnerabilidades conocidas (XSS, injection, etc.)
- [ ] Validación de inputs en cliente y servidor
- [ ] Sanitización de datos mostrados
- [ ] Secrets no hardcodeados
- [ ] Checklist de seguridad revisado

### 7. Accesibilidad (A11y)

- [ ] Navegación completa por teclado
- [ ] Contrastes adecuados (WCAG AA)
- [ ] Labels en inputs
- [ ] ARIA donde necesario
- [ ] Probado con screen reader (si es flujo crítico)

### 8. Integración

- [ ] Merge con main sin conflictos
- [ ] Build en CI pasa
- [ ] Tests en CI pasan
- [ ] Linters en CI pasan
- [ ] No rompe otras features (regresión)

### 9. Deployment

- [ ] Deployable a producción (feature flags si no está completa)
- [ ] Migraciones de DB probadas (si aplica)
- [ ] Rollback plan documentado (si es cambio riesgoso)
- [ ] Monitoring configurado (si aplica)

### 10. Product Owner

- [ ] Demo realizada a PO/stakeholders
- [ ] PO aprueba la implementación
- [ ] Criterios de aceptación verificados por PO

---

## DoD por Tipo de Trabajo

### Feature

Aplican **todos** los criterios de DoD general.

### Bug Fix

- [ ] Root cause identificado y documentado
- [ ] Fix implementado
- [ ] Test de regresión añadido
- [ ] Verificado en entorno donde se reportó
- [ ] Documentado en changelog

### Refactor

- [ ] Comportamiento externo sin cambios
- [ ] Tests existentes siguen pasando
- [ ] Coverage no disminuye
- [ ] Performance no degrada
- [ ] Razón de refactor documentada

### Documentation

- [ ] Contenido preciso y actualizado
- [ ] Sin errores de spelling/grammar
- [ ] Ejemplos funcionales probados
- [ ] Links verificados
- [ ] Reviewed por par

### Infrastructure/Tooling

- [ ] Funciona en todos los entornos (dev, staging, prod)
- [ ] Documentado en runbook/wiki
- [ ] Equipo entrenado (si es nuevo)
- [ ] Rollback posible
- [ ] Monitoreo configurado

---

## Checklist de Code Review

### Funcionalidad

- [ ] Cumple criterios de aceptación
- [ ] Maneja casos de error
- [ ] Edge cases considerados

### Código

- [ ] Legible y mantenible
- [ ] Sin duplicación innecesaria
- [ ] Nombres descriptivos (variables, funciones)
- [ ] Funciones pequeñas (SRP)
- [ ] No hay "magic numbers"

### Performance

- [ ] No loops innecesarios
- [ ] Queries optimizadas
- [ ] Memoization donde aplica
- [ ] Lazy loading considerado

### Seguridad

- [ ] Inputs validados
- [ ] Outputs sanitizados
- [ ] No secrets en código
- [ ] Permisos verificados

### Tests

- [ ] Coverage adecuado
- [ ] Tests legibles
- [ ] No tests frágiles
- [ ] Mocks apropiados

---

## Excepciones y Fast-Tracks

### Hot Fix (P0 en producción)

Permite skip temporal de:
- Tests E2E (agregar después)
- Demo completa (async)

NO permite skip de:
- Code review
- Tests unitarios
- CI passing
- Rollback plan

### Spike/POC

DoD reducido:
- [ ] Pregunta de investigación respondida
- [ ] Findings documentados
- [ ] Recomendación clara (go/no-go)
- [ ] Código prototipo (no production-ready)

---

## Metrics

Trackear:

- **Cycle time**: DoR → Done
- **Lead time**: Idea → Producción
- **Defect rate**: Bugs post-release / Features
- **Rework rate**: Stories reopened / Stories done
- **Code coverage**: % líneas cubiertas

Goals:

- Cycle time: <5 días (P50)
- Defect rate: <5%
- Code coverage: ≥80% (core), ≥60% (UI)

---

## Revisión y Mejora

- DoR/DoD se revisan cada **3 sprints**
- Equipo propone mejoras en retrospectivas
- Cambios requieren consenso del equipo
- Versión y fecha de cambio se documentan

**Última revisión**: 2025-11-10
**Próxima revisión**: 2025-12-01 (post Etapa 3)
