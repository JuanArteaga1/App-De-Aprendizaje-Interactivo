# 🎨 Frontend Pro — Skill para Cursor

Skill profesional para convertir a Cursor en un **Ingeniero Frontend Senior + UX/UI Designer**.

## 📦 Instalación

### Opción A — Nivel proyecto (recomendado)
Copia la carpeta `.cursor/` a la raíz de tu proyecto:
```
tu-proyecto/
└── .cursor/
    └── rules/
        ├── frontend-pro.mdc
        ├── templates/
        ├── examples/
        └── notes/
```
Cursor detecta automáticamente los `.mdc` al abrir el proyecto.

### Opción B — Nivel global (todos tus proyectos)
En **Windows** copia la carpeta a:
```
%APPDATA%\Cursor\User\globalStorage\cursor.rules\
```
O en Cursor: `Settings → Rules → User Rules` y pega el contenido.

## 🚀 Uso

- **Auto-activación**: al editar `.tsx .jsx .vue .svelte .css`, la skill se aplica gracias a `globs`.
- **Invocación manual**: `@frontend-pro` dentro del chat de Cursor.
- **Templates**: `@templates/component-react.tsx` para insertar uno.
- **Checklist**: `@templates/a11y-checklist.md` antes del commit.

## 📁 Estructura

```
.cursor/rules/
├── frontend-pro.mdc          ← SKILL principal (los 7 bloques)
├── templates/                ← código reutilizable
│   ├── component-react.tsx
│   ├── page-nextjs.tsx
│   ├── form-rhf-zod.tsx
│   ├── design-tokens.css
│   ├── tailwind.config.ts
│   └── a11y-checklist.md
├── examples/                 ← few-shot para el modelo
│   ├── dashboard-example.md
│   └── landing-example.md
└── notes/                    ← conocimiento de referencia
    └── design-principles.md
```

## 🧩 Los 7 bloques de la skill

| # | Bloque        | Dónde vive                        |
| - | ------------- | --------------------------------- |
| 1 | Name          | frontmatter `name`                |
| 2 | Description   | frontmatter `description`         |
| 3 | Metadata      | `globs`, `alwaysApply`, `tags`    |
| 4 | Instructions  | cuerpo markdown sección 4         |
| 5 | Templates     | carpeta `templates/`              |
| 6 | Examples      | carpeta `examples/`               |
| 7 | Notes         | carpeta `notes/` + sección 7      |

## 🔄 Mantener actualizada
- Añade nuevos templates conforme tu stack crezca.
- Documenta decisiones en `notes/` (ADR ligeros).
- Versiona con `version: x.y.z` en el frontmatter.
