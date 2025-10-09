import { redirect } from 'next/navigation'

export default function ProductsCatalogPage() {
  redirect('/supplier/products')
  return null
}
