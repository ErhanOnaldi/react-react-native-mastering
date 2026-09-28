---
title: "Bearer başlığıyla profil isteği"
minutes: 15
kind: concept
---

# Bearer başlığıyla profil isteği

:::pain[Sinema'da token var ama profil 401]
Kullanıcı giriş yaptı, Redux store'a ve depolamaya token kaydedildi. Kullanıcı sevinçle profil sayfasına tıklıyor; ancak ekranda film bilgileri yerine donuk bir boşluk beliriyor. Tarayıcının DevTools Network sekmesini açtığında acı gerçek ortaya çıkıyor: `/auth/me` isteği atılmış ama yanıt `401 Unauthorized` dönmüş! İstek başlıklarını incelediğinde `Authorization` alanının bomboş olduğunu görüyorsun. İstemcinin elinde geçerli bir bilet olması yetmez; o bileti her kapı geçişinde sunucuya doğru biçimde ibraz etmesi gerekir.
:::

## Taşıyıcı belirteç (Bearer Token) ve RFC 6750 standardı

Oturum açıldıktan sonra korumalı kaynaklara (kullanıcı profili, özel izleme listeleri, hesap ayarları) erişim sağlamak için istemcinin her HTTP isteğinde kimliğini kanıtlaması gerekir. OAuth 2.0 ve RFC 6750 spesifikasyonu bu kanıt için **Bearer** şemasını tanımlar.

"Bearer", kelime anlamıyla "hamili", yani "bu belirteci elinde tutan kişi" demektir. Sunucu açısından bu belirteci sunan istemci, aksi kanıtlanana kadar o belirtecin temsil ettiği meşru kullanıcıdır. Bu kural, belirtecin iletiminde azami özen ve disiplin gerektirir.

İstemci, her yetkili istekte HTTP istek başlığına (request headers) şu satırı ekler:

```http
Authorization: Bearer <accessToken>
```

![Bearer başlığıyla korumalı kaynak isteği ve 401 kontrolü](diagrams/bearer-istek-akisi.svg "Bearer token istek akışı ve 401 hata kontrolü.")

Yetkili istek mimarisinin kesin ve bağlayıcı kuralları:

1. **RFC 6750 başlık biçimi:** Başlık adı tam olarak `Authorization` (büyük/küçük harf duyarsız olsa da standart olarak PascalCase), başlık değeri ise `Bearer ` (sonunda bir boşluk karakteriyle) ve hemen ardından gelen ham token dizgisinden oluşmalıdır. `Bearer` kelimesinin unutulması ya da aradaki boşluğun atlanması sunucunun isteği 400 veya 401 ile reddetmesine yol açar.
2. **URL parametresinde token taşımak KESİNLİKLE YASAKTIR:** Token hiçbir zaman `GET /profile?token=eyJ...` şeklinde URL sorgu dizgisine (query string) yazılmamalıdır. URL'ler tarayıcı geçmişine (history) kaydedilir, şirket proxy'lerinde açık metin olarak loglanır, hata raporlarına sızar ve sayfadaki harici bir bağlantıya tıklandığında `Referer` başlığıyla üçüncü parti sitelere sızdırılır. Başlıklar ise bu sızıntılara karşı korunmalıdır.
3. **Servis ve token izolasyonu:** Uygulamanız birden fazla dış API ile konuşuyor olabilir. Örneğin Sinema uygulamasında iki ayrı servis vardır:
   - *TMDB API:* Film kataloğunu sunar ve tüm uygulama için sabit olan genel API anahtarı (`VITE_TMDB_TOKEN`) ile yetkilendirilir.
   - *Kimlik ve Oturum API'si:* Kullanıcı oturumunu yönetir ve giriş yapan her bireye özel dinamik `accessToken` ile yetkilendirilir.
   Bu iki belirteç asla birbirine karıştırılmamalı; kullanıcı token'ı TMDB'ye, TMDB token'ı ise kullanıcı oturum servisine gönderilmemelidir.
4. **`fetch`'in 401 sessizliği:** Önceki derslerde gördüğümüz gibi, sunucu token'ı tanımazsa veya süresi dolmuşsa `401 Unauthorized` döner. Ancak `fetch` bu yanıtta asla hata fırlatmaz. `response.ok` kontrol edilmeli ve durum kodu içeren somut bir hata üretilerek çağıran katmana sinyal verilmelidir.
5. **Merkezi API İstemcisi (API Client Sınırı):** `Authorization` başlığını her React bileşeni içinde tek tek elle `fetch` seçeneklerine yazmak spagetti koda yol açar. Token yönetimi ve başlık ekleme işi merkezi bir API client fonksiyonu veya sarmalayıcısı (wrapper) arkasında soyutlanmalıdır.

## Yetkili bir isteğin yaşam döngüsü

Bir istemcinin yetkili istek atma sürecini adım adım izleyelim:

| Aşama | Aktör | İşlem | Örnek Değer |
| --- | --- | --- | --- |
| 1 | İstemci | Bellek veya depodan token okunur | `token = "eyJhbGci..."` |
| 2 | Başlık Hazırlığı | `Authorization` alanı kurulur | `{ "Authorization": "Bearer eyJhbGci..." }` |
| 3 | Ağ Gönderimi | `fetch(url, { headers })` çağrılır | İstek sunucuya iletilir |
| 4 | Sunucu Doğrulaması | İmza ve son kullanma (`exp`) kontrolü | `HMACSHA256` doğrulaması |
| 5a | Başarı (200 OK) | Sunucu korumalı veriyi döner | `{ "id": 42, "role": "member" }` |
| 5b | Hata (401 Unauthorized) | Belirteç geçersiz veya süresi dolmuş | `{ "message": "Invalid token" }` |
| 6 | İstemci Kararı | `response.ok` denetimi yapılır | `true` ise JSON döner, `false` ise `Error` yükselir |

## Önce kırık, sonra doğru: Yetkili veri istemcisi

Örnek olarak bir bulut paneli ayar servisini (`/api/account/settings`) ele alalım.

### Kırık örnek

Aşağıdaki kod yetkilendirme standartlarını ihlal etmekte ve 401 hatalarını yutmaktadır:

```ts
// TEHLİKELİ VE KIRIK İMPLEMENTASYON
export async function fetchAccountSettingsBroken(token: string) {
  // HATA 1: Token URL query string'ine konmuş (Log sızıntısı ve güvenlik ihlali)
  const res = await fetch(`/api/account/settings?access_token=${token}`)

  // HATA 2: 401 hatası denetlenmiyor, response.ok yok!
  // Sunucu 401 döndüğünde JSON parse çalışır ve { error: "Unauthorized" } döner
  const data = await res.json()

  // HATA 3: Hata durumunda sessizce sahte bir varsayılan nesne dönüyor;
  // Arayüz kullanıcının oturumunun düştüğünü anlayamıyor!
  return data ?? { theme: 'dark' }
}
```

Bu kodun oluşturduğu tehlikeler:
1. Kullanıcının gizli token'ı ağdaki tüm ara sunucuların ve sunucu loglarının URL dökümüne açıkça yazılır.
2. Token'ın süresi dolduğunda fonksiyon hata fırlatmak yerine hatalı veri döner; UI oturumun kapandığını fark edemez ve kullanıcıya yanıltıcı ekranlar gösterir.

### Doğru örnek

Standartlara tam uyumlu, başlığı doğru ekleyen ve 401 durumunda açıkça hata yükselten derlenebilir yardımcı fonksiyon:

```ts check
export interface AccountSettingsPayload {
  organizationId: string
  preferredTheme: 'light' | 'dark'
  emailNotificationsEnabled: boolean
}

export async function requestAccountSettings(
  accessToken: string,
): Promise<AccountSettingsPayload> {
  // 1. Boş veya geçersiz token ön kontrolü
  if (!accessToken.trim()) {
    throw new Error('Yetkilendirme belirteci bulunamadı (401).')
  }

  // 2. Standart Bearer başlığıyla istek
  const response = await fetch('https://api.example.com/account/settings', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken.trim()}`,
      Accept: 'application/json',
    },
  })

  // 3. HTTP durum denetimi
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Oturum süresi dolmuş veya yetki geçersiz (401).')
    }
    if (response.status === 403) {
      throw new Error('Bu kaynağa erişim yetkiniz bulunmuyor (403).')
    }
    throw new Error(`Sunucu isteği reddetti: ${response.status}`)
  }

  // 4. Tipli veri ayrıştırma
  const data = (await response.json()) as AccountSettingsPayload
  return {
    organizationId: data.organizationId,
    preferredTheme: data.preferredTheme,
    emailNotificationsEnabled: data.emailNotificationsEnabled,
  }
}
```

Bu fonksiyonda:
- Başlık biçimi tam olarak RFC 6750 standardına (`Bearer <token>`) uyar.
- `response.ok` denetlenir; özellikle 401 durumu net bir hata mesajıyla çağırıcıya bildirilir. Bu sayede bir sonraki derste kuracağımız otomatik token yenileme (refresh) mekanizması bu 401 hatasını yakalayıp oturumu kurtarabilir.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: Bearer önekini ve boşluğu yanlış yazmak]
Belirti → Sunucunun istekleri sürekli `400 Bad Request` veya `401 Unauthorized` ile reddetmesi.  
Neden → `headers: { Authorization: token }` veya `headers: { Authorization: "Bearer" + token }` yazarak aradaki boşluğun unutulması.  
Düzeltme → Başlık formatını daima şablon dizgisiyle doğrula: ``Authorization: `Bearer ${token}` ``.
:::

:::mistake[Sık hata: Token'ı URL parametresiyle iletmek]
Belirti → Güvenlik taramalarında veya sızma testlerinde "CWE-598: Use of GET Request with Sensitive Data in Query String" güvenlik açığı raporlanması.  
Neden → Token'ı başlık yerine URL'ye parametre olarak iliştirmek (`?token=...`).  
Düzeltme → GET, POST veya DELETE fark etmeksizin tüm yetkili isteklerde belirteçleri daima HTTP `Authorization` başlığında taşı.
:::

:::mistake[Sık hata: 401 hatasını sessizce yutmak]
Belirti → Arayüzün verisi boş kaldığı halde ekranda hiçbir hata veya giriş yönlendirmesi görülmemesi; sayfanın donmuş gibi kalması.  
Neden → API çağrısında `catch` bloğu içinde `return null` veya `return []` yaparak hatayı yutmak.  
Düzeltme → 401 hatasını yukarıya fırlat ki çağıran katman kullanıcının oturumunun sona erdiğini anlasın ve giriş sayfasına yönlendirme yapabilsin.
:::

:::mistake[Sık hata: Farklı servislerin token'larını çapraz göndermek]
Belirti → Üçüncü parti harici bir API'ye istek atılırken uygulamanın kendi gizli kullanıcı token'ının o üçüncü partiye gönderilmesi.  
Neden → Genel bir `fetch` sarmalayıcısının ayrım gözetmeksizin her giden URL'ye aynı kullanıcı başlığını yapıştırması.  
Düzeltme → API istemcisinde hedef etki alanını (base URL) kontrol et; kullanıcı token'ını yalnızca kendi yetkili kimlik sunucuna gönder.
:::

:::sector
Büyük ölçekli kurumsal React projelerinde (örneğin yüzlerce farklı endpoint barındıran mimarilerde) ham `fetch` doğrudan bileşen içinde neredeyse hiç çağrılmaz. Bunun yerine **Axios Interceptor** veya özel bir **HTTP Transport İstemcisi** deseni uygulanır:

1. **Request Interceptor:** Uygulama deposundaki güncel access token'ı alır, isteğin hedef URL'sinin kendi API'miz olup olmadığını doğrular ve `Authorization: Bearer <token>` başlığını otomatik olarak isteğe enjekte eder. Geliştirici her fonksiyonda başlık düşünmekten kurtulur.
2. **Response Interceptor:** Gelen tüm yanıtları dinler. Eğer yanıt 401 ise, isteği hemen kullanıcıya hata olarak göstermez; arka planda refresh akışını tetikler ve istekleri kuyruğa alır.

Bu merkezi mimari, güvenlik standartlarının tek bir noktada denetlenmesini ve kod tekrarının önlenmesini sağlar.
:::

## Özet

- Korumalı API kaynaklarına erişirken kimlik kanıtı HTTP `Authorization: Bearer <token>` başlığında taşınır.
- Token asla URL query string içinde gönderilmemelidir; URL'ler geçmişe ve loglara sızar.
- `fetch` 401 yanıtlarında hata fırlatmaz; `response.ok` kontrol edilmeli ve durum açıkça ele alınmalıdır.
- Farklı API'lerin (TMDB vs Kimlik servisi) belirteçleri izole tutulmalı, çapraz servis sızıntıları önlenmelidir.
- Merkezi bir API istemcisi deseni, başlık ekleme ve hata yakalama mantığını bileşenlerden ayırır.

**Kendini yokla:** `headers: { Authorization: "Bearer" + accessToken }` şeklinde yazılmış bir istek neden 401 hatası alır?  
*Cevap:* "Bearer" kelimesi ile token dizgisi arasında boşluk bırakılmamıştır (örneğin `"BearereyJhbG..."` olmuştur). RFC 6750 standardına göre kelime ile belirteç arasında tam bir boşluk karakteri bulunmalıdır.

**Kendini yokla:** Bir API isteği URL sorgusunda `?auth_token=...` taşıdığında neden güvenlik açığı oluşur?  
*Cevap:* URL parametreleri tarayıcı geçmişine yazılır, sunucu erişim loglarında açık metin olarak depolanır ve sayfadaki herhangi bir dış linke tıklandığında `Referer` başlığıyla üçüncü şahıslara sızabilir.
