import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Mesaj anahtarlarını ve parametrelerini tiple',
  difficulty: 'zor',
  concepts: ['i18n.message-catalog', 'ts.generics', 'ts.keyof'],
  files: ['messages.ts'],
  hints: [
    'Dil kataloglarının aynı mesaj kümesini taşımasını ve her mesajın kendi parametre biçimine sahip olmasını sağla.',
    '`keyof`, generic type parameter ve `Parameters` ile parametre tipini seçilen anahtardan türet.',
    'Formatter fonksiyonlarını dil ve anahtar bazında eşleştir; `t<K extends MessageKey>(key: K, params: MessageParams<K>, locale: Locale)` imzası uygun bir başlangıçtır.',
  ],
})
