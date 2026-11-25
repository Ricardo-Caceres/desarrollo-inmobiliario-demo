import Link from 'next/link'

// not-found no recibe params: textos en ambos idiomas, sin depender del locale.
export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="font-display text-4xl">404</h1>
      <p className="mt-4 text-muted">Page not found · Página no encontrada</p>
      <p className="mt-8 flex gap-6 text-accent">
        <Link href="/en">Back to home</Link>
        <Link href="/es">Volver al inicio</Link>
      </p>
    </section>
  )
}
