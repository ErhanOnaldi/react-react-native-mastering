---
title: "İzleme listesine kapı koy"
minutes: 15
kind: concept
---

# İzleme listesine kapı koy

:::pain[Sinema'da bağlantıyı gizleyince korundu sanmak]
Sinema'da kullanıcı oturum açmadığında üst menüdeki "İzleme Listelerim" bağlantısını gizledin. Arayüzde hiçbir link görünmüyor. Ancak meraklı bir kullanıcı tarayıcının adres çubuğuna doğrudan `https://sinema.local/watchlists` yazıp Enter'a basıyor ve sayfa tüm bileşenleriyle açılıyor! Ekranda ne bir hata var ne de bir yönlendirme. Çünkü arayüzde bir bağlantıyı koşullu render etmek (`isLoggedIn && <Link to="/watchlists">`), o URL'yi korumak anlamına gelmez.
:::

## Arayüz kapısı ile veri güvenliği arasındaki ayrım

Tek sayfa uygulamalarında (SPA) URL değiştiğinde sunucuya yeni bir HTML sayfası isteği gitmez; React Router tarayıcının adres çubuğunu dinleyerek eşleşen React bileşen ağacını ekrana çizer.

Bir route'un "korumalı" (protected route) olması iki farklı katmanda değerlendirilir:

1. **İstemci Gezinti Deneyimi (UX Guard):** Giriş yapmamış bir kullanıcı korumalı bir adresi açmaya çalıştığında, onu boş veya yarım yamalak kırık bir sayfayla baş başa bırakmak yerine giriş sayfasına (`/login`) yönlendirmektir. Bu katman tamamen kullanıcı deneyimiyle ilgilidir.
2. **Sunucu Veri Yetkilendirmesi (Security Boundary):** Kullanıcı istemci tarafındaki JavaScript kodunu manipüle etse, yönlendirmeyi iptal etse veya bileşeni zorla render etse dahi, API sunucusu geçerli bir `Authorization: Bearer <token>` başlığı olmadan tek bir bayt gizli veri vermemelidir.

İstemci tarafındaki koruma bir güvenlik kalkanı değil, bir **rehberlik mekanizmasıdır**. Gerçek güvenlik her zaman sunucu API'sindedir.

:::model[URL state]
URL uygulamanın tek ve paylaşılabilir doğru durum kaynağıdır. Kullanıcı bir bağlantıyı kopyalayıp arkadaşına gönderdiğinde veya yer imlerine eklediğinde o adrese doğrudan erişebilmelidir. Korumalı route mimarisi, bu URL doğasını bozmadan araya bir kontrol katmanı yerleştirir.
:::

![Korumalı route kapısı: oturum kontrolü, Outlet ve yönlendirme](diagrams/korumali-route-mantigi.svg "Korumalı route kapısı oturum kontrolü, Outlet ve Navigate yönlendirmesini gösterir.")

Korumalı route mimarisinin kesin kuralları:

1. **Yolsuz Layout Route (Pathless Layout Route) deseni:** Korumayı her bir sayfa bileşeni (`WatchlistsPage`, `ProfilePage`, `SettingsPage`) içine tek tek `useEffect` yazarak kopyalamak mimari bir hatadır. React Router'ın yolsuz layout yapısı kullanılır; tek bir ebeveyn kapı bileşeni altındaki tüm çocuk sayfaları (`children`) ortaklaşa korur.
2. **Oturum açıksa `<Outlet />`, kapalıysa `<Navigate />`:** Kapı bileşeni oturum geçerliyse çocuk route'ların ekrana basılabilmesi için `<Outlet />` döndürür. Oturum yoksa derhal `<Navigate to="/login" replace />` ile giriş ekranına geçiş yapar.
3. **`replace: true` zorunluluğu:** Giriş sayfasına yönlendirirken `replace` parametresi kullanılmalıdır. Eğer `replace` verilmezse tarayıcı geçmişine (history stack) yeni bir adım eklenir (`push`). Kullanıcı login ekranındayken tarayıcının "Geri" butonuna bastığında tekrar korumalı sayfaya gitmeye çalışır; korumalı sayfa onu tekrar login'e atar ve kullanıcı geri tuşuyla çıkamadığı bir geçmiş tuzağına (history trap) hapsolur.
4. **Dönüş yolunu (`state.from`) saklama:** Kullanıcı `/watchlists?filter=recent` sayfasına gitmek isterken login'e yönlendirildiyse, nereye gitmek istediği bilgisi kaybolmamalıdır. Mevcut konum `state={{ from: location }}` olarak `Navigate` bileşenine verilir. Kullanıcı giriş yaptığında bu hedef okunarak kaldığı yere geri gönderilir (açık yönlendirmeyi önlemek için bu değer Modül 17.11'de göreceğimiz gibi doğrulanmalıdır).
5. **Yüklenme durumunu bekleme (Flash of Redirect engeli):** Sayfa ilk açıldığında veya F5 yapıldığında depolamadaki token henüz okunuyor veya doğrulanıyor olabilir (`isLoading: true`). Durum kesinleşmeden erkenden yönlendirme kararı verilirse, aslında oturumu açık olan kullanıcı saliseliğine login ekranına atılır veya sayfa yanıp söner. Kontrol tamamlanana kadar bir yükleme göstergesi (spinner) çizilmelidir.

## Gezinti akışının adım adım izlenmesi

Kullanıcının izleme listesine erişim denemesini adım adım karşılaştıralım:

| Senaryo | Hedef URL | Oturum Durumu | Kapı Bileşeninin Kararı | Ekrana Basılan | Tarayıcı Geçmişi |
| --- | --- | --- | --- | --- | --- |
| **Giriş Yapmış Kullanıcı** | `/watchlists` | `signedIn = true` | `return <Outlet />` | `WatchlistsPage` içeriği | Normal gezinme |
| **Girişsiz Kullanıcı** | `/watchlists` | `signedIn = false` | `return <Navigate to="/login" replace state={{ from }} />` | `LoginPage` içeriği | `/watchlists` adresi `/login` ile ezilir |
| **Giriş Tamamlandıktan Sonra** | `/login` | Giriş başarılı oldu | `state?.from` okunur | Kullanıcı doğrudan `/watchlists` sayfasına uçar | Dönüş tamamlanır |

## Önce kırık, sonra doğru: Layout route kapısı

Örnek olarak bir kurumsal yönetim panelini (`/admin/dashboard` ve `/admin/audit-logs`) ele alalım.

### Kırık örnek

Aşağıdaki koruma yaklaşımı her sayfada tekrarlanmakta ve geçmiş tuzağı yaratmaktadır:

```tsx
// TEHLİKELİ VE KIRIK İMPLEMENTASYON
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export function AdminDashboardBroken({ isAuth }: { isAuth: boolean }) {
  const navigate = useNavigate()

  useEffect(() => {
    // HATA 1: Render tamamlandıktan SONRA çalışır; yetkisiz kullanıcı
    // saliseliğine özel paneli ve verileri görür (Flash of Unauthenticated Content)!
    if (!isAuth) {
      // HATA 2: replace kullanılmamış! Geri tuşuna basınca tekrar buraya gelir.
      // HATA 3: Geldiği hedef URL saklanmamış; login sonrası nereye döneceğini bilemez.
      navigate('/login')
    }
  }, [isAuth, navigate])

  return <div>Gizli Yönetim Kurulu Raporları...</div>
}
```

Bu kod iki ciddi soruna yol açar:
1. `useEffect` render'dan sonra çalıştığı için sayfa ilk açıldığında `Gizli Yönetim Kurulu Raporları...` metni ekrana boyanır (paint edilir), hemen ardından yönlendirme gerçekleşir. Ağır çekimde veya ekran kaydedicilerde gizli içerik sızar.
2. `replace` olmadığı için kullanıcı login ekranında "Geri" butonuna tıklayamaz.

### Doğru örnek

Sayfayı hiç render etmeden engelleyen, hedefi saklayan ve temiz layout sağlayan derlenebilir kapı bileşeni:

```tsx check
import { Navigate, Outlet, useLocation } from 'react-router'

export interface PortalSecurityGateProps {
  hasValidSession: boolean
  isResolvingSession?: boolean
}

export function PortalSecurityGate({
  hasValidSession,
  isResolvingSession = false,
}: PortalSecurityGateProps) {
  const location = useLocation()

  // 1. Oturum henüz depodan okunuyor veya doğrulanıyorsa bekle
  if (isResolvingSession) {
    return (
      <div role="status" style={{ padding: '2rem', textAlign: 'center' }}>
        <span>Oturum durumu kontrol ediliyor...</span>
      </div>
    )
  }

  // 2. Oturum yoksa hedef adresi kaydederek giriş ekranına yönlendir
  if (!hasValidSession) {
    return (
      <Navigate
        to="/portal-login"
        replace
        state={{ originalTargetLocation: location.pathname + location.search }}
      />
    )
  }

  // 3. Oturum geçerliyse alt route'ları güvenle çiz
  return <Outlet />
}
```

Bu bileşeni React Router ağacında nasıl konumlandırırız?

```tsx title="src/routes.tsx"
import { createBrowserRouter } from 'react-router'

export function createApplicationRoutes(isLoggedIn: boolean) {
  return createBrowserRouter([
    // Açık sayfalar
    { path: '/portal-login', element: <LoginPage /> },
    { path: '/', element: <HomePage /> },

    // Korumalı route grubu (Yolsuz Layout)
    {
      element: <PortalSecurityGate hasValidSession={isLoggedIn} />,
      children: [
        { path: '/admin/dashboard', element: <AdminDashboard /> },
        { path: '/admin/audit-logs', element: <AuditLogs /> },
        { path: '/admin/settings', element: <AdminSettings /> },
      ],
    },
  ])
}
```

Artık `/admin/` altındaki 10 farklı sayfa için tek bir satır ekstra kontrol yazmaya gerek kalmaz. Tüm koruma deklaratif olarak router seviyesinde sağlanır.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: replace bayrağını unutarak geri tuşu kilitlenmesi yaratmak]
Belirti → Kullanıcı korumalı bir linke tıklayıp login'e yönlendirildiğinde tarayıcının "Geri" tuşuna basınca bir türlü önceki sayfaya dönememesi.  
Neden → `<Navigate to="/login" />` varsayılan olarak `push` yapar; geçmişe yeni bir satır ekler. Geri tuşu kullanıcıyı tekrar korumalı sayfaya götürür, o da tekrar login'e atar.  
Düzeltme → Yönlendirme etiketine mutlaka `replace` ekle: `<Navigate to="/login" replace />`.
:::

:::mistake[Sık hata: /login sayfasını da korumalı route çocukları arasına yazmak]
Belirti → Tarayıcıda "Maximum call stack size exceeded" hatası veya sayfanın hiçbir şey render etmeden kilitlenmesi.  
Neden → Giriş yapılmadığında `/login` adresine gidiliyor, ancak `/login` route'u da korumalı grubun içinde olduğu için tekrar `/login`'e yönlendirme tetikleniyor (sonsuz döngü).  
Düzeltme → Giriş, kayıt ve parola sıfırlama gibi genel sayfaları korumalı layout'un dışında, en üst seviyede tut.
:::

:::mistake[Sık hata: İstemci korumasını gerçek güvenlik sanıp API yetkisini unutmak]
Belirti → Kullanıcı tarayıcı konsolunda JavaScript state'ini değiştirip sayfayı açabiliyor ve verileri okuyabiliyor.  
Neden → Yalnızca React Router'da kapı koyup sunucu uç noktalarında `Authorization` başlığı kontrolü yapmamak.  
Düzeltme → İstemcideki koruma yalnızca kullanıcı deneyimi içindir. API sunucusunun her yetkili çağrıda JWT imzasını doğrulaması şarttır.
:::

:::mistake[Sık hata: Başlatma anında erken yönlendirip oturumu düşürmek]
Belirti → Sayfa yenilendiğinde (F5) kullanıcı saliseliğine login ekranını görüp hemen ardından ana sayfaya dönüyor (ekran titremesi).  
Neden → Depodan token okunurken geçen asenkron sürede `isLoggedIn = false` varsayılıp anında `<Navigate />` döndürülmesi.  
Düzeltme → Oturum durumu netleşene kadar bir yükleme ara durumu (`isResolvingSession`) tanımla ve yönlendirmeyi durum kesinleştikten sonra yap.
:::

:::sector
Kurumsal SaaS platformlarında korumalı route'lar yalnızca "giriş yapıldı mı?" kontrolüyle sınırlı kalmaz. **Rol Tabanlı Erişim Kontrolü (RBAC - Role-Based Access Control)** uygulanır:

```tsx
<RoleGate allowedRoles={['billing_admin', 'super_admin']}>
  <Outlet />
</RoleGate>
```

Kullanıcı giriş yapmış olsa bile yetkili role sahip değilse, login ekranına değil; özel bir **403 Forbidden ("Bu sayfayı görüntüleme yetkiniz yok")** sayfasına yönlendirilir.

Ayrıca başarılı giriş sonrasında kullanıcının yönlendirileceği hedef yol (`state.from`), açık yönlendirme (open redirect) saldırılarına karşı mutlak biçimde doğrulanır: Hedef adresin harici bir etki alanına (`https://evil.com`) ya da çift eğik çizgiye (`//evil.com`) çıkmadığından emin olunur (Modül 17.11).
:::

## Özet

- Route koruması bir gezinme deneyimidir; veri güvenliği sunucu API'sinde sağlanır.
- Yolsuz layout route (`<Outlet />`), birden fazla alt sayfayı tek merkezden korur.
- Girişsiz kullanıcılar `<Navigate to="/login" replace />` ile yönlendirilmeli; geri tuşu döngüsü engellenmelidir.
- Kullanıcının gitmek istediği özgün adres `state={{ from: location }}` ile saklanmalı, girişten sonra oraya dönülmelidir.
- Oturum durumu depodan yüklenirken erken yönlendirme yapılmamalı, yüklenme durumu beklenmelidir.

**Kendini yokla:** `<Navigate to="/login" />` yazarken `replace` prop'u verilmezse ne tür bir kullanıcı deneyimi hatası oluşur?  
*Cevap:* Yönlendirme tarayıcı geçmişine yeni bir kayıt olarak eklenir (`push`). Kullanıcı login ekranındayken tarayıcının "Geri" düğmesine bastığında tekrar korumalı sayfaya gider; o sayfa kullanıcıyı tekrar login ekranına fırlatır ve kullanıcı geri tuşunu kullanamaz hale gelir.

**Kendini yokla:** Giriş yapmamış bir kullanıcı `/profile` sayfasına gitmek istediğinde hedef adres neden saklanmalıdır?  
*Cevap:* Kullanıcı login ekranında bilgilerini girdikten sonra doğrudan ana sayfaya atılmak yerine, ilk başta gitmek istediği `/profile` sayfasına otomatik olarak ulaştırılabilmesi için hedef adres saklanır.
