## Neden böyle?

`SelectionGroup`, hangi sayfada olduğunu bilmez; yalnızca `label`, `options`, `value`, `onChange` alır. Bu yüzden Detay sayfası da onu farklı bir seçenek listesiyle çağırabilir — kopyalanmış bir klavye/focus mantığı değil, aynı mantığın ikinci kullanımı. Roving tabindex (seçili öğe `tabIndex=0`, diğerleri `-1`) ve ok tuşu yönetimi tek yerde yaşadığı için bir gün üçüncü bir kullanım gerekirse (örn. bir modal içinde) aynı parçayı üçüncü kez çağırman yeterli.

Her sayfanın seçimi `SelectionPages` bileşeninde ayrı `useState` ile tutuluyor; `SelectionGroup`'un kendi state'i yok. Bu yüzden sayfa değiştirmek (koşullu render ile `SelectionGroup`'un o anki örneğini unmount etmek) diğer sayfanın seçimini SİLMEZ — değer zaten üst bileşende yaşıyor, `SelectionGroup` yeniden mount olduğunda ona `value` prop'uyla geri veriliyor.

**Alternatif yaklaşım:** `SelectionGroup`'u `React.memo` ile sarabilirsin (davranışı değiştirmez, gereksiz render'ı azaltır); ya da compound bir API'ye taşıyıp `<Selection.Root><Selection.Option/></Selection.Root>` şeklinde açabilirsin — 04. derste göreceğin `Tabs` compound deseninin aynısı, farklı bir role sözleşmesiyle (`radiogroup`/`radio` yerine `tablist`/`tab`).

**Tuzaklar:** Ref map'i `useRef(new Map())` yerine düz obje kullanmak burada sorun değil çünkü component her render'da aynı obje referansını tutuyor (ref, render'lar arası kalıcı); ama option listesi tamamen değişkense (örn. filtrelenip elemanlar kayboluyorsa) eski elemanlara ait referansları temizlemeyi unutma.

**Köprü:** Bir sonraki görevde (`ChoiceControl`) bu kez aynı klavye mekaniğini, dışarıdan kontrol edilen bir değer ve erişilebilir bir hata mesajı sözleşmesiyle birleştireceksin.
