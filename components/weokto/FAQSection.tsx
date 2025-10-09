'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus } from '@phosphor-icons/react'

export default function FAQSection() {
  const faqItems = useMemo(() => [
    {
      question: "Comment fonctionne Weokto concrètement ?",
      answer: "Weokto est la plateforme du community building qui met en relation les créateurs avec des fournisseurs. Apprends le community building dans les guildes, trouve un produit avec les fournisseurs, vends, gagne de l'argent de manière passive, et participe aux compétitions."
    },
    {
      question: "Combien ça coûte de commencer ?",
      answer: "C'est 100% gratuit pour démarrer ! Tu reçois 500 Pearls de bienvenue, l'accès aux guildes, aux fournisseurs et aux outils IA. Weokto prend seulement 6% de commission sur tes ventes."
    },
    {
      question: "Quels types de produits puis-je vendre ?",
      answer: "Nos fournisseurs proposent des produits numériques (formations, outils SaaS, templates), des services (coaching, consulting) et bientôt des produits physiques. Tout dépend de ta guilde et de tes intérêts."
    },
    {
      question: "Comment fonctionnent les guildes ?",
      answer: "Les guildes sont des communautés spécialisées (copywriters, créateurs de contenu, etc.). Toutes les guildes ont un accès gratuit forcé par Weokto et ne sont pas affiliées à nous. Nous vérifions leur contenu et performance pour assurer leur qualité. Tu peux rejoindre celle qui correspond à tes compétences."
    },
    {
      question: "C'est quoi le système de Pearls ?",
      answer: "Les Pearls sont notre système de points. Tu gagnes 2 Pearls pour chaque 1€ généré. Ils te permettent de monter en niveau, débloquer des récompenses et personnaliser ton MyOkto."
    },
    {
      question: "Comment je reçois mes paiements ?",
      answer: "Tu peux retirer tes gains à partir de 30€ directement sur ton compte bancaire. Bientôt, les retraits en crypto et PayPal seront disponibles. Tu payes seulement 4% de frais sur les retraits (payouts)."
    },
    {
      question: "Puis-je vraiment générer des revenus sans expérience ?",
      answer: "Oui, c'est l'objectif de Weokto. Les guildes proposent des formations, du mentorat et des méthodes éprouvées. La communauté est là pour t'aider à réussir, peu importe ton niveau de départ."
    },
    {
      question: "Y a-t-il un support si j'ai besoin d'aide ?",
      answer: "Absolument ! Support communautaire 24/7, documentation complète, et les mentors de ta guilde sont là pour t'accompagner. Tu n'es jamais seul dans ton parcours."
    }
  ], [])

  return (
    <section className="py-20 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-[#FFB000] text-sm font-mono animate-pulse">{'>'} FAQ</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-mono font-bold text-[#B794F4]"
          >
            TU TE POSES DES QUESTIONS ?
            <br />
            ON A LES RÉPONSES.
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <details className="group border border-[#B794F4]/30 bg-black/50 p-5 cursor-pointer hover:border-[#B794F4]/50 transition-all">
                <summary className="flex items-center justify-between font-mono text-white marker:content-none">
                  <span className="text-sm">{faq.question}</span>
                  <span className="text-[#FFB000] group-open:rotate-90 transition-transform ml-4">{'>'}</span>
                </summary>
                <p className="mt-4 text-gray-400 text-xs font-mono leading-relaxed pl-4 border-l-2 border-[#B794F4]/30">
                  {faq.answer}
                </p>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}