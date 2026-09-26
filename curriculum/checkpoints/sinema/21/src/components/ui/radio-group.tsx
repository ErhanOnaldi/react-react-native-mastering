import type { ComponentProps, KeyboardEvent } from 'react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { cn } from '@/shared/lib/cn'
import { CircleIcon } from './icons'

export function RadioGroup({
  className,
  onKeyDownCapture,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  function handleKeyDownCapture(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDownCapture?.(event)
    if (
      event.defaultPrevented ||
      props.disabled ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return

    const direction = props.dir === 'rtl' ? -1 : 1
    const step =
      event.key === 'ArrowRight'
        ? direction
        : event.key === 'ArrowLeft'
          ? -direction
          : event.key === 'ArrowDown'
            ? 1
            : event.key === 'ArrowUp'
              ? -1
              : 0
    if (!step) return
    if (props.orientation === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(event.key)) return
    if (props.orientation === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) return

    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="radio"]:not([data-disabled])',
      ),
    )
    const current = items.indexOf(event.target as HTMLButtonElement)
    if (current < 0 || items.length === 0) return
    const nextIndex = current + step
    if (props.loop === false && (nextIndex < 0 || nextIndex >= items.length)) return

    // Radix defers roving focus with setTimeout. Select synchronously so the
    // radio's value and focus move together after a key press.
    event.preventDefault()
    const next = items[(nextIndex + items.length) % items.length]
    next.focus()
    next.click()
  }

  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      {...props}
      onKeyDownCapture={handleKeyDownCapture}
    />
  )
}

export function RadioGroupItem({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}
