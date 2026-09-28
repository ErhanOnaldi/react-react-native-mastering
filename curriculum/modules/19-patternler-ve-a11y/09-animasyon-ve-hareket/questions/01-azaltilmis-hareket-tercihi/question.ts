import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hareket tercihini gözet',
  difficulty: 'kolay',
  concepts: ['motion.reduced-motion'],
  question:
    'Sinema kartları hover olduğunda büyüyor, sayfalar arasında da geçiş animasyonu var. Hareketi azaltma tercihi veren bir kullanıcı için hangi kararlar uygundur?',
  mode: 'multiple',
  options: [
    {
      text: 'Hareketi azaltma tercihini CSS’te `motion-reduce:` ve animasyonun var olmasının isteğe bağlı olduğu yerde `motion-safe:` ile ele al.',
      correct: true,
      explanation:
        'CSS tercihi JavaScript olmadan okunabilir; azaltılmış hareket için animasyonu kapatmak veya sadeleştirmek mümkündür.',
    },
    {
      text: 'JavaScript davranışı gerekiyorsa `matchMedia("(prefers-reduced-motion: reduce)")` ile ilk tercihi oku ve değişimini izle.',
      correct: true,
      explanation:
        'Kullanıcı işletim sistemi tercihini sonradan değiştirebilir; canlı değişim de state’e yansıtılmalıdır.',
    },
    {
      text: 'Hareketi azaltma tercihi yalnızca CSS renklerini etkiler; transform animasyonları her zaman çalışmalıdır.',
      correct: false,
      explanation:
        'Tercih hareket ve animasyonla ilgilidir. Ölçek büyütme ve sayfa geçişi de hareket üretir.',
    },
    {
      text: 'Bütün animasyonları herkeste kaldır; kullanıcı tercihini okumaya gerek yoktur.',
      correct: false,
      explanation:
        'Azaltılmış hareket tercihi olan kullanıcılar için hareketi azalt; diğer kullanıcılara bilinçli tasarlanan hareket sunulabilir.',
    },
  ],
})
