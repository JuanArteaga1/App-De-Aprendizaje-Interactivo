# Ejemplo — Dashboard SaaS

## Brief del usuario
> "Necesito una pantalla de dashboard con KPIs, gráfico y tabla de usuarios."

## Wireframe (texto)
```
┌────────────────────────────────────────────────────────────┐
│ Logo   Nav: Home · Users · Billing          🔔  Avatar ⌄   │
├────────────────────────────────────────────────────────────┤
│ H1: Overview                              [+ Nuevo usuario]│
│                                                            │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    ← KPIs (4 cards)    │
│ │ 1.2k │ │ $34k │ │ 98%  │ │ 2.1s │                        │
│ │Users │ │MRR   │ │Uptime│ │TTI   │                        │
│ └──────┘ └──────┘ └──────┘ └──────┘                        │
│                                                            │
│ ┌──────────────────────────┐ ┌─────────────────────────┐   │
│ │ Revenue (line chart)     │ │ Top countries (list)    │   │
│ └──────────────────────────┘ └─────────────────────────┘   │
│                                                            │
│ Tabla: paginada, ordenable, filtrable, export CSV          │
└────────────────────────────────────────────────────────────┘
```

## Decisiones UX
- **KPIs primero** (ley de primacía).
- **Gráfico 2/3 · Lista 1/3** (jerarquía de importancia).
- **CTA primario arriba-derecha** (zona de acción Gutenberg).
- **Tabla con skeleton** mientras carga (evita CLS).
- **Empty state** con ilustración + botón de acción.

## Tokens aplicados
- Cards con `rounded-lg`, `shadow-sm`, `p-6`, `gap-6` en el grid.
- Tipografía: KPI valor `text-3xl font-bold`, label `text-sm text-muted-foreground`.
- Spacing: 8pt grid (`gap-6`, `px-8`, `py-6`).

## Accesibilidad
- Tabla con `<caption>` oculto visualmente pero leído por SR.
- Botones de orden con `aria-sort`.
- Skeleton con `role="status" aria-label="Cargando datos"`.
