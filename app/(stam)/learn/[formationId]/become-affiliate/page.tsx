import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Prisma } from '@prisma/client'
import { ArrowRight, FireSimple, Handshake } from '@phosphor-icons/react/dist/ssr'

import { getStamSession } from '@/lib/auth/stam/session'
import { getFormationById } from '@/services/stam/formations'
import {
  checkAffiliateEligibility,
  joinAffiliateProgram
} from '@/services/stam/affiliation'

function toNumber(value?: number | Prisma.Decimal | null) {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value
  return Number(value)
}

function formatPercent(value?: number | Prisma.Decimal | null) {
  const numeric = toNumber(value)
  if (numeric === null) return '—'
  const percent = (numeric * 100).toFixed(1).replace(/\.0$/, '')
  return `${percent}%`
}

async function joinProgramAction(formData: FormData) {
  'use server'

  const formationId = (formData.get('formationId') ?? '') as string
  if (!formationId) {
    redirect('/stam/learn')
  }

  const session = await getStamSession()
  if (!session) {
    redirect(`/stam/login?redirect=/stam/learn/${formationId}/become-affiliate`)
  }

  await joinAffiliateProgram({
    formationId,
    stamUserId: session.id
  })

  revalidatePath(`/stam/learn/${formationId}/become-affiliate`)
  redirect(`/stam/affiliate/dashboard?joined=${formationId}`)
}

export default async function BecomeAffiliatePage({
  params
}: {
  params: Promise<{ formationId: string }>
}) {
  const { formationId } = await params
  const session = await getStamSession().catch(() => null)
  const formation = await getFormationById(formationId).catch(() => null)

  if (!formation) {
    redirect('/stam/learn')
  }

  const eligibility = await checkAffiliateEligibility({
    formationId,
    stamUserId: session?.id ?? null
  })

  const program = eligibility.program

  const heroBackground =
    eligibility.status === 'ALREADY_APPROVED'
      ? 'from-emerald-100 via-white to-emerald-50'
      : eligibility.status === 'PENDING_APPROVAL'
        ? 'from-amber-100 via-white to-amber-50'
        : 'from-emerald-50 via-white to-emerald-100'

  return (
    <div className="space-y-10 px-4 pb-20 pt-10 md:space-y-14 md:px-8 md:pb-24 md:pt-16">
      <header
        className={`rounded-[36px] border border-emerald-200 bg-gradient-to-br ${heroBackground} p-6 shadow-[0_30px_80px_-40px_rgba(16,94,88,0.35)] md:p-10`}
      >
        <div className="space-y-4 md:max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">
            <Handshake weight="bold" size={16} />
            Programme affilié
          </div>
          <h1 className="text-3xl font-semibold text-emerald-900 md:text-4xl">
            {formation.title}
          </h1>
          <p className="text-sm text-emerald-800/80 md:text-base">
            Rejoins le réseau de partenaires STAM pour promouvoir cette formation. Tu bénéficies de taux différenciés
            et de bonus cross-selling pour chaque vente générée.
          </p>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6 rounded-3xl border border-emerald-200 bg-white/95 p-6 shadow-[0_25px_60px_-45px_rgba(16,94,88,0.35)]">
          <h2 className="text-xl font-semibold text-emerald-900 md:text-2xl">Avantages affilié</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Taux standard</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-900">
                {formatPercent(program?.standardRate ?? null)}
              </p>
              <p className="mt-2 text-sm text-emerald-800/80">
                Commission appliquée pour toute première vente générée via ton lien affilié.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Client affilié</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-900">
                {formatPercent(program?.affiliateRate ?? null)}
              </p>
              <p className="mt-2 text-sm text-emerald-800/80">
                Taux majoré quand tu recrutes un profil déjà affilié ou ambassadeur de la communauté STAM.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Bonus cross-selling</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-900">
                {formatPercent(program?.crossSellBonusRate ?? null)}
              </p>
              <p className="mt-2 text-sm text-emerald-800/80">
                Bonus additionnel si l&apos;apprenant possède déjà une formation STAM active.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Validation</p>
              <p className="mt-2 text-xl font-semibold text-emerald-900">
                {program?.requiresApproval ? 'Sur validation du créateur' : 'Activation immédiate'}
              </p>
              <p className="mt-2 text-sm text-emerald-800/80">
                {program?.requiresApproval
                  ? 'Le créateur reçoit ta demande et valide ton profil avant l’activation du lien.'
                  : 'Ton lien affilié est disponible instantanément après ta demande.'}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-3xl border border-emerald-200 bg-white/95 p-6 shadow-[0_25px_60px_-45px_rgba(16,94,88,0.35)]">
          {eligibility.status === 'PROGRAM_INACTIVE' ? (
            <div className="space-y-4 text-sm text-emerald-800">
              <FireSimple weight="fill" size={32} className="text-emerald-500" />
              <p>
                Ce programme affilié n’est pas encore ouvert. Contacte le créateur pour activer l’affiliation sur cette
                formation.
              </p>
            </div>
          ) : null}

          {eligibility.status === 'NOT_AUTHENTICATED' ? (
            <div className="space-y-4 text-sm text-emerald-800">
              <p>Connecte-toi à ton espace STAM pour rejoindre le programme.</p>
              <Link
                href={`/stam/login?redirect=/stam/learn/${formationId}/become-affiliate`}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
              >
                Se connecter
              </Link>
            </div>
          ) : null}

          {eligibility.status === 'CAN_JOIN' && session ? (
            <form action={joinProgramAction} className="space-y-4">
              <input type="hidden" name="formationId" value={formationId} />
              <p className="text-sm text-emerald-800">
                En un clic, génère ton lien affilié et suis tes conversions depuis le dashboard.
              </p>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
              >
                Devenir affilié
                <ArrowRight weight="bold" size={16} />
              </button>
            </form>
          ) : null}

          {eligibility.status === 'ALREADY_APPROVED' ? (
            <div className="space-y-4 text-sm text-emerald-800">
              <p>Tu fais déjà partie du programme. Retrouve ton lien affilié et tes performances sur ton dashboard.</p>
              <Link
                href="/stam/affiliate/dashboard"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:text-emerald-900"
              >
                Ouvrir le dashboard
              </Link>
            </div>
          ) : null}

          {eligibility.status === 'PENDING_APPROVAL' ? (
            <div className="space-y-4 text-sm text-emerald-800">
              <p>Ta demande est en cours de validation. Tu recevras une notification dès son acceptation.</p>
              <Link
                href="/stam/affiliate/dashboard"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:text-emerald-900"
              >
                Consulter l’état
              </Link>
            </div>
          ) : null}

          {eligibility.status === 'REJECTED' ? (
            <div className="space-y-4 text-sm text-emerald-800">
              <p>
                Ce programme n’est pas accessible pour le moment. Contacte l’équipe STAM pour réévaluer ton profil
                affilié.
              </p>
              <Link
                href="/stam/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:text-emerald-900"
              >
                Contacter l’équipe
              </Link>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  )
}
