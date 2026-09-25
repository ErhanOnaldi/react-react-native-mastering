import { Button } from './Button'
export default function Preview() {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      {(['primary', 'secondary', 'ghost'] as const).map((variant) =>
        (['sm', 'md', 'lg'] as const).map((size) => (
          <Button key={`${variant}-${size}`} variant={variant} size={size}>
            {variant} {size}
          </Button>
        )),
      )}
    </div>
  )
}
