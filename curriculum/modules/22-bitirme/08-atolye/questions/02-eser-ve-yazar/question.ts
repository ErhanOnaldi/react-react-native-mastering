import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Eser değişince yazar güncellenmiyor',
  difficulty: 'orta',
  concepts: ['query.keys', 'query.dependent', 'router.params'],
  files: ['BookDetail.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Eser ve yazar bilgisi iki ayrı sorgudur; yazar bilgisini çekerken sorgu kimliğini aktif esere ve yazar referansına bağla.',
    "İkinci sorguda `queryKey: ['author', authorKey]` (veya eser kimliğine bağlı anahtar) kullan; `enabled: Boolean(authorKey)` koşuluyla yazar anahtarı gelmeden sorguyu başlatma.",
    'Eser değiştiğinde `useParams` üzerinden gelen `workId` değişir. Yazar verisini `workData?.authors?.[0]?.author?.key` üzerinden alıp ayrı bir sorguyla çağır.',
    'Yazar sorgusunun anahtarına (`queryKey`) yazar kimliğini veya `workId`’yi koymayı unutursan, önbellek ilk çağrılan eserin yazarını dönmeye devam eder.',
  ],
})
