import { notFound } from 'next/navigation'

// Captura cualquier ruta sin página para que se muestre el not-found localizado.
export default function MissingPage() {
  notFound()
}
