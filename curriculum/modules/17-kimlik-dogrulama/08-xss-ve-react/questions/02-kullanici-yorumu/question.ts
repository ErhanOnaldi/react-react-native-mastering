import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kullanıcı yorumunu güvenle göster',
  difficulty: 'orta',
  concepts: ['security.xss', 'react.components'],
  files: ['SafeComment.tsx'],
  hints: [
    "Kullanıcıdan gelen HTML etiketlerini çalıştırmamak için `dangerouslySetInnerHTML` yerine React'in doğal JSX metin çıktısını (`{content}`) kullan.",
    'React, `{content}` ile basılan metinleri otomatik olarak kaçışlar; bu sayede `<img onerror>` veya `<script>` etiketleri DOM elementi oluşturmaz, düz metin kalır.',
    'Opsiyonel `websiteUrl` bağlantısını render ederken tehlikeli şemaları (`javascript:`) engelle; yalnızca `http:` ve `https:` protokollerine izin ver.',
  ],
})
