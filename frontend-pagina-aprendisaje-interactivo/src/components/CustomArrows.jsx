// CustomArrows.js
import React from "react";

export const PrevArrow = ({ onClick }) => (
  <button
    type="button"
    aria-label="Imagen anterior"
    className="slick-prev !left-3 sm:!left-4 absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white backdrop-blur-sm transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:p-3"
    onClick={onClick}
  >
    &#8249;
  </button>
);

export const NextArrow = ({ onClick }) => (
  <button
    type="button"
    aria-label="Siguiente imagen"
    className="slick-next !right-3 sm:!right-4 absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white backdrop-blur-sm transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:p-3"
    onClick={onClick}
  >
    &#8250;
  </button>
);
