import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Tabs parçalarını bağla',
  difficulty: 'orta',
  concepts: ['pattern.compound', 'react.context'],
  question: 'Tabs.Trigger ve Tabs.Panel hangi bilgiyi ortak kullanmalı?',
  options: [
    {
      text: 'Kökteki seçili value ve trigger/panel kimlik eşlemesini.',
      correct: true,
      explanation:
        'Doğru. Context ortak seçimi ve ilişkili id’leri taşır; parçalar value ile eşleşir.',
    },
    {
      text: 'Her panelin kendi ayrı useState değerini.',
      explanation: 'Ayrı state’ler birden fazla paneli aynı anda açık bırakabilir.',
    },
    {
      text: 'Yalnızca CSS class adlarını.',
      explanation: 'Görünüm, klavye ve aria-selected tutarlılığını tek başına sağlayamaz.',
    },
    {
      text: 'TMDB tokenını.',
      explanation: 'Sekme seçimi client UI state’idir; ağ yetkilendirmesiyle ilgisi yok.',
    },
  ],
})
