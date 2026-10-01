import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Paylaşılan onay penceresi',
  difficulty: 'zor',
  concepts: ['arch.refactoring', 'pattern.portal', 'a11y.focus'],
  files: ['DialogPages.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'İki ekranda hangi görünüm ve etkileşim aynı kalmalı, hangisi kayda göre değişmeli?',
    "Ortak onay görünümünü tek bir bileşene çıkar; focus dönüşü için Radix Dialog'un `onCloseAutoFocus` olayını kullanabilirsin.",
    'Bileşene başlık, açıklama, onay etiketi, callback ve odağın döneceği elementi prop olarak ver; her ekran kendi açılma durumunu tutsun.',
    "Escape ile kapanmayı ve onayla silmeyi ayrı dene; aynı `Sil` tetikleyicisini yeniden açarken focus ref'ini güncelle.",
  ],
  rubric: [
    'Düzenleme ve silme ekranları aynı onay penceresi parçasını kullanır; kopya kod yok.',
    'Esc tuşu her iki ekranda da pencereyi kapatır.',
    'Pencere kapanınca odak, onu açan düğmeye geri döner.',
    'Onay bileşeninin API’si küçük ve anlaşılırdır (başlık, açıklama, onay metni, geri çağırma gibi).',
    'Düzenleme ekranının önceden çalışan davranışı bozulmadan korunmuştur.',
  ],
})
