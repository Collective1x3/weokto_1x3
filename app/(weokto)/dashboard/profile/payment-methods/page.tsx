'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PaymentMethodCard } from '@/components/weokto/payments/PaymentMethodCard'
import { PaymentMethodActions } from './PaymentMethodActions'
import { CreditCard, Plus } from 'phosphor-react'
import type { PaymentMethodStatus } from '@prisma/client'

interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  funding?: string
  status: PaymentMethodStatus
  createdAt: Date
  storedCredentialType?: string
  customerId: string
  isDefault?: boolean
}

interface Customer {
  id: string
  defaultPaymentMethodId?: string | null
  product?: {
    name: string
  }
  paymentMethods: PaymentMethod[]
}

export default function ProfilePaymentMethodsPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true)

      // First, get payment methods
      const response = await fetch('/api/payment-methods')

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch payment methods')
      }

      const paymentMethods: PaymentMethod[] = await response.json()

      // Group payment methods by customer
      const customerMap = new Map<string, Customer>()

      for (const method of paymentMethods) {
        if (!customerMap.has(method.customerId)) {
          // Fetch customer details if needed
          try {
            const customerResponse = await fetch(`/api/customers/${method.customerId}`)
            if (customerResponse.ok) {
              const customerData = await customerResponse.json()
              customerMap.set(method.customerId, {
                id: method.customerId,
                defaultPaymentMethodId: customerData.defaultPaymentMethodId,
                product: customerData.product,
                paymentMethods: []
              })
            } else {
              customerMap.set(method.customerId, {
                id: method.customerId,
                defaultPaymentMethodId: null,
                paymentMethods: []
              })
            }
          } catch {
            customerMap.set(method.customerId, {
              id: method.customerId,
              defaultPaymentMethodId: null,
              paymentMethods: []
            })
          }
        }

        const customer = customerMap.get(method.customerId)!
        customer.paymentMethods.push({
          ...method,
          isDefault: customer.defaultPaymentMethodId === method.id
        })
      }

      setCustomers(Array.from(customerMap.values()))
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

  if (customers.length === 0) {
    return (
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Mes moyens de paiement</h1>
          <p className="text-sm text-gray-400">
            Gérez vos cartes et autorisations de prélèvement utilisées pour vos abonnements.
          </p>
        </header>

        <div className="rounded-2xl border border-[#B794F4]/20 bg-[#1e1e1e] p-10 text-center">
          <CreditCard size={48} className="mx-auto mb-4 text-purple-400/30" />
          <p className="text-gray-400 mb-4">Aucun moyen de paiement n'est associé à votre compte.</p>
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-400 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-purple-500"
          >
            <Plus size={16} />
            Ajouter un moyen de paiement
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Mes moyens de paiement</h1>
          <p className="text-sm text-gray-400">
            Gérez vos cartes et autorisations de prélèvement utilisées pour vos abonnements.
          </p>
        </div>
        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 rounded-lg bg-purple-400/10 border border-[#B794F4]/40 px-4 py-2 text-sm font-medium text-purple-400 transition-all duration-200 hover:bg-purple-400/20 hover:border-[#B794F4]"
        >
          <Plus size={16} />
          Ajouter un moyen de paiement
        </Link>
      </header>

      <div className="space-y-8">
        {customers.map((customer) => (
          <section key={customer.id} className="space-y-4">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {customer.product?.name ?? 'Abonnement'}
                </h2>
                <p className="text-xs text-gray-500">Cartes enregistrées pour ce produit.</p>
              </div>
              <span className="rounded-full border border-[#B794F4]/20 bg-[#1e1e1e] px-3 py-1 text-xs text-gray-400">
                {customer.paymentMethods.length} moyen{customer.paymentMethods.length > 1 ? 's' : ''}
              </span>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              {customer.paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] p-4"
                >
                  <PaymentMethodCard
                    id={method.id}
                    brand={method.brand}
                    last4={method.last4}
                    expMonth={method.expMonth}
                    expYear={method.expYear}
                    funding={method.funding}
                    status={method.status}
                    isDefault={method.isDefault || false}
                    createdAt={new Date(method.createdAt)}
                    storedCredentialType={method.storedCredentialType}
                    actions={(
                      <PaymentMethodActions
                        paymentMethodId={method.id}
                        isDefault={method.isDefault || false}
                        status={method.status}
                      />
                    )}
                  />
                </div>
              ))}

              {customer.paymentMethods.length === 0 && (
                <div className="rounded-lg border border-dashed border-[#B794F4]/20 bg-[#1e1e1e] p-6 text-sm text-gray-400">
                  Aucun moyen de paiement sur ce produit. Ajoutez-en un pour éviter les interruptions de service.
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
