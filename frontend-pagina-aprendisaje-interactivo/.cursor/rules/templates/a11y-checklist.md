# ✅ Checklist de Accesibilidad (WCAG 2.2 AA)

Ejecutar antes de cada PR.

## Estructura
- [ ] Un único `<h1>` por página, jerarquía de headings sin saltos.
- [ ] Landmarks `<header> <nav> <main> <footer>` presentes.
- [ ] `lang` declarado en `<html>`.

## Teclado
- [ ] Todos los interactivos alcanzables con `Tab`.
- [ ] Orden de foco lógico.
- [ ] `focus-visible` con contraste AA.
- [ ] `Esc` cierra modales y menús.
- [ ] Atajos documentados; no colisionan con lectores de pantalla.

## Color y contraste
- [ ] Texto normal ≥ 4.5:1 · Texto grande ≥ 3:1 · UI ≥ 3:1.
- [ ] No se transmite información solo por color.

## Formularios
- [ ] Cada `<input>` con `<label>` asociado.
- [ ] Errores con `role="alert"` y `aria-describedby`.
- [ ] `autocomplete` correcto (email, current-password, etc.).

## Imágenes y media
- [ ] `alt` descriptivo · decorativas con `alt=""`.
- [ ] Videos con subtítulos; transcripción si es audio.

## Movimiento
- [ ] Respeta `prefers-reduced-motion`.
- [ ] No hay parpadeos > 3 Hz.

## Herramientas
- [ ] Axe DevTools: 0 errores.
- [ ] Lighthouse A11y ≥ 95.
- [ ] Probado con lector de pantalla (NVDA / VoiceOver).
