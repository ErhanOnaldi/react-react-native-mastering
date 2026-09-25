import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
export const buttonVariants = cva('inline-flex items-center rounded-lg', {
  variants: {
    variant: { primary: '', secondary: '', ghost: '' },
    size: { sm: '', md: '', lg: '' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})
type Props = Omit<ComponentProps<'button'>, 'size'> & VariantProps<typeof buttonVariants>
export function Button({ children, className, ...props }: Props) {
  return (
    <button className={cn(buttonVariants(), className)} {...props}>
      {children}
    </button>
  )
}
