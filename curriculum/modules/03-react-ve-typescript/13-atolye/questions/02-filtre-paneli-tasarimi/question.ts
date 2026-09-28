import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Filtre panelinin API’sini seç',
  difficulty: 'zor',
  concepts: ['react.composition', 'react.props', 'react.controlled-input'],
  files: ['MovieBrowser.tsx'],
  hints: [
    'Filtreyi kullanan ekranın hangi bilgiyi kontrol etmesi gerektiğini düşün.',
    'Tek `mode` prop’u basit bir panel sağlar; ayrı parçalar daha esnek yerleşim sağlar. İkisi de arama değerini üst bileşene bildirebilir.',
    'Seçtiğin API’yi yorumda gerekçelendir; etiketli controlled input’un değeriyle başlıkları filtrele.',
  ],
  preview: { entry: 'Preview.tsx' },
  rubric: [
    'Kod yorumunda seçilen API ve diğer seçeneğe göre somut bir ödünleşim açıklanıyor.',
    'Filtre denetiminin etiketi ve görünür değeri kullanıcı için açık.',
    'Filtreleme sorumluluğu tek yerde; aynı başlık karşılaştırması birden çok bileşene kopyalanmıyor.',
    'Panel başka bir film listesiyle yeniden kullanılabilecek şekilde belirli başlıklara gömülmüyor.',
    'Boş arama ve temizleme akışı tutarlı; kullanıcı tüm filmlere dönebiliyor.',
  ],
})
