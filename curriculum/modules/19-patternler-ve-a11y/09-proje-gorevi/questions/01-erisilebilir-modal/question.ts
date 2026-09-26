import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema için erişilebilir Modal',
  difficulty: 'zor',
  concepts: [
    'pattern.compound',
    'pattern.headless',
    'pattern.portal',
    'pattern.slot',
    'a11y.keyboard',
    'a11y.focus',
    'react.context',
    'react.useEffectEvent',
  ],
  project: 'sinema',
  focusFiles: [
    'src/shared/ui/modal/Modal.tsx',
    'src/shared/ui/modal/useDisclosure.ts',
    'src/pages/MovieDetailsPage.tsx',
  ],
  reviewFiles: ['src/shared/ui/modal/*.ts', 'src/shared/ui/modal/*.tsx', 'src/pages/MovieDetailsPage.tsx'],
  hints: [
    'Önce `useDisclosure`’ı (8. ders alıştırması) projeye taşı. `Modal` kökü onu çağırsın ve `{ isOpen, open, close, triggerRef, titleId }` gibi değerleri Context’e koysun; parçalar `useModal()` ile okusun, provider yoksa hata fırlatsın.',
    '`Modal.Content`: açık değilse `null`; açıksa `createPortal(<div role="dialog" …>, document.body)`. Focus trap için tuş anında `dialog.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex=\\"-1\\"])")` listesini `:disabled` olmayanlarla filtrele; ilk ve son öğeye göre Tab’ı çevir.',
    'Trigger `asChild` için `cloneElement(child, { onClick: (e) => { child.props.onClick?.(e); if (!e.defaultPrevented) open() }, ref: birleşikRef })` (6. ders). Effect’i `[isOpen]`’a bağla, `close`’u `useEffectEvent` ile ya da kararlı referansla çağır; cleanup’ta açan öğeye `focus()` ver.',
  ],
  rubric: [
    'Modal bir compound API: durum tek yerde (useDisclosure), parçalar Context ile bağlı; parçalar Modal dışında kullanılırsa anlaşılır hata veriyor.',
    'Focus trap sabit ref’lere değil o anki içeriğe bakıyor; disabled kontrolleri atlıyor ve Shift+Tab yönünü kapsıyor. Keydown dinleyicisi yalnızca modal açıkken kurulu ve cleanup’ta kaldırılıyor.',
    'Trigger asChild iç içe button üretmiyor; child’ın handler ve ref’i korunuyor.',
    'MovieDetailsPage fragmanı gerçek TMDB videos verisinden seçiyor; video yoksa düğme yok; Suspense/Query akışı bozulmamış.',
  ],
})
