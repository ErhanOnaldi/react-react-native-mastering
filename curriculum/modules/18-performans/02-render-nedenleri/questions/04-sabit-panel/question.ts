import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sabit sonuç panelini memo ile koru',
  difficulty: 'orta',
  concepts: ['perf.rerender', 'react.state', 'react.controlled-input'],
  files: ['SearchShell.tsx'],
  hints: [
    'Arama metni değişiyor, sonuç paneline gönderilen callback aynı kalıyor. Bu iki parçanın yeniden çalışmasını ayrı ayrı düşün.',
    'Aynı props alan bir çocuğu parent render dalgasından korumak için `memo` kullanabilirsin.',
    '`ResultsPanel` bileşenini `memo(function ResultsPanel({ onRender }) { ... })` biçiminde tanımla.',
    'Callback yalnızca sonuç paneli render edildiğinde çağrılmalı; `SearchShell` gövdesinde çağırma.',
  ],
})
