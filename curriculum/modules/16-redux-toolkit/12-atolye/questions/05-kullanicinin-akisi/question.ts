import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  project: 'atolye',
  title: 'Kullanıcının akışı',
  difficulty: 'zor',
  concepts: ['arch.api-client', 'arch.feature-folders', 'router.params'],
  reviewFiles: ['src/kullanicinin-akisi/**'],
  hints: [
    'Kullanıcı, gönderi ve yorum üç ayrı kaynak; hangi ekranın hangi kimliğe ihtiyaç duyduğunu netleştir.',
    'Bir kullanıcı seçildiğinde onun gönderilerini, bir gönderi açıldığında o gönderinin yorumlarını ayrı isteklerle al; kimlikleri URL’de taşı.',
    'DummyJSON `/users`, bir kullanıcının gönderileri için `/posts/user/:id`, bir gönderinin yorumları için `/comments/post/:id` kaynaklarını kullan; boş sonuçta erişilebilir bir "içerik yok" mesajı göster.',
  ],
  rubric: [
    'Gerçek DummyJSON kullanıcıları listelenir.',
    'Seçilen kullanıcının gönderileri doğru şekilde gösterilir.',
    'Seçilen gönderinin yorumları doğru şekilde gösterilir.',
    'Kullanıcı ve gönderi seçimi URL üzerinden gezinilebilir.',
    'Üç kaynağın yükleme ve hata durumları ayrı ayrı ve anlaşılır gösterilir.',
    'Gönderisi veya yorumu olmayan bir kullanıcı/gönderi için erişilebilir bir boş durum mesajı vardır.',
  ],
})
