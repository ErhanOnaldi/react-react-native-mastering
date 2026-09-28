import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Geçişin maliyetini ve yerini seç',
  difficulty: 'orta',
  concepts: ['motion.view-transition', 'motion.reduced-motion'],
  question:
    'Bir panel görünürken genişliyor ve sayfa içeriği yenilenince iki durum arasında geçiş yapıyor. Uygun teknik kararları seç.',
  mode: 'multiple',
  options: [
    {
      text: '`opacity` ve `transform` genellikle layout hesabı gerektirmeyen daha ucuz animasyonlardır.',
      correct: true,
      explanation:
        'Bu özellikler çoğunlukla compositing katmanında işlenebilir; yine de gerçek cihazda ölçmek gerekir.',
    },
    {
      text: '`width` ve `top` animasyonu layout hesaplarını tetikleyebilir; sık karelerde daha pahalı olabilir.',
      correct: true,
      explanation: 'Geometriyi değiştiren özellikler tarayıcıyı layout ve paint işine sokabilir.',
    },
    {
      text: 'React 19.3’te `ViewTransition` geçişleri her state güncellemesinde otomatik çalışır.',
      correct: false,
      explanation:
        'React ViewTransition, geçiş olarak işaretlenmiş güncellemelerle çalışır; sıradan güncellemeleri canlandırmaz.',
    },
    {
      text: 'Tarayıcı View Transitions API desteklemiyorsa arayüz güncellemesini durdurmak gerekir.',
      correct: false,
      explanation:
        'Animasyon desteklenmese de işlev sürmelidir; DOM/state güncellemesi doğrudan uygulanabilir.',
    },
    {
      text: 'Hareketi azaltma tercihi olan kullanıcıya sayfa geçişinde de animasyonsuz ya da sadeleştirilmiş yol sunulmalıdır.',
      correct: true,
      explanation: 'Tercih yalnızca hover süsüne değil, bütün anlamlı hareketlere uygulanmalıdır.',
    },
  ],
})
