/** Koşullu class birleştirme (küçük projede clsx'e gerek yok). */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
