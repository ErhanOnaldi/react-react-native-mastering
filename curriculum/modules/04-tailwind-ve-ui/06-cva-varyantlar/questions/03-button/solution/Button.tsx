import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
export const buttonVariants = cva(
  'inline-flex items-center rounded-lg font-semibold focus-visible:outline-2 disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-sky-700 text-white',
        secondary: 'border border-sky-700 text-sky-700',
        ghost: 'bg-transparent text-sky-700',
      },
      size: { sm: 'px-2 py-1 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
    compoundVariants: [{ variant: 'ghost', size: 'sm', class: 'underline-offset-2' }],
  },
)
type Props = Omit<ComponentProps<'button'>, 'size'> & VariantProps<typeof buttonVariants>
export function Button({ variant, size, children, className, ...props }: Props) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  )
}
