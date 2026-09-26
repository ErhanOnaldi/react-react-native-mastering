import { useId, useRef, useState } from 'react'

// Tasarım kararı: tek bir yapılandırma listesi (OPTIONS) kullanıyorum. Seçenek sayısı
// küçük ve sabit; her seçenek aynı yapıda (value + label). Ayrı, birlikte kullanılan
// parçalara (örn. ChoiceControl.Option) bölmek bu ölçekte ekstra dolaylamadan başka bir
// şey katmazdı. Seçenekler farklı içerik (ikon, açıklama, koşullu görünürlük) taşısaydı
// ya da liste dışarıdan (üst bileşenden) beslenmesi gerekseydi, küçük parçalar API'si
// (her biri kendi JSX'ini taşıyan bir alt bileşen) daha okunur olurdu.

interface Option {
  value: string
  label: string
}

const OPTIONS: Option[] = [
  { value: 'ekitap', label: 'E-kitap' },
  { value: 'basili', label: 'Basılı' },
  { value: 'sesli', label: 'Sesli' },
]

export function ChoiceControl() {
  const [value, setValue] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const errorId = useId()

  function select(next: string) {
    setValue(next)
    setError(null)
    refs.current[next]?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const index = OPTIONS.findIndex((option) => option.value === value)
    const currentIndex = index === -1 ? 0 : index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      select(OPTIONS[(currentIndex + 1) % OPTIONS.length].value)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      select(OPTIONS[(currentIndex - 1 + OPTIONS.length) % OPTIONS.length].value)
    }
  }

  function handleSave() {
    if (!value) {
      setError('Bir biçim seçmelisin.')
      return
    }
    setSaved(value)
  }

  const selectedLabel = OPTIONS.find((option) => option.value === value)?.label

  return (
    <section>
      <div
        role="radiogroup"
        aria-label="Kitap biçimi"
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        onKeyDown={handleKeyDown}
      >
        {OPTIONS.map((option, index) => (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[option.value] = node
            }}
            role="radio"
            aria-checked={option.value === value}
            tabIndex={(value === null ? index === 0 : option.value === value) ? 0 : -1}
            onClick={() => select(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {error && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
      <button onClick={handleSave}>Kaydet</button>
      {saved && <p>Kaydedildi: {selectedLabel}</p>}
    </section>
  )
}
