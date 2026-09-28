---
title: "Bağlama göre navigasyon"
minutes: 13
kind: concept
---

# Bağlama göre navigasyon

:::pain[Problem]
Detay ekranındaki “Kapat” düğmesi her zaman `/` adresine gidiyor. Kullanıcı aramadan geldiyse `?q=Matrix&page=2` listesini kaybediyor; ana menüdeki Ana sayfa ise film detayındayken etkin görünüyor.
:::

## Kullanıcı bağlantısı mı, işlem sonucu mu?

Navigasyonun niyeti iki farklı olabilir. Bir menü öğesi kullanıcıya gideceği adresi sunar; adresi kopyalayabilir, yeni sekmede açabilir veya klavyeyle etkinleştirebilir. Bir formun kaydı başarıyla tamamlandığında ise uygulama kodu sonraki adımı seçebilir. İlk durumda gerçek bir link, ikincisinde programatik navigasyon uygundur.

![Kullanıcının bağlantı seçimi ile işlem sonrası yönlendirmenin farklı yolları](diagrams/navigasyon-karari.svg)

1. **Hedef önceden belliyse link kullan.** `Link` Router'ın uygulama içi geçişini yaparken `<a>` semantiğini korur. Kullanıcı link metnini görür ve tarayıcı davranışlarını kullanabilir.
2. **Link menüsünde aktif durumu göstermek gerekiyorsa NavLink seç.** Router mevcut adresin linkle eşleşip eşleşmediğini hesaplar; CSS veya `aria-current="page"` ile görünür kılabilirsin.
3. **İş tamamlandıktan sonra kod karar veriyorsa `useNavigate` kullan.** Form submit'i başarılı olduğunda veya bir akış adımı tamamlandığında route'a geçiş yapabilirsin. Bu kullanımda hedef kullanıcıya link olarak sunulmuyordur.
4. **History'de geri gitmek ile sabit adrese gitmek aynı değildir.** `navigate(-1)` önceki history kaydına döner. Kullanıcı detay adresini doğrudan yeni sekmede açtıysa uygulama içi önceki arama kaydı olmayabilir.
5. **Relative hedefin tabanını bil.** `to=".."` route hiyerarşisine göre bir üst parent'a çıkar; `to="/search"` uygulama kökünden açıkça başlar. Aynı metin farklı route bağlamında farklı hedef üretebilir.

Bu karar erişilebilirlik açısından da önemlidir. Bir buton “kaydet”, “sil” veya “gönder” gibi bir eylem başlatır. Bir link ise başka bir kaynağa götürür. Görsel olarak ikisi aynı tasarlanabilir; HTML semantiği ve tarayıcının sunduğu etkileşim davranışı farklıdır.

## Sabit dönüş adresi geçmişi silebilir

Aşağıdaki buton tıklandığında kullanıcı her koşulda ana sayfaya döner:

```tsx
function DetailActions() {
  const navigate = useNavigate()
  return <button onClick={() => navigate('/')}>Kapat</button>
}
```

Kod çalışır, ama kullanıcının nereden geldiğini atlar. Arama sonucu `?q=Matrix&page=2` ise o adres uygulama geçmişinde durabilir. Bir “Geri” eylemi gerçekten geçmişe dönmek anlamına geliyorsa relative history kullan; “Aramaya git” eylemi belirli bir hedef anlamındaysa o adresi açıkça link olarak sun.

```tsx check
import { Link, NavLink, useNavigate } from 'react-router'

export function ArticleActions() {
  const navigate = useNavigate()
  return (
    <>
      <nav aria-label="Kitaplık">
        <NavLink to="/" end>Raf</NavLink>
        <NavLink to="/authors">Yazarlar</NavLink>
      </nav>
      <Link to="/authors">Yazar listesini aç</Link>
      <button onClick={() => navigate(-1)}>Önceki ekrana dön</button>
    </>
  )
}
```

`Link` ve `NavLink` statik hedefin ne olduğunu kullanıcıya gösterir. `navigate(-1)` ise belirli bir URL'yi garanti etmez; history'deki bir önceki entry'yi seçer. Kapanış düğmesinin iş tanımında sabit hedef isteniyorsa `navigate('/search')` gibi açık hedef kullan; dönüş güvenli değilse ekranda sabit bir link de sun.

## Üç navigasyonu izleyelim

Arama sonucu `/search?q=Matrix&page=2` açık olsun. Kullanıcı bir film linkine basar ve `/movie/550` adresine gider. Router yeni route zincirini seçer. Kullanıcı “Önceki ekrana dön” düğmesine basarsa `navigate(-1)` history'deki arama entry'sini açar. Ama detay doğrudan `/movie/550` adresinden yeni sekmede açıldıysa history bir önceki uygulama route'unu içermeyebilir.

| Kullanıcı niyeti | Araç | Hedef davranışı | Yeni sekme/kopyalama |
| --- | --- | --- | --- |
| Menüyü aç | `NavLink` | Bilinen path'e gider, aktif state verir | Link davranışı korunur |
| “Tüm yazarları gör” | `Link` | Bilinen kaynak adresine gider | Link davranışı korunur |
| Kayıt başarıyla tamamlandı | `useNavigate` | İşlem sonucu kod hedefi seçer | Kullanıcıya link sunulmaz |
| Önceki ekrana dön | `navigate(-1)` | History'deki bir önceki entry | Önceki entry garanti değildir |

`NavLink`'in eşleşme kuralı menü hiyerarşisiyle birlikte düşünülür. Kök adres `/` birçok path'in başlangıç öneki olduğu için `end` olmadan `/authors` üzerinde de aktif görünebilir. `/authors` için `end` çoğu zaman gerekmez; alt yazar detaylarının da aynı menüyü etkin tutması beklenebilir.

## Geçmiş hareketi her zaman ürün niyeti değildir

`navigate(-1)` bir geçmiş hareketidir. Önceki entry'nin uygulama içinde olacağı garanti edilmez: kullanıcı linke dış bir siteden gelmiş olabilir, adresi doğrudan yazmış olabilir veya geçmişi temizlenmiş yeni sekmede açmış olabilir. Bu yüzden “önceki ekrana dön” gerçekten history davranışı bekliyorsa kullan; “filmlere dön” gibi ürünün sabit bir hedefi varsa o hedefi açık bir `/search` linkiyle sun.

History entry'lerinin bir başka özelliği de arama ve filtre değişiklikleriyle ilişkisidir. Her input harfinde yeni entry eklenirse kullanıcı geri tuşuyla karakter karakter geri gidebilir. Bazı uygulamalar ilk filtre değişimini history'ye koyup devamını mevcut entry'de değiştirir; bazıları form gönderilene kadar adresi güncellemez. Hangi davranış seçilirse seçilsin, URL ve görünür sonuç senkron kalmalı. Bu seçim bir performans hilesi değil, gezinme deneyimi kararıdır.

Relative hedefler route hiyerarşisine göre hesaplanır. `to=".."`, `..` segmenti URL path string'i kesmekten ziyade eşleşen route parent'ına döner. Bir path içinde `movie/:id` ve `cast` child'ı varsa `..` bir üst route seviyesini seçer; `to="/search"` ise nereden çağrıldığına bakmaz. Hangi parent'a dönmek istediğin belirsizse mutlak uygulama yolu daha açıktır.

Programatik navigasyonu bir işlem sonucuyla ilişkilendir. Örneğin profil formu sunucu tarafından kabul edilince detay ekranına geçmek uygundur; form her render'da “başarılı” state'i gördüğü için navigasyon çağırmak uygun değildir. Olayın gerçekleştiği yerde veya action sonucunda bir kez karar ver. Render saf kalır, route transition da beklenmedik tekrarlarla tetiklenmez.

Navigasyonun erişilebilir olması yalnız role adını ayarlamak değildir. Link odağa gelebilmeli, anlamlı görünen metne sahip olmalı ve aktif state renk dışında da duyurulabilmelidir. `NavLink` aktif olduğunda `aria-current="page"` üretir; uygulama bunu CSS ile vurgulayabilir. Bir button'ın etiketi ise yaptığı eylemi anlatmalıdır: “Önceki ekrana dön”.

Gelen URL veya state içinden next path alıyorsan sadece local path kabul et. `//host` gibi çift slash'lı bir değer tarayıcıda başka host'a gidebilir; mutlak URL de uygulama dışına çıkar. Güvenlikte bu open redirect olarak bilinir. Kullanıcıya link olarak gösterilecek her dış hedefin de protokolünü ve kaynağını kontrol et.

## History güvenliğine sınır koy

History geri dönüşünü tek bir düğmede kullanırken başarısız veya dışarıya giden yönlendirme üretme. Kullanıcıyı uygulama içi sabit bir hedefe dönmek gerekiyorsa bu adresi linkle göster. URL'den alınan `returnTo` gibi bir parametreyi doğrudan navigate etmek açık yönlendirme oluşturabilir; yalnızca izin verilen uygulama içi yolları kabul etmelisin. Bu modülde temel navigasyon ayrımını kuruyoruz; güvenlik modülünde açık yönlendirme riskini ayrıca ele alacaksın.

Bir form submit'inden sonra yönlendirme yaparken kodu event veya action sonucuna bağla; render sırasında `navigate` çağırma. Render'ın görevi mevcut state'ten arayüz hesaplamaktır. Her render'da route değiştirmek render döngüsüne veya istenmeyen geçişlere yol açabilir. İşlem sonucu bir defa karar verip yönlendir.

:::mistake[Belirti → neden → düzeltme]
Menü bağlantısı fareyle çalışıyor ama yeni sekmede açılamıyor → link görünümündeki öğe aslında `button` ve `navigate` çağırıyor → önceden belli adresi `Link` veya `NavLink` olarak sun.
:::

:::mistake[Belirti → neden → düzeltme]
Detaydan geri düğmesi doğrudan açılışta beklenmeyen sayfaya gidiyor → `navigate(-1)` history'de hangi entry'nin önce geldiğini garanti etmez → güvenli ve sabit bir dönüş adresi için ayrıca görünür link ver.
:::

:::mistake[Belirti → neden → düzeltme]
Kök menü öğesi her alt sayfada etkin → `/` linki prefix eşleşmesiyle child adresleri de kapsıyor → kök `NavLink` üzerine `end` ekle.
:::

:::model[URL state ve route kimliği]
Navigasyon URL'yi değiştirerek router'ın eşleşen route zincirini yeniden seçmesini sağlar. Ortak layout eşleşmede kalırsa React o parent'ın state'ini koruyabilir; outlet'teki yeni sayfa farklı component kimliği olduğu için önceki sayfanın yerel state'i korunmayabilir. Bu bağlamdaki karar yalnız “nereye git?” değil, kullanıcı eyleminin history ve link semantiğine ne anlatacağıdır.
:::

:::sector
Tasarım sistemleri navigasyon linklerini ve eylem butonlarını ayrı bileşenlerle sunar. Bu ayrım ekran okuyucuya doğru rolü verir, yeni sekme davranışını korur ve analitik olaylarını anlamlandırır. Ürün ekipleri ayrıca doğrudan açılan detay sayfalarında birincil dönüş rotasını belirler; önceki history kaydının varlığına bel bağlamaz.
:::

## Özet

- Bilinen hedef kullanıcıya link olarak sunulur; `NavLink` aktif menü state'i de sağlar.
- İşlem sonucunda yönlendirme gerektiğinde `useNavigate` kullanılır.
- `navigate(-1)` geçmişe döner ama önceki adresin ne olduğunu veya bulunacağını garanti etmez.
- Relative route hedefleri hiyerarşiye, slash ile başlayan hedefler uygulama köküne göre çözülür.
- Render sırasında navigasyon tetikleme; kullanıcı eylemi veya işlem sonucu anında yönlendir.

**Kendini yokla:** Menüde `/favorites` adresi biliniyorsa neden `button` yerine `Link` seçilir?

*Cevap:* Kullanıcıya adresi olan bir kaynak sunulur ve yeni sekme, kopyalama, klavye link davranışları korunur.

**Kendini yokla:** `navigate(-1)` neden doğrudan açılmış detayda güvenli tek dönüş yolu değildir?

*Cevap:* Önceki history entry'si başka site, boş başlangıç veya beklenmeyen bir adres olabilir.
