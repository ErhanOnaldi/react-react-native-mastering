import { useRef, useState, type ReactNode, type RefObject } from 'react'
import { Dialog } from 'radix-ui'

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

// Paylaşılan onay penceresi: Radix Dialog Escape'i ve odak tuzağını kendisi yönetir.
// Kapanınca odağı, açan düğmeye biz döndürüyoruz (restoreFocusRef) — hangi düğmenin
// açtığı ekrana göre değişebileceğinden bunu dışarıdan alıyoruz.
// Küçük bir API: başlık, açıklama, onay metni ve onaylandığında çalışacak callback.
function ConfirmDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  restoreFocusRef: RefObject<HTMLElement | null>
  children?: ReactNode
}) {
  return (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            props.restoreFocusRef.current?.focus()
          }}
        >
          <Dialog.Title>{props.title}</Dialog.Title>
          <Dialog.Description>{props.description}</Dialog.Description>
          {props.children}
          <button
            onClick={() => {
              props.onConfirm()
              props.onOpenChange(false)
            }}
          >
            {props.confirmLabel}
          </button>
          <Dialog.Close asChild>
            <button>Vazgeç</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

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
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Değişiklikleri kaydetmeden çık?"
        description="Yazdığın değişiklikler kaybolur."
        confirmLabel="Evet, çık"
        onConfirm={() => setAd('Dune')}
        restoreFocusRef={iptalRef}
      />
    </div>
  )
}

function SilmeEkrani({ kayitlar, onSil }: { kayitlar: Kayit[]; onSil: (id: string) => void }) {
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null)

  return (
    <div>
      <ul>
        {kayitlar.map((kayit) => (
          <li key={kayit.id}>
            {kayit.ad}
            <button
              onClick={(event) => {
                activeTriggerRef.current = event.currentTarget
                setConfirmId(kayit.id)
              }}
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={confirmId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmId(null)
        }}
        title="Bu kaydı silmek istediğine emin misin?"
        description="Bu işlem geri alınamaz."
        confirmLabel="Evet, sil"
        onConfirm={() => {
          if (confirmId) onSil(confirmId)
        }}
        restoreFocusRef={activeTriggerRef}
      />
    </div>
  )
}
