---
title: "Çıkıştan sonra eski veri görünmesin"
minutes: 15
kind: concept
---

# Çıkıştan sonra eski veri görünmesin

:::pain[Sinema'da kullanıcı değişince önceki profili görmek]
Emily ortak kullanılan bir bilgisayarda Sinema'ya giriş yaptı, izleme listesini düzenledi ve "Çıkış Yap" butonuna bastı. Hemen ardından arkadaşı Can aynı tarayıcıda kendi hesabıyla oturum açtı. Ancak Can profil sayfasına girdiğinde korkunç bir an yaşanıyor: Ekranda ilk 2 saniye boyunca Emily'nin profil resmi, e-postası ve özel izleme listesi görünüyor! Hatta Redux DevTools açıldığında Emily'nin film notlarının hâlâ state'te durduğu fark ediliyor. Çıkış işlemi yalnızca token'ı silmiş; ancak bellekteki store'u ve TanStack Query önbelleğini geride bırakmıştır.
:::

## Oturum sınırı ve veri sızıntısı (Data Leakage)

Web uygulamalarında çıkış (logout) işlemi, giriş yapmak kadar kritik bir güvenlik ve gizlilik adımıdır. Bir kullanıcının oturumu sona erdiğinde, uygulamanın o kullanıcıya ait bildiği tüm verileri geride hiçbir iz bırakmayacak şekilde yok etmesi gerekir.

Modern bir React uygulamasında veri tek bir yerde durmaz; farklı yaşam döngülerine sahip birden fazla katmana dağılmıştır:
1. **İstemci Depolama Katmanı (`localStorage` / `sessionStorage`):** Kalıcı token'lar ve oturum bilgileri.
2. **Global İstemci Durumu (Redux Store):** Kullanıcının favorileri, UI tercihleri ve bildirimleri.
3. **Sunucu Durumu Önbelleği (TanStack Query Cache):** Profil verileri, film listeleri ve önbelleğe alınmış API yanıtları.

Eğer çıkış fonksiyonunuz yalnızca token'ı silip kullanıcıyı ana sayfaya yönlendirirse, TanStack Query ve Redux içinde kalan bayat veriler yeni bir kullanıcı geldiğinde ekrana fırlar. Bu durum hem KVKK / GDPR kapsamında ciddi bir kişisel veri sızıntısıdır hem de arayüzde açıklanamayan tutarsızlıklara yol açar.

:::model[Redux veri akışı]
Redux'ta state tek bir store ağacında toplanır. Bir action dispatch edildiğinde reducer'lar yeni state üretir ve selector'lar aracılığıyla UI güncellenir. Çıkış anında auth ve kullanıcıya ait tüm slice'ların başlangıç durumuna (initialState) döndürülmesi gerekir.
:::

:::model[Query önbellek yaşam döngüsü]
TanStack Query bir veriyi çektiğinde onu hafızada tutar (`fresh` veya `stale`). Normal sayfa geçişlerinde `stale` veri hemen ekranda gösterilirken arka planda sessizce taze veri çekilir. Ancak kullanıcı değiştiğinde eski kullanıcının verisi "bayat veri" muamelesi görmemelidir; derhal hafızadan kazınmalıdır.
:::

![Çıkış ve temizlik akışı: depolama, store ve query önbelleği](diagrams/cikis-temizlik-katmanlari.svg "Çıkış ve temizlik akışı depolama, store ve query önbelleği sıfırlamasını gösterir.")

Çıkış ve temizlik mimarisinin kesin kuralları:

1. **Çıkışın atomikliği:** Çıkış işlemi birbiriyle koordineli üç ayağı aynı anda tamamlamalıdır:
   - Kalıcı depodaki oturum anahtarları silinmelidir (`localStorage.removeItem`).
   - Redux store'daki kullanıcıya özel durumlar sıfırlanmalıdır (`dispatch(resetState())`).
   - TanStack Query önbelleğinin tamamı boşaltılmalıdır (`queryClient.clear()`).
2. **`queryClient.clear()` zorunluluğu (`invalidateQueries` YASAKTIR):**
   - `invalidateQueries()` çağrısı önbellekteki veriyi **silmez**; yalnızca "bayat" (stale) olarak etiketler ve arka planda yeniden çekilmesini emreder. Bu, çıkış senaryosunda ölümcül bir hatadır! Çünkü yeni kullanıcı gelene kadar eski kullanıcının verisi ekranda kalır, üstelik eski parametrelerle sunucuya yetkisiz istekler fırlar.
   - `queryClient.clear()` ise önbellekteki tüm sorguları ve mutasyonları kökünden söker atar (`evict`). Yeni kullanıcı giriş yaptığında önbellek bomboştur; eski verinin 1 milisaniye bile ekranda belirmesi imkansız hale gelir.
3. **Çift tetikleyici ilkesi (Kullanıcı eylemi + Otomatik çıkış):** Çıkış fonksiyonu yalnızca kullanıcı arayüzdeki "Çıkış Yap" düğmesine bastığında değil; arka planda refresh token süresi dolduğunda (`403 Forbidden`) da otomatik olarak çalıştırılmalıdır. Her iki durum da aynı merkezi temizlik fonksiyonunu tetiklemelidir.
4. **Yönlendirme sırası:** Önce tüm temizlik işlemleri tamamlanmalı, ardından kullanıcı giriş sayfasına veya ana sayfaya yönlendirilmelidir. Yönlendirme temizlikten önce yapılırsa, henüz silinmemiş önbellek geçiş anında ekrana yansıyabilir.

## İki çıkış yönteminin karşılaştırılması

Çıkış yapıldığında `invalidateQueries` ile `clear` arasındaki dramatik farkı adım adım izleyelim:

| Aşama | `invalidateQueries()` ile Hatalı Çıkış | `queryClient.clear()` ile Güvenli Çıkış |
| --- | --- | --- |
| **1. Kullanıcı Çıkış Yaptı** | Token silindi, sorgular "stale" yapıldı | Token silindi, tüm önbellek tamamen yok edildi |
| **2. Önbellekteki Durum** | `['profile']` anahtarında hâlâ Emily'nin verisi duruyor! | Önbellek bomboş (`undefined`) |
| **3. Can Giriş Yaptı** | `useQuery(['profile'])` önbellekteki Emily verisini anında ekrana basar! | Önbellek boş olduğu için doğrudan yüklenme (`loading`) durumuna geçer |
| **4. Ağ İsteği** | Arka planda Can'ın token'ıyla profil istenir | Ön planda Can'ın profil isteği başlatılır |
| **5. Kullanıcı Deneyimi** | **HATA:** Can 2 saniye boyunca Emily'nin bilgilerini okur! | **GÜVENLİ:** Can temiz bir yükleme görür, ardından kendi profili açılır |

## Önce kırık, sonra doğru: Çıkış koordinatörü

Örnek olarak bir kurumsal çalışma alanı oturum sonlandırma modülünü (`WorkspaceSessionCoordinator`) inceleyelim.

### Kırık örnek

Aşağıdaki çıkış fonksiyonu önbellek temizliğini yüzeysel yapmakta ve veri sızıntısına kapı aralamaktadır:

```ts
// TEHLİKELİ VE KIRIK İMPLEMENTASYON
import { QueryClient } from '@tanstack/react-query'

export function terminateSessionBroken(queryClient: QueryClient) {
  // HATA 1: localStorage'daki token silinmiyor, F5 yapınca oturum geri geliyor!

  // HATA 2: invalidateQueries veriyi silmez, bayat olarak bellekte tutar!
  queryClient.invalidateQueries()

  // HATA 3: Redux store sıfırlanmadı, sepet ve özel liste state'te kaldı!

  window.location.href = '/login'
}
```

Bu fonksiyon çalıştırıldığında eski kullanıcının kişisel kayıtları bellekte çakılı kalır.

### Doğru örnek

Tüm katmanları koordine eden, bağımlılıkları enjekte edilebilir ve derlenebilir profesyonel çıkış yardımcısı:

```ts check
import { QueryClient } from '@tanstack/react-query'

export interface StorageAdapter {
  removeEntry: (key: string) => void
}

export interface SessionTeardownDependencies {
  clientQueryEngine: QueryClient
  permanentStorage: StorageAdapter
  resetApplicationState: () => void
}

const STORAGE_SESSION_KEY = 'enterprise_portal_session'

export function executeCompleteSessionTeardown({
  clientQueryEngine,
  permanentStorage,
  resetApplicationState,
}: SessionTeardownDependencies): void {
  // 1. Kalıcı depodaki token'ları ve oturum anahtarlarını sil
  try {
    permanentStorage.removeEntry(STORAGE_SESSION_KEY)
  } catch {
    // Depolama erişim hatalarında sessiz kal ama akışı durdurma
  }

  // 2. Global client state'ini (Redux vb.) başlangıç durumuna döndür
  resetApplicationState()

  // 3. TanStack Query önbelleğindeki tüm sorgu ve mutasyonları kökten temizle
  // DİKKAT: invalidateQueries DEĞİL, clear() kullanılmalıdır!
  clientQueryEngine.clear()
}
```

Bu fonksiyon:
- Bağımlılıkları parametre olarak alarak test edilebilirliği en üst düzeye çıkarır.
- `permanentStorage.removeEntry` ile diskteki kaydı temizler; kullanıcı F5 yapsa bile eski oturum canlanamaz.
- `resetApplicationState` ile Redux'taki tüm kullanıcı slice'larını temizler.
- `clientQueryEngine.clear()` ile bellekteki tüm API önbelleğini buharlaştırır; yeni kullanıcının ekranına eski veri sızması matematiksel olarak imkansız hale gelir.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: invalidateQueries ile clear arasındaki farkı atlamak]
Belirti → Kullanıcı değiştikten sonra eski kullanıcının avatarı veya adı birkaç saniyeliğine ekranda görünüp sonra yenisiyle değişiyor (stale flicker).  
Neden → Çıkışta `queryClient.clear()` yerine `queryClient.invalidateQueries()` çağırmak.  
Düzeltme → Oturum kapatma anında daima `queryClient.clear()` fonksiyonunu kullan.
:::

:::mistake[Sık hata: Yalnızca auth slice'ını temizleyip diğer verileri unutmak]
Belirti → Yeni kullanıcı giriş yaptığında bir önceki kullanıcının alışveriş sepetini veya film listesini kendi listesi gibi görüyor.  
Neden → Çıkış action'ının yalnızca auth token'larını sıfırlaması; `watchlistSlice` veya `cartSlice` gibi diğer parçaları dokunulmadan bırakması.  
Düzeltme → Çıkış anında ya tüm ilgili slice'ları tek tek sıfırla ya da Redux'ta tüm state'i `initialState`'e çeken bir kök eylem (root action) tetikle.
:::

:::mistake[Sık hata: 403 refresh hatasında çıkış yapmamak]
Belirti → Kullanıcının refresh token süresi dolduğunda veya sunucudan oturumu iptal edildiğinde ekranın donması, isteklerin sürekli 403 alarak arayüzün kilitlenmesi.  
Neden → Otomatik yenileme başarısız olduğunda temiz çıkış fonksiyonunu çağırmayı unutmak.  
Düzeltme → API istemcisinde refresh isteği 403 döndüğü anda temizlik fonksiyonunu çağır ve kullanıcıyı doğrudan giriş ekranına gönder.
:::

:::mistake[Sık hata: Çıkıştan önce yönlendirme yapmak]
Belirti → Yönlendirme yapıldığı salisede bileşenlerin unmount olurken eski önbellekten veri okumaya çalışması ve hata fırlatması.  
Neden → `navigate('/login')` çağrısını önbellek temizliğinden önce çalıştırmak.  
Düzeltme → Önce depolamayı sil, store'u sıfırla, cache'i temizle; tüm temizlik kesinleştikten sonra yönlendirmeyi tetikle.
:::

:::sector
Kurumsal Redux mimarilerinde her slice için ayrı ayrı "temizle" eylemi dispatch etmek yerine **Root Reducer Reset** deseni uygulanır:

```ts
const appReducer = combineReducers({ auth: authReducer, movies: movieReducer, user: userReducer })

const rootReducer = (state: RootState | undefined, action: UnknownAction) => {
  if (action.type === 'auth/userLoggedOut') {
    // State undefined verilerek tüm reducer'ların initialState ile baştan kurulması sağlanır
    state = undefined
  }
  return appReducer(state, action)
}
```

Bu kalıp tek bir dispatch ile store'un tamamını fabrika ayarlarına döndürür; projeye yeni bir slice eklendiğinde geliştiricinin çıkış temizliğini unutma riskini tamamen ortadan kaldırır.
:::

## Özet

- Güvenli çıkış; depolama, Redux state'i ve TanStack Query önbelleğini aynı anda temizlemelidir.
- Çıkış anında `queryClient.invalidateQueries()` değil, `queryClient.clear()` çağrılmalıdır.
- Kullanıcıya ait tüm state dilimleri (favoriler, sepet, bildirimler) sıfırlanmalıdır.
- Çıkış mekanizması hem kullanıcı butonuna hem de refresh token iptali (`403`) durumuna bağlanmalıdır.
- Önce tüm temizlik tamamlanmalı, ardından kullanıcı güvenle yönlendirilmelidir.

**Kendini yokla:** Çıkış yaparken `queryClient.invalidateQueries()` çağırırsan neden veri sızıntısı oluşabilir?  
*Cevap:* Çünkü `invalidateQueries` verileri bellekten silmez; yalnızca "bayat" (stale) olarak etiketler. Yeni kullanıcı aynı sayfayı açtığında, yeni ağ isteği sonuçlanana kadar eski kullanıcının bayat verisi ekranda görüntülenir.

**Kendini yokla:** Bir kullanıcı başka bir cihazdan şifresini değiştirdi ve elindeki refresh token sunucu tarafından geçersiz kılındı. İstemci bu durumu nasıl ele almalıdır?  
*Cevap:* İstemci access token bittiğinde `/auth/refresh` isteği atar ve sunucudan `403 Forbidden` yanıtı alır. Bu yanıtı aldığı anda istemci derhal merkezi çıkış fonksiyonunu çalıştırmalı; yerel token'ları silmeli, önbelleği boşaltmalı ve kullanıcıyı giriş ekranına yönlendirmelidir.
