import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hepsini E2E yazalım mı?',
  difficulty: 'orta',
  concepts: ['test.e2e', 'test.what-to-test', 'test.msw', 'test.rtl-queries'],
  question: `Pazartesi olayından sonra takım arkadaşın öneriyor:

> “RTL testleri bizi kurtarmadı. Hepsini silelim, bundan sonra her şeyi Playwright ile test edelim: \`formatVote\`, boş tarih, arama hata mesajı, sayfalama… Gerçek tarayıcı en güvenilirisi.”

En iyi cevap hangisi?`,
  options: [
    {
      text: 'Kritik yolculuklar (ana sayfa → arama → detay, giriş → liste) için birkaç E2E ekleyelim; ayrıntılar hızlı birim ve entegrasyon testlerinde kalsın.',
      correct: true,
      explanation:
        'Doğru. Pazartesi hatasının sebebi eksik **akış** senaryosuydu; çözüm o akışları E2E ile korumak. `formatVote(0)` gibi ayrıntıyı E2E ile test etmek hem yavaş (her biri saniyeler) hem de kalınca teşhisi zor olur. Katmanlar birbirinin yerine değil, birbirinin tamamlayıcısıdır.',
    },
    {
      text: 'Haklı: E2E her şeyi zaten kapsar, RTL testleri artık gereksiz.',
      explanation:
        'Kapsamak ile iyi test etmek farklı. `formatVote`’un beş kenar durumunu E2E’de denemek için beş kez uygulamayı açman gerekir; RTL/Vitest’te milisaniyeler. Kalan bir E2E testi “sunucu mu, ağ mı, CSS mi, kod mu?” sorusunu da açık bırakır. Sonuç: yavaş, pahalı ve kimsenin çalıştırmadığı bir paket.',
    },
    {
      text: 'Hayır: E2E testleri kırılgan olduğu için hiç yazmayalım, RTL testlerini artıralım.',
      explanation:
        'Bu, pazartesi hatasını tekrar yaşatır. İyi yazılmış E2E (rol tabanlı locator, otomatik bekleme, taklit edilmiş ağ) kırılgan değildir. “Kırılganlık” çoğu zaman `waitForTimeout` ve CSS seçicilerinden gelir; bunları 3. derste çözeceğiz.',
    },
    {
      text: 'E2E’yi yalnızca yayından önce, elle bir kez çalıştıralım; CI’a koymayalım.',
      explanation:
        'Elle ve seyrek çalışan test, en çok ihtiyaç duyduğun anda (cuma akşamı commit’i) çalışmaz. Değerini, **her** değişiklikte otomatik koşmasından alır; 8. derste GitHub Actions’a bağlayacağız.',
    },
  ],
})
