type Props = { value: string; onValueChange: (value: string) => void }

export function SearchField({ value, onValueChange }: Props) {
  return <input aria-label="Film ara" value={value} onChange={() => onValueChange('')} />
}
