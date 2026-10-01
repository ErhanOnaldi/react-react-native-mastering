import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Aynı hatayı yakala',
  difficulty: 'kolay',
  concepts: ['test.what-to-test', 'router.search-params'],
  question:
    'İkinci sayfaya geçince yine ilk sayfa geliyorsa hangi senaryoyu kalıcı test olarak yazarsın?',
  options: [
    {
      text: 'Arama URL’si `?q=matrix&page=2` iken istekte `query=matrix` ve `page=2` bulunur',
      correct: true,
      explanation:
        'Doğru. Geçmişte bozulan kullanıcı akışının iki kritik parametresini sabitlersin.',
    },
    {
      text: 'Her component’in kaç satırdan oluştuğunu ölçerim',
      correct: false,
      explanation: 'Satır sayısı davranış değildir; sayfa seçimi yine yanlış olabilir.',
    },
    {
      text: 'İkinci sayfa isteğinin başladığını kontrol ederim',
      correct: false,
      explanation:
        'İstek başlayabilir ama yanlış `page=1` taşıyabilir; URL parametresini de denetle.',
    },
  ],
})
