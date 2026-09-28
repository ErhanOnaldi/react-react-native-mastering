import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama state’ini daralt',
  difficulty: 'orta',
  concepts: ['perf.rerender', 'react.state', 'react.controlled-input'],
  files: ['SearchShell.tsx'],
  hints: [
    'State değişikliğinin bileşen ağacında hangi alt parçayı etkilediğini ve hangi parçanın değişmeyen veriyle kaldığını düşün.',
    'Üst bileşen render olduğunda çocuklarının da varsayılan olarak yeniden çalışmasını engellemek için bileşeni `memo` ile sarmalayabilirsin.',
    'Sabit sonuçları ayrı bir alt bileşene çıkar: `const Results = memo(function Results({ onRender }) { ... })`. `SearchShell` içinde `<Results onRender={onResultsRender} />` olarak çağır.',
    '`onResultsRender` çağrısını doğrudan `SearchShell` gövdesinde bırakırsan, her tuş basışında üst bileşen render olduğu için callback yine gereksiz yere çalışır.',
  ],
})
