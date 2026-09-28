import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Ağır sekmeyi geçişle aç',
  difficulty: 'orta',
  concepts: ['perf.transitions', 'react.events'],
  files: ['MovieTabs.tsx'],
  hints: [
    'Sekme state’i güncellenirken kullanıcıya bekleme durumunu iletmek ve arayüz kilitlenmesini önlemek için React’in geçiş mekanizmasını düşün.',
    'Bileşen içinde `useTransition` hook’unu kullanarak `isPending` ve `startTransition` çiftini elde edebilirsin.',
    "Sekme değiştirme çağrılarını sarmala: `startTransition(() => setTab('overview'))`. Durum alanı için `<p role=\"status\">{isPending ? 'Sekme açılıyor' : ''}</p>` yapısını kur.",
    '`role="status"` içeren elementi yalnızca `isPending` true olduğunda koşullu olarak DOM’a eklemek yerine sürekli DOM’da tutup içeriğini boş dize yapmak ekran okuyucular ve testler için daha kararlıdır.',
  ],
})
