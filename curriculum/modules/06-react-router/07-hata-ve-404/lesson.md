---
title: "Rota hatası ve 404"
minutes: 13
kind: concept
---

# Rota hatası ve 404

:::pain[Problem]
Bir kullanıcı `/olmayan` adresini açıyor ve boş ekran görüyor. Başka bir kullanıcı geçerli `/books/42` sayfasında veri yükleme hatası alıyor; onda da hiçbir açıklama yok. İlkinde adres bilinmiyor, ikincisinde çalışan bir sayfanın işlemi başarısız.
:::

## Adres bulunamadı mı, route işlemi mi bozuldu?

Uygulamada “sayfa yok” ile “sayfa açılırken hata oldu” farklı durumlardır. Eşleşmeyen URL için route ağacında `path: '*'` gibi bir yakalama route'u tanımlanır. Bir route eşleştiği halde loader veya route bileşeni hata verirse data mode'daki hata sınırı devreye girer. Kullanıcıya uygun geri dönüş sağlamak için iki yolu ayrı düşün.

![Bilinmeyen URL ile eşleşmiş route hatasının ayrı kullanıcı ekranlarına gitmesi](diagrams/404-ve-route-hatasi.svg)

1. **Wildcard route eşleşmeyen adresleri kapsar.** `*` belirli sayfa desenleri eşleşmediğinde son çare route olarak kullanılır. Uygun başlık, ana sayfaya dönüş linki veya arama yolu göster.
2. **`errorElement` eşleşmiş bir route işleminin hatasını yakalar.** Data route'ta loader, action veya route bileşeninin hatası en yakın hata elementine aktarılabilir. Bir alt route'ta özel hata ekranı tanımlanmışsa hata orada kalabilir; yoksa üst sınıra çıkar.
3. **`useRouteError()` sonucunu `unknown` gibi ele al.** Her hata Router'ın yapılandırılmış HTTP cevabı değildir. `isRouteErrorResponse` ile response biçimini daraltmadan `.status` okumak güvenli değildir.
4. **Hata türüne göre kullanıcı mesajı seç.** Router response'u 404 olabilir; başka bir exception ise beklenmeyen teknik hata olabilir. Stack trace veya sunucu ayrıntısını son kullanıcıya basma.
5. **Her hata ekranına çıkış yolu koy.** Ana sayfa, arama veya geri bağlantısı kullanıcının kilitli ekranda kalmasını önler. Loglama ve geliştirici ayrıntıları kullanıcı mesajından ayrı tutulur.

Bir 404 her zaman `path: '*'` demek değildir. `/books/999` route deseniyle eşleşebilir ama katalogda kitap bulunmayabilir. Bu durumda route içindeki sayfa kendi veri sonucunu “Kitap bulunamadı” olarak gösterir. Wildcard yalnızca route ağacında tanınmayan adresi yakalar.

## İki hata yüzeyini kur

Bir hata ekranını yalnızca root route'a bağlamak, eşleşmeyen her adresi otomatik olarak özel 404 sayfasına dönüştürmez. `errorElement` hata sınırıdır; route eşleşmesi bulunmamasının yerini tutmaz. Bir de hata nesnesini daraltmadan okumak TypeScript ve çalışma zamanı hatasına yol açabilir:

```tsx
function BrokenResponseView() {
  const error = useRouteError()
  return <p>{error.status}</p>
}
```

`error` her zaman `status` alanı taşımaz. Bileşen bir `Error` veya başka bir nesne alabilir. Router response ile genel exception durumunu daraltıp kullanıcı mesajını buna göre üret:

```tsx check
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

export function RouteFailure() {
  const error: unknown = useRouteError()
  const isMissing = isRouteErrorResponse(error) && error.status === 404
  return (
    <main role="alert">
      <h1>{isMissing ? 'Sayfa bulunamadı' : 'Bir şeyler ters gitti'}</h1>
      <p>{isMissing ? 'Bu adres için bir sayfa yok.' : 'Biraz sonra tekrar deneyebilirsin.'}</p>
      <Link to="/">Ana sayfaya dön</Link>
    </main>
  )
}
```

Bu hata yüzeyini root route'a bağlayınca, çocuk route'lardaki hata en yakın sınırda görünür. Wildcard sayfası ise normal route içeriği olduğu için kendi 404 açıklamasını render eder. İki ekranda da kullanıcıya yön verir ama beklenmeyen exception'ın içeriğini sızdırmaz.

## `/unknown` ve `/broken` adresini izleyelim

Uygulama `/unknown` ile açılır. Router tanımlı route desenlerini sırayla eşleştirir ve wildcard harici bir desen bulamazsa yıldızlı child route'u seçer; `NotFoundPage` normal içerik gibi render edilir. `/broken` ise tanımlı route olduğundan eşleşme vardır. Route'un loader'ı exception fırlatırsa Router normal page element'i yerine en yakın `errorElement` içeriğini gösterir.

| Adres | Eşleşme | Sonuç | Kullanıcı yüzeyi |
| --- | --- | --- | --- |
| `/unknown` | Yalnız `*` yakalar | Normal route render edilir | Sayfa bulunamadı + çıkış linki |
| `/books/999` | `/books/:id` eşleşir | Veri listesinde kayıt yok | Kitap detayının boş/not found durumu |
| `/broken` | `/broken` route'u eşleşir | Loader hata verir | En yakın `errorElement` |
| `/broken` altındaki özel child | Child sınırı olabilir | Hata child sınırında kalabilir | Child'a özel hata UI |

Buradaki sıra eşleşme katmanı ile route çalıştırma katmanını ayırır. Önce adres hangi route olduğunu seçer. Sonra loader, action veya component yürütülür. Sınırın nerede duracağı route ağacındaki en yakın hata ekranına bağlıdır; her hatayı tek bir global modal yapmak genellikle hangi bölgenin devam edebileceğini belirsizleştirir.

## Güvenli hata mesajı ve üretim sınırı

`isRouteErrorResponse` ile daraltılan hata `status`, `statusText` ve data bilgileri sunabilir. Buna rağmen sunucudan gelen her metni arayüze aynen koymak doğru değildir. Kullanıcıya ne yapabileceğini anlatan genel mesaj göster; geliştirici loglarında ise yeterli bağlamı kaydet. Kimlik bilgisi veya dahili yol gibi ayrıntılar ekrana sızmamalıdır.

Bir route hata sınırı kendi alt ağacındaki render işlemlerini yakalarken kökün kendisi için de bir hata sınırı kurmak önemlidir. Hata element'i de render edilemezse daha yukarıda başka bir güvenlik ağı gerekebilir. Bu modülde tek root sınırı ve wildcard yeterli; kapsamı ihtiyacın ötesinde büyütme.

## En yakın sınır neden önemli?

Nested route'larda her route kendi hata UI'sini tanımlayabilir. Bir child route hata verdiğinde Router önce o route'un sınırına bakar; child sınırı yoksa parent'a çıkar. Bu, ortak navigasyonun görünür kalmasına yardım eder: tek bir rapor alanı bozuldu diye tüm uygulamanın baştan kurulması gerekmeyebilir. Ama error element kendi route zincirinden dışarıda bir bilgiyi okumaya çalışırsa aynı hata tekrar oluşabilir; hata ekranı sade tutulmalıdır.

404 durum kodu ve 404 görünümü de aynı şey değildir. Route response `status === 404` olabilir; ayrıca app'in wildcard sayfası da kullanıcıya 404 içeriği gösterir. Film route'u `/movie/:id` ile eşleştiği halde film statik katalogda bulunmazsa kendi ekranı not found mesajı üretir. Hangi katmanda başarısız olduğuna göre URL, kullanıcı mesajı ve analitik olayı farklı olabilir.

Sunucu hata ayrıntıları içerebilir: dosya yolu, SQL açıklaması, iç servis host'u veya kullanıcının görmemesi gereken id. Hata ekranı bunları `String(error)` ile yazdırmamalıdır. React Router'ın response kontrolü status gibi güvenli karar noktalarını daraltır; hata metni kullanıcıya gösterilecek metne dönüştürülmeden önce düşünülmelidir. Geliştirme araçlarında ayrıntı görmek başka, prod arayüzüne sızdırmak başkadır.

Hata sınırı tüm hataları otomatik olarak düzeltmez. Bir event handler içindeki hata veya zamanlayıcı callback'i farklı hata işleme yoluna sahip olabilir; her asynchronous callback'i `errorElement` yakalar varsayımıyla tasarlama. Buradaki route sınırı, Router'ın yönettiği route render ve data işlemlerine aittir. Genel çalışma zamanı gözlemi için uygulama seviyesinde hata izleme ayrıca gerekir.

Bir kullanıcı hatalı URL ile geldiyse ekranın eylemi bağlamlı olmalıdır. Arama detayı bulunmadıysa “Aramaya dön”, genel bilinmeyen yol için “Ana sayfa” uygun olabilir. Bununla birlikte başka bir route'a dönüş linki çalışır bir link olmalı; hatayı gizlemek için otomatik yönlendirme yaparsan kullanıcı yanlış adresin neden açılmadığını anlamayabilir. Hata sayfası sorunu açıklar ve sonraki adımı kullanıcıya bırakır.

:::mistake[Belirti → neden → düzeltme]
`/olmayan` özel ekran yerine boş veya genel hata ekranı gösteriyor → yalnızca `errorElement` tanımlanmış, eşleşmeyen yol için normal route yok → wildcard `*` route'u ekle.
:::

:::mistake[Belirti → neden → düzeltme]
Hata ekranı `status` okurken çökmüş → `useRouteError()` sonucu bilinmeyen bir nesne olarak daraltılmamış → `isRouteErrorResponse` ile kontrol et; diğer durumda genel mesaj kullan.
:::

:::mistake[Belirti → neden → düzeltme]
Kullanıcı hata sayfasında kalıyor ve ne yapacağını bilmiyor → mesaj var ama uygulamaya dönüş bağlantısı yok → güvenli ana sayfa veya arama linki ekle.
:::

:::model[URL eşleşmesi ve route ağacı]
URL route zincirini seçer; hata da bu zincirdeki en yakın hata sınırına gider. Yeni ayrım, wildcard'ın eşleşmeyen adres için normal route olması, `errorElement`'in ise eşleşmiş route çalışırken hata yakalamasıdır. Hata yüzeyi ortak layout içinde kalabilir; hangi child'ın başarısız olduğuna göre uygun içerik gösterilir.
:::

:::sector
Ürünlerde 404 sayfası ve beklenmeyen hata sayfası ayrı tasarlanır; analitik ve hata izleme sistemleri de bunları farklı olaylar olarak kaydeder. Teknik ayrıntıları kullanıcıdan saklamakla hata bilgisini ekipten saklamak aynı şey değildir: kullanıcıya sade mesaj, gözlem sistemine kontrollü ve güvenli hata bağlamı sunulur.
:::

## Özet

- Wildcard route tanınmayan URL'yi yakalar; `errorElement` eşleşmiş route çalışırken oluşan hatayı yakalar.
- Veride bulunmayan kaynak, route eşleşmeyen adresle aynı durum değildir.
- `useRouteError` sonucunu `isRouteErrorResponse` ile daraltmadan response alanı okuma.
- Hata ekranında güvenli mesaj, uygun 404 ayrımı ve kullanıcının çıkış yolu olsun.

**Kendini yokla:** `/books/999` için route eşleşip kitap yoksa neden wildcard çalışmayabilir?

*Cevap:* `/books/:id` route'u zaten eşleşmiştir; kaynak bulunmama durumunu detay sayfası ele alır.

**Kendini yokla:** `errorElement` neden tek başına bilinmeyen URL için 404 sayfası değildir?

*Cevap:* Hata sınırı route çalışma hatalarını yakalar; route ağacında eşleşmeyen adres için ayrıca wildcard tanımı gerekir.
