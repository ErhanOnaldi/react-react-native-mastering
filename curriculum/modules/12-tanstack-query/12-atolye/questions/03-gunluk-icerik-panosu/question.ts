import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  project: 'atolye',
  title: 'Günlük içerik panosu',
  difficulty: 'zor',
  concepts: ['arch.feature-folders', 'arch.api-client', 'query.useQuery'],
  reviewFiles: ['src/gunluk-icerik-panosu/**'],
  hints: [
    'Önce gönderi, arama, detay ve yazar görünümü için gereken veri akışını çiz.',
    'DummyJSON `/posts` ile `/users` kaynaklarını ayrı `useQuery` okumaları ve anlaşılır durum dallarıyla al.',
    'Detayda `post.userId` ile yazarı bul; dönüşte aynı arama key’ini kullan.',
  ],
  rubric: [
    'Gerçek DummyJSON gönderileri listelenir ve arama sonuçları güncellenir.',
    'Gönderi detayında doğru yazarın adı gerçek kullanıcı verisiyle eşleşir.',
    'Detaydan listeye dönüş seçilen aramayı korur.',
    'Gönderi ve yazar verisinin yükleme, boş ve hata durumları ayrı ayrı anlaşılırdır.',
    'Pano uygulama içinden açılabilir bir girişe sahiptir.',
    'API erişimi ile ekran işaretlemesi anlaşılır sorumluluklara ayrılmıştır.',
  ],
})
