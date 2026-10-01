import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yeni kodda varsayılan',
  difficulty: 'kolay',
  concepts: ['perf.compiler'],
  question: `React Compiler etkin bir Sinema sayfasında arama sorgusu değişince sonuç listesi güncellenmeli; sayaç değişince aynı filtre hesabı tekrarlanmamalı. Yeni kod için nasıl başlarsın?`,
  options: [
    {
      text: 'Önce normal bileşen kodunu yazar, derleyicinin tekrarlanan işi azaltmasını bekler ve sonucu ölçerim.',
      correct: true,
      explanation:
        'Derleyici uygun hesapları otomatik koruyabilir. Hangi işin atlandığını yine ölçerek doğrularsın.',
    },
    {
      text: 'Filtreyi hiçbir koşulda yeniden hesaplamamak için sonuçları sabitlerim.',
      correct: false,
      explanation:
        'Arama sorgusu değiştiğinde sonuç da değişmelidir; eski listeyi sabitlemek doğru davranışı bozar.',
    },
    {
      text: 'Sayaç state’ini her sonuç satırına taşırım ki bütün liste güncellensin.',
      correct: false,
      explanation:
        'Sayaç değişikliği filtre girdisi değildir; state’i satırlara taşımak gereksiz render alanını büyütür.',
    },
  ],
})
