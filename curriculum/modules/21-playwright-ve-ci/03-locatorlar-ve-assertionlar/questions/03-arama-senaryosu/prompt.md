## Bağlam

Dersin başındaki “bazen geçen, bazen kalan” arama testini bu sefer doğru yazacaksın. Arama sayfasında iki gecikme var: kutunun **350 ms debounce**’u ve TMDB’nin cevap süresi. Sabit bekleme (`waitForTimeout`) ile yazılan test yavaş makinede kalır; beklemeyi web-first assertion’lara bırakan test her hızda geçer.

Kullanıcı gerçekçi davranıyor: önce bir şey arıyor, sonra fikrini değiştiriyor. Bu, “eski sonuçlar listede kaldı” hatasını görmenin tek yolu.

## Görev

`searchScenario(page)` şu adımları izlesin:

1. `/search` sayfasını aç.
2. **“Film ara”** kutusuna `matrix` yaz ve **2 sonuç** geldiğini doğrula.
3. Kutuya `başlangıç` yaz (eski metnin yerine) ve şunları doğrula:
   - URL’de `q` parametresi `başlangıç` (Modül 6: URL = state),
   - **“Başlangıç”** bağlantısı görünüyor,
   - sonuç listesinde **tam 1** madde var,
   - **“Aranıyor…”** yazısı ekranda değil.

Sayfanın ilgili parçaları (`sinema-app.ts` → `searchPage`):

| Parça | Rol / ad |
| --- | --- |
| Arama kutusu | `searchbox`, adı “Film ara” (etiketi de “Film ara”) |
| Sonuç bölgesi | `region`, adı “Arama sonuçları” |
| Her sonuç | bölgedeki `listitem`; içinde film adıyla bir `link` |
| Yükleniyor | “Aranıyor…” metni (`role="status"`) |

## Senaryon neyle sınanacak?

| Uygulama | Senaryon ne yapmalı? |
| --- | --- |
| Çalışan Sinema | Hatasız bitmeli |
| Arama cevabı 1,5 sn geciken Sinema | Hatasız bitmeli |
| Yeni aramada eski sonuçları bırakan sürüm | **Hata fırlatmalı** |
| Aramayı URL’ye yazmayan sürüm | **Hata fırlatmalı** |
| “Aranıyor…” yazısı hiç kalkmayan sürüm | **Hata fırlatmalı** |
| TMDB 401 dönen sürüm (sonuç yok) | **Hata fırlatmalı** |
