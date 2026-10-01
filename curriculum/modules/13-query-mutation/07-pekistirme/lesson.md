---
title: "Silme akışını sağlamlaştır"
minutes: 8
kind: practice
---

# Silme akışını sağlamlaştır

Bu pekiştirmede Sinema’daki puan silme işleminin bekleme, başarı ve hata durumlarını ele alacaksın. Sonra silinen satırın kısa süreliğine listeden kalkmasını, istek reddedilirse geri gelmesini ve doğru oturum listesinin yenilenmesini bir araya getireceksin.

:::model[Mutation ve invalidation]
Mutation sunucuya yazma isteğidir; query ise sunucudan okunan veriyi cache’te tutar. Yazma cache’i kendiliğinden değiştirmez. İstekten sonra ilgili query’yi **invalidate** etmek, onu yeniden kontrol edilmesi gereken durumda işaretler.
:::

## Küçük bir silme akışından başlayalım

İlk örnekte Sinema’da bir filmi izleme listesinden kaldırdığını düşün. `useMutation` yazma işleminin durumunu React’e bağlar; **mutation state**, işlemin beklediğini, başarılı olduğunu veya hata aldığını tutan bilgidir.

```tsx
const removal = useMutation({ mutationFn: removeFromWatchlist })

<button disabled={removal.isPending} onClick={() => removal.mutate(movieId)}>
  {removal.isPending ? 'Kaldırılıyor…' : 'Listemden kaldır'}
</button>
```

İlk render yalnız düğmeyi hazırlar. Tıklama `mutate(movieId)` çağırınca istek başlar; beklerken düğme kilitlenir. Böylece kullanıcı bekleme anında aynı düğmeye art arda basmaz.

Bir adım sonra sonucu da gösterelim:

```tsx
{removal.isSuccess && <p>İzleme listesinden kaldırıldı.</p>}
{removal.isError && <p role="alert">Film kaldırılamadı.</p>}
```

Başarılı Promise başarı mesajını, reddedilen Promise hata mesajını gösterir. `fetch` kullanıyorsan HTTP 500 cevabı Promise’i otomatik reddetmez; `response.ok` false olduğunda hata fırlatmalısın, yoksa mutation başarısız isteği başarılı sanabilir.

## Silinen satır hemen kaybolsun

Puan listesinden film silerken sunucunun cevabını beklemek istemeyebilirsin. Satırı önce geçici olarak kaldırmak **optimistic update**’tir: sunucu yanıtı gelmeden arayüzde sonucu olmuş gibi gösterirsin. Bunun güvenli olması için eski listenin bir kopyasını, yani **snapshot**’ı saklarsın; istek hata verirse eski görünümü geri kurabilirsin.

```text
Önce:   Dövüş Kulübü — 8,5 puan
Beklerken: satır gizli
Hata:   snapshot geri yüklenir, satır ve puan görünür
Başarı: sunucudaki son liste yeniden okunur
```

Burada geçici kaldırma henüz sunucunun kaydı sildiğini kanıtlamaz. Hata gelirse snapshot, kullanıcının önceki listesini geri getirir; başarıdan sonra listeyi yeniden okumak da sunucunun kabul ettiği son durumu gösterir.

`onMutate` callback’inden döndürülen değer, sonraki mutation callback’lerine **context** olarak taşınır. Context burada rollback için gereken snapshot gibi bilgileri taşır. İkinci görevde hangi veriyi saklayacağını ve hata anında nasıl kullanacağını kendin kuracaksın.

Oturum da listenin kimliğinin parçasıdır. `['ratings', sessionId]` key’i bir oturumun puan listesini tanımlar. `['ratings']` gibi daha kısa bir key’in başında aynı parçalar olan alt key’ler de eşleşebilir; buna **prefix matching** denir. Bu nedenle başarıdan sonra doğru oturumun kapsamını seç.

| An | Sunucu | Query cache ve ekran |
| --- | --- | --- |
| t0 | Henüz istek yok | Film ve puanı listede |
| t1 | DELETE bekliyor | İyimser görünüm satırı saklar; snapshot elde |
| t2-hata | İstek reddedildi | Context’teki snapshot geri yüklenir |
| t2-başarı | İstek kabul edildi | İlgili oturumun puan query’si invalidate edilir |
| t3 | Liste yeniden okunur | Sunucunun son cevabı görünür |

Bu sıra, “satır kayboldu” ile “sunucu silmeyi kabul etti” ayrımını görünür kılar. Hata durumunda geri yükleme, başarı durumunda yeniden okuma farklı işleri çözer.

TMDB puan silme isteği `DELETE /movie/:id/rating?guest_session_id=...` biçimindedir. Guest session id URL’de query parametresi olarak encode edilir; Bearer token `Authorization` başlığında kalır. Başarılı cevapta liste nesnesi dönmesi gerekmez, bu yüzden API fonksiyonu `Promise<void>` ile bitebilir. HTTP hata cevabında hata fırlat ki mutation başarısız olsun.

:::info[Derinlemesine (isteğe bağlı)]
Sayfalı bir listeyi cache’ten doğrudan değiştiriyorsan, yalnız satırı çıkarmak yetmeyebilir: sayfa içindeki sonuç sayısını ve toplam sayacı da tutarlı güncellemen gerekir. Buradaki puan listesi akışında, silinen kaydı cache’ten elle çıkarmak yerine ilgili listeyi yeniden almak yeterlidir.
:::

## Gerçek bir karışıklığı fark et

Belirti: `guest-1` oturumundaki film silinirken `guest-2` listesinin de yeniden yüklendiğini görüyorsun. Neden: işlem yalnız etkilenen oturumun key’i yerine bütün `ratings` ailesini hedeflemiş olabilir. Düzeltme: yazma hangi oturumun verisini değiştirdiyse invalidation kapsamını o oturumla sınırla.

Silme işlemlerinde onay veya kullanıcının işlemi geri alabileceği kısa bir süre de görebilirsin. Bu ürün davranışıdır; bu çalışmadaki rollback ise sunucu isteği başarısız olduğunda geçici cache değişikliğini düzeltir.

:::model[Optimistic update]
Beklerken cache’e geçici sonucu yaz; hata gelirse mutation context’indeki snapshot’ı geri koy. Başarıdan sonra etkilenen query’yi sunucu cevabıyla uzlaştır. Buradaki yeni ayrım, silmenin yalnız doğru oturum listesini etkilemesidir.
:::

## Çalışırken izle

Önce ilk düğmede pending, success ve error görünümünü kur. Sonra ikinci işte silme sürerken satırın kaybolduğunu, hata yanıtında eski puanıyla geri geldiğini ve başarılı yanıtta yalnız doğru oturumun listesinin yenilendiğini adım adım takip et. Her aşamada “şu an ekrandaki bilgi sunucudan mı geldi, geçici mi?” diye kendine sor.

## Özet

- Mutation state, bekleme/başarı/hata görünümünü seçer; HTTP hatasında Promise’i reddet.
- Optimistic silmede hata halinde geri dönebilmek için snapshot sakla.
- Context, mutation callback’leri arasında snapshot gibi bilgileri taşır.
- Invalidation key’ini yalnız etkilenen session’ı kapsayacak şekilde seç.

**Yeni terimler**

- **Mutation state:** Yazma isteğinin bekleme, başarı veya hata durumunu tutan bilgi.
- **Optimistic update:** Sunucu yanıtından önce sonucu arayüzde geçici olarak gösterme.
- **Snapshot:** Geri yüklemek için saklanan önceki veri kopyası.
- **Context:** Mutation callback’leri arasında taşınan ek bilgi.
- **Prefix matching:** Kısa query key’in aynı başlangıca sahip daha uzun key’lerle eşleşmesi.

**Kendini yokla:** Silme isteği hata verince neden snapshot gerekir?

Cevap: Satırı geçici kaldırdığın için eski listeyi ve puanı geri getirecek veriye ihtiyacın var.

**Kendini yokla:** Neden yalnız ilgili session key’ini yenilersin?

Cevap: Diğer oturumun sunucu verisi değişmedi; gereksiz istek ve cache yenilemesi önlenir.
