---
title: "Acı günlüğü: Saf veri çekmenin sınırları"
minutes: 8
kind: review
---

# Acı günlüğü: Saf veri çekmenin sınırları

:::pain[Problem]
Sinema v1 canlı çalışıyor; ana sayfada trendler akıyor, arama kutusu sonuç getiriyor ve film detayları kadrosuyla açılıyor. Ancak kullanıcı deneyiminde can sıkan bir gariplik var: Arama sayfasında "Matrix" arayıp bir filme tıklıyorsun; detay sayfasına bakıp tarayıcının geri tuşuna bastığında ekran bembeyaz kesiliyor, "Filmler yükleniyor..." uyarısı beliriyor ve az önce gördüğün filmler ancak yarım saniye sonra tekrar ekrana geliyor. Network sekmesini açtığında acı gerçekle yüzleşiyorsun: Tarayıcı aynı `/search/movie?query=Matrix` isteğini saniyeler önce tamamlamış olmasına rağmen sunucudan baştan istiyor!
:::

## İstekler neden tekrarlanıyor?

Bileşen düzeyinde saf `useEffect` ile veri çekildiğinde karşılaşılan ilk büyük darboğaz **yaşam döngüsü kaybıdır**.

Kullanıcı `/search?q=Matrix` sayfasındayken `SearchPage` bileşeni gelen film listesini kendi yerel `useState` değişkeninde tutar. Kullanıcı bir filme tıklayıp `/movie/550` rotasına geçtiğinde React Router arama sayfasını unmount eder (ekrandan söker). Bu anda `SearchPage` bileşeninin bellekteki tüm state'i silinir.

:::model[Effect yaşam döngüsü]
Modül 5.2'deki kuralı hatırla:  
**Mount → Effect Setup → (deps değişirse) Cleanup → Setup → Unmount → Cleanup.**  
Kullanıcı geri tuşuna bastığında `SearchPage` sıfırdan yeniden mount edilir. React için bu yeni bir başlangıçtır; yerel `data` boştur ve effect en baştan çalışarak aynı ağ isteğini tekrar tetikler.
:::

## Tekrar eden istekler neden HTTP önbelleği ile çözülmüyor?

Aklına şu soru gelebilir: *"Tarayıcının kendi HTTP önbelleği yok muydu? Modül 7.3'teki `Cache-Control` mekanizması bu isteği neden kurtarmıyor?"*

:::model[HTTP önbellek kararı]
Modül 7.3'teki karar ağacını anımsa: Tarayıcı kaynağı önbelleğe alabilmek için sunucudan gelen `Cache-Control` (`max-age`, `must-revalidate`) veya `ETag` başlığına bakar. Kaynak taze ise diskten sunar; bayat ise sunucuya `If-None-Match` ile sorar.
:::

Bu mekanizmanın bir SPA'da tek başına yetersiz kalmasının iki sebebi vardır:

1. **Dinamik API politikaları:** TMDB gibi REST API'leri, verilerin değişebileceği varsayımıyla arama uç noktalarına kısa süreli veya yeniden doğrulama gerektiren başlıklar (`no-cache` veya `max-age=0`) koyar. Tarayıcı önbelleğe alsa bile sunucuya gidip `304 Not Modified` yanıtı almak zorundadır; bu da her defasında ağ gecikmesi (round-trip) üretir.
2. **Arayüz titremesi (UI Flash):** Tarayıcı yanıtı diskten 5 milisaniyede getirse bile, React tarafında bileşen `loading = true` ile render edilir. Kullanıcı saliselik de olsa bir yüklenme titremesi görür. HTTP önbelleği ağ baytlarını saklar; ancak React bileşeninin **hazır JavaScript state modelini** saklayamaz.

Bu yüzden **ağ önbelleği (HTTP Cache)** ile ileride tanışacağımız **uygulama veri önbelleği (TanStack Query)** tamamen farklı iki katmandır.

## Dört sayfadaki kod tekrarı

Sinema v1'deki `HomePage.tsx`, `SearchPage.tsx`, `MovieDetailsPage.tsx` ve `FavoritesPage.tsx` dosyalarını açtığında aynı kod kalıplarının defalarca kopyalandığını görürsün:

- `const [loading, setLoading] = useState(true)`
- `const [error, setError] = useState<string | null>(null)`
- `const [data, setData] = useState(...)`
- `if (loading) return <p role="status">Yükleniyor...</p>`
- `if (error) return <div role="alert">{error}</div>`

Dört ayrı sayfada neredeyse aynı yükleme, hata ve veri durumları yönetilmektedir. Üstelik bir sayfada hata mesajı metin, diğerinde alert kutusu olarak verilmiş; tutarsızlıklar başlamıştır.

## Rota içi geçişte eski içerik tuzağı

Bir diğer acı noktası detay rotasında ortaya çıkar: `/movie/550` (Dövüş Kulübü) sayfasındayken aynı sayfa içinde `/movie/27205` (Başlangıç) filmine geçildiğinde `MovieDetailsPage` unmount olmadan yeni parametreyle render edilir.

Eğer `useEffect` bağımlılık dizisine `id` eklenmemişse (`[]` bırakılmışsa), URL değişmesine rağmen effect tekrar çalışmaz ve kullanıcı "Başlangıç" adresinde hâlâ "Dövüş Kulübü" filmini okur.

:::sector
Kıdemli bir geliştirici sorunu metriklerle belgeler: *"Arama sayfasından detaya gidip geri dönüldüğünde aynı sorgu için 2 gereksiz GET isteği atılıyor; unmount sebebiyle bileşen state'i sıfırlanıyor ve kullanıcıya 400 ms yükleme ekranı gösteriliyor."* Sorunu somut kanıtlarla belgelediğinde, sonraki modüllerde seçeceğin durum yönetim araçlarının gerekçesi kendiliğinden netleşir.
:::

## Özet

- Saf `useEffect` veri çekme yaklaşımında sayfa değiştiğinde bileşen unmount olur ve yerel state silinir; geri dönüldüğünde aynı istek tekrarlanır.
- Tarayıcının HTTP önbelleği ağ katmanında çalışır; REST API'lerin dinamik başlıkları ve React bileşenlerinin `loading` başlangıç durumu nedeniyle arayüz titremesini tek başına engelleyemez.
- `HomePage`, `SearchPage`, `MovieDetailsPage` ve `FavoritesPage` üzerinde `loading`, `error` ve `data` yönetimi kopyala-yapıştır kod tekrarına yol açar.
- Rota parametrelerine bağlı effect'lerde bağımlılık dizisinin eksik bırakılması, rota değiştiğinde ekranda bayat veri kalmasına yol açar.

---

### Kendini yokla

**1. `/search?q=Matrix` sayfasından detaya gidip tarayıcının geri tuşuyla döndüğünde, sunucu 304 Not Modified dönse dahi kullanıcı neden bir anlık yüklenme ekranı görür?**
*(Cevap: Çünkü `SearchPage` bileşeni sayfadan ayrılırken unmount edilmiş ve state'i sıfırlanmıştır. Geri dönüldüğünde bileşen `loading = true` ile baştan render edilir; tarayıcı HTTP cevabını hızlıca önbellekten getirse bile o süre zarfında kullanıcı yüklenme durumunu görür.)*

**2. `/movie/550` sayfasından `/movie/155` filmine tıklandığında ekranda hâlâ 550 numaralı filmin kalmasının temel sebebi nedir?**
*(Cevap: Detay sayfasındaki `useEffect` bağımlılık dizisine `id` parametresi eklenmemiştir. Bileşen unmount olmadan yalnızca props/parametre güncellendiği için effect yeni istek atmamıştır.)*
