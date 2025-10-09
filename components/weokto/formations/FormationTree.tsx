'use client'

import { type ReactElement } from 'react'
import * as Icons from 'phosphor-react'
import clsx from 'clsx'

export interface FormationTreeModule {
  id: string
  title: string
  type: 'VIDEO' | 'PDF' | 'AUDIO' | 'LINK'
  status?: string | null
  chapterId: string
}

export interface FormationTreeCategory {
  id: string
  title: string
  modules: FormationTreeModule[]
}

interface FormationTreeProps {
  categories: FormationTreeCategory[]
  selectedModuleId?: string | null
  editable?: boolean
  onSelectModule?: (moduleId: string, chapterId: string) => void
  onAddCategory?: () => void
  onAddModule?: (chapterId: string) => void
  onDeleteCategory?: (categoryId: string) => void
  onDeleteModule?: (moduleId: string) => void
  onEditCategory?: (categoryId: string) => void
}

const MODULE_ICONS: Record<FormationTreeModule['type'], ReactElement> = {
  VIDEO: <Icons.Play size={12} />,
  PDF: <Icons.FilePdf size={12} />,
  AUDIO: <Icons.Headphones size={12} />,
  LINK: <Icons.LinkSimple size={12} />
}

export function FormationTree({
  categories,
  selectedModuleId = null,
  editable = false,
  onSelectModule,
  onAddCategory,
  onAddModule,
  onDeleteCategory,
  onDeleteModule,
  onEditCategory
}: FormationTreeProps) {
  return (
    <aside className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-base uppercase tracking-wider">Plan de la formation</h2>
        {editable && (
          <button
            onClick={onAddCategory}
            className="inline-flex items-center gap-1 rounded border border-[#B794F4]/40 px-2 py-1 text-xs uppercase text-[#B794F4] hover:border-[#FFB000] hover:text-[#FFB000]"
          >
            <Icons.Plus size={12} /> Catégorie
          </button>
        )}
      </div>

      <div className="space-y-3">
        {categories.length === 0 && (
          <div className="rounded border border-dashed border-[#B794F4]/40 bg-black/40 px-4 py-6 text-center text-xs text-[#B794F4]/60">
            Aucune catégorie pour l'instant. Ajoute ta première vidéo pour commencer.
          </div>
        )}

        {categories.map((category) => (
          <div key={category.id} className="rounded border border-[#B794F4]/30 bg-black/60">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-left text-white font-semibold text-sm flex-1">
                {category.title || 'Catégorie sans titre'}
              </span>
              {editable && (
                <div className="flex items-center gap-1 text-xs text-[#B794F4]/60">
                  {onEditCategory && (
                    <button
                      onClick={() => onEditCategory(category.id)}
                      className="rounded border border-[#B794F4]/40 px-2 py-1 uppercase hover:border-[#FFB000] hover:text-[#FFB000]"
                    >
                      <Icons.PencilSimple size={12} />
                    </button>
                  )}
                  {onAddModule && (
                    <button
                      onClick={() => onAddModule(category.id)}
                      className="rounded border border-[#B794F4]/40 px-2 py-1 uppercase hover:border-[#FFB000] hover:text-[#FFB000]"
                    >
                      <Icons.Plus size={12} /> Module
                    </button>
                  )}
                  {onDeleteCategory && (
                    <button
                      onClick={() => onDeleteCategory(category.id)}
                      className="rounded border border-[#EF4444]/40 px-2 py-1 uppercase text-[#EF4444] hover:bg-[#EF4444]/10"
                    >
                      <Icons.Trash size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1 px-2 pb-3">
              {category.modules.map((module) => {
                const active = module.id === selectedModuleId
                return (
                  <button
                    key={module.id}
                    onClick={() => onSelectModule?.(module.id, module.chapterId)}
                    className={clsx(
                      'w-full rounded px-3 py-2 text-left text-xs uppercase tracking-wide transition-colors flex items-center justify-between',
                      active ? 'bg-[#FFB000]/20 text-[#FFB000]' : 'text-[#B794F4]/70 hover:bg-[#B794F4]/10'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current">
                        {MODULE_ICONS[module.type]}
                      </span>
                      <span className="capitalize text-[11px]">
                        {module.title || 'Module sans titre'}
                      </span>
                    </span>
                    {editable && onDeleteModule && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation()
                          onDeleteModule(module.id)
                        }}
                        className="rounded border border-transparent px-1 py-0.5 text-[10px] uppercase text-[#EF4444] hover:border-[#EF4444]/40"
                      >
                        Supprimer
                      </button>
                    )}
                  </button>
                )
              })}

              {category.modules.length === 0 && (
                <div className="rounded border border-dashed border-[#B794F4]/30 px-3 py-2 text-[11px] text-[#B794F4]/50">
                  Aucun module dans cette catégorie.
                </div>
              )}

              {editable && onAddModule && (
                <button
                  onClick={() => onAddModule(category.id)}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded border border-dashed border-[#B794F4]/40 px-3 py-2 text-[11px] uppercase text-[#B794F4]/60 hover:border-[#FFB000] hover:text-[#FFB000]"
                >
                  <Icons.Plus size={12} /> Ajouter un module
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
