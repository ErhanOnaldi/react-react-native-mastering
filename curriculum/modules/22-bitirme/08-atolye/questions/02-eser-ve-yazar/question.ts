import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Eser değişince yazar güncellenmiyor',
  difficulty: 'orta',
  concepts: ['query.keys', 'query.dependent', 'router.params'],
  files: ['BookDetail.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Eser değişince neyin yeniden hesaplanması gerektiğini düşün: yazar hangi esere bağlı?',
    'Yazar bilgisini ayrı bir sorguyla getiriyorsan, o sorgunun kimliği de değişen esere bağlı olmalı.',
    'İkinci sorgunun query key’ine eser kimliğini (ya da yazarın anahtarını) ekle; aksi halde önbellek eskisini döner.',
  ],
})
