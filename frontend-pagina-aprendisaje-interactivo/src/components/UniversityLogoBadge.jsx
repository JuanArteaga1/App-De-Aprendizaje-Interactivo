import React from "react";

const UniversityLogoBadge = ({ className = "" }) => {
  return (
    <div
      className={`absolute bottom-4 right-4 rounded-lg bg-white/90 px-2 py-1 shadow-sm ${className}`}
      aria-hidden="true"
    >
      <img
        src="/img/logos%20autonoma_2.png"
        alt="Logo Universidad Autónoma del Cauca"
        className="h-7 w-auto object-contain sm:h-8"
        loading="lazy"
      />
    </div>
  );
};

export default UniversityLogoBadge;
