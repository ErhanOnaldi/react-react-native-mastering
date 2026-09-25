import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Regresyonu görünür kıl',
  difficulty: 'kolay',
  concepts: ['test.what-to-test', 'router.search-params'],
  question: 'Aynı hata tekrar etmesin diye ilk hangi senaryoyu kalıcı test olarak yazarsın?',
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
      text: 'Yalnızca ilk sayfanın açıldığını kontrol ederim',
      correct: false,
      explanation: 'İlk sayfa zaten çalışıyordu; regresyon ikinci sayfa geçişindeydi.',
    },
  ],
})
