import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'CSF dosyasındaki durumları oku',
  difficulty: 'kolay',
  concepts: ['shadcn.storybook', 'arch.component-api'],
  question: `Bir bildirim bileşeninin story dosyası şöyle başlıyor:

\`\`\`tsx
const meta = {
  component: Notice,
  args: { title: 'Plan kaydedildi' },
  argTypes: { tone: { control: 'select', options: ['positive', 'warning'] } },
} satisfies Meta<typeof Notice>

export default meta
type Story = StoryObj<typeof meta>

export const Warning: Story = { args: { tone: 'warning' } }
\`\`\`

Bu dosyada \`Warning\` named export'u neyi temsil eder?`,
  options: [
    {
      text: 'Varsayılan başlığı koruyup `tone` değerini `warning` yapan bir bileşen örneğini.',
      correct: true,
      explanation:
        'Doğru. Story args, meta args ile birleşerek bileşeni belirli bir durumda gösterir.',
    },
    {
      text: 'Uygulamanın runtime tema ayarını kalıcı olarak warning yapan bir ayarı.',
      explanation:
        'Story, uygulamanın tema deposunu değiştirmez; katalogdaki izole başlangıç durumunu tanımlar.',
    },
    {
      text: "Bileşenin `tone` prop'una çalışma zamanında yeni bir tip ekleyen deklarasyonu.",
      explanation:
        'Prop tipi component kaynak kodundadır; story yalnız mevcut seçeneklerden birini kullanır.',
    },
  ],
})
