import type { ComponentProps } from 'react'

// shadcn CLI bu ikonları `lucide-react`'ten import eder. Kursun ortak ortamında o paket
// olmadığı için aynı çizimleri küçük, dekoratif (aria-hidden) SVG bileşenleri olarak tutuyoruz.

function Icon({ children, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function XIcon(props: ComponentProps<'svg'>) {
  return (
    <Icon {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Icon>
  )
}

export function CheckIcon(props: ComponentProps<'svg'>) {
  return (
    <Icon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  )
}

export function CircleIcon(props: ComponentProps<'svg'>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
    </Icon>
  )
}

export function ChevronDownIcon(props: ComponentProps<'svg'>) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  )
}
