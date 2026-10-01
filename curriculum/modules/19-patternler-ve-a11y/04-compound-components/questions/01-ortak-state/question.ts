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
      text: 'Her trigger’ın kendi seçili değerini ve panelin görünürlük state’ini.',
      explanation:
        'İki ayrı state kaynağı seçili görünen trigger ile açık panelin ayrışmasına yol açabilir.',
    },
    {
      text: 'Yalnızca seçili trigger’ın id değerini.',
      explanation:
        'Bir id tek başına seçim ve panel görünürlüğü durumunu paylaşmaz; kökün seçili value bilgisi de gerekir.',
    },
    {
      text: 'Panel içeriğinin başlığını, trigger’ların value değerinden bağımsız olarak.',
      explanation:
        'Başlık metni içerik parçasına aittir. Kökte ortak tutulması seçim ile hangi panelin görünmesi gerektiğini çözmez.',
    },
  ],
})
