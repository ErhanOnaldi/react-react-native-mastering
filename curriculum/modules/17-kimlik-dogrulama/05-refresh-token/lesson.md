---
title: "401 sonrası tek refresh"
minutes: 18
kind: concept
---

# 401 sonrası tek refresh

:::pain[Sinema'da yarışan 401'ler ve 403 çöküşü]
Kullanıcı Sinema uygulamasında yarım saattir film inceliyor. Access token'ın 15 dakikalık süresi dolmuş durumda. Kullanıcı yeni bir sayfaya geçtiğinde iki bileşen aynı anda sunucuya istek atıyor: profil kartı `/auth/me` çağrısı yapıyor, sağ üstteki bildirim zili ise okunmamış sayısını çekiyor. İki istek de aynı anda `401 Unauthorized` yanıtı alıyor. İki bileşen de bağımsız olarak "Eyvah, token bitti, hemen yenileyeyim" diyerek `/auth/refresh` uç noktasına koşuyor. Ancak kimlik sunucusu tek kullanımlık refresh token rotasyonu (rotation) uyguluyor! İlk refresh isteği token'ı tüketip yenisini alırken, yarım milisaniye sonra gelen ikinci refresh isteği az önce yakılmış olan eski token'ı sunduğu için sunucu alarm veriyor: `403 Forbidden`. Oturum anında iptal ediliyor ve kullanıcı şaşkınlık içinde sistemden atılıyor.
:::

## Taşıyıcı zihinsel model: Tek uçuşta token yenileme

Güvenli web mimarilerinde access token'ların ömrü bilinçli olarak kısa tutulur (5–15 dakika). Böylece belirteç çalınsa dahi saldırganın elindeki kullanım penceresi son derece dar kalır. Ancak kullanıcının her 15 dakikada bir yeniden parola girmesini istemeyiz. Arka planda kesintisiz oturum sürekliliği sağlayan araç **Refresh Token** mekanizmasıdır.

Ancak refresh token'ların kendisi de çalınma riskine karşı korunmalıdır. Modern kimlik sağlayıcılar (OAuth 2.0 / OIDC) **Refresh Token Rotation (Döndürme)** kuralını uygular: Her yenileme isteğinde sunucu eski refresh token'ı geçersiz kılar ve yepyeni bir token çifti (`accessToken` + `refreshToken`) teslim eder. Eski bir refresh token ikinci kez sunulursa sunucu bunu bir çalınma girişimi (token reuse) sayar ve oturumu `403 Forbidden` ile derhal sonlandırır.

Bu katı kural istemci tarafında çok dikkatli bir eşzamanlılık (concurrency) mimarisi gerektirir.

![401 sonrası tek refresh ve bekleyen istekler](diagram:token-yenileme)

Modelin kesin ve bağlayıcı kuralları:

1. **Tek uçuş (Single-Flight) ilkesi:** Uygulamada aynı anda kaç istek 401 alırsa alsın, ağa **yalnızca bir adet** `/auth/refresh` isteği gönderilebilir. İlk 401 bir yenileme Promise'ı (`inFlight`) başlatır; o sırada gelen diğer tüm 401'ler bu ortak Promise'a abone olur ve bekler.
2. **Bir kez yeniden deneme (Single-Retry) sözleşmesi:** Yenileme başarıyla tamamlandığında, bekletilen tüm orijinal istekler yeni access token ile **yalnızca bir kez** tekrar denenir.
3. **Sonsuz döngü engeli:** Eğer tekrar denenen istek yine 401 alırsa veya `/auth/refresh` isteğinin kendisi 401/403 ile reddedilirse, asla ikinci bir yenileme döngüsü başlatılamaz. İstemci döngüyü kesmeli ve oturumu sonlandırmalıdır.
4. **Kendine referans yasağı:** Yenileme yapan fonksiyonun kendisi (`refreshSession` / `fetch('/auth/refresh')`), 401 yakalayan interceptor sarmalayıcısının içinden geçirilmemelidir. Aksi takdirde refresh başarısız olduğunda kendini yenilemeye çalışan bir sonsuz döngü kilitlenmesi doğar.
5. **İki yeni token'ın atomik saklanması:** Rotation kuralı gereği sunucudan dönen yeni access token ve yeni refresh token depoya **birlikte ve aynı anda** yazılmalıdır. Yeni access token alınıp eski refresh token depoda bırakılırsa, bir sonraki yenileme kaçınılmaz olarak 403 alır.
6. **Geç gelen 401 kontrolü (Post-Flight Check):** Bir istek ağ gecikmesi nedeniyle yenileme işlemi **bittikten hemen sonra** 401 ile dönebilir. Bu istek geldiğinde depodaki güncel token ile istekte kullanılan token karşılaştırılmalıdır. Eğer depodaki token zaten değişmişse, başka bir istek token'ı çoktan yenilemiştir; yeni bir refresh başlatmaya gerek yoktur, doğrudan depodaki taze token ile retry yapılmalıdır.

## Yarışan iki isteğin zaman çizelgesinde izini sürelim

İki eşzamanlı isteğin (`İstek A` ve `İstek B`) 401 alıp tek uçuşta kurtarılma sürecini milisaniye milisaniye izleyelim:

| Zaman | İstek A (Profil) | İstek B (Bildirimler) | Paylaşılan `inFlight` | Depodaki Token Çifti | Ağdaki İstekler |
| --- | --- | --- | --- | --- | --- |
| **0 ms** | `GET /me` (Token v1) | `GET /notifications` (Token v1) | `null` | `{ acc: v1, ref: v1 }` | 2 istek uçuşta |
| **40 ms** | Sunucu yanıtı: `401` | Henüz yanıt bekliyor | `null` | `{ acc: v1, ref: v1 }` | - |
| **42 ms** | `inFlight = refresh()` başlar | Beklemede | `Promise<v2>` | `{ acc: v1, ref: v1 }` | `POST /auth/refresh` (1. İstek) |
| **45 ms** | Yenilemeyi bekliyor | Sunucu yanıtı: `401` | `Promise<v2>` (Dolu) | `{ acc: v1, ref: v1 }` | İstek B ağa gitmez! Mevcut `inFlight`'a tutunur |
| **120 ms** | `inFlight` tamamlandı | `inFlight` tamamlandı | `null` (`finally`) | `{ acc: v2, ref: v2 }` | Refresh başarılı! İki yeni token kaydedildi |
| **125 ms** | Retry: `GET /me` (Token v2) | Retry: `GET /notifications` (Token v2) | `null` | `{ acc: v2, ref: v2 }` | 2 istek tekrarlandı |
| **160 ms** | `200 OK` (Profil geldi) | `200 OK` (Bildirim geldi) | `null` | `{ acc: v2, ref: v2 }` | Kullanıcı hiçbir kesinti hissetmedi |

Sonuç: İki ayrı istek 401 aldığı halde ağda **tam 1 adet** `/auth/refresh` isteği görülmüş, refresh token rotasyonu bozulmamış ve iki istek de başarıyla sonuçlanmıştır.

## Önce kırık, sonra doğru: Dayanıklı HTTP istemcisi

Şimdi bu mimariyi farklı bir iş senaryosu üzerinden kodlayalım: Bir kurumsal sipariş takip istemcisi (`OrderApiClient`).

### Kırık örnek

Aşağıdaki kod her 401 için ayrı refresh tetikler ve retry döngüsünü denetlemez:

```ts
// TEHLİKELİ VE KIRIK İMPLEMENTASYON
let activeSession = { token: 'old-access', renewal: 'old-refresh' }

export async function badFetchOrder(orderId: string): Promise<unknown> {
  const res = await fetch(`/api/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${activeSession.token}` },
  })

  // HATA 1: Her 401 alan istek kendi başına refresh başlatıyor (Yarış durumu!)
  if (res.status === 401) {
    const refreshRes = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: activeSession.renewal }),
    })

    // HATA 2: İkinci paralel istek buraya geldiğinde eski renewal token 403 alır ve çöker!
    const newTokens = await refreshRes.json()
    activeSession = newTokens

    // HATA 3: Retry sonsuz döngüye açıktır; tekrar 401 dönerse fonksiyon kendini durduramaz!
    return badFetchOrder(orderId)
  }

  return res.json()
}
```

Bu kod canlıya çıktığında iki paralel sipariş sorgusu aynı anda 401 aldığında ikinci istek 403 alır, sunucu kullanıcının hesabını kilitler.

### Doğru örnek

Tek uçuş kilidi (mutex Promise), retry koruması ve geç gelen 401 kontrolü barındıran derlenebilir profesyonel istemci:

```ts check
export interface SessionTokens {
  accessToken: string
  refreshToken: string
}

export interface SessionVault {
  getTokens: () => SessionTokens | null
  saveTokens: (tokens: SessionTokens) => void
  purgeSession: () => void
}

export function createResilientApiClient(vault: SessionVault) {
  // Eşzamanlı isteklerin paylaşacağı tek uçuş Promise referansı
  let inFlightRefreshPromise: Promise<SessionTokens> | null = null

  async function performNetworkCall(
    endpoint: string,
    token?: string,
  ): Promise<Response> {
    return fetch(`https://api.example.com${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  }

  async function executeRefreshFlow(): Promise<SessionTokens> {
    const currentSession = vault.getTokens()
    if (!currentSession?.refreshToken) {
      vault.purgeSession()
      throw new Error('Yenileme belirteci bulunamadı.')
    }

    const refreshResponse = await fetch('https://api.example.com/auth/renew', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: currentSession.refreshToken }),
    })

    // Refresh başarısızsa (403 veya 401) oturum artık kurtarılamaz
    if (!refreshResponse.ok) {
      vault.purgeSession()
      throw new Error(`Oturum yenilenemedi: ${refreshResponse.status}`)
    }

    const freshTokens = (await refreshResponse.json()) as SessionTokens
    vault.saveTokens(freshTokens)
    return freshTokens
  }

  return {
    async requestData<T>(endpoint: string): Promise<T> {
      const initialTokens = vault.getTokens()
      const usedAccessToken = initialTokens?.accessToken

      // 1. İlk istek
      let response = await performNetworkCall(endpoint, usedAccessToken)

      // 2. 401 Yakalandı: Kurtarma akışı
      if (response.status === 401) {
        let latestAccessToken = vault.getTokens()?.accessToken

        // Kontrol: Başka bir istek biz 401 alana kadar token'ı zaten yeniledi mi?
        if (!latestAccessToken || latestAccessToken === usedAccessToken) {
          // Eğer aktif bir refresh uçuşu yoksa başlat, varsa mevcut olana katıl
          if (!inFlightRefreshPromise) {
            inFlightRefreshPromise = executeRefreshFlow().finally(() => {
              // İşlem bittiğinde (başarı veya hata) referansı temizle
              inFlightRefreshPromise = null
            })
          }

          const renewedSession = await inFlightRefreshPromise
          latestAccessToken = renewedSession.accessToken
        }

        // 3. Tekrar deneme (Yalnızca 1 kez retry)
        response = await performNetworkCall(endpoint, latestAccessToken)
      }

      // 4. Nihai yanıt denetimi
      if (!response.ok) {
        throw new Error(`İstek başarısız oldu: ${response.status}`)
      }

      return (await response.json()) as T
    },
  }
}
```

Bu mimari zarafetin detayları:
- `inFlightRefreshPromise` değişkeni closure içinde yaşar. İlk 401 bu değişkene bir Promise atar; 1 milisaniye sonra 401 alan ikinci istek `inFlightRefreshPromise` dolu olduğu için yeni bir HTTP isteği başlatmaz, doğrudan var olan Promise'ı `await` eder.
- `finally` bloğu, istek ister başarıyla tamamlansın ister hata versin `inFlightRefreshPromise = null` satırını çalıştırır. Böylece 1 saat sonra token yeniden bittiğinde sistem yeniden taze bir refresh başlatabilir.
- `response = await performNetworkCall(endpoint, latestAccessToken)` satırı yalnızca **bir kez** çalıştırılır. Eğer retry yanıtı da 401 dönerse kod tekrar refresh'e girmez; alttaki `if (!response.ok)` bloğuna düşerek temiz bir hata fırlatır.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: inFlight Promise'ı finally bloğunda sıfırlamamak]
Belirti → İlk refresh başarıyla çalışıyor; ancak kullanıcı yarım saat sonra tekrar 401 aldığında uygulama sonsuza dek kilitleniyor, hiçbir yeni istek atılamıyor.  
Neden → `inFlight` değişkeninin başarıdan sonra `null` yapılmaması; sistemin eski ve çoktan çözülmüş Promise'ı hâlâ uçuşta sanması.  
Düzeltme → Promise temizliğini daima `.finally(() => { inFlight = null })` ile garantiye al.
:::

:::mistake[Sık hata: Retry isteğini denetimsiz bırakıp sonsuz döngüye girmek]
Belirti → Kullanıcının hesabı silindiğinde veya yetkisi kaldırıldığında istemcinin sunucuya saniyede 50 adet refresh ve profil isteği yağdırması (istemci kaynaklı DDoS).  
Neden → Retry sonucu dönen 401'i de tekrar kurtarmaya çalışmak.  
Düzeltme → Yeniden denemeyi kesin olarak 1 tur ile sınırla. Retry da 401 ise oturumu hemen kapat.
:::

:::mistake[Sık hata: Sadece access token'ı kaydedip yeni refresh token'ı atmak]
Belirti → İlk token yenileme kusursuz çalışıyor; ancak 15 dakika sonraki ikinci yenilemede sunucu aniden `403 Forbidden` patlatıyor.  
Neden → Refresh Token Rotation kuralını unutmak. Sunucunun her yenilemede verdiği yeni refresh token'ı kaydetmeyip depoda eski refresh token'ı bırakmak.  
Düzeltme → Refresh yanıtındaki her iki token'ı daima atomik olarak depoya yaz.
:::

:::mistake[Sık hata: 401 dışındaki hatalarda (404, 500) refresh tetiklemek]
Belirti → Olmayan bir film detayına gidildiğinde (404) istemcinin gereksiz yere auth sunucusunu arayıp token yenilemeye çalışması.  
Neden → `if (!response.ok)` kontrolü görülen her yere körlemesine refresh mantığı eklemek.  
Düzeltme → Yenileme mantığını yalnızca ve yalnızca `response.status === 401` koşuluna bağla.
:::

:::sector
Kurumsal kimlik mimarilerinde (OAuth 2.0 Güvenlik En İyi Uygulamaları - BCP):
- **Token Reuse Detection (Yeniden Kullanım Tespiti):** Eğer sunucu daha önce kullanılmış ve geçersiz kılınmış bir refresh token ile istek alırsa, bunu derhal "Yetki hırsızlığı vakası" olarak işaretler. Sunucu yalnızca o isteği reddetmekle kalmaz; o kullanıcıya ve o oturum zincirine ait **bütün geçerli token'ları iptal eder**. Kurbanın tüm cihazlarındaki oturumlar kapatılır. Bu nedenle istemcide hiçbir refresh isteğinin mükerrer gitmemesi hayati derecede önemlidir.
- **Proaktif Yenileme (Proactive Refresh):** Bazı kurumsal istemciler 401 hatasını beklemek yerine, token'ın `exp` süresine bakar. Sürenin bitimine 60 saniye kala kullanıcı işlem yaparken arka planda sessizce refresh atar. Böylece kullanıcı hiçbir zaman 401 hatasıyla ve ağ gecikmesiyle karşılaşmaz.
:::

## Özet

- Access token'lar kısa ömürlüdür; Refresh token'lar ise oturum sürekliliğini sağlar.
- Refresh Token Rotation gereği her refresh isteğinde eski refresh token ölür, yeni bir çift doğar.
- Aynı anda gelen birden fazla 401 yanıtı için tek bir refresh Promise'ı (`inFlight`) paylaşılmalıdır.
- Başarılı yenilemeden sonra orijinal istekler yeni access token ile yalnızca bir kez tekrarlanır (retry).
- Refresh isteği kendi kendini yenileyemez; retry başarısız olursa oturum derhal temizlenmelidir.

**Kendini yokla:** Uygulamanız aynı anda 3 paralel API isteği attı ve üçü de 401 aldı. Neden 3 ayrı refresh isteği göndermek sistemi çökertir?  
*Cevap:* Refresh Token Rotation uygulanan sunucularda ilk gelen refresh isteği mevcut refresh token'ı tüketir ve yenisini üretir. Arkadan gelen diğer 2 istek az önce tükenmiş olan eski token'ı sunacağı için sunucu "token çalınması" alarmı verir ve 403 Forbidden ile oturumu tamamen iptal eder.

**Kendini yokla:** `inFlight = refreshSession()` Promise'ı tamamlandıktan sonra `inFlight = null` yapmayı unutursak ne olur?  
*Cevap:* İlk yenileme başarılı olur. Ancak daha sonraki bir saatte access token yeniden tükendiğinde, sistem `inFlight` değişkeninde hâlâ eski çözülmüş Promise'ı göreceği için yeni bir ağ isteği başlatamaz ve oturum kilitlenir.
