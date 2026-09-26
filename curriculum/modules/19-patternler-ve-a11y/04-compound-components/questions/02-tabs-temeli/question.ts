import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Tabs parçalarını Context ile bağla',
  difficulty: 'orta',
  concepts: ['pattern.compound', 'react.context', 'a11y.basics'],
  files: ['Tabs.tsx'],
  hints: [
    'Kökte useState(defaultValue) ve Context kur.',
    'Trigger seçili value ile kendi value değerini karşılaştırsın; Panel de aynı karşılaştırmayla gizlensin.',
    'Statik alt parçaları Object.assign(TabsRoot,{ List, Trigger, Panel }) ile dışa açabilirsin.',
  ],
  preview: { entry: 'Preview.tsx' },
})
