/**
 * TEMPLATE: Página Next.js 15 App Router
 * - Server Component por defecto
 * - Metadata dinámica + OpenGraph
 * - Suspense boundaries
 * - SEO + a11y listos
 */
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Título | Mi App",
  description: "Descripción SEO entre 120-160 caracteres.",
  openGraph: {
    title: "Título",
    description: "Descripción",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Título de la página
        </h1>
        <p className="mt-2 text-muted-foreground">Subtítulo descriptivo.</p>
      </header>

      <Suspense fallback={<SectionSkeleton />}>
        {/* Contenido dinámico */}
      </Suspense>
    </main>
  );
}

function SectionSkeleton() {
  return (
    <div role="status" aria-label="Cargando" className="space-y-4">
      <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-32 w-full animate-pulse rounded bg-muted" />
    </div>
  );
}
