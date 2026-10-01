import { cn } from './cn'

type Props = { children: React.ReactNode; className?: string }
export function BrandHeading({ children, className }: Props) {
  return (
    <h2 className={cn('font-display text-brand-700 dark:text-brand-300', className)}>{children}</h2>
  )
}
