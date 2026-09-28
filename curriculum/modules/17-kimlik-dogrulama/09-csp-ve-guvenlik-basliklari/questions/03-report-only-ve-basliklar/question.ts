import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Report-Only ve güvenlik başlıkları',
  difficulty: 'orta',
  concepts: ['security.csp'],
  question:
    'Üretim ortamına yeni bir CSP politikası geçirmeden önce mevcut çalışan özellikleri bozmadan ihlalleri izlemek ve dev sunucusundaki HMR gibi satır içi yapıları engellememek için hangi yaklaşım uygundur?',
  options: [
    {
      text: 'İlk aşamada `Content-Security-Policy-Report-Only` başlığıyla ihlalleri raporlamak; geliştirme ortamında HMR satır içi betiklere ihtiyaç duyduğundan sıkı politikayı üretim dağıtımında (host seviyesinde) zorunlu kılmak.',
      correct: true,
      explanation:
        '`Report-Only` modu ihlalleri engellemez, yalnızca konsola veya raporlama uç noktasına bildirir; böylece hatalı kural yüzünden sayfanın bozulması önlenir. Vite dev sunucusu sıcak modül yenileme (HMR) için satır içi stiller/scriptler kullanabildiğinden katı CSP genellikle prodüksiyonda sunucu başlığı olarak verilir.',
    },
    {
      text: "Geliştirme ortamında `Content-Security-Policy: default-src 'none'` koyarak tüm Vite araçlarını engellemek.",
      correct: false,
      explanation:
        'Bu ayar geliştirme sunucusunun HMR bağlantısını ve stil enjeksiyonunu tamamen kırarak yerel geliştirmeyi imkansız kılar.',
    },
    {
      text: '`Report-Only` başlığını üretimde kalıcı savunma mekanizması olarak kullanmak.',
      correct: false,
      explanation:
        'Report-Only hiçbir saldırıyı engellemez, yalnızca raporlar; bu nedenle gerçek bir koruma sağlamaz.',
    },
  ],
})
