import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi parçayı ayırmalı?',
  difficulty: 'orta',
  concepts: ['perf.code-splitting'],
  question: `Sinema'nın film detay ekranındaki ağır oyuncu analizi grafiği yalnızca bazı ziyaretçiler tarafından açılıyor. Bu kodu ilk açılış paketinden çıkarmak için en uygun seçim hangisidir?`,
  options: [
    {
      text: 'Yalnız grafik panelini kullanıcı açtığında yükle; her ekranda gereken küçük başlık ve düğmeleri ilk pakette tut.',
      correct: true,
      explanation:
        'Nadiren kullanılan ve ağır bir panel ayrı yükleme için iyi adaydır. Küçük, her zaman görünen öğeleri bölmek istek ve bekleme maliyeti doğurur.',
    },
    {
      text: 'Her film başlığını ve düğmesini ayrı ayrı yükle; her dosya küçük olsun.',
      correct: false,
      explanation:
        'Çok küçük parçalar çok sayıda ağ isteği ve bekleme sınırı yaratır; ayrımın kendi maliyeti vardır.',
    },
    {
      text: 'Grafik kodunu her sayfa açıldığında indir, ama JavaScript çalışmasını on saniye beklet.',
      correct: false,
      explanation:
        'Çalıştırmayı geciktirmek kodu ilk paketten çıkarmaz; kullanılmayan dosya yine indirilir.',
    },
  ],
})
