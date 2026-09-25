type Props = { children: React.ReactNode; className?: string }
export function BrandHeading({ children, className }: Props) {
  return <h2 className={className}>{children}</h2>
}
