'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SubscriptionCard } from '@/components/weokto/payments/SubscriptionCard'
import { SubscriptionActions, type PlanOption } from './SubscriptionActions'

interface Subscription {
  id: string
  productName?: string
  planName?: string
  planId?: string
  status: string
  isFreePlan: boolean
  currency: string
  amountCents: number
  billingInterval?: string
  billingAnchor?: Date | null
  nextBillingAt?: Date | null
  trialEndsAt?: Date | null
  graceUntil?: Date | null
  createdAt: Date
  paymentMethod?: any
  plan?: {
    id: string
    name: string
    price: number
    currency: string
    billingInterval?: string
    productId: string
  }
  product?: {
    id: string
    name: string
  }
  latestInvoice?: {
    id: string
    amountIncludingTax: number
    status: string
    createdAt: Date
    currency: string
  }
}

export default function ProfileSubscriptionsPage() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [plans, setPlans] = useState<Map<string, PlanOption[]>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)

      // Fetch subscriptions
      const response = await fetch('/api/subscriptions')
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch subscriptions')
      }

      const data = await response.json()
      setSubscriptions(data)

      // Extract unique product IDs
      const productIds = new Set<string>()
      data.forEach((sub: Subscription) => {
        if (sub.plan?.productId) productIds.add(sub.plan.productId)
        if (sub.product?.id) productIds.add(sub.product.id)
      })

      // Fetch plans for each product
      const plansByProduct = new Map<string, PlanOption[]>()
      for (const productId of productIds) {
        try {
          const plansResponse = await fetch(`/api/products/${productId}`)
          if (plansResponse.ok) {
            const productData = await plansResponse.json()
            if (productData.plans) {
              plansByProduct.set(productId, productData.plans.map((plan: any) => ({
                id: plan.id,
                name: plan.name,
                amountCents: plan.price,
                currency: plan.currency,
                billingInterval: plan.billingInterval
              })))
            }
          }
        } catch (err) {
          console.error(`Failed to fetch plans for product ${productId}:`, err)
        }
      }

      setPlans(plansByProduct)
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

  if (subscriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-[#B794F4]/20 bg-[#1e1e1e] p-10 text-center text-sm text-gray-400">
        Aucun abonnement associé à votre compte pour le moment.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-white">Mes abonnements</h1>
        <p className="text-sm text-gray-400">
          Gérez vos plans actifs, vos prochaines échéances et vos préférences de facturation.
        </p>
      </header>

      <div className="space-y-6">
        {subscriptions.map((subscription) => {
          const now = new Date()
          const isPaused = !!subscription.graceUntil && new Date(subscription.graceUntil) > now
          const planProductId = subscription.plan?.productId || subscription.product?.id
          const planOptions = planProductId ? plans.get(planProductId) || [] : []

          // Format subscription data for SubscriptionCard
          const cardProps = {
            id: subscription.id,
            productName: subscription.product?.name || subscription.productName || null,
            planName: subscription.plan?.name || subscription.planName || (subscription.isFreePlan ? 'Plan gratuit' : 'Plan personnalisé'),
            planId: subscription.plan?.id || subscription.planId || null,
            status: subscription.status as any,
            isFreePlan: subscription.isFreePlan,
            currency: subscription.currency,
            amountCents: subscription.amountCents,
            billingInterval: subscription.billingInterval || null,
            billingAnchor: subscription.billingAnchor,
            nextBillingAt: subscription.nextBillingAt,
            trialEndsAt: subscription.trialEndsAt,
            graceUntil: subscription.graceUntil,
            createdAt: subscription.createdAt,
            paymentMethod: subscription.paymentMethod,
            latestInvoice: subscription.latestInvoice || null
          }

          return (
            <SubscriptionCard
              key={subscription.id}
              {...cardProps}
              actions={(
                <SubscriptionActions
                  subscriptionId={subscription.id}
                  status={subscription.status as any}
                  currentPlanId={subscription.plan?.id || null}
                  isPaused={isPaused}
                  availablePlans={planOptions}
                />
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
