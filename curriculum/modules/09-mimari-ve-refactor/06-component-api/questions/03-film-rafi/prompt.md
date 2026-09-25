Ana sayfada raf kendi kendine açılıp kapanıyor; favoriler ekranında açık durumunu sayfa yönetmek istiyor. İçerik de her sayfada farklı.

## İstenen

`MovieShelf` props: `title`, `children`, isteğe bağlı `open`, `defaultOpen`, `onOpenChange`.

- `<section>` içinde başlığı bir `<button>` olarak göster.
- Açıkken `children` içeriğini göster; kapalıyken gizle.
- `open` verilirse controlled: dış değer görünümü belirler, tıklama sadece `onOpenChange` çağırır.
- `open` verilmezse uncontrolled: iç state `defaultOpen ?? false` ile başlar, tıklama iç state’i ve callback’i günceller.
- `aria-expanded` gerçek açık durumu yansıtsın.

`children` sayesinde rafın içeriği film listesi, açıklama veya başka bir bileşen olabilir.
