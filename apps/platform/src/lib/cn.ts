import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Koşullu class'ları birleştirir, çakışan Tailwind class'larını ayıklar. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
