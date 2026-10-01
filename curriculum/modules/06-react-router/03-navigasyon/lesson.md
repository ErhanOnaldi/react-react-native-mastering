---
title: "Bağlama göre navigasyon"
minutes: 14
kind: concept
---

# Bağlama göre navigasyon

Sinema'da bir adresi kullanıcıya bağlantı olarak sunabilir veya bir işlem bittikten sonra uygulamayı başka bir adrese geçirebilirsin. İkisi de ekranı değiştirir, ama kullanıcıya farklı şey söyler. Doğru aracı seçmek için önce kullanıcının ne yapmak istediğine bak.

## Hedef belliyse bağlantı göster

Bir kullanıcıya açacağı adresi önceden biliyorsan `Link` kullan. Örneğin Sinema ana sayfasında festival seçkisine giden bir bağlantı gösterelim:

```tsx
import { Link } from 'react-router'

function FestivalTeaser() {
  return <Link to="/festival">Festival seçkisini gör</Link>
}
```

Metin gerçek bir bağlantıdır ve `/festival` hedefini taşır. Kullanıcı üzerine sağ tıklayıp yeni sekmede açabilir, bağlantıyı kopyalayabilir veya klavyeyle seçebilir. Bu seçenekler bir hedefi kullanıcıya sunmanın doğal parçalarıdır; aynı eylemi `button` içine saklarsan bu link davranışları kendiliğinden gelmez.

## Menüde bulunduğun yeri de göster

Bir link menünün parçasıysa, hangi sayfada olduğunu belirtmek isteyebilirsin. Önceki derste gördüğün `NavLink`, `Link` gibi hedefe gider ve adres eşleştiğinde aktif durum bilgisini verir:

```tsx
import { NavLink } from 'react-router'

function GenreMenu() {
  return (
    <nav aria-label="Film türleri">
      <NavLink to="/genres" end>Dram</NavLink>
      <NavLink to="/genres/comedy">Komedi</NavLink>
    </nav>
  )
}
```

Router geçerli adresi karşılaştırdığı için etkin menü öğesini ayrıca React state'inde tutmana gerek yoktur. `/genres` açıkken `Dram` etkin olur; `end` bu bağlantının yalnızca tam adreste eşleşmesini sağlar. Alt tür adreslerinde de ortak menü öğesini etkin tutmak istiyorsan o öğede tam eşleşme istemeyebilirsin.

`Link` ve `NavLink` adresi kullanıcıya açık eder. Form gönderimi gibi bir işlem tamamlandıktan sonra kullanıcıya önceden bir bağlantı sunmak mümkün olmayabilir; o zaman geçişi uygulama kodu başlatabilir.

## İşlem bitince uygulama geçiş yapsın

**Programatik navigasyon**, uygulama kodunun bir kullanıcı bağlantısını seçmek yerine adres değişikliğini başlatmasıdır. Sinema'da fragman kaydı başarıyla tamamlandığında gösterilecek bir sonuç ekranı olduğunu düşün. `useNavigate` hook'u sana bir yönlendirme fonksiyonu verir:

```tsx
import { useNavigate } from 'react-router'

function TrailerActions() {
  const navigate = useNavigate()

  function saveTrailer() {
    // Kayıt işlemi burada tamamlanır.
    navigate('/watchlist')
  }

  return <button onClick={saveTrailer}>Fragmanı kaydet</button>
}
```

Burada `/watchlist` bir düğmenin adresi gibi gösterilmiyor. Kullanıcı bir işi başlatıyor; iş tamamlanınca kod sonraki ekranı seçiyor. `navigate` çağrısı event handler içinde çalıştığı için her render sırasında değil, kullanıcı düğmeye bastığında çalışır.

Bir **history hareketi**, tarayıcının kayıtlı adresler arasında geri veya ileri gitmesidir. Eğer kullanıcının niyeti “bir önceki ekrana dön” ise önceki URL'yi tahmin edip yazmak yerine `navigate(-1)` kullanabilirsin:

```tsx
function BackToFilms() {
  const navigate = useNavigate()

  return <button onClick={() => navigate(-1)}>Önceki ekrana dön</button>
}
```

Bu düğme sabit olarak bir film listesine gitmez; history'deki önceki adrese döner. Kullanıcı detay adresini doğrudan açtıysa önceki kayıt Sinema içindeki beklediğin ekran olmayabilir. Ürün niyeti “filmlere git” ise sabit bir hedef bağlantı da sun; “bir adım geri” ise history hareketi uygundur.

Bu akışı zaman sırasıyla izleyelim. Kullanıcı `/genres?type=drama` adresinden bir film ayrıntısına geçmiş olsun:

| Sıra | Olay | Sonuç |
| --- | --- | --- |
| 1 | Kullanıcı bir film bağlantısını seçer | Router film ayrıntısı adresine geçer |
| 2 | Yeni adres history'ye eklenir | Önceki tür filtresi kayıtta kalır |
| 3 | Kullanıcı “Önceki ekrana dön” düğmesine basar | `navigate(-1)` önceki kaydı seçer |
| 4 | Router önceki adresi açar | `/genres?type=drama` geri gelir |

Geri tuşu ve `navigate(-1)` kayıtlı adresler arasında ilerler; sabit bir `/genres` adresine geçmekle aynı şey değildir. Bu yüzden filtreli listeye dönmek istiyorsan önceki kayda dönmek filtreyi koruyabilir. Ama doğrudan açılan ayrıntıda uygulama içi önceki kayıt olmayabilir; her iki kullanım biçimi de tasarımda düşünülmelidir.

## Hangi niyete hangi araç?

Bir menüden bilinen `/watchlist` sayfasına gitmek istiyorsan bunu `Link` veya aktif durum da gerekiyorsa `NavLink` ile sun. Bir kayıt başarılı olduğunda kodun başka sayfayı açması gerekiyorsa `useNavigate` ile programatik geçiş yap. Kullanıcı “önceki ekrana dön” diyorsa `navigate(-1)` history'deki önceki kayda gider.

![Kullanıcının bağlantı seçimi ile işlem sonrası yönlendirmenin farklı yolları](diagrams/navigasyon-karari.svg "Bilinen hedef bağlantıyla, işlem sonucu kodla açılır.")

Bu ayrım yalnızca kod düzeni değildir. Link yeni sekmede açma, kopyalama ve klavye etkileşimini kullanıcıya verir. Programatik navigasyon ise bir düğme veya form eyleminin ardından uygulama kararını uygular. Kullanıcıya hangi eylemi sunduğun, hangi HTML öğesini ve hangi navigasyon aracını seçeceğini belirler.

## Sık görülen üç belirti

Bir menü öğesi fareyle çalışıyor ama yeni sekmede açılamıyorsa, önceden bilinen hedefi `button` ve `navigate` ile kurmuş olabilirsin. Onu `Link` veya `NavLink` yap; link semantiği tarayıcının bağlantı özelliklerini korur.

Ana sayfa menüsü alt sayfalarda da etkin görünüyorsa, `/` bağlantısı alt adreslerle de eşleşiyor olabilir. Ana sayfa bağlantısına `end` eklemek yalnızca tam `/` eşleşmesini ister.

Geri düğmesi doğrudan açılan detaydan beklenmedik yere gidiyorsa, `navigate(-1)` önceki kaydın adresini garanti etmez. Ürünün sabit bir dönüş hedefi varsa onu ayrıca açık bir bağlantı olarak göster.

## Özet

- Bilinen hedefi kullanıcıya `Link` ile sun; menüde aktif durum gerekiyorsa `NavLink` kullan.
- Programatik navigasyon, uygulama kodunun bir işlem sonrasında adres değişikliği başlatmasıdır; bunun için `useNavigate` kullanılır.
- `navigate(-1)` önceki history kaydına döner; o kaydın hangi adres olduğu garanti değildir.
- Link ve düğme görsel olarak benzetilebilir, ama kullanıcıya farklı davranış vaat eder.

**Yeni terimler**

- **Programatik navigasyon:** Bir bağlantı seçimi yerine uygulama kodunun adres değişikliği başlatması.
- **History hareketi:** Tarayıcının adres geçmişinde geri veya ileri bir kayda gitmesi.
- **`useNavigate`:** Component içinden programatik geçiş başlatmanı sağlayan React Router hook'u.

**Kendini yokla:** Bilinen bir sayfaya giden menü öğesi neden `button` yerine `Link` olmalı?

**Cevap:** Kullanıcıya adresi olan bir hedef verir ve kopyalama, yeni sekmede açma, klavye ile etkinleştirme gibi bağlantı davranışlarını korur.

**Kendini yokla:** `navigate(-1)` neden her zaman belirli bir liste adresine gitmez?

**Cevap:** Komut sabit URL seçmez; tarayıcı history'sindeki önceki kayda döner ve bu kayıt doğrudan açılışta farklı olabilir.
