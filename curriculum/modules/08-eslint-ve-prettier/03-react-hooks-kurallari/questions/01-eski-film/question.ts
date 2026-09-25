import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Eski film neden kaldı?',
  difficulty: 'kolay',
  concepts: ['react.useEffect.deps', 'router.params', 'tooling.eslint'],
  question:
    '`useEffect` içinde `id` kullanılıyor ama dependency array `[]`. `/movie/550` → `/movie/155` geçişinde doğru adım nedir?',
  options: [
    {
      text: 'Effect’in bağımlılığına `id` ekleyip eski isteği cleanup ile iptal etmek.',
      correct: true,
      explanation: '`id` değişince yeni istek gerekir; cleanup yarışan eski yanıtı engeller.',
    },
    {
      text: '`id`’yi dependency array’den silmek.',
      explanation: 'Zaten yok; boş array effect’i yeni route parametresi için yeniden çalıştırmaz.',
    },
    {
      text: 'Bileşeni her render’da `fetch` çağıracak şekilde değiştirmek.',
      explanation: 'Render yan etkisi gereksiz tekrar isteklere yol açar.',
    },
    {
      text: 'Sadece Prettier çalıştırmak.',
      explanation: 'Prettier kod biçimini düzeltir, effect bağımlılığını analiz etmez.',
    },
  ],
  explanation: '',
})
