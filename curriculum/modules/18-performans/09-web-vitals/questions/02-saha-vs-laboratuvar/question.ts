import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Saha verisi ile laboratuvar verisi farkı',
  difficulty: 'orta',
  concepts: ['perf.web-vitals'],
  question: `Bir geliştirici, geliştirdiği React uygulamasını kendi güçlü geliştirici bilgisayarında Chrome Lighthouse ile test etmiş ve 98 puan almıştır. Ancak uygulama canlıya alındığında Google Search Console'da "Zayıf INP (> 500 ms)" ve "Zayıf LCP (> 4 sn)" uyarıları çıkmaya başlamıştır.

Laboratuvar (Lab) verisi ile saha (Field) verisi arasındaki bu farkın temel nedeni ve Core Web Vitals değerlendirme kuralı aşağıdakilerden hangisidir?`,
  mode: 'single',
  options: [
    {
      text: 'Lighthouse sentetik ve kontrollü bir ortamda çalışır; kullanıcı etkileşimi simüle etmediği için INP ölçemez. Canlıdaki saha verisi ise gerçek kullanıcıların farklı ağ/cihaz çeşitliliğinde toplanır ve kararlar 75. yüzdeliğe (p75) göre verilir.',
      correct: true,
      explanation:
        'Doğru. Lighthouse bir laboratuvar aracıdır ve sayfada gerçek tıklama/yazma etkileşimi yapmadığı için doğrudan INP ölçemez (yerine TBT kullanır). Saha verisi (RUM / CrUX) ise gerçek kullanıcıların cihazlarından toplanır ve değerlendirme kullanıcı deneyimlerinin 75. yüzdeliğine (p75) dayanır.',
    },
    {
      text: 'Lighthouse testleri production sunucusu yerine localhost üzerinde koştuğu için her zaman %50 daha iyimser sonuç üretir.',
      correct: false,
      explanation:
        "Yanlış. Lighthouse'un farklı sonuç vermesi sadece localhost kaynaklı değildir; prod üzerinde koşulduğunda da sentetik bir ortamdır ve gerçek kullanıcıların zayıf mobil işlemcilerini, arka plan sekmelerini veya gerçek ağ dalgalanmalarını birebir yansıtamaz.",
    },
    {
      text: 'Saha verisi yalnızca ortalama (average) değerleri dikkate alır; aşırı yavaş birkaç cihaz ortalamayı yukarı çekmiştir.',
      correct: false,
      explanation:
        'Yanlış. Web Vitals metriklerinde aritmetik ortalama değil, 75. yüzdelik (p75) kullanılır. Yani ziyaretlerin en az %75\'inin "iyi" eşiğinde olması gerekir. Uç değerlerin ortalamayı saptırmasını önlemek için yüzdelik dilim standardı getirilmiştir.',
    },
    {
      text: 'INP yalnızca React StrictMode kapalıyken ölçülebilir; canlı ortamda React hatalı derlendiği için INP yüksek çıkmıştır.',
      correct: false,
      explanation:
        "Yanlış. INP tarayıcı seviyesinde bir standarttır (`event` performans girdileri); React sürümünden veya StrictMode'dan bağımsız olarak tüm DOM olaylarını ve boyama gecikmelerini ölçer.",
    },
  ],
  explanation: `Performans ölçümünde iki farklı dünya vardır:
- **Laboratuvar (Lab) Ölçümü (Lighthouse, DevTools)**: Sabit bir cihaz/ağ profilinde sentetik test çalıştırır. Tekrarlanabilir ve hata ayıklamak için idealdir; ancak gerçek kullanıcı etkileşimi içermez.
- **Saha (Field) Ölçümü (CrUX, RUM, web-vitals)**: Farklı telefonlar, yavaş ağlar, batarya tasarruf modları ve gerçek kullanıcı tıklamalarıyla toplanan gerçek veridir.
Resmi Core Web Vitals değerlendirmesi her zaman **saha verisinin 75. yüzdeliğine (p75)** göre yapılır.`,
})
