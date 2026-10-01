import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Navigasyon aracını seç',
  difficulty: 'orta',
  concepts: ['router.navigation', 'a11y.basics'],
  question: `Sinema'daki üç eylem için uygun yaklaşım hangisi?

1. Menüden önceden belli /favorites adresini aç.
2. Kayıt başarılı olunca uygulama kodu /movie/550 adresine geçsin.
3. Film detayından önceki filtreli arama adresine dön.`,
  options: [
    {
      text: '1: `Link`; 2: `useNavigate`; 3: `navigate(-1)`.',
      correct: true,
      explanation:
        'Bilinen adres kullanıcıya link olur, işlem sonucu kod geçiş yapar, geçmişe dönüş önceki entry’yi seçer.',
    },
    {
      text: '1: `useNavigate`; 2: `Link`; 3: `navigate("/search")`.',
      explanation:
        'Sabit linki programatik yapmak link davranışlarını kaybettirir; işlem sonucu bir Link sunamaz ve sabit arama yolu filtreleri korumaz.',
    },
    {
      text: 'Üçü için de `setPage` kullan; Router adresi ekrandan bulur.',
      explanation: 'Yerel state güncellemesi adresi değiştirmez; Router ekrandan URL üretmez.',
    },
  ],
})
