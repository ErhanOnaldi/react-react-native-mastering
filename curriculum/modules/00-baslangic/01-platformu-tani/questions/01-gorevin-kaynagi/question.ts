import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Görev tam olarak ne istiyor?',
  difficulty: 'kolay',
  concepts: ['tooling.platform', 'test.vitest-basics'],
  question: 'Bir kod görevinin **tam olarak** ne istediğini en kesin hangi kaynaktan öğrenirsin?',
  options: [
    {
      text: 'Test dosyasından (mor ikonlu sekme)',
      correct: true,
      explanation:
        'Doğru. Testler görevin çalıştırılabilir gereksinim listesidir: hangi girdiye hangi çıktının beklendiği tek tek yazar.',
    },
    {
      text: 'Çözüm sekmesinden',
      explanation:
        'Çözüm, gereksinimi karşılayan **bir** yoldur; gereksinimin kendisi değil. Ayrıca erken bakmak ilerlemende işaretlenir.',
    },
    {
      text: 'İpuçlarından',
      explanation:
        'İpuçları yön gösterir ama tüm kenar durumlarını (örn. 0 oy, boş tarih) listelemez. Tam liste testlerdedir.',
    },
    {
      text: 'Görev metnini okuyup tahmin ederek',
      explanation:
        'Görev metni bağlamı anlatır; ama "0 geldiğinde ne döneceği" gibi ayrıntıları kesinleştiren testlerdir.',
    },
  ],
})
