import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Controlled film rafı',
  difficulty: 'zor',
  concepts: ['arch.component-api', 'react.composition', 'react.props', 'react.state'],
  files: ['MovieShelf.tsx'],
  hints: [
    'Açık/kapalı değeri prop olarak geliyor; tıklama bu değeri doğrudan değiştirebilir mi?',
    'Controlled API ve `ReactNode` tipini kullan.',
    'Button tıklanınca `onOpenChange(!open)` çağır; içerik ve `aria-expanded` değerini `open` propundan üret.',
    "Callback sahibine yeni değeri bildirir; sahibin prop'u değişene kadar görünüm aynı kalır.",
  ],
  rubric: [
    'Props tipi `title`, `children`, `open` ve `onOpenChange` sözleşmesini açıkça tanımlar.',
    'Düğmeye basmak `onOpenChange` fonksiyonuna tersine çevrilmiş `open` değerini gönderir.',
    'İçerik ve `aria-expanded` yalnız `open` propunu izler.',
    '`open={false}` kontrollü kapalı durumu olarak ele alınır.',
  ],
})
