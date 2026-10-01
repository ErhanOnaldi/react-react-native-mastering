import { useRef, useState } from 'react'

type Screen = 'duzenle' | 'sil'

interface Kayit {
  id: string
  ad: string
}

const baslangicKayitlar: Kayit[] = [
  { id: '1', ad: 'Dune' },
  { id: '2', ad: 'Matrix' },
]

export function DialogPages() {
  const [screen, setScreen] = useState<Screen>('duzenle')
  const [kayitlar, setKayitlar] = useState(baslangicKayitlar)

  return (
    <section>
      <div>
        <button onClick={() => setScreen('duzenle')} aria-pressed={screen === 'duzenle'}>
          Düzenleme
        </button>
        <button onClick={() => setScreen('sil')} aria-pressed={screen === 'sil'}>
          Silme
        </button>
      </div>
      {screen === 'duzenle' ? (
        <DuzenlemeEkrani />
      ) : (
        <SilmeEkrani
          kayitlar={kayitlar}
          onSil={(id) => setKayitlar((prev) => prev.filter((k) => k.id !== id))}
        />
      )}
    </section>
  )
}

// Bu ekrandaki basit pencere çalışır; Escape ve focus dönüşü henüz eklenmedi.
function DuzenlemeEkrani() {
  const [ad, setAd] = useState('Dune')
  const [open, setOpen] = useState(false)
  const iptalRef = useRef<HTMLButtonElement>(null)

  return (
    <div>
      <label>
        Ad
        <input value={ad} onChange={(event) => setAd(event.target.value)} />
      </label>
      <button ref={iptalRef} onClick={() => setOpen(true)}>
        İptal
      </button>
      {open && (
        <div role="dialog" aria-label="Değişiklikleri kaydetmeden çık?">
          <p>Yazdığın değişiklikler kaybolur.</p>
          <button
            onClick={() => {
              setAd('Dune')
              setOpen(false)
            }}
          >
            Evet, çık
          </button>
          <button onClick={() => setOpen(false)}>Vazgeç</button>
        </div>
      )}
    </div>
  )
}

// Silme ekranı: onay penceresi acele yazıldı — Esc ile kapanmıyor, kapanınca odak geri dönmüyor.
function SilmeEkrani({ kayitlar, onSil }: { kayitlar: Kayit[]; onSil: (id: string) => void }) {
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>())

  return (
    <div>
      <ul>
        {kayitlar.map((kayit) => (
          <li key={kayit.id}>
            {kayit.ad}
            <button
              ref={(node) => {
                if (node) buttonRefs.current.set(kayit.id, node)
              }}
              onClick={() => setConfirmId(kayit.id)}
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
      {confirmId && (
        <div role="dialog" aria-label="Silme onayı">
          <p>Bu kaydı silmek istediğine emin misin?</p>
          <button
            onClick={() => {
              onSil(confirmId)
              setConfirmId(null)
            }}
          >
            Evet, sil
          </button>
          <button onClick={() => setConfirmId(null)}>Vazgeç</button>
        </div>
      )}
    </div>
  )
}
