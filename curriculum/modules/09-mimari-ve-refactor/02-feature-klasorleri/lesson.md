---
title: "Dosyaları özelliğin yanına koy"
minutes: 16
kind: concept
---

# Dosyaları özelliğin yanına koy

Sinema uygulamasında yalnızca arama ekranının kullandığı `SearchBox` olsun. Bu dosyayı `features/search/` içine koyarsan, aramayla ilgili bir değişiklikte önce bakacağın yer bellidir. **Feature**, kullanıcının gördüğü bir iş alanıdır; örneğin arama, filmler veya favoriler. Bir klasör, kodun kime ait olduğunu ve hangi kodun onunla birlikte değişmesinin beklendiğini gösterir.

## Bir kullanım yerinden başla

Önce arama davranışını kendine ait yerde tut:

```text
src/
  features/
    search/
      SearchBox.tsx
      useSearch.ts
```

`SearchBox` arama metnini ve gönderme davranışını biliyorsa, onu genel `shared/ui/` klasörüne koymak arama sorumluluğunu gizler. `shared` ise gerçekten birden fazla feature'ın kullandığı genel parçaların evidir. Örneğin sade bir `TextInput` arama ve yorum formunda aynı görünüm sözleşmesiyle kullanılıyorsa shared adayı olabilir; aramaya özel `SearchBox` yine search feature'ında kalır.

Şimdi TMDB'den film listesi alan kodu ekleyelim:

```text
src/
  features/
    movies/
      api/movies-api.ts
    search/
      SearchBox.tsx
  shared/
    api/tmdb-client.ts
```

`movies-api.ts`, “trend filmleri getir” gibi film özelliğinin anlamını bilir. `tmdb-client.ts` ortak HTTP ayrıntısını bilir, örneğin TMDB'ye istek göndermeyi. Bu ayrım faydalıdır çünkü bir feature'ın anlamı değiştiğinde ortak ağ koduna dokunman gerekmez; ortak ağ politikası değiştiğinde de film ekranına özel kararları değiştirmezsin.

İki feature aynı saf film poster adresi kurucusunu gerçekten kullanmaya başladı diyelim. O zaman ortak kullanım görünür hale gelir:

```text
src/
  features/
    movies/
    favorites/
  shared/
    lib/movie-poster-url.ts
```

Bu dosya hem filmler hem favoriler ekranında aynı işi yapıyorsa `shared/lib/` uygun olabilir. İleride kullanılabilir düşüncesi tek başına yeterli değil. Önce tek sahibi olan yerde başlamak, ikinci gerçek kullanım doğduğunda ortak sınırı çizmek gereksiz klasörleri ve erken genellemeyi azaltır.

![Feature klasörlerinden shared katmanına tek yönlü bağımlılığı gösteren diyagram](diagrams/feature-bagimlilik.svg "Feature ortak parçayı kullanır; shared feature'a geri dönmez.")

## Bağımlılık yönünü import'lardan anla

**Bağımlılık**, bir dosyanın çalışmak veya tipini bilmek için başka bir dosyayı kullanmasıdır. Örneğin `HomePage` iki parçayı bir araya getirebilir:

```ts
import { getTrendingMovies } from '../features/movies/api/movies-api'
import { tmdbRequest } from '../shared/api/tmdb-client'
```

Page/route ekran akışını kurar, movie feature film endpoint'ini tanır, shared katman ortak HTTP işini yapar. Sağlıklı yön `page → feature → shared` olabilir. `shared/api/tmdb-client.ts` içinden `features/movies/api/movies-api.ts` import edilirse yön geri döner: genel ağ kodu bir film özelliğine bağlanır. Böyle bir yapı değişiklikleri birbirine dolaştırır ve döngülü import olasılığını artırır.

| Kod neyi biliyor? | Genellikle nerede başlar? | Örnek |
| --- | --- | --- |
| Yalnız arama akışı | `features/search/` | `SearchBox` |
| Film endpoint'inin anlamı | `features/movies/api/` | `getTrendingMovies` |
| Birden fazla feature'ın kullandığı genel iş | `shared/` | `moviePosterUrl` |
| Ekranların bir araya gelişi | `pages/` veya route modülü | `HomePage` |

Dosyanın adını değil, ne zaman değişeceğini sor. `MovieCard` adı film diyor diye otomatik olarak shared olmaz. Yalnız film listesindeki alanları gösteriyorsa movies feature'ına ait olabilir. Favori listesi de aynı davranış ve props sözleşmesiyle kullanıyorsa ortaklaştırmak anlamlı olabilir. Paylaşmanın nedeni “belki lazım olur” değil, bugünkü gerçek kullanıcıların aynı işi aynı biçimde yapmasıdır.

İki feature aynı adlı dosyaya sahip diye bunları da hemen birleştirme. Örneğin arama sonuçlarındaki kart puanı gösterirken favori kartı yıldız ve kaldırma düğmesi gösterebilir. Yalnızca dış görünüşleri benziyor diye tek bir `MovieCard` yapmak, props'a koşul ekleyip iki farklı davranışı tek yerde toplamana yol açabilir. Önce değişiklik nedenleri ve sözleşmeleri gerçekten aynı mı diye bak; ortaklaştırma kod tekrarını azaltırken kavramı da sadeleştirmeli.

## Dışarı açılan yüzeyi küçük tut

Bir feature'ın diğer feature'lar tarafından kullanılmasına izin verdiği isimler onun **public API**'sidir: yani dışarıdaki kodun güvenle kullanabileceği küçük giriş yüzeyi. Bir **barrel**, genelde `index.ts` adlı dosyadır; seçilmiş export'ları tek bir girişten dışarı verir.

```ts title="features/movies/index.ts"
export { MovieCard } from './MovieCard'
export { useMovies } from './useMovies'
```

Başka bir feature bu girişten `MovieCard` alabilir. Böylece `features/search` uygulama ayrıntısı olan `features/movies/components/MovieCardInternal.tsx` yoluna bağlanmaz. MovieCard'ın iç yapısı taşınsa da dışarıdaki import aynı kalabilir. İçerideki dosyalar ise birbirini kendi barrel'ından değil, doğrudan göreli yoldan import etmelidir.

Barrel'dan geri dönmek döngü doğurabilir. Örneğin `index.ts`, `MovieCard.tsx` dosyasını export ederken, `MovieCard.tsx` de bir yardımcıyı `index.ts`'ten import etsin:

```text
index.ts → MovieCard.tsx → index.ts
```

İkinci import, `MovieCard` dosyasının başladığı modüle geri döner. JavaScript modülleri açılırken export henüz hazır değilse yardımcı `undefined` görünebilir. MovieCard içindeki yardımcıyı aynı klasördeki gerçek dosyadan doğrudan import et; barrel'ı dışarıdaki tüketiciler için bırak. Export sırasını değiştirmek bu geri dönüş okunu kaldırmaz.

Taşıma yaparken bir defada tüm `src/` ağacını değiştirme. Tek bir dosyayı taşı, import'larını güncelle ve editör/build hatalarını çöz; sonra sıradaki dosyaya geç. Küçük adımda sorun çıkarsa hangi sahiplik veya import kararıyla ilgili olduğunu bulmak kolaydır.

Bir `SearchBox`'ı taşırken sıra basit olabilir: dosyayı `features/search/` altına taşı, onu kullanan sayfanın import'unu yenile, sonra typecheck/build hatalarını düzelt. Eski kopya başka bir yerde kaldıysa hangi bileşenin güncel olduğunu anlamak zorlaşır; tek gerçek kaynağı seçip eski kopyayı kaldır. Bu adımlar bir framework buyruğu değil, değişikliğin etkisini gözle takip etmenin yoludur.

| Adım | Değişiklik | Neyi kontrol edersin? |
| --- | --- | --- |
| 1 | `components/SearchBox.tsx` → `features/search/SearchBox.tsx` | Arama sayfası yeni yolu import ediyor mu? |
| 2 | İkinci ekran da aynı SearchBox'ı kullanır | Davranış ve props gerçekten aynı mı? |
| 3 | Ortak, aynı sözleşmeli parça belirginleşir | O parçayı shared'e al; SearchBox arama feature'ında kalsın |

:::mistake[Belirti: shared klasöründe film aramasına özel dosyalar çoğalıyor]
**Belirti →** `shared/` içinde `movieSearch` ve `favoriteBadge` gibi tek ekrana ait adlar birikiyor. **Neden →** Gelecekte belki kullanılacak olması bugünkü ortak kullanım sanılmış. **Düzeltme →** Önce dosyayı tek feature içinde tut; ikinci gerçek kullanıcı aynı sözleşmeyle kullanınca ortaklaştır.
:::

:::mistake[Belirti: export edilen feature bileşeni bazen undefined]
**Belirti →** `MovieCard` açılırken kullandığı yardımcı hazır değil. **Neden →** Feature içindeki dosya, onu tekrar export eden `index.ts` üzerinden kendine geri dönmüş olabilir. **Düzeltme →** İç import'u gerçek dosya yoluna çevir; barrel'ı feature dışındaki kodun giriş noktası olarak kullan.
:::

:::mistake[Belirti: ortak ağ kodu film feature'ını import ediyor]
**Belirti →** `shared/api` içindeki HTTP yardımcı dosyasında film tipi veya endpoint adı görünüyor. **Neden →** Genel ağ katmanı feature'a ait anlamı üstlenmiş. **Düzeltme →** Endpoint kararını `features/movies/api/`'ye taşı; shared katmanda yalnız gerçek ortak HTTP davranışı kalsın.
:::

## Özet

- Tek feature'ın kullandığı kodu o feature'ın yanında tut; ortaklaştırmayı gerçek ikinci kullanım doğduğunda düşün.
- `shared` genel işleri bilir; feature'a özel endpoint ve davranışları bilmez.
- Import yönünü `page → feature → shared` gibi tek yönde tut.
- `public API`, feature'ın dışarıya izin verdiği girişlerdir; barrel (`index.ts`) bu girişleri toplar.
- Feature içindeki import'ları doğrudan dosyaya yönelt; kendi barrel'ına geri dönmek döngü yaratabilir.

**Yeni terimler:** `feature` — uygulamadaki bir iş alanı; `public API` — dış kodun kullanmasına izin verilen export'lar; `barrel` — export'ları genellikle `index.ts`'te toplayan dosya; `bağımlılık` — bir dosyanın kullandığı başka kod.

**Kendini yokla:** Yalnız favoriler ekranında kullanılan yıldız düğmesi ilk olarak nereye konur?  
*Cevap:* `features/favorites/` içine. Aynı davranış başka bir feature'da gerçekten gerekirse sınırı tekrar değerlendir.

**Kendini yokla:** `shared/api` film türlerinin etiketini seçmeli mi?  
*Cevap:* Hayır. HTTP işi shared'e, film/tür anlamı movies feature'ına aittir.
