import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Lazy panelin çıktısını gör',
  difficulty: 'orta',
  concepts: ['tooling.build', 'perf.code-splitting'],
  question:
    '`React.lazy` ile oyuncu panelini ayırdın. Geliştirme sunucusu çalışıyor; dağıtıma gidecek çıktıda panelin ayrı dosyaya ayrıldığını hangi adımda doğrularsın?',
  options: [
    {
      text: '`pnpm build` ile production çıktısı üretip çıktı dosyalarını/Network yüklemesini incelersin.',
      correct: true,
      explanation:
        'Doğru. Dinamik import’un üretim paketine etkisi build çıktısında ve gerçek yükleme sırasında görülür.',
    },
    {
      text: 'Yalnız `pnpm dev` terminalinde HMR mesajını beklersin.',
      correct: false,
      explanation: 'HMR geliştirme akışıdır; production chunk çıktısını göstermez.',
    },
    {
      text: '`tsc -b` sonrasında otomatik oluşan JS chunk listesini okursun.',
      correct: false,
      explanation:
        'TypeScript tip kontrolü Vite’ın production paketleme çıktısını tek başına üretmez.',
    },
  ],
})
