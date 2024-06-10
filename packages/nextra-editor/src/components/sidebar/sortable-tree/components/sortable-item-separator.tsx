import cn from 'clsx'
import { ReactElement, useEffect } from 'react'
import { useDndTree } from '..'
import { SortableItem } from '@/nextra/normalize-pages'
import { classes } from '../../style'
import { SortableTreeItemProps } from '../types'

type SeparatorProps = {
  item: SortableItem
} & SortableTreeItemProps

export function SortableItemSeparator({ item, ...props }: SeparatorProps): ReactElement {
  const { title } = item
  const { setDragItem } = useDndTree()

  const {
    setDraggableNodeRef,
    setDroppableNodeRef,
    attributes,
    isDragTarget,
    isOver,
    listeners,
    level,
    indentationWidth,
    style,
  } = props

  useEffect(() => {
    if (!isDragTarget) return
    setDragItem(item)
  }, [isDragTarget])

  return (
    <li
      ref={setDroppableNodeRef}
      className={cn(
        'nx-relative',
        '[word-break:break-word]',
        'nx-mb-2 nx-mt-5 nx-text-sm nx-font-semibold nx-text-gray-900 first:nx-mt-0 dark:nx-text-gray-100',
        isDragTarget && classes.drag,
        isOver && classes.over,
      )}
      style={style}
    >
      <div
        ref={setDraggableNodeRef}
        {...attributes}
        {...listeners}
        className={cn('cursor-default', 'nx-px-2 nx-py-1.5')}
      >
        {title}
      </div>
    </li>
  )
}
