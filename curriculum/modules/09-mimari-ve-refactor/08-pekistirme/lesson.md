---
title: "İki gerçek taşıma"
minutes: 8
kind: practice
---

# İki gerçek taşıma

Arama ve film detayı ekranda çalışırken bile içeride aynı işi iki kez yapıyor olabilir. Bu derste iki küçük örnekle tekrarı azaltacaksın: önce arama URL'sini tek yerde kurmak, sonra afiş görünümünü başlık ve açıklamadan ayırmak. Amaç yeni davranış eklemek değil; kullanıcı aynı şeyi görürken kodda her sorumluluğun yerini belirginleştirmek.

:::model[UI ile davranışın sınırı]
Veriyi hazırlama veya ortak davranışı hook/saf birime taşı; ekranda ne gösterileceğine component karar versin. Aramada URL üretimi ile isteği, detayda ortak metin ile afişi ayrı düşün. Bir sınırın işe yaraması için yeni parça gerçek akışta kullanılmalı.
:::

## Arama isteğini tek yoldan kur

En küçük başlangıçta arama metni URL parametresine çevrilir:

```ts check
const params = new URLSearchParams({ query: 'Dövüş' })
const url = `/search/movie?${params}`
```

`URLSearchParams` Türkçe karakterleri URL için güvenli biçimde kodlar. Örnekte `Dövüş`, isteğin `query` parametresine dönüşür; URL yazımı bir kez yapılır.

Şimdi sayfa bilgisini de ekleyelim:

```ts check
function makeMovieSearchUrl(query: string, page: number) {
  const params = new URLSearchParams({ query, page: String(page) })
  return `/search/movie?${params}`
}
```

Yeni fonksiyon sorgu ve sayfayı aynı kurala bağlar. Böylece ilk sayfa ile sonraki sayfa için ayrı URL kuralları oluşmaz; sorgu değişse de sayfa değişse de istek aynı yolu kullanabilir.

Son adımda URL üretimini arama akışının içinde kullanırsın. Film listesindeki `page` ve `results` cevabı yine aynı kalır; yalnız URL'nin nasıl üretildiği tek yerde toplanır. Bunu yaparken istek, yetkilendirme başlığı ve Türkçe dil ayarı gibi mevcut davranışları da koru.

| Adım | Arama girdisi | URL'deki seçim | Beklenen sonuç |
|---|---|---|---|
| 1 | `Dövüş`, sayfa 1 | `query=Dövüş`, `page=1` | İlk sayfa isteği |
| 2 | `Dövüş`, sayfa 2 | `query=Dövüş`, `page=2` | Aynı arama, sonraki sayfa |
| 3 | Türkçe karakterli metin | Kodlanmış URL, aynı metin değeri | Sunucuya doğru sorgu ulaşır |

Her satırda sorgu aynı, sayfa değişince yalnız `page` değişiyor. URL kuralını merkezileştirmenin nedeni bu tutarlılığı korumak.

## Detay kartında değişeni ayır

Bir film kartının en sade halinde başlık ve açıklama vardır. Afiş geldiğinde yalnızca görsel kısmı koşula bağlanır; ortak metni iki ayrı dalda kopyalamak gerekmez.

```tsx check
function PosterImage({ title, path }: { title: string; path: string | null }) {
  if (path === null) return null
  return <img src={`https://image.tmdb.org/t/p/w185${path}`} alt={title} />
}
```

`path` yoksa görsel hiç çizilmez. Böylece tarayıcı bozuk resim simgesi göstermez; `alt` metni de görseli görmeyen kişiye film adını verir.

Bir sonraki küçük adımda başlık ile açıklama kendi ortak görünümünde kalır; `MoviePoster` yalnız afişten sorumlu olur. Afişli ve afişsiz film aynı başlığı ve açıklamayı gösterir. Görevde bu iki export'u birlikte kullanırken isimleri ve prop'ları verilen sözleşmeye göre eşleştir.

:::mistake[Metni iki dala kopyalamak]
**Belirti →** Afişsiz kartta başlık farklı görünür. **Neden →** Afiş var/yok koşulunda başlık ve açıklama iki kez yazılmış, sonra yalnız bir kopya güncellenmiştir. **Düzeltme →** Metni ortak render noktasında tut; yalnız afişi koşullu bileşene ayır.
:::

## Çalışırken

Önce mevcut çıktıyı ve boş/sınır durumunu not et. Sonra tek sorumluluğu ayır, yeni parçayı asıl akıştan çağır ve aynı çıktıyı yeniden kontrol et. İki değişikliği birden yaparsan hangi adımın davranışı etkilediğini bulmak zorlaşır.

Örneğin URL'yi ayırdıktan sonra sayfa numarası kaybolursa, önce fonksiyon çağrısına `page` değerinin ulaşıp ulaşmadığını izle. Afiş bileşenini ayırdıktan sonra başlık kaybolursa, sorunun ortak metin görünümünde mi yoksa afiş koşulunda mı olduğunu ayrı kontrol et. Her iki durumda da eski sonucu korumak, refactor'ın ölçüsüdür.

Rubric, çalışmanın hangi ölçütlerle değerlendirileceğini açıklayan listedir. Burada yalnızca çalışan çıktıya değil, ayırdığın yeni parçanın gerçek akışta kullanılıp kullanılmadığına ve kodun okunaklı kalmasına da bakılır.

## Özet

- Arama sorgusu ve sayfa aynı URL kurucusundan geçer; mevcut istek davranışları korunur.
- Afiş görünümü ayrı olabilir; başlık ve açıklama ortak kalır.
- Yeni helper veya component gerçek akışta kullanılınca sınır anlam kazanır.

**Yeni terimler:** `URLSearchParams`: URL sorgu parametrelerini güvenli biçimde oluşturur. `alt metin`: Görseli göremeyen kullanıcıya içeriğini anlatan metin. `Rubric`: Çalışmanın hangi ölçütlerle değerlendirileceğini açıklayan liste.

**Kendini yokla:** Sayfa 2'ye geçince sorgu neden aynı kalmalı?
*Cevap:* Kullanıcı aynı aramayı sürdürür; yalnızca istediği sonuç sayfası değişir.

**Kendini yokla:** Afiş yoksa başlığı nerede tutarsın?
*Cevap:* Afiş koşulunun dışında, kartın ortak metin görünümünde.
