import type { ComponentProps } from 'react'

export type MovieActionProps = ComponentProps<'button'> & {
  asChild?: boolean
  variant?: 'primary' | 'outline'
}

export function MovieAction({ asChild, variant = 'primary', className, ...props }: MovieActionProps) {
  return <button className={className} {...props} />
}
