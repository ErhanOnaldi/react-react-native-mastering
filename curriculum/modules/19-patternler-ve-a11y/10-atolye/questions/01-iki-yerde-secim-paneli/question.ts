import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İki yerde seçim paneli',
  difficulty: 'zor',
  concepts: ['arch.refactoring', 'a11y.keyboard', 'pattern.compound'],
  files: ['SelectionPages.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Ana Sayfa’daki seçim panelinin görünümü ile klavye/focus davranışı, Detay sayfasında farklı bir seçenek listesiyle de aynı kalmalı.',
    'Panelin kendisini ayrı bir parça olarak çıkarıp iki sayfada da farklı `value`/`onChange` ile kullanabilirsin.',
    'Her sayfanın seçili değerini `SelectionPages` içinde ayrı state olarak tut; panel yalnızca `label`, `options`, `value`, `onChange` alsın.',
  ],
  rubric: [
    'Seçim paneli tek bir yerde tanımlanır ve iki sayfada da aynı bileşen kullanılır.',
    'Ok tuşları, Home/End ve seçili öğenin tabIndex’i (roving tabindex) iki sayfada da doğru çalışır.',
    'Her sayfanın seçimi kendi yerel state’inde tutulur; bir sayfadaki seçim diğerini etkilemez.',
    'Sayfalar arası geçişte önceki seçim kaybolmaz.',
  ],
})
