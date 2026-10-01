---
title: "Asenkron arayüzü doğru zamanda doğrulamak"
minutes: 15
kind: concept
---

# Asenkron arayüzü doğru zamanda doğrulamak

Bir film seansının detayını açtığında ekranda önce “Yükleniyor”, cevap geldikten sonra seans bilgisi görünmesi doğaldır. Test ise `render(...)` satırından hemen sonra devam eder. Asenkron iş, sonucu hemen değil daha sonra verdiği için testin de ekrandaki doğru anı beklemesi gerekir.

`getByRole` DOM’da şu anda bulunan öğeyi hemen arar. Bulamazsa anında hata verir; ağ yanıtını beklemez. Önce en kolay durumu görelim: yükleme metni component’in ilk ekranında hazırsa onu hemen bulabiliriz.

```ts
render(<ScreeningDetails />)
expect(screen.getByRole('status')).toHaveTextContent('Yükleniyor')
```

Bu assertion render’dan sonra o anda doğru olanı söyler. `status` erişilebilir durum mesajı rolüdür; kullanıcı ve yardımcı teknolojiler bu metnin bir durum güncellemesi olduğunu anlayabilir. Burada bekleme eklemek gerekmez, çünkü metin ağ cevabından önce gösterilir.

## Sonradan gelen sonucu bekle

Seans başlığı cevap gelince ekleniyorsa aynı `getByRole` çok erken çalışabilir. `findByRole`, ilgili `getByRole` sorgusunu tekrar deneyerek öğenin görünmesini bekler:

```ts
expect(await screen.findByRole('heading', { name: 'Gece Matinesi' }))
  .toBeInTheDocument()
```

Bu satır testin “şu anda başlık var mı?” yerine “başlık biraz sonra gelecek mi?” sorusunu sormasını sağlar. Sabit bir saniye uyumak daha kötü bir seçimdir: hızlı makinede gereksiz bekler, yavaş makinede süre yetmeyebilir. Aranan şey zamanı değil, kullanıcının göreceği başlıktır.

Bekleme sırasını görünür kılalım. MSW handler’ı yanıtı kısa süre geciktiriyorsa component’in ve testin gördüğü sıra şöyledir:

| An | Ne oluyor? | Test ne yapabilir? |
|---|---|---|
| Component render olur | İstek başlar, seans henüz yoktur | `getByRole('status')` ile yüklemeyi hemen doğrula |
| Handler bekler | Component yükleniyor durumundadır | Sabit uyku ekleme; test sıradaki anlamlı durumu beklesin |
| Handler cevap verir | Component yanıtı işler | `await findByRole('heading', ...)` başlığı bekler |
| State güncellenir | Yükleme kalkar, başlık görünür | İstenirse yükleme öğesinin kaldırılışı ayrıca doğrulanır |

Her testte bütün ara anları doğrulamak zorunda değilsin. Kullanıcı için anlamlı olan yükleme ve sonuç durumlarını seç. Eğer istek çok hızlı biterse yükleme metni test assertion’ından önce kalkabilir; yükleme anını özellikle sınamak için MSW’de kontrollü gecikme verirsin. Gecikme sunucu davranışını taklit eder, testin `findBy` ile sonucu beklemesinin yerini almaz.

## Birden fazla koşul için `waitFor`

Bazen tek bir öğeyi beklemek yerine birden fazla koşulun doğru olmasını istersin. `waitFor`, içindeki callback hata verdiği sürece onu tekrar çalıştıran yardımcıdır. Bu yüzden callback’in içine yalnızca kontrol koy:

```ts
await waitFor(() => {
  expect(screen.getByRole('button', { name: 'Bilet al' })).toBeEnabled()
  expect(requests()).toHaveLength(1)
})
```

Burada iki koşulun da doğru olmasını bekliyoruz: düğme yeniden kullanılabilir ve yalnızca bir istek yapılmış. Callback’in ilk çalıştığı anda henüz doğru değilse assertion hata verir ve RTL tekrar dener. `waitFor` tek bir başlık için gereksizdir; o durumda `findByRole` daha kısa ve anlaşılır olur.

Gerçek bir öğrenci hatası, tıklamayı da callback içine koymaktır:

```ts
// Yanlış: callback tekrar denenirse tıklama da tekrarlanabilir.
await waitFor(async () => {
  await user.click(screen.getByRole('button', { name: 'Bilet al' }))
  expect(requests()).toHaveLength(1)
})
```

Belirti olarak test birden çok istek gönderir veya arada sırada geçer. Nedeni, `waitFor` callback’inin bir kereden fazla çalışabilmesidir. Önce `await user.click(...)` ile etkileşimi bir kez yap; ardından `waitFor` içinde yalnız sonucu doğrula. Böylece testin tekrar denediği şey kullanıcı eylemi değil, henüz gerçekleşmemiş beklentidir.

## Ekrandan kaybolan öğeyi bekle

Yükleme göstergesinin kalktığını doğrudan sınamak da isteyebilirsin. **Disappearance helper**, DOM’da görünen bir öğenin kaldırılmasını bekleyen yardımcıdır. RTL’de `waitForElementToBeRemoved` bu iş için kullanılır. Öğeyi kaldırılmadan önce bulmak gerektiği için ilk durumun varlığını alıp sonra kayboluşunu beklersin:

```ts
const loading = screen.getByRole('status')
await waitForElementToBeRemoved(loading)
expect(await screen.findByRole('heading', { name: 'Gece Matinesi' }))
  .toBeInTheDocument()
```

İlk satır ekrandaki mevcut yükleme öğesini alır; ikinci satır aynı öğenin DOM’dan kaldırılmasını bekler. Son satır sonuç başlığını arar. Eğer yükleme metni ilk anda görünmüyorsa onu önce `findByRole('status')` ile beklemen gerekir. Bu kontrolü yalnızca yükleme göstergesinin kaybolması ürün davranışının parçasıysa ekle; çoğu testte sonuç başlığının görünmesi yeterlidir.

Başlık bazen hiç gelmiyorsa timeout’u gelişigüzel büyütme. Önce doğru role ve erişilebilir ada baktığını, istek URL’inin handler ile eşleştiğini ve handler’ın cevap verdiğini kontrol et. 404 gibi bir HTTP cevabı geldiyse `fetch` yine `Response` üretir; component `response.ok` değerini denetlemezse hata ekranı yerine yanlış başarı gösterebilir. Ağ bağlantısı hiç kurulamazsa ise Promise reject olabilir. Bu iki yol kullanıcıya benzer hata mesajı gösterebilir, ama uygulamada farklı şekilde oluşur.

:::mistake[HTTP hatasını ağ hatası sanmak]
Belirti → Handler 500 döndürürken hata ekranı gelmez, test başlığı beklerken zaman aşımına uğrar.
Neden → `fetch` HTTP 500’de reject olmaz; uygulama status kontrolü yapmadan cevabı başarı gibi işlemiştir.
Düzeltme → Uygulamada `response.ok` kontrolü yap ve testte sonradan görünen hata mesajını `findByRole('alert')` ile bekle.
:::

İsteklerin tamamlanma sırası da önem taşıyabilir. Kullanıcı önce “Matrix”, hemen ardından “Dövüş” ararsa ilk istek daha geç bitebilir. Önceki hook derslerinde gördüğün cleanup, eski isteğin yeni sonucu ezmesini önleyebilir. Asenkron testte yeni başlık bir kez göründü diye her şeyin bittiğini varsayma; testin iddiası son ve güncel arama sonucunu görmekse onu ayrıca doğrula.

![Eski yavaş yanıtın yeni hızlı yanıtı ezme riski](diagram:yaris-kosulu)

:::info[Derinlemesine (isteğe bağlı)]
İki istek ters sırada tamamlandığında oluşan duruma yarış koşulu denir. Testte MSW gecikmesiyle cevap sırasını kontrollü kurabilirsin; eski cevabı iptal etme veya yok sayma davranışı component’in sorumluluğudur. Bu derste yalnız tek bir cevabın yükleme ve sonuç geçişini test etmek için bu ayrıntı gerekmez.
:::

## Özet

- `getBy` şu an DOM’da olması gereken öğeyi hemen arar.
- `findBy` sonradan görünmesi beklenen tek öğeyi bekler.
- `waitFor` birden fazla assertion veya özel koşul için tekrar dener; callback içinde yan etki yapma.
- Bir öğenin kaybolması gerekiyorsa `waitForElementToBeRemoved` kullanılabilir.
- Sabit süre uyumak yerine kullanıcının göreceği DOM durumunu bekle.
- HTTP hata status’u ile ağ bağlantısı hatası farklıdır; `fetch` HTTP hatasında `Response` döndürür.

**Yeni terimler**

- **Asenkron iş:** Sonucunu aynı anda değil, daha sonra veren işlem.
- **Disappearance helper:** Bir DOM öğesinin kaldırılmasını bekleyen test yardımcısı.
- **Retry / tekrar deneme:** Bir kontrol henüz doğru değilken aynı kontrolü yeniden çalıştırma.

**Kendini yokla:** Başlık cevap geldikten sonra görünüyorsa `getByRole` mı `findByRole` mı seçersin?
*Cevap:* `findByRole`; çünkü öğe hemen değil, biraz sonra DOM’a eklenir.

**Kendini yokla:** `waitFor` içindeki callback’e neden `user.click` koymamalısın?
*Cevap:* Callback birden çok kez çalışabilir ve tıklama tekrar edilerek birden fazla istek oluşturabilir.
