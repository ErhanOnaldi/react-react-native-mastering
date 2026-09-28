import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Paylaşılan onay penceresi',
  difficulty: 'zor',
  concepts: ['arch.refactoring', 'pattern.portal', 'a11y.focus'],
  files: ['DialogPages.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'İki ekranda tekrar eden şey nedir? Kod olarak aynı olması gereken parçayı bul.',
    'Bir onay penceresi bileşeni çıkar; açık/kapalı durumunu, başlığını ve onay metnini dışarıdan prop olarak al.',
    'Radix’in Dialog bileşenini kullanırsan Escape’i kendisi kapatır; kapanınca hangi düğmeye odaklanacağını `onCloseAutoFocus` ile sen belirtebilirsin. İki ekran da aynı bileşeni farklı başlık ve metinle çağırsın.',
  ],
  rubric: [
    'Düzenleme ve silme ekranları aynı onay penceresi parçasını kullanır; kopya kod yok.',
    'Esc tuşu her iki ekranda da pencereyi kapatır.',
    'Pencere kapanınca odak, onu açan düğmeye geri döner.',
    'Onay bileşeninin API’si küçük ve anlaşılırdır (başlık, açıklama, onay metni, geri çağırma gibi).',
    'Düzenleme ekranının önceden çalışan davranışı bozulmadan korunmuştur.',
  ],
})
