## Neden böyle?
Seçim tek bir yerde (kökte) durduğu için iki panelin aynı anda açık kalması ya da seçili görünen sekmeyle açık panelin ayrışması mümkün değil. Context, `active`/`onChange` prop zincirini ortadan kaldırır; kullanan kişi yalnızca `value` eşleştirir.

`useTabs()` yardımcı hook'u iki iş yapar: Context'i okur ve provider yoksa **anlaşılır** bir hata fırlatır. `useContext(Context)!` ile geçiştirseydin hata, tıklama anında "cannot read properties of null" olarak, yanlış yerde patlardı.

`Object.assign(Root, { List, Trigger, Panel })` kökü bir fonksiyon bileşeni olarak bırakır ve parçaları onun statik alanları yapar; `Tabs.Trigger` yazımı buradan gelir.

### Alternatif ve sınır
- Parçaları ayrı ayrı export etmek (`TabsList`, `TabsTrigger`…) de yaygındır; shadcn/ui bu yolu seçer. Nokta yazımı ile düz export arasında davranış farkı yoktur, yalnızca API zevki ve tree-shaking tercihidir.
- Projede ESLint'in `react-refresh/only-export-components` kuralı `Object.assign(...)` sonucunu bileşen olarak tanımaz ve Fast Refresh uyarısı verir. Aynı API'yi `export function Tabs(…) {…}` ve altına `Tabs.List = TabsList` yazarak kurabilirsin; TypeScript bu "expando" atamaları tipe ekler, lint de temiz kalır.
- Seçili olmayan paneli DOM'dan çıkardık. Panel içeriğinin state'ini (örn. oynayan bir video) korumak istersen `hidden` ile gizlemek gerekir; sonraki soruda bu yolu göreceksin.

### Sık hata
Bu ilk basamakta yön tuşları ve `aria-controls`/`aria-labelledby` bağları yok. Bileşeni bu haliyle "erişilebilir Tabs" diye yayınlama; sonraki soru onları ekliyor.
