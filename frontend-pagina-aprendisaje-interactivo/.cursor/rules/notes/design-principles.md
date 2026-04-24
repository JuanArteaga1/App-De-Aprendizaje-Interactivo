# 📐 Principios de Diseño — Referencia rápida

## Leyes de UX clave
| Ley                | Aplicación práctica                                      |
| ------------------ | -------------------------------------------------------- |
| **Hick-Hyman**     | Reduce opciones visibles; usa progressive disclosure.    |
| **Fitts**          | Targets ≥ 44px; CTA grandes y cerca del cursor esperado. |
| **Jakob**          | Copia patrones de sitios populares antes de innovar.     |
| **Miller**         | Agrupa información en bloques de 5±2.                    |
| **Proximidad**     | Elementos relacionados deben estar cerca.                |
| **Gestalt**        | Similitud, continuidad, cierre → guían la percepción.    |
| **Von Restorff**   | El elemento "diferente" se recuerda más (CTA único).     |
| **Peak-End**       | Cuida el final de un flujo; deja buena sensación.        |

## Refactoring UI (top tips)
1. Empieza por funcionalidad en grayscale, añade color al final.
2. Usa sombras con luz física (no blur + negro plano).
3. Bordes sutiles + fondo, no bordes pesados.
4. Espaciado generoso > elementos apretados.
5. Contraste de texto: usa peso y color, no solo tamaño.
6. Imágenes con overlay sutil si van sobre texto.
7. Evita degradados planos; prefiere 2-3 paradas con variación de hue.

## Anti-patterns UI
- ❌ Placeholder como label.
- ❌ Iconos sin label en navegación principal.
- ❌ Loaders infinitos sin indicador de progreso.
- ❌ Modales que no cierran con Esc.
- ❌ Animaciones > 300ms (se sienten lentas).
- ❌ Tooltips con info crítica (no funciona en mobile).

## Recursos
- [Refactoring UI](https://refactoringui.com)
- [Laws of UX](https://lawsofux.com)
- [Nielsen Norman Group](https://www.nngroup.com)
- [web.dev Learn](https://web.dev/learn)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
