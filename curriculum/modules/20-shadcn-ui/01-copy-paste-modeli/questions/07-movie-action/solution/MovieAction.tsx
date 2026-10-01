import type { ComponentProps } from 'react'
import { Slot } from 'radix-ui'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...values: Parameters<typeof clsx>) => twMerge(clsx(...values))
const styles = cva('inline-flex items-center rounded-md px-4 py-2', {
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground',
      outline: 'border border-input bg-background text-foreground',
    },
  },
  defaultVariants: { variant: 'primary' },
})

export type MovieActionProps = ComponentProps<'button'> & {
  asChild?: boolean
  variant?: 'primary' | 'outline'
}

export function MovieAction({
  asChild,
  variant = 'primary',
  className,
  ...props
}: MovieActionProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return <Comp className={cn(styles({ variant }), className)} {...props} />
}
