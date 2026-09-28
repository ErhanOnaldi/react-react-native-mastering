import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Etkileşim testinin sırası',
  difficulty: 'kolay',
  concepts: ['test.aaa', 'test.user-event', 'test.matchers'],
  question:
    'Bir “Notları aç” düğmesine tıklanınca `aria-expanded` değeri `true` oluyor ve açıklama görünür hale geliyor. Kullanıcı davranışını izleyen test akışında doğru sıra hangisidir?',
  options: [
    {
      text: 'Kullanıcıyı kur → bileşeni render et → düğmeye tıkla → DOM’daki durumu ve açıklamayı doğrula',
      correct: true,
      explanation:
        'Önce etkileşim ortamı ve başlangıç arayüzü hazırlanır, sonra kullanıcı davranışı gerçekleşir, en son sonuç doğrulanır.',
    },
    {
      text: 'DOM’u doğrula → düğmeye tıkla → bileşeni render et → kullanıcıyı kur',
      correct: false,
      explanation:
        'Arayüz render edilmeden sorgulanamaz; ayrıca kullanıcı etkileşimi başlangıç ortamı kurulmadan önce yapılamaz.',
    },
    {
      text: 'Bileşenin state değerini doğrudan `true` yap → testte click çağır → sonucu doğrula',
      correct: false,
      explanation:
        'Bu akış kullanıcının yaptığı eylemi atlar ve uygulama ayrıntısına bağlanır; etkileşimi DOM üzerinden gerçekleştir.',
    },
    {
      text: 'Bileşeni render et → beklenen son state’i önceden ata → DOM yerine CSS sınıfını doğrula',
      correct: false,
      explanation:
        'Beklenen state’i elle atamak kullanıcı davranışını denemez; CSS sınıfı da görünür arayüz sözleşmesi değildir.',
    },
  ],
  explanation:
    'Bir etkileşim testi Arrange → Act → Assert sırasını izler: ortamı hazırla, kullanıcı eylemini uygula, DOM’daki sonucu doğrula.',
})
