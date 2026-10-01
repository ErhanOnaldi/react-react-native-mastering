import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Render prop mı, HOC mu?',
  difficulty: 'orta',
  concepts: ['pattern.render-props-hoc', 'react.custom-hooks'],
  question: `Eski bir bileşen \`SessionData\`, oturum bilgisini iki şekilde sunuyor:

- \`withSession(Page)\` bileşenin etrafına oturum davranışı ekliyor.
- \`<SessionData render={(session) => ...} />\` oturum bilgisini senin verdiğin fonksiyona geçiriyor.

İki sayfa da aynı oturum bilgisini kullanacak, ama her sayfanın HTML düzeni farklı kalmalı. Bu iki eski API'den hangisi düzeni doğrudan çağıran sayfaya bırakır?`,
  options: [
    {
      text: 'Render prop; çağıran sayfa `render` fonksiyonunun içinde kendi görünümünü yazar.',
      correct: true,
      explanation:
        'Render prop veri veya davranışı callback ile verir; çağıran taraf JSX düzenini kendisi kurar. HOC ise component’i başka bir component ile sarar.',
    },
    {
      text: 'HOC; `withSession` içine verilen JSX ağacını her sayfanın düzenine göre değiştirir.',
      explanation:
        'HOC bir component alıp sarmalanmış component döndürür; JSX düzenini otomatik olarak çağıranın içine taşımaz.',
    },
    {
      text: 'İkisi de aynı HTML düzenini zorunlu kılar, bu yüzden yalnızca CSS ile ayrılırlar.',
      explanation:
        'Render prop callback’i çağırana kendi JSX’ini yazdırır. HOC da her zaman tek bir HTML düzeni dayatmaz; bu senaryoda render prop düzeni doğrudan görünür kılar.',
    },
    {
      text: 'HOC ve render prop yalnızca global state’i günceller; görünüm için custom hook gerekir.',
      explanation:
        'Her iki pattern de veriyi component’lere sunabilir; global state zorunlu değildir. Custom hook bugün yaygın bir başka seçenektir.',
    },
  ],
})
