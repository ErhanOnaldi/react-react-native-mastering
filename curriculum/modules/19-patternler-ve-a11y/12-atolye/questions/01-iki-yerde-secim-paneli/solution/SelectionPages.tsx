import { useRef, useState } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectionGroupProps {
  label: string
  options: Option[]
  value: string
  onChange: (value: string) => void
}

function SelectionGroup({ label, options, value, onChange }: SelectionGroupProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  function move(nextValue: string) {
    onChange(nextValue)
    refs.current[nextValue]?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const index = options.findIndex((option) => option.value === value)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      move(options[(index + 1) % options.length].value)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      move(options[(index - 1 + options.length) % options.length].value)
    } else if (event.key === 'Home') {
      event.preventDefault()
      move(options[0].value)
    } else if (event.key === 'End') {
      event.preventDefault()
      move(options[options.length - 1].value)
    }
  }

  return (
    <div role="radiogroup" aria-label={label} onKeyDown={handleKeyDown}>
      {options.map((option) => (
        <button
          key={option.value}
          ref={(node) => {
            refs.current[option.value] = node
          }}
          role="radio"
          aria-checked={option.value === value}
          tabIndex={option.value === value ? 0 : -1}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

const GENRES: Option[] = [
  { value: 'aksiyon', label: 'Aksiyon' },
  { value: 'komedi', label: 'Komedi' },
]

const SORTS: Option[] = [
  { value: 'puan', label: 'Puan' },
  { value: 'tarih', label: 'Tarih' },
]

export function SelectionPages() {
  const [screen, setScreen] = useState<'ana' | 'detay'>('ana')
  const [anaGenre, setAnaGenre] = useState('aksiyon')
  const [detaySort, setDetaySort] = useState('puan')

  return (
    <main>
      <nav>
        <button onClick={() => setScreen('ana')}>Ana Sayfa</button>
        <button onClick={() => setScreen('detay')}>Detay</button>
      </nav>
      {screen === 'ana' ? (
        <SelectionGroup label="Tür" options={GENRES} value={anaGenre} onChange={setAnaGenre} />
      ) : (
        <SelectionGroup
          label="Sıralama"
          options={SORTS}
          value={detaySort}
          onChange={setDetaySort}
        />
      )}
    </main>
  )
}
