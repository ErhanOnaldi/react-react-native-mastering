import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tipli isteğin sınırını gör',
  difficulty: 'orta',
  concepts: ['ts.generics', 'ts.async-types', 'ts.api-types', 'fetch.headers-auth'],
  files: ['task.ts'],
  hints: [
    'İsteğin başlığını ve hata yanıtının çağırana nasıl yansıyacağını belirle.',
    '`fetch` için `headers` seçeneğini ve `response.ok` kontrolünü kullan.',
    'Başarıda JSON gövdesini `T` için cast edebilirsin; bu runtime doğrulaması değildir.',
  ],
})
