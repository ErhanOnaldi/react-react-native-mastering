import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Üretim hatasının kaynağını bul',
  difficulty: 'orta',
  concepts: ['monitoring.error-reporting', 'deploy.build-preview'],
  question:
    'Hata kaydında `assets/app-a41c.js:1:9002` görünüyor. Aynı hata farklı yayınlarda farklı satıra düşüyor. Hangi bilgi ikilisi kaynağa dönmek için gerekir?',
  options: [
    {
      text: 'Hatanın geldiği release kimliği ve o build’e ait source map.',
      correct: true,
      explanation: 'Minify edilmiş konum ancak aynı build’in map dosyasıyla özgün koda eşlenir.',
    },
    {
      text: 'Kullanıcının ekran genişliği ve en son çalıştırdığı `vite dev` sunucusu.',
      correct: false,
      explanation:
        'Ekran genişliği tanıya yardımcı olabilir, ama üretim JS konumunu özgün satıra çeviremez.',
    },
    {
      text: 'Yalnızca en yeni source map; bütün build’lerde satır konumları aynıdır.',
      correct: false,
      explanation:
        'Her build’in bundle içeriği ve sıkıştırılmış konumları değişebilir; map release ile eşleşmelidir.',
    },
  ],
})
