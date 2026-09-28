import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Önizlemedeki mantık hatasını avla',
  difficulty: 'orta',
  concepts: ['tooling.browser-devtools', 'tooling.debugging'],
  files: ['ticketPricing.ts'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Tarayıcı DevTools Sources panelinde `ticketPricing.ts` dosyasını bul ve `calculateBookingTotal` fonksiyonunun ilk satırına breakpoint koy. Önizlemede bilet sayısını değiştirip Scope panelindeki ara değerleri gözlemle.',
    'Önce toplam ham tutarı hesapla: `const subtotal = ticketCount * pricePerTicket`. İndirim tutarını tek bir biletten değil, bu `subtotal` üzerinden düşmelisin.',
    'Formül: `const discountAmount = (subtotal * discountPercent) / 100`, ardından `return Math.round(subtotal - discountAmount)`.',
    'Tuzak: `ticketCount <= 0` veya `pricePerTicket <= 0` durumunda indirim hesaplamasına hiç girmeden doğrudan `return 0` yapmalısın.',
  ],
})
