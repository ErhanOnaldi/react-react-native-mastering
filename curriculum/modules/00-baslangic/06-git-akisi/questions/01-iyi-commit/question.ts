import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'En iyi commit mesajı',
  difficulty: 'kolay',
  concepts: ['tooling.git', 'tooling.conventional-commits'],
  question:
    'Arama kutusu boşken TMDB’ye gereksiz istek atılıyordu; bunu düzelttin. Hangi commit mesajı en iyisi?',
  options: [
    {
      text: '`fix(search): boş aramada istek atma`',
      correct: true,
      explanation:
        'Tür (fix), kapsam (search) ve davranışı anlatan kısa açıklama: okuyan ne olduğunu hemen anlar.',
    },
    {
      text: '`düzeltmeler`',
      explanation:
        'Neyin, neden düzeltildiğini söylemiyor. Üç ay sonra geçmişte bu commit’i arayan kişi (muhtemelen sen) hiçbir şey anlamaz.',
    },
    {
      text: '`feat: arama`',
      explanation: 'Yeni özellik değil, hata düzeltmesi (`fix`). Açıklama da çok belirsiz.',
    },
    {
      text: '`SearchBox.tsx dosyasında if ekledim ve useEffect’i değiştirdim`',
      explanation:
        'Ne yaptığını (kodu) anlatıyor, neyi çözdüğünü değil. Kodu zaten diff gösterir; mesaj **amacı** anlatmalı.',
    },
  ],
})
