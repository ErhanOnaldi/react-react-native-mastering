import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

type SectionKey = 'summary' | 'cast' | 'videos'

export function MovieSections({
  title,
  cast,
  videos,
}: {
  title: string
  cast: string[]
  videos: string[]
}) {
  const [selected, setSelected] = useState<SectionKey>('summary')
  const id = useId()
  const summaryRef = useRef<HTMLButtonElement>(null)

  // Sekmeler veriden türer: video yoksa Videolar sekmesi hiç yok.
  const sections: { key: SectionKey; label: string; content: string }[] = [
    { key: 'summary', label: 'Özet', content: title },
    { key: 'cast', label: 'Oyuncular', content: cast.join(', ') },
    ...(videos.length > 0
      ? [{ key: 'videos' as const, label: 'Videolar', content: videos.join(', ') }]
      : []),
  ]
  // Seçili sekme veriden düştüyse Özet'i göster (state'i effect ile "düzeltmeye" gerek yok).
  const active = sections.some((section) => section.key === selected) ? selected : 'summary'
  const fellBack = active !== selected

  useEffect(() => {
    // Focus'lu sekme DOM'dan kalktıysa focus body'ye düşer; kullanıcıyı Özet'e geri getir.
    if (fellBack && document.activeElement === document.body) summaryRef.current?.focus()
  }, [fellBack])

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement)
    if (current < 0) return
    event.preventDefault()
    const next = (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    tabs[next].focus()
    setSelected(sections[next].key)
  }

  return (
    <>
      <div role="tablist" aria-label="Film bölümleri" onKeyDown={onKeyDown}>
        {sections.map((section) => (
          <button
            key={section.key}
            ref={section.key === 'summary' ? summaryRef : undefined}
            type="button"
            role="tab"
            id={`${id}-tab-${section.key}`}
            aria-controls={`${id}-panel`}
            aria-selected={active === section.key}
            tabIndex={active === section.key ? 0 : -1}
            onClick={() => setSelected(section.key)}
          >
            {section.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`}>
        {sections.find((section) => section.key === active)?.content}
      </div>
    </>
  )
}
