# Ejemplo — Landing Page SaaS

## Estructura recomendada (orden probado por conversión)
1. **Hero** — headline claro (< 10 palabras) + sub (beneficio) + CTA + imagen/video.
2. **Social proof** — logos de clientes o testimonios breves.
3. **Features (3-6)** — iconos + título + 1 línea, formato F-pattern.
4. **How it works** — 3 pasos máximo.
5. **Pricing** — 3 planes, uno destacado ("Most popular").
6. **FAQ** — acordeón, 5-8 preguntas.
7. **CTA final** + footer.

## Reglas UX
- Hero visible sin scroll en 1280×720.
- Un único CTA primario por sección (evitar decisión paralizante).
- Contraste del CTA mínimo 7:1 vs fondo.
- Animaciones sutiles on-scroll (respetando `prefers-reduced-motion`).

## Performance
- Hero con `next/image` + `priority`.
- Fuentes con `next/font` + `display: swap`.
- Lazy-load de todo lo que esté debajo del fold.
