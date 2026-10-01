---
title: "Rota hatası ve 404"
minutes: 12
kind: concept
---

# Rota hatası ve 404

Sinema'da `/films` film listesini açıyor. Peki `/oyuncular` gibi tanımadığımız bir adres gelirse ne görünsün? Bir de `/films` adresi geçerli olduğu halde sayfa çizilirken hata çıkarsa ne yapalım? Bunlar farklı sorunlar; önce adresin route'la eşleşip eşleşmediğine bakacağız.

## Tanımadığımız bir adres için ekran

Bir **route**, adres desenini göstereceği React içeriğine bağlayan tanımdır. Daha önce `path: '*'` yazdığında, başka route'larla eşleşmeyen adreslerin bu route'a düştüğünü gördün. `*` bir **wildcard**'dır: kalan bütün adresleri yakalayan desen.

Sinema'nın basit route listesine bir wildcard ekleyelim:

```tsx
import { Link } from 'react-router'

const routes = [
  { path: '/', element: <h1>Sinema</h1> },
  { path: '/films', element: <h1>Filmler</h1> },
  { path: '*', element: <main><h1>Bu adresi tanımıyorum</h1><Link to="/">Ana sayfaya dön</Link></main> },
]
```

`/films` ikinci route'la eşleşir ve film başlığını gösterir. `/oyuncular` ilk iki desenle eşleşmez; son route normal sayfa içeriği gibi render edilir. Buradaki ekranı kendin tasarlarsın: kısa bir açıklama ve ana sayfaya giden `Link` eklemek, kullanıcıyı çıkmazda bırakmaz.

## Eşleşen adresin içindeki başka bir sorun

`/films` adresi tanınan bir adres. Fakat o route'un bileşeni çalışırken bir hata fırlatırsa, bu kez wildcard devreye girmez: adres zaten `/films` route'uyla eşleşmiştir. React Router'ın **route error boundary**'si, route çalışırken çıkan hatada gösterilecek ayrı React içeriğidir. Data mode'da bu içeriği route'un `errorElement` alanıyla belirlersin.

Önce hata ekranının en küçük haline bakalım:

```tsx
import { Link } from 'react-router'

function FilmPageError() {
  return <main role="alert"><h1>Film sayfası açılamadı</h1><Link to="/">Filmlere dön</Link></main>
}
```

`useRouteError()` hatayı verir; ama TypeScript bu değerin biçimini önceden bilemez. Ekranda `error.status` yazmak güvenli değildir: bu değer bir Router cevabı, sıradan bir `Error` ya da başka bir şey olabilir. Bu yüzden hatanın türünü kontrol etmeden alanlarını okumayız.

```tsx check
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

function FilmPageError() {
  const error: unknown = useRouteError()
  const isMissing = isRouteErrorResponse(error) && error.status === 404
  return <main role="alert">
    <h1>{isMissing ? 'Bu film bulunamadı' : 'Film sayfası açılamadı'}</h1>
    <Link to="/">Sinema ana sayfasına dön</Link>
  </main>
}
```

`isRouteErrorResponse` true olduğunda hata, React Router'ın HTTP durum kodu taşıyan cevabıdır; bu durumda `status` alanını okuyabiliriz. Örneğin route işlemi 404 cevabı verdiyse kullanıcıya kaynağın bulunmadığını söyleyebiliriz. Başka hata geldiyse genel bir mesaj gösteririz. Böylece tanımadığımız hata metnini sayfaya basmak zorunda kalmayız.

Bu ekranı route'a bağlamak için `errorElement` kullanılır:

```tsx
const routes = [
  {
    path: '/films',
    element: <FilmListPage />,
    errorElement: <FilmPageError />,
  },
  { path: '*', element: <UnknownAddressPage /> },
]
```

Artık `/films` içindeki route hatası `FilmPageError`'a gider; `/not-a-page` ise wildcard'ın normal içeriğini açar. Bu iki ekran ayrı kalmalı, çünkü ilkinde tanıdığımız sayfanın çalışması başarısız olmuştur, ikincisinde adres haritamızda böyle bir sayfa yoktur.

![Bilinmeyen URL ile eşleşmiş route hatasının ayrı kullanıcı ekranlarına gitmesi](diagrams/404-ve-route-hatasi.svg "Wildcard bilinmeyen adresi, errorElement route hatasını karşılar.")

## Bir adresi adım adım takip edelim

Şu üç URL'yi route haritasına göre sırayla düşün:

| URL ve durum | Eşleşen route | Gösterilen içerik | Neden? |
| --- | --- | --- | --- |
| `/oyuncular` | `*` | Bilinmeyen adres ekranı | Belirli bir route bu adresle eşleşmedi. |
| `/films` ve route hatası | `/films` | `errorElement` | Adres eşleşti; eşleşen route'un çalışması hata verdi. |
| `/films/42` ve 42 numaralı film yok | `/films/:id` | Film detayının kendi “film yok” durumu | URL deseni eşleşti; veri bulunmaması route eşleşme hatası değil. |

Son satır özellikle kolay karışır. `/films/:id` adres deseni `/films/42` ile eşleşebilir; içeride film aranır ve sonuç yoksa detay sayfası “Film bulunamadı” gösterebilir. Wildcard yalnızca route haritasında eşleşmeyen adres içindir. Buna karşılık eşleşmiş route'un `errorElement`'i, route çalışırken çıkan hatayı gösterir.

Bu ayrım kullanıcıya hangi adımı önereceğini de belirler. Tanınmayan adresi açan kişiye ana sayfaya dönme bağlantısı işe yarar; film detayında kayıt yoksa film listesine dönmek daha uygundur. Beklenmeyen bir hata için “Biraz sonra yeniden dene” diyebilirsin. Her üçünde de ekran sebebi anlaşılır biçimde söyler ve kullanıcının devam edebileceği bir yol bırakır.

Hata mesajını doğrudan `String(error)` yapıp ekrana yazdırma. Hata nesnesinde dosya yolu, servis adresi veya geliştiriciye yönelik başka bilgi bulunabilir; bunlar kullanıcıya yardımcı olmaz. Tür kontrolü sana yalnızca karar vermek için gereken güvenli bilgiyi verir: Router cevabı mı ve status 404 mü? Ayrıntılı hata incelemesi geliştirici araçlarında yapılır, kullanıcı ekranında değil.

Bir hata sınırı da her JavaScript hatasını yakalayan evrensel bir `try/catch` değildir. Burada React Router'ın yönettiği route ekranı için tanımladığın geri dönüş yüzeyinden söz ediyoruz. Kullanıcıya görünen sayfanın hata halinde de render edilebilmesi için bu ekranı küçük tutmak faydalıdır: basit bir başlık, kısa bir açıklama ve sağlam bir dönüş bağlantısı.

:::mistake[Belirti → neden → düzeltme]
`/oyuncular` genel hata ekranına gidiyor → sadece `errorElement` tanımlanmış, bilinmeyen URL için route yok → route listesine `path: '*'` ekle.
:::

:::mistake[Belirti → neden → düzeltme]
Hata ekranı `status` alanını okurken hata veriyor → `useRouteError()` sonucu önce tür kontrolünden geçmemiş → `isRouteErrorResponse(error)` ile kontrol et, değilse genel mesaj göster.
:::

:::info[Derinlemesine (isteğe bağlı)]
Nested route ağacında React Router hatayı önce en yakın üst route'un `errorElement`'ine verir. O seviyede hata ekranı yoksa daha yukarıdaki route'a çıkar; böylece yalnızca hata alan bölümün görünümünü değiştirebilir, ortak layout'u ekranda tutabilirsin. Örneğin filmler alanında özel bir hata ekranı olabilirken uygulamanın geri kalanı kendi ana layout'unda çalışmayı sürdürebilir. Hata sınırını her küçük bileşene koyman gerekmez; kullanıcı deneyiminin farklılaştığı route seviyelerinde karar vermen yeterlidir.
:::

## Özet

- Wildcard `*`, başka route'la eşleşmeyen adresi yakalar.
- `errorElement`, eşleşmiş route çalışırken hata çıktığında gösterilecek içeriği belirler.
- Bir URL deseni eşleşse bile o ID'ye ait film veride bulunmayabilir; bu durumu sayfanın kendisi ele alır.
- `useRouteError()` sonucunu doğrudan okumak yerine `isRouteErrorResponse` ile kontrol et.

**Yeni terimler**

- **Wildcard:** Diğer route desenleriyle eşleşmeyen adresleri yakalayan `*` deseni.
- **Route error boundary:** Eşleşmiş route çalışırken oluşan hata için gösterilecek React içeriği.
- **Route response:** Router'ın status gibi HTTP bilgileri taşıyan cevabı.

**Kendini yokla:** `/films/404` URL'si `/films/:id` ile eşleşiyor ama film bulunamıyorsa neden wildcard açılmaz?

**Cevap:** Adres deseni eşleşmiştir; film verisinin bulunmaması detay sayfasının ele alacağı bir durumdur.

**Kendini yokla:** Hata ekranında `error.status` değerini okumadan önce ne yaparsın?

**Cevap:** `isRouteErrorResponse(error)` ile Router cevabı olup olmadığını kontrol eder, yalnız doğruysa `status` alanını okurum.
