import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Rol ve erişilebilir ad',
  difficulty: 'kolay',
  concepts: ['test.rtl-queries', 'test.what-to-test'],
  question:
    'Bir bileşen “Kaydedildi” metni içeren bir düğme gösteriyor. Hangi sorgu bu kullanıcıya açık kontrolü en iyi doğrular?',
  options: [
    {
      text: "`screen.getByRole('button', { name: 'Kaydedildi' })`",
      correct: true,
      explanation:
        'Rol ve erişilebilir ad birlikte sınanır; test, kullanıcının bulabildiği düğmeye bağlanır.',
    },
    {
      text: "`container.querySelector('.green-button')`",
      correct: false,
      explanation:
        'Bu sorgu CSS sınıfına bağlanır; düğmenin adı ve erişilebilirliği hakkında bilgi vermez.',
    },
    {
      text: "`screen.getByTestId('saved-control')`",
      correct: false,
      explanation:
        'Test kimliği kullanıcıya açık rol ve adı doğrulamaz; uygun bir anlamsal sorgu varken ilk tercih değildir.',
    },
    {
      text: "`screen.getByText('Kaydedildi')`",
      correct: false,
      explanation:
        'Metni bulabilir, ancak bunun düğme olduğunu doğrulamaz; rol sorgusu daha tam bir sözleşmedir.',
    },
  ],
  explanation:
    'Bileşen testinde DOM’u kullanıcıya açık anlamıyla sorgula. Rol ve ad, arayüzün bulunabilirliğini birlikte korur.',
})
