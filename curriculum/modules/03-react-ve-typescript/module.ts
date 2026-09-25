import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'React + TypeScript',
  phase: 1,
  summary: 'Sinema için tipli bileşenler kurup statik filmlerde arama ve favori işaretleme yapıyoruz.',
  pain: `Sinema’da bir filmi favoriye ekledin; dizi değiştiği hâlde karttaki işaret aynı kaldı. Üstelik yanlış props alan kart, ancak kullanıcı tıkladığında bozuluyor. Render, state ve tipli bileşen sözleşmesini gerçek ekranda sınayarak bu iki sorunu çözeceğiz.`,
  outcomes: [
    'Render sırasında saf kalan tipli bileşenler yazabilirsin',
    'Props, children ve doğal HTML props tiplerinden güvenli bileşen API’si çıkarabilirsin',
    'State snapshot’ını ve updater fonksiyonunu kullanabilirsin',
    'Nesne ve dizileri immutable biçimde güncelleyebilirsin',
    'Event, liste key’i ve koşullu görünümü doğru kullanabilirsin',
    'Controlled arama alanını ve favorileri ortak üst bileşende yönetebilirsin',
  ],
})
