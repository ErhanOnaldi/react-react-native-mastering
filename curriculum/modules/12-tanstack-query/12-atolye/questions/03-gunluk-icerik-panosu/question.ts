import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  project: 'atolye',
  title: 'Günlük içerik panosu',
  difficulty: 'zor',
  concepts: ['arch.feature-folders', 'arch.api-client', 'query.useQuery'],
  reviewFiles: ['src/gunluk-icerik-panosu/**'],
  hints: [
    'Gönderi ve yazar farklı kaynaklar; ekranın hangi veriye ne zaman ihtiyaç duyduğunu belirle.',
    'Kimlikleriyle eşleştir; dönüşte aynı veriyi gereksiz yere yeniden istememeyi düşün.',
    'DummyJSON /posts ve /users verilerini ayrı isteklerle al; detayda gönderinin userId değeriyle yazar bilgisini bağla.',
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
