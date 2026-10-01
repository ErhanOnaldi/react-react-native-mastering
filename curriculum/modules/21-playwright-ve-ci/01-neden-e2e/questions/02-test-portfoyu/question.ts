import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hepsini E2E yazalım mı?',
  difficulty: 'orta',
  concepts: ['test.e2e', 'test.what-to-test', 'test.msw', 'test.rtl-queries'],
  question: `Girişten izleme listesi oluşturmaya giden akışın ayrı testlerde yeşil olduğu halde gerçek uygulamada bozulduğunu gördün. Test paketinde ayrıca puan biçimi, boş tarih ve form alanı kuralları var.

Bu paket için en dengeli seçim hangisi?`,
  options: [
    {
      text: 'Girişten liste oluşturmaya ve aramadan ayrıntıya giden birkaç kritik yolculuğu E2E ile ekleyelim; puan ve alan kuralları hızlı testlerde kalsın.',
      correct: true,
      explanation:
        'Doğru. Eksik olan, parçaların gerçek uygulamadaki birleşimini çalıştıran akış senaryosuydu. Puan ve alan kurallarını hızlı testlerde tutmak her kenar durumunu browser açmadan denemeni sağlar.',
    },
    {
      text: 'Arama ve giriş akışlarını E2E’ye taşıyalım; bileşen testlerini yalnızca görsel metinlerin varlığını kontrol etmeye bırakalım.',
      explanation:
        'Akış testlerini browser ile korumak yararlı, ama bileşen testleri yalnızca metin varlığıyla sınırlı değildir. Form alanı ve istek/yanıt bağlantısı gibi bileşen davranışlarını da hızlıca sınayabilirler.',
    },
    {
      text: 'Önce puan, tarih ve form kurallarının E2E testlerini tamamlayalım; sonra gerekirse giriş akışını ekleriz.',
      explanation:
        'Bu sıra hızlı testlerdeki ayrıntılara öncelik verir ama gördüğün gerçek uygulama boşluğunu açık bırakır. Önce eksik kritik akışı koru; kalan sınır durumları hızlı testlerde genişletebilirsin.',
    },
    {
      text: 'Akış testini yalnızca yerelde elle çalıştıralım; CI süresini kısa tutmak için değişikliklerde çalıştırmayalım.',
      explanation:
        'Yerelde geçen test değişiklik sonrası tekrar çalıştırılmayabilir. Kritik akışı otomatik kapıya bağlamak, route birleşimi yeniden bozulduğunda bunu erken gösterir.',
    },
  ],
})
