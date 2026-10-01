import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Reset yeni başlangıç mı?',
  difficulty: 'orta',
  concepts: ['form.rhf-form-state', 'form.rhf-reset'],
  question: [
    "Formun başlangıcı `{ name: 'Akşam' }`.",
    '',
    "Kullanıcı adı `'Gece'` yapıp formu gönderiyor. Sunucu `{ name: 'Gece' }` ile başarılı dönüyor ve callback içinde `reset(savedValues)` çağrılıyor. Sonra `isDirty` hangi değeri alır?",
  ].join('\n'),
  options: [
    {
      text: '`false`; `Gece` yeni başlangıç değeri olur.',
      correct: true,
      explanation:
        '`reset(savedValues)` hem alanları hem dirty karşılaştırmasının başlangıç noktasını günceller.',
    },
    {
      text: '`true`; kullanıcı bir kez değiştirdiği için form daima kirli kalır.',
      correct: false,
      explanation:
        '`isDirty` geçmişte değişiklik olup olmadığını değil, şimdiki değerin başlangıçtan farklı olup olmadığını gösterir.',
    },
    {
      text: '`false`; ama input `Akşam` değerine döner.',
      correct: false,
      explanation:
        '`reset(savedValues)` aldığı değerleri uygular; parametresiz `reset()` ilk başlangıç değerlerine döner.',
    },
    {
      text: '`undefined`; reset sonrası formState kullanılamaz.',
      correct: false,
      explanation: '`reset` formState’i kapatmaz; form yeni değerleriyle çalışmaya devam eder.',
    },
  ],
})
