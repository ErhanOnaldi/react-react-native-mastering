import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Eski film neden kaldı?',
  difficulty: 'kolay',
  concepts: ['react.useEffect.deps', 'react.props'],
  question:
    '`useEffect(..., [])` içinde `id` okunuyor. Prop 550’den 27205’e değiştiğinde neden başlık eski?',
  options: [
    {
      text: 'Effect yeniden çalışmaz; `id` dependency olmalı.',
      correct: true,
      explanation: 'Dış sistemle senkron tutulan id değişti, effect yeniden başlamalı.',
    },
    {
      text: 'React props değişimini algılamaz.',
      explanation: 'Props değişir ve render olur; effect’in bağımlılığı ayrı konudur.',
    },
    {
      text: '`setState` asenkron olduğu için hep bir film geridedir.',
      explanation: 'Bu kalıcı eski başlığın sebebi eksik dependency’dir.',
    },
  ],
})
