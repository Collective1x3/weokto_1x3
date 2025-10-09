import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { BillingForm } from './BillingForm'

interface FormState {
  status: 'idle' | 'success' | 'error'
  message?: string | null
}

const updateSchema = z.object({
  customerId: z.string().cuid(),
  country: z.string().length(2),
  state: z.string().max(64).optional().or(z.literal('')),
  city: z.string().min(1).max(128),
  postalCode: z.string().min(1).max(32),
  street: z.string().min(1).max(255),
  vatNumber: z.string().max(32).optional().or(z.literal('')),
  taxExempt: z.boolean().optional()
})

async function updateBilling(_prev: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const session = await getSession()
  if (!session) {
    return { status: 'error', message: 'Session expirée. Reconnectez-vous.' }
  }

  const raw = {
    customerId: formData.get('customerId'),
    country: formData.get('country'),
    state: formData.get('state'),
    city: formData.get('city'),
    postalCode: formData.get('postalCode'),
    street: formData.get('street'),
    vatNumber: formData.get('vatNumber'),
    taxExempt: formData.get('taxExempt') ? true : false
  }

  const parsed = updateSchema.safeParse(raw)
  if (!parsed.success) {
    return { status: 'error', message: 'Veuillez vérifier les informations fournies.' }
  }

  const customer = await prisma.customer.findFirst({
    where: {
      id: parsed.data.customerId,
      weoktoUserId: session.id
    }
  })

  if (!customer) {
    return { status: 'error', message: 'Client introuvable.' }
  }

  await prisma.customerTaxProfile.create({
    data: {
      customerId: customer.id,
      country: parsed.data.country,
      state: parsed.data.state || null,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      street: parsed.data.street,
      vatNumber: parsed.data.vatNumber || null,
      taxExempt: parsed.data.taxExempt ?? false
    }
  })

  const metadata: Record<string, unknown> =
    customer.metadata && typeof customer.metadata === 'object' && !Array.isArray(customer.metadata)
      ? { ...customer.metadata }
      : {}

  metadata.lastBillingUpdateAt = new Date().toISOString()

  await prisma.customer.update({
    where: { id: customer.id },
    data: {
      metadata: metadata as Prisma.InputJsonValue
    }
  })

  revalidatePath('/profile/billing')

  return { status: 'success', message: 'Profil de facturation mis à jour.' }
}

export default async function ProfileBillingPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const customers = await prisma.customer.findMany({
    where: { weoktoUserId: session.id },
    include: {
      product: {
        select: {
          name: true
        }
      },
      taxProfiles: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  })

  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-sm text-slate-400">
        Aucune information de facturation disponible. Souscrivez à une offre pour configurer votre profil.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-100">Facturation</h1>
        <p className="text-sm text-slate-400">
          Mettez à jour vos informations de facturation, adresse complète et numéro de TVA.
        </p>
      </header>

      <div className="space-y-6">
        {customers.map((customer) => {
          const latestProfile = customer.taxProfiles[0]
          return (
            <BillingForm
              key={customer.id}
              customerId={customer.id}
              productName={customer.product?.name}
              initial={latestProfile
                ? {
                    country: latestProfile.country,
                    state: latestProfile.state,
                    city: latestProfile.city,
                    postalCode: latestProfile.postalCode,
                    street: latestProfile.street,
                    vatNumber: latestProfile.vatNumber,
                    taxExempt: latestProfile.taxExempt
                  }
                : undefined}
              action={updateBilling}
            />
          )
        })}
      </div>
    </div>
  )
}
