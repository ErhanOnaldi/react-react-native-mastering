import type { ComponentProps } from 'react'
type FavoriteButtonProps = Omit<ComponentProps<'button'>, 'type'>
export function FavoriteButton({ children, ...rest }: FavoriteButtonProps) {
  return <button>{children}</button>
}
