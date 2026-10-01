import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Yenilemede kalıcılık',
  difficulty: 'orta',
  concepts: ['auth.token-storage'],
  question:
    'Sinema token’ı `localStorage` içine yazdı. Aynı sekmede F5 yapınca `localStorage` ve Redux store için hangisi beklenir?',
  options: [
    {
      text: '`localStorage` kaydı kalır; Redux store yeniden başlatıldığı için bellekteki eski state kaybolur.',
      correct: true,
      explanation:
        '`localStorage` sayfa yenilemeleri arasında kalır; Redux store bellekte yeniden kurulur ve token’ı kendiliğinden geri almaz.',
    },
    {
      text: 'İkisi de F5 sonrasında korunur; Redux state’i tarayıcı depolamasına otomatik kopyalar.',
      explanation:
        'Redux kendi başına kalıcılık sağlamaz; depolamadaki değeri geri okumak için uygulama kodu gerekir.',
    },
    {
      text: 'İkisi de sıfırlanır; tarayıcı yenilenince yerel veriler temizlenir.',
      explanation:
        '`localStorage` yenilemeler arasında kalıcıdır; geçici state ile aynı ömre sahip değildir.',
    },
  ],
})
