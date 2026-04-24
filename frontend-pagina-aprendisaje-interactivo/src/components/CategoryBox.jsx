import React from "react";
import { Link } from "react-router-dom";

const CategoryBox = ({ title, image, path }) => {
  return (
    <Link
      to={path}
      className="group flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-sm)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
    >
      <div className="mb-4 flex h-28 w-full items-center justify-center">
        <img
          src={image}
          alt=""
          className="max-h-24 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          width={120}
          height={120}
        />
      </div>
      <span className="text-center text-lg font-bold tracking-wide text-slate-900">
        {title}
      </span>
      <span className="mt-2 text-sm text-[var(--color-muted)]">Explorar contenidos</span>
    </Link>
  );
};

export default CategoryBox;
