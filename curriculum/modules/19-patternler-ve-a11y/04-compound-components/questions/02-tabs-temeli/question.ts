import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Tabs parçalarını Context ile bağla',
  difficulty: 'orta',
  concepts: ['pattern.compound', 'react.context', 'a11y.basics'],
  files: ['Tabs.tsx'],
  hints: [
    'Seçili sekme ile görünür panelin tek bir kaynaktan güncellenmesini sağla; alt parça kökün dışında kalırsa ne olacağını da belirle.',
    '`createContext`, `useContext`, `useState` ve statik component alanlarıyla compound API kurmayı düşün.',
    'Kökte seçimi sakla; her Trigger ve Panel kendi `value` değerini kökteki değerle karşılaştırsın. Provider yoksa hook bir hata fırlatsın.',
  ],
  preview: { entry: 'Preview.tsx' },
})
