---
title: "İzleme listesine kapı koy"
minutes: 15
kind: concept
---

# İzleme listesine kapı koy

Sinema'da oturum yokken üst menüdeki “İzleme Listelerim” bağlantısını gizleyebilirsin. Ama kullanıcı adres çubuğuna `/watchlists` yazarsa ne olur? Bu adresi göstermenin kararını menü değil, o adrese karşılık gelen route verir. **Route**, URL ile ekranda gösterilecek React sayfası arasındaki eşlemedir.

## Gizli bağlantı sayfayı korumaz

Menüde bağlantıyı koşullu göstermek normaldir:

```tsx
{isAuthenticated && <Link to="/watchlists">İzleme Listelerim</Link>}
```

Oturum kapalıysa link görünmez; fakat kullanıcı URL'yi doğrudan açmayı deneyebilir. Link görünürlüğü yalnızca gezinmeyi kolaylaştırır, sayfanın gösterilip gösterilmeyeceğini denetlemez. Bu nedenle erişim kararını route ağacında vermeliyiz.

Bir route bileşeni yalnızca oturum varsa alt sayfayı göstermeli. React Router'da `<Outlet />`, eşleşen alt route'un içeriği için ayrılmış yerdir:

```tsx
import { Outlet } from 'react-router'

function WatchlistLayout({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) return <p>Giriş yapmalısın.</p>
  return <Outlet />
}
```

Burada oturum açıksa çocuk route ekrana gelir; kapalıysa içerik görünmez. Tek bir koruma bileşenini birden çok alt route'un ebeveyni yapmak, her sayfada aynı kontrolü tekrarlamaktan daha kolaydır. Bu ebeveyn düzenine **layout route** denir.

Route ağacında bu ilişkiyi şöyle düşünebilirsin: `WatchlistLayout` altında `/watchlists` ve `/profile` gibi alt sayfalar bulunur. Kullanıcı hangi alt adrese giderse gitsin önce ebeveynin oturum kontrolünden geçer; oturum açıksa yalnızca seçilen alt sayfa `Outlet` yerinde görünür. Böylece kontrolün her sayfaya kopyalanıp birinde unutulması önlenir.

## Giriş sayfasına yönlendir

“Giriş yapmalısın” yazmak yerine, oturum yokken giriş sayfasına gidebiliriz. `<Navigate />` React Router'ın render sırasında başka bir adrese geçiş yapmasını sağlar:

```tsx
import { Navigate, Outlet } from 'react-router'

function WatchlistLayout({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) return <Navigate to="/login" />
  return <Outlet />
}
```

Artık oturum kapalıyken çocuk sayfa gösterilmez. Bir ayrıntı kaldı: girişe yönelince tarayıcının Geri düğmesi korumalı URL'ye dönebilir ve aynı yönlendirmeyi tekrar başlatabilir.

`replace`, geçerli geçmiş kaydını yeni kayıtla değiştirmeyi söyler. Böylece korumalı URL giriş sayfasının arkasında kalmaz:

```tsx
return <Navigate to="/login" replace />
```

`replace` olmadan yönlendirme yeni bir geçmiş kaydı ekler. Kullanıcı login'de Geri'ye basınca `/watchlists`'e döner; kapı onu tekrar login'e yollar. Bu döngü, Geri düğmesini kullanışsız hale getirir.

Bu karar route eşleşirken verildiği için yetkisiz çocuk sayfa render edilmez. Sayfanın içinde önce özel içeriği çizip sonra `useEffect` ile başka yere gitmek daha geç bir karardır; bu arada içerik kısa süre görünebilir. Ebeveyn kapısı, kullanıcıya özel sayfaların hepsinde aynı erken kararı verir.

## Girişten sonra kaldığın yere dön

Kullanıcı belki `/watchlists` değil, `/profile` açmaya çalışıyordu. **Location**, geçerli URL konumunu (yol ve ek arama bilgilerini) temsil eder. Onu yönlendirme sırasında `state` içine koyabiliriz; `state` bu geçişle taşınan ek bilgidir:

```tsx
import { Navigate, Outlet, useLocation } from 'react-router'

function ProfileLayout({ isAuthenticated }: { isAuthenticated: boolean }) {
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
```

Örneğin `/profile` adresinden gelen kullanıcı login'e giderken `from: '/profile'` bilgisini taşır. Giriş başarılı olduğunda login sayfası bu hedefi okuyup kullanıcıyı başladığı yere geri gönderebilir. URL böylece paylaşılabilir ve doğrudan açılabilir kalır; araya yalnızca bir karar kapısı eklenir.

Bu davranış kullanıcının niyetini de korur. Bir arkadaşının gönderdiği `/watchlists` bağlantısını açmış olabilir; oturum açtıktan sonra onu ana sayfaya göndermek yerine istediği sayfaya döndürürsün. `from` bilgisini taşımak, korunan sayfayı login ekranına yönlendirmeden önce kaydettiğimiz küçük bir yol bilgisidir.

## Birden çok sayfanın gezinti izi

Aşağıdaki küçük tablo, aynı layout kapısının iki alt sayfada verdiği kararı gösterir:

| Adım | Ziyaret edilen adres | Oturum | Kapının sonucu | Tarayıcı geçmişi |
| --- | --- | --- | --- | --- |
| 1 | `/watchlists` | Açık | `<Outlet />`; izleme listesi gösterilir | Adres değişmez |
| 2 | `/profile` | Kapalı | `/login` adresine `replace` ile geçilir; `from: '/profile'` saklanır | Korunan adres geçmişte bırakılmaz |
| 3 | `/login` | Giriş başarılı | Login sayfası `from` değerine döner | Kullanıcı `/profile`'da devam eder |

![Korumalı route kapısı: oturum kontrolü, Outlet ve yönlendirme](diagrams/korumali-route-mantigi.svg "Korumalı route kapısı oturum kontrolü, Outlet ve Navigate yönlendirmesini gösterir.")

Oturum kontrolünün ne işe yaradığını doğru sınırlandırmak önemli: client tarafındaki kapı sayfayı normal gezinmede göstermemeye yarar. Tarayıcıdaki JavaScript değiştirilebilir; gizli veriyi koruma yetkisi API sunucusundadır ve o sunucu yetkili isteklerde token'ı ayrıca doğrulamalıdır.

:::mistake[Belirti: sayfa bir an görünüp sonra login'e atıyor]
Özel sayfanın içeriği kısacık görünüyorsa ve sonra yönleniyorsa, kontrolü `useEffect` içinde yapıyor olabilirsin. `useEffect` ekran çizildikten sonra çalışır; bu sırada bileşen içeriği görünmüştür. Route kararını render sırasında `<Outlet />` ya da `<Navigate />` döndürerek ver.
:::

:::info[Derinlemesine (isteğe bağlı)]
Kullanıcının rolüne göre erişim kısıtlamaya **RBAC** (role-based access control, role göre erişim kontrolü) denir. Örneğin yalnızca editör rolü film düzenleme route'unu açabilir; bu kontrol de gerçek veri güvenliği için API'de uygulanmalıdır. Login sonrası `state.from` içinden gelen adres de kullanılmadan önce aynı uygulama içinde güvenli bir yol olduğundan doğrulanmalıdır; aksi halde başka siteye yönlendirme riski doğar.
:::

## Özet

- Menüyü saklamak, URL'yi korumaz; erişim kararını route bileşeni verir.
- Bir `layout route`, `<Outlet />` ile çocuk sayfaları ortak bir kapıdan geçirir.
- Oturum yoksa `<Navigate to="/login" replace />` ile yönlendir; `replace` geri tuşu döngüsünü önler.
- İstenen yolu `state.from` içinde taşıyarak girişten sonra oraya dönebilirsin.
- Client route kapısı gezinme deneyimini düzenler; API sunucusu veriye erişimi ayrıca doğrular.

**Yeni terimler**

- **Route:** Bir URL ile gösterilecek sayfa arasındaki eşleme.
- **Layout route / `Outlet`:** Alt route'ları ortak kapıdan geçiren ebeveyn düzeni / seçilen alt sayfanın gösterildiği yer.
- **`Navigate` / `replace`:** Route içinden gezinme yapan bileşen / geçerli geçmiş kaydını yenileyen seçeneği.
- **Location:** Geçerli URL konumu; `useLocation` ile okunur.
- **Route `state`:** Gezinmeyle taşınan ek bilgi; burada ilk istenen yolu saklar.

**Kendini yokla:** Neden bağlantıyı gizlemek tek başına `/watchlists` sayfasını korumaz?  
*Cevap:* Kullanıcı URL'yi doğrudan açabilir; bağlantı menüde görünür mü diye bakmaz.

**Kendini yokla:** `replace` eklenince Geri düğmesinde ne değişir?  
*Cevap:* Girişe giderken korumalı URL geçmişte bırakılmaz; Geri düğmesi aynı korumalı adrese dönüp tekrar login'e yönlendirilmez.
