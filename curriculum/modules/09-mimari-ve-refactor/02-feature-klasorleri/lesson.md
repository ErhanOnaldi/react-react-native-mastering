---
title: "Dosyaları özelliğin yanına koy"
minutes: 16
kind: concept
---

# Dosyaları özelliğin yanına koy

:::pain[Problem]
Sinema'da arama kutusunun davranışını değiştirmek için `components/`, `pages/`, `hooks/` ve `lib/` içinde dolaşıyorsun. Favorilere özel bir düğmenin genel `shared/ui/` klasöründe ne işi olduğunu anlamak için import zincirini açman gerekiyor. Yeni bir feature geldiğinde dosya adları benzer ama aralarındaki bağ görünmüyor.
:::

## Klasör bir sahiplik sınırıdır

Klasör, sadece dosya saklanan bir çekmece değildir. Dosyanın hangi özelliğe ait olduğunu, başka kod tarafından kullanılıp kullanılmadığını ve bağımlılığın hangi yöne gitmesi gerektiğini görünür kılar. Feature temelli düzende bir iş alanına ait sayfa, bileşen, hook ve API fonksiyonları yan yana yaşar. Gerçekten birden fazla feature'ın kullandığı kod `shared/` içine çıkar.

![Feature klasörlerinden shared katmanına tek yönlü bağımlılığı gösteren diyagram](diagrams/feature-bagimlilik.svg "Feature ortak parçayı kullanır; shared feature'a geri dönmez.")

Kesin kurallar:

1. **Bir feature'a ait kod önce o feature'ın içindedir.** Yalnız arama sayfasının kullandığı `SearchBox`, `features/search/components/` içinde yer alır. “İleride belki kullanılır” ortaklık gerekçesi değildir.
2. **İki ya da daha fazla gerçek kullanıcı ortak kodu haklı çıkarabilir.** Saf tarih biçimleyici hem arama hem detay ekranında kullanılıyorsa `shared/lib/` adayıdır. Taşımadan önce aynı işin kopyaları varsa tek uygulamayı ortaklaştır; iki bağımsız doğruluk kaynağı bırakma.
3. **Bağımlılık feature'dan shared'e doğru akar.** `features/movies` `shared/api`'yi çağırabilir. `shared/api` ise `features/movies` import etmemelidir; aksi halde ortak katman bir ürün özelliğini tanır ve döngü ihtimali doğar.
4. **Feature'lar arası kullanım açık bir public API'den geçer.** `features/search` doğrudan `features/movies/components/MovieCardInternal` dosyasına bağlanmamalı. Gerekli dış yüzeyi `features/movies/index.ts` gibi bir girişten export edebilir ya da bileşeni gerçekten ortaksa `shared/ui/`'ye taşıyabilirsin.
5. **Sınıflandırmayı dosya adından değil, değişiklik nedeninden yap.** `MovieCard` adı film içeriyor diye mutlaka shared olmaz. Birden fazla alan aynı davranışı ve görünüm sözleşmesini kullanıyor mu, yoksa yalnız bir feature mı değiştiriyor?

Tipik yapı şu şekilde olabilir:

```text
src/
  features/
    movies/
      api/
      components/
      hooks/
      index.ts
    search/
      components/
      hooks/
      api/
    favorites/
      components/
      hooks/
  pages/
  shared/
    api/
    config/
    lib/
    ui/
```

Bu isimler katı bir framework kuralı değil; ekipte anlaşılır bir sahiplik sözleşmesidir. Küçük uygulamada `features/search/` içinde daha az alt klasör kullanmak normaldir. Kod miktarı veya gerçekten ayrı sorumluluklar arttıkça klasörü derinleştir. Her tür dosya için boş `components`, `hooks`, `types`, `utils` klasörleri üretmek yapıyı daha açık kılmaz.

## Bir dosyanın yolunu kararlaştır

Şu soruları sırayla sor:

| Soru | Yanıt | İlk yer |
| --- | --- | --- |
| Kod tek bir iş akışını mı anlatıyor? | Evet, yalnız arama | `features/search/` |
| Kod başka feature'larda da aynı sözleşmeyle mi kullanılıyor? | Evet, birden fazla | `shared/` adayı |
| Kod HTTP standardını mı, film endpoint anlamını mı biliyor? | HTTP | `shared/api/`; film endpoint'i | `features/movies/api/` |
| Kod sayfa seçimini mi birleştiriyor? | Evet | `pages/` ya da route modülü |
| Kod bağımlılığı yönü tersine çeviriyor mu? | Evet | Sınırı yeniden çiz |

Örneğin `posterUrl(path)` sadece TMDB görsel adresini kuran saf yardımcıysa filmler ve favoriler onu paylaşabilir; `shared/lib/tmdb-image.ts` makul bir yerdir. `getTrendingMovies()` ise TMDB'ye ait olsa da yalnız HTTP ayrıntısı değildir: endpoint ve “trend film” anlamını bilir, dolayısıyla `features/movies/api/`'ye aittir. `SearchBox` da arama etkileşimini bilir; genel bir text input'la karıştırma.

## Bağımlılık yönünü import'larla izle

Bir import'u okurken “bu dosya ne kullanıyor?” diye sor. Şu zincirde sayfa ürün akışını birleştirir, film feature'ı endpoint anlamını sağlar, ortak API HTTP ayrıntısını uygular:

```text
pages/HomePage.tsx
  → features/movies/api/movies-api.ts
    → shared/api/tmdb-client.ts
```

`shared/api/tmdb-client.ts` geriye dönüp `features/movies/api/movies-api.ts` içinden bir film tipini almamalı. Ortak katman film özelliğine özel bir tipi gerçekten taşımamalı; ortak ve semantik olarak ortak tipe sahipse `shared`'de tanımla, değilse tip feature'da kalsın. Barrel dosyası bu kuralı değiştirmez. `index.ts` dış kullanıma bir API sunabilir; feature içindeki dosyalar kendi barrel'ına geri import ederek döngü kurmamalı.

Taşıma değişikliğini izlerken şu küçük zinciri düşün:

| Adım | Önce | Sonra | Kontrol |
| --- | --- | --- | --- |
| 1 | `components/SearchBox.tsx` | `features/search/components/SearchBox.tsx` | Yalnız import yolunu değiştir |
| 2 | Aynı SearchBox iki sayfada kopya | Tek feature bileşeni | İki kullanımın aynı sözleşmeye uyduğunu doğrula |
| 3 | Genel formatlayıcı iki feature'da | `shared/lib/format.ts` | Feature'dan shared'e import olduğunu gör |
| 4 | `shared` feature dosyasını import eder | Yanlış bağımlılık | Tipi ortaklaştır veya feature sınırında bırak |

Bir seferde tüm `src/` ağacını yeniden düzenleme. Tek dosya taşı, importlarını güncelle, editör/typecheck'te kırılan referansları düzelt, sonra sonraki parçaya geç. Küçük adımın değeri sadece kolay geri alma değildir: hata çıkınca hangi sahiplik kararının yanlış olduğunu da hemen görürsün.

## Önce kırık yön, sonra doğru yön

Bu örnek derlenir ama shared'in feature'a bağımlı olması nedeniyle ortak katmanın gerçek sahibi belirsizdir:

```ts check
type Movie = { id: number; title: string; credits: string[] }

export function movieLabel(movie: Movie): string {
  return `${movie.title} (${movie.id})`
}
```

Eğer `Movie` yalnız `movies` feature'ına ait detay cevabıysa bu yardımcıyı shared'e taşımak yanlıştır. Yardımcı `Movie`'nun bütün detaylarını kullanmıyorsa ihtiyacı olan küçük shape'i tanımlamak; gerçekten yalnız filmlere aitse feature içinde tutmak daha açık çözümdür. İki feature'ın aynı temel alanları anlamlı biçimde paylaştığı durumda ortak tipi `shared`'e taşıyabilirsin.

Feature endpoint'i ile ortak taşıma örneği:

```ts check
type MovieCardData = { id: number; title: string }

export function formatCardLabel(movie: MovieCardData): string {
  return `${movie.title} · #${movie.id}`
}
```

Bu fonksiyonun ortak olması için en az iki gerçek tüketici bulunmalı ve aynı format her ikisi için de anlamlı olmalı. Aksi halde `formatCardLabel` feature'ın içinde kalır. Paylaşımın hedefi klasörü doldurmak değil, aynı kuralın değişiklikte bir kez tutulmasıdır.

## Sınır durumları ve sık hatalar

:::mistake[Belirti: shared klasörü her türden dosyayla doluyor]
**Belirti →** `shared/` içinde `movieSearch`, `favoriteBadge`, `profileSearch` gibi feature adları çoğalıyor. **Neden →** “Başka yerde kullanabiliriz” ihtimali gerçek tüketici gibi sayılmış. **Düzeltme →** İlk kullanım noktasına koy; ikinci kullanım ortaya çıktığında ortak sözleşme varsa taşı.
:::

:::mistake[Belirti: küçük import değişikliği tüm uygulamayı döngüye sokuyor]
**Belirti →** `shared/ui` içindeki bileşen feature barrel'ından tekrar `shared` dosyasına ulaşıyor veya başlangıç değeri `undefined` oluyor. **Neden →** Import yönü yukarı/aşağı gidip aynı modül ağacına geri dönüyor; barrel da döngüyü gizliyor. **Düzeltme →** `feature → shared` yönünü koru; içeride doğrudan dosya import et ve public barrel'ı dış tüketiciye sakla.
:::

:::mistake[Belirti: arama kutusunu güncellemek için üç alana dokunuyorsun]
**Belirti →** Aynı `SearchBox` bir sayfada `components/`, diğerinde `shared/ui/` kopyası olarak duruyor. **Neden →** Ortaklaştırma yapılırken eski kopya kaldırılmamış veya API'ler ayrışmış. **Düzeltme →** İki kullanımın davranış ve props sözleşmesini karşılaştır, bir kaynağı seç ve diğer import'u ona geçir.
:::

:::mistake[Belirti: klasör sayısı koddan hızlı artıyor]
**Belirti →** Tek satırlı küçük dosya için beş seviye derin klasör gerekiyor. **Neden →** Klasör şablonu her feature'a ölçmeden uygulanmış. **Düzeltme →** Yapıyı dosyaların gerçek sorumluluklarına göre tut; alt klasörü ancak gezinmeyi veya sahipliği iyileştiriyorsa ekle.
:::

:::sector
Ekiplerde feature klasörleri değişiklik sınırını code review'da görünür kılar. Bir arama davranışının değişmesi çoğunlukla `features/search/` çevresinde kalır; ortak UI değişikliği ise birden fazla sahibin görüşünü gerektirir. Mimari kuralı klasör adına değil, import yönüne ve gerçek kullanıma bakarak denetle.
:::

## Özet

- Tek bir özelliğe ait kod o feature'ın yanında başlar.
- Gerçekten ortaklaşan davranış shared'e taşınır; erken genelleme yapılmaz.
- Bağımlılık yönü feature'dan shared'e doğrudur; shared feature bilmez.
- Endpoint anlamı feature API'sinde, ortak HTTP politikası shared API client'tadır.
- Küçük taşıma adımları sahiplik hatasını bulmayı kolaylaştırır.

**Kendini yokla:** Yalnız favoriler ekranında görünen `FavoriteCount` ilk olarak nereye konur?  
*Cevap:* `features/favorites/` içine. Başka gerçek feature da aynı sözleşmeyle kullanırsa ortaklaştırmayı düşün.

**Kendini yokla:** `shared/api` film türlerinin etiketlerini seçmeli mi?  
*Cevap:* Hayır. Ortak API HTTP davranışını bilir; tür ve endpoint anlamı film feature'ına aittir.
