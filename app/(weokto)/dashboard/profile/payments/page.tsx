'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { InvoiceTable } from '@/components/weokto/payments/InvoiceTable'
import { Download } from 'phosphor-react'

interface Invoice {
  id: string
  number?: string | null
  createdAt: Date
  status: string
  currency: string
  amountIncludingTax: number
  taxAmount: number
  productName?: string | null
  planName?: string | null
  metadata?: any
  subscription?: {
    plan?: {
      name: string
    }
  }
  customer?: {
    product?: {
      name: string
    }
  }
}

function extractInvoiceNumber(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object') return null
  if (Array.isArray(metadata)) return null
  const invoiceNumber = (metadata as Record<string, unknown>).invoiceNumber
  return typeof invoiceNumber === 'string' ? invoiceNumber : null
}

// Composant pour le téléchargement PDF
function PDFDownloadButton({ invoiceId }: { invoiceId: string }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `facture-${invoiceId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        // If PDF generation is not ready, fallback to JSON export
        const jsonResponse = await fetch(`/api/invoices/${invoiceId}`)
        if (jsonResponse.ok) {
          const data = await jsonResponse.json()
          const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
          const url = window.URL.createObjectURL(jsonBlob)
          const a = document.createElement('a')
          a.href = url
          a.download = `facture-${invoiceId}.json`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }
      }
    } catch (error) {
      console.error('Error downloading invoice:', error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="px-3 py-1 bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-50"
    >
      <Download size={16} />
      {downloading ? 'Téléchargement...' : 'Télécharger'}
    </button>
  )
}

export default function ProfilePaymentsPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/invoices')

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch invoices')
      }

      const data = await response.json()
      setInvoices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  const rows = invoices.map((invoice) => ({
    id: invoice.id,
    number: extractInvoiceNumber(invoice.metadata),
    createdAt: new Date(invoice.createdAt),
    status: invoice.status,
    currency: invoice.currency,
    amountIncludingTax: invoice.amountIncludingTax,
    taxAmount: invoice.taxAmount,
    downloadUrl: `/api/invoices/${invoice.id}/pdf`,
    productName: invoice.customer?.product?.name ?? invoice.productName ?? null,
    planName: invoice.subscription?.plan?.name ?? invoice.planName ?? null
  }))

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Mes paiements</h1>
        <p className="text-sm text-gray-400">
          Retrouvez l'historique de vos factures, montants réglés et téléchargements PDF.
        </p>
      </header>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-[#B794F4]/20 bg-[#1e1e1e] p-10 text-center text-sm text-gray-400">
          Aucune facture disponible pour le moment.
        </div>
      ) : (
        <>
          <InvoiceTable invoices={rows} />

          {/* Enhanced Invoice List with Download Buttons */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Actions rapides</h2>
            <div className="grid gap-4">
              {invoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex justify-between items-center p-4 bg-[#1e1e1e] rounded-lg border border-[#B794F4]/20"
                >
                  <div>
                    <p className="text-white font-medium">
                      Facture {extractInvoiceNumber(invoice.metadata) || invoice.id.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(invoice.createdAt).toLocaleDateString('fr-FR')} - {(invoice.amountIncludingTax / 100).toFixed(2)}€
                    </p>
                  </div>
                  <PDFDownloadButton invoiceId={invoice.id} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
