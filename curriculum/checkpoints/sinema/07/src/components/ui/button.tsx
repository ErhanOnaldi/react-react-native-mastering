import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-500',
        secondary: 'border border-slate-500 bg-slate-800 text-white hover:bg-slate-700',
        ghost: 'text-slate-100 hover:bg-slate-700',
      },
      size: {
        sm: 'gap-1 px-2 py-1 text-sm',
        md: 'gap-2 px-3 py-2 text-base',
        lg: 'gap-2 px-4 py-3 text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}
