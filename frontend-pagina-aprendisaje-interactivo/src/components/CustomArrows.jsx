// CustomArrows.js
import React from "react";

export const PrevArrow = ({ onClick }) => (
  <button
    className="slick-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black bg-opacity-50 rounded-full p-2"
    onClick={onClick}
  >
    &#8249;
  </button>
);

export const NextArrow = ({ onClick }) => (
  <button
    className="slick-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black bg-opacity-50 rounded-full p-2"
    onClick={onClick}
  >
    &#8250;
  </button>
);
