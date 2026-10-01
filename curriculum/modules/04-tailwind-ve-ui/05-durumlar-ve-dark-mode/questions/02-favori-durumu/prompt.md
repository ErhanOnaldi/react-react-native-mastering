Favori düğmesinin seçili durumu anlaşılmıyor ve klavyeyle odaklandığında işaret görünmüyor. Durumu erişilebilir biçimde bildir; fare, klavye odağı, devre dışı olma ve koyu tema için görünüm sağla.

## Gereksinimler
- Gerçek button kullanılsın ve `type="button"` olsun.
- Button class'ları `rounded-lg bg-sky-700 px-3 py-2 text-white` temel görünümünü taşısın.
- Seçili durum `aria-pressed` ile aktarılsın.
- Erişilebilir ad seçili değilken `Favoriye ekle`, seçiliyken `Favorilerden çıkar` olsun.
- `disabled` ve `onClick` native button'a aktarılsın.
- Class listesinde `hover:bg-sky-800`, `focus-visible:outline-2 focus-visible:outline-sky-500`, `disabled:opacity-50` ve `dark:bg-sky-500` bulunsun.

## Örnek
`active=true` iken düğmenin adı `Favorilerden çıkar`, basılı durumu true olur. Disabled düğme tıklanmaz.

## Sözleşme
- Dosya ve export: `FavoriteButton.tsx` → `FavoriteButton({ active, disabled, onClick })`.
- Önizlemede aktif/pasif ve devre dışı durumları görürsün.
