'use client'

import { useEffect, useMemo, useState } from 'react'

interface ReorderableListProps<T> {
  items: T[]
  getId: (item: T) => string
  renderItem: (item: T, state: { isDragging: boolean; isDragTarget: boolean }) => React.ReactNode
  onReorder: (orderedIds: string[]) => Promise<void> | void
  className?: string
  disabled?: boolean
  emptyState?: React.ReactNode
}

interface DraggableState<T> {
  order: T[]
  draggingId: string | null
  overId: string | null
  busy: boolean
}

export function ReorderableList<T>({
  items,
  getId,
  renderItem,
  onReorder,
  className,
  disabled,
  emptyState
}: ReorderableListProps<T>) {
  const [state, setState] = useState<DraggableState<T>>({
    order: items,
    draggingId: null,
    overId: null,
    busy: false
  })

  useEffect(() => {
    setState((prev) => ({ ...prev, order: items }))
  }, [items])

  const orderedIds = useMemo(() => state.order.map(getId), [state.order, getId])

  if (!items.length && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <div className={className}>
      {state.order.map((item) => {
        const id = getId(item)
        const isDragging = state.draggingId === id
        const isDragTarget = state.overId === id && state.draggingId !== id

        return (
          <div
            key={id}
            draggable={!disabled}
            onDragStart={() => {
              if (disabled) return
              setState((prev) => ({ ...prev, draggingId: id, overId: id }))
            }}
            onDragOver={(event) => {
              if (disabled) return
              event.preventDefault()
              if (state.overId !== id) {
                setState((prev) => ({ ...prev, overId: id }))
              }
            }}
            onDrop={(event) => {
              if (disabled) return
              event.preventDefault()
              setState((prev) => ({ ...prev, draggingId: null, overId: null, busy: true }))
              const draggedId = state.draggingId
              if (!draggedId || draggedId === id) {
                setState((prev) => ({ ...prev, busy: false }))
                return
              }

              setState((prev) => {
                const currentOrder = [...prev.order]
                const draggedIndex = currentOrder.findIndex((value) => getId(value) === draggedId)
                const targetIndex = currentOrder.findIndex((value) => getId(value) === id)
                if (draggedIndex === -1 || targetIndex === -1) {
                  return { ...prev, busy: false }
                }

                const [draggedItem] = currentOrder.splice(draggedIndex, 1)
                currentOrder.splice(targetIndex, 0, draggedItem)

                void Promise.resolve(onReorder(currentOrder.map(getId))).finally(() => {
                  setState((latest) => ({ ...latest, busy: false }))
                })

                return {
                  ...prev,
                  order: currentOrder,
                  draggingId: null,
                  overId: null
                }
              })
            }}
            onDragEnd={() => {
              setState((prev) => ({ ...prev, draggingId: null, overId: null }))
            }}
            className={`relative transition-all ${
              isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'
            } ${isDragTarget ? 'ring-2 ring-[#FFB000]/40' : ''}`}
          >
            {renderItem(item, { isDragging, isDragTarget })}
          </div>
        )
      })}

      {state.busy && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 text-xs text-[#B794F4]/60">
          Réorganisation...
        </div>
      )}
    </div>
  )
}

