---
title: "Çıkıştan sonra eski veri görünmesin"
minutes: 15
kind: concept
---

# Çıkıştan sonra eski veri görünmesin

Sinema'da Emily izleme listesini açtı ve sonra çıkış yaptı. Aynı tarayıcıyı Can kullanacak. Çıkışta yalnızca token'ı silersek, uygulamanın belleğinde Emily'nin profil ve liste verileri kalabilir. Çıkışın amacı hem kalıcı oturum bilgisini hem de ekranda yeniden kullanılabilecek kullanıcı verisini temizlemektir.

## Token'ı silmek ilk adımdır

Tarayıcıda oturum bilgisini `localStorage`'da tuttuğumuzu varsayalım. `removeItem` bu depodaki tek bir anahtarı siler:

```ts
localStorage.removeItem('sinema-auth')
```

Sayfayı yenileyince eski token artık depodan okunmaz. Fakat bu komut yalnızca kalıcı kopyayı siler. React uygulaması çalışırken bellekteki Redux store ve TanStack Query cache'i hâlâ önceki kullanıcının verisini tutabilir. **Cache**, tekrar kullanmak üzere kısa süre saklanan veri kopyasıdır.

## Bellekteki iki kopyayı da temizle

Redux store uygulamanın paylaşılan state'ini tutar; TanStack Query cache ise sunucudan gelen verileri saklar. Çıkış sırasında her ikisi de sıfırlanmalıdır:

```ts
resetStore()
queryClient.clear()
```

`clear()` Query cache'indeki kayıtları siler. `invalidateQueries()` ise kayıtları silmez; yalnızca artık güncel olmayabileceklerini işaretler ve yeniden istek başlatabilir. Emily'nin profilini yeni kullanıcı görmesin diye cache'i yalnızca “eski” diye işaretlemek yeterli değildir.

Bu iki katmanı ayrı düşünmek işe yarar: Redux'taki görünür tercih veya oturum durumu store'da yaşar; `/profile` isteğinin sonucu Query cache'inde yaşar. Store'u sıfırlamak Query kaydını otomatik silmez, Query cache'ini boşaltmak da kalıcı token'ı depodan kaldırmaz. Bu nedenle çıkışta üç ayrı yeri tek bir akış içinde ele alırız.

## Temizlik sırasını izle

Şimdi depolama çağrısının hata verebileceği bir durumu ekleyelim. Özel tarayıcı ayarı veya erişim sorunu `removeItem` işlemini bozabilir; bu hata store ve cache temizliğini durdurmamalıdır. Depo adımını kendi `try` bloğuna alır, sonra iki bellek adımını da tamamlarız:

```ts
function clearCinemaSession() {
  try {
    localStorage.removeItem('sinema-auth')
  } catch {
    // Depo silinemese de bellek temizliği sürmeli.
  }

  resetStore()
  queryClient.clear()
}
```

Burada her satırın sırası önemlidir: önce kalıcı oturum kaydını silmeyi deneriz; hata olursa yakalarız; ardından store'u sıfırlar ve Query cache'i boşaltırız. Çıkış tamamlanınca yeni oturum açacak kişi eski kullanıcının profilini cache'ten alamaz. Bu yardımcı yönlendirme yapmıyor; route değişikliğini temizlik tamamlandıktan sonra başlatmak, geçiş sırasında eski verinin yeniden okunmasını önler.

Depolama çağrısını `try` içine alırken yalnızca o çağrının hatasını yakalamamızın nedeni de bu: `removeItem` bozulursa yine de bellek temizliğini sürdürmek istiyoruz. Bütün fonksiyonu tek bir `try` içine alıp ilk hatada dönersen, cache temizlenmeden kalabilir. `resetStore()` ve `clear()` çağrılarının her ikisi de çıkışın parçası olduğu için depolama arızası onları atlamamalı.

### Çıkıştan sonraki görünümü adım adım izle

| Sıra | İşlem | Emily'nin verisi nerede? | Sonuç |
| --- | --- | --- | --- |
| 1 | `removeItem('sinema-auth')` denenir | Bellekte olabilir; depodaki token silinmeye çalışılır | Yenilemede eski token okunmaz |
| 2 | `resetStore()` | Redux state'i başlangıç durumuna döner | Kullanıcıya ait UI state'i kaybolur |
| 3 | `queryClient.clear()` | Query cache boşalır | Eski profil ve liste yeniden gösterilmez |
| 4 | Login'e yönlendirme yapılır | Oturum verisi kalmamıştır | Sonraki kullanıcı temiz ekrandan başlar |

![Çıkış ve temizlik akışı: depolama, store ve query önbelleği](diagrams/cikis-temizlik-katmanlari.svg "Çıkış ve temizlik akışı depolama, store ve query önbelleği sıfırlamasını gösterir.")

## Yaygın yanlış ve belirtisi

Şunu yapsaydık:

```ts
queryClient.invalidateQueries()
```

Emily'nin profil sorgusu cache'te kalır; yalnızca güncel olmadığı işaretlenir. Can aynı sorgu anahtarını kullanırsa, yeni istek tamamlanana kadar cache'teki eski veri ekranda görünebilir. Bu yüzden oturum değişirken `clear()` seçiyoruz. Sıradan bir sayfa güncellemesinde eski veriyi ekranda tutup arka planda yenilemek faydalı olabilir; çıkışta ise eski kullanıcı verisi yeniden kullanılmamalıdır.

Zaman çizelgesinde fark nettir: `invalidateQueries()` eski sonucu hemen yok etmez; yeni istek daha sonra tamamlanır. `clear()` ise cache kaydını hemen kaldırır, bu yüzden aynı sorgu okunursa eski profil hazır bir yanıt gibi sunulamaz. Burada temizlik, kullanıcılar arasında veri karışmasını önler; yeni profil isteği gerektiğinde yeniden başlar.

:::mistake[Belirti: yeni kullanıcı eski avatarı ya da izleme listesini görüyor]
Çıkıştan hemen sonra eski profil görünüyorsa yalnızca token'ı silmiş veya cache'i `invalidateQueries()` ile işaretlemiş olabilirsin. Token, Redux state'i ve Query cache ayrı yerlerde durur. Depoyu sil, store'u sıfırla ve çıkışta Query cache için `clear()` çağır.
:::

Otomatik oturum sonlandırma da aynı temizlik yolunu kullanmalıdır. Örneğin sonraki modüllerde göreceğin refresh işlemi başarısız olup sunucu `403` döndürürse, uygulama sessizce eski kullanıcıyı ekranda tutmamalı; oturumu temizleyip kullanıcıyı girişe yönlendirmelidir.

:::info[Derinlemesine (isteğe bağlı)]
Redux'ta her slice'ı tek tek sıfırlamak yerine bir **root reducer reset** düzeni kurulabilir. Root reducer, çıkış action'ında state'i `undefined` alacak biçimde davranır; reducer'lar kendi başlangıç değerlerini üretir. Bu, büyük uygulamalarda yeni slice eklendiğinde çıkış listesini güncelleme riskini azaltır; bu dersteki temel görev için her projede böyle bir düzen kurmak gerekmez.
:::

## Özet

- Çıkışta kalıcı token, Redux store'daki kullanıcı state'i ve TanStack Query cache'i temizle.
- `removeItem` hata verse bile store ve cache temizliği devam etmelidir.
- `invalidateQueries()` kayıtları silmez; çıkışta eski kullanıcı verisini kaldırmak için `queryClient.clear()` kullan.
- Temizlik tamamlandıktan sonra login'e yönlendir; böylece yeni oturum eski veriyi yeniden kullanmaz.

**Yeni terimler**

- **Cache:** Sonradan yeniden kullanmak için geçici olarak saklanan veri kopyası.
- **Invalidation (`invalidateQueries`):** Cache kaydını güncel değil diye işaretleme; kaydı silmekle aynı şey değildir.
- **Clear (`queryClient.clear`):** TanStack Query cache'indeki kayıtları tamamen temizleme.
- **Root reducer reset:** Çıkış sırasında Redux state'ini tümüyle başlangıç durumuna döndürme yaklaşımı.

**Kendini yokla:** Neden çıkışta `invalidateQueries()` yerine `clear()` kullanıyoruz?  
*Cevap:* Invalidation eski kaydı cache'te bırakabilir; clear kaydı silerek yeni kullanıcının onu görmesini önler.

**Kendini yokla:** Depolama temizliği hata verse bile neden diğer adımlara devam etmeliyiz?  
*Cevap:* Kalıcı token silinemese de bellekteki profil ve kullanıcı state'i temizlenebilir; bu adımları atlamamak eski verinin arayüzde kalmasını azaltır.
