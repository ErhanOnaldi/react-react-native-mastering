---
title: "Asenkron arayüzü doğru zamanda doğrulamak"
minutes: 15
kind: concept
---

# Asenkron arayüzü doğru zamanda doğrulamak

:::pain[Problem]
Film ayrıntısını açar açmaz `getByRole('heading', { name: 'Kayıp Şehir' })` çağırıyorsun. Ağ henüz yanıtlamadığı için test kırmızı; gerçek kullanıcı ise yarım saniye sonra başlığı görüyor. Testin saati ile arayüzün saati aynı değil.
:::

## Ekran bir anda değil, geçişlerle değişir

`getBy` hemen sorgular. Asenkron işin sonucunu beklemez. Bir ekran ilk render’da “Yükleniyor”, daha sonra başlık veya hata gösterebilir. Her zaman noktasında başka bir sorgu anlamlıdır: başlangıç durumu için `getBy`, daha sonra DOM’dan kaybolması beklenen öğe için `queryBy` ile `waitFor`/`waitForElementToBeRemoved`, sonradan eklenecek öğe için `findBy`.

0.7’de test anatomisini gördün; şimdi aynı hazırla → çalıştır → doğrula akışını zaman içinde değişen DOM’a uygula. Asenkron testte temel kural, sabit süre uyumak değil, beklenen gözlenebilir durumun gerçekleşmesini beklemektir.

Kesin kurallar:

1. **Hemen görünen şeyi hemen sorgula.** İlk render’da status görünüyorsa `getByRole('status')` kullan.
2. **Sonradan gelecek tek öğe için `findBy` seç.** `findBy` ilgili `getBy` sorgusunu yeniden dener ve süre aşımında açıklayıcı biçimde başarısız olur.
3. **Birden çok assertion için `waitFor` kullan.** Callback’in içindeki assertion’lar hata verdiği sürece callback yeniden denenir.
4. **`waitFor` callback’ini yan etkisiz tut.** İçine click, istek, state değiştiren çağrı veya sayaç artırma koyma; callback birden çok kez çalışabilir.
5. **Öğenin kaldırılmasını ayrıca bekle.** Yükleme göstergesinin kaybolması gereksinimse `waitForElementToBeRemoved` ya da `waitFor(() => expect(queryBy...).not...)` kullan.
6. **Sabit gecikmeyi varsayılan çözüm yapma.** `await new Promise(setTimeout...)` makineye göre yavaş veya erken kalır; DOM durumunu beklemek daha sağlamdır.

Bir `findBy` çağrısı varsayılan bekleme süresi içinde arar. Gerçek ürün davranışı bu süreden daha uzun sürüyorsa test yapılandırmasını açıkça değiştirmek gerekebilir; her teste rastgele uzun timeout eklemek ise yavaşlığı gizler. İstek hiç çözülmüyorsa timeout’u büyütmek yerine handler, Promise zinciri ve loading/error geçişini incele.

## Üç zaman noktasını sırayla izle

Bir takvim ayrıntı paneli mount olduğunda veri ister. Ağ cevabı başarı, HTTP hata veya ağ hatası olabilir. Testte beklenen DOM sırası şöyledir:

| Zaman | Bileşen durumu | DOM sorgusu |
|---|---|---|
| Render sonrası | İstek sürüyor | `getByRole('status')` |
| Başarılı cevap sonrası | Başlık geldi | `await findByRole('heading', { name: 'Pazar Pazarı' })` |
| Hata cevabı sonrası | Kullanıcıya hata açık | `await findByRole('alert')` |
| Başarıdan sonra yükleme kalktı | Status kaldırıldı | `waitForElementToBeRemoved(status)` |

`status` öğesini kaldırılmayı beklemeden önce DOM’dan bulman gerekir; bulması hemen mümkün değilse sırayı ters kurmak yerine önce `findByRole('status')` ile görünmesini bekle, sonra removal helper’ını çağır. Yine de çoğu testte hem her ara durumu hem son durumu assert etmek gerekmeyebilir. Ürün davranışı açısından anlamlı ve hatayı ayırt ettiren minimum beklentileri seç.

## Kırık bekleme, doğru bekleme

Sabit uyku, ağ cevabının ne zaman geldiğini bilmez:

```ts
// Kırık: 500 ms fazla bekleyebilir ya da yavaş ortamda yetmeyebilir.
await new Promise((resolve) => setTimeout(resolve, 500))
expect(screen.getByText('Pazar Pazarı')).toBeInTheDocument()
```

Öğenin kendisini bekle:

```tsx check
import { useEffect, useState } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { expect, it } from 'vitest'

const loadMarketName = () => Promise.resolve('Pazar Pazarı')

function MarketName({ load }: { load: () => Promise<string> }) {
  const [name, setName] = useState<string | null>(null)
  useEffect(() => {
    void load().then(setName)
  }, [load])
  return name ? <h2>{name}</h2> : <p role="status">Yükleniyor</p>
}

it('cevap geldiğinde pazar adını gösterir', async () => {
  render(<MarketName load={loadMarketName} />)
  expect(screen.getByRole('status')).toHaveTextContent('Yükleniyor')
  expect(await screen.findByRole('heading', { name: 'Pazar Pazarı' })).toBeInTheDocument()
})
```

## `waitFor` nasıl tekrar dener?

`waitFor` callback’i hemen çalışır, hata alırsa aralıklarla yeniden çalışır ve timeout’a kadar devam eder. Callback içinde assertion başarılı döndüğü anda promise tamamlanır. Bu nedenle callback yalnızca “şimdi doğru mu?” sorusunu yanıtlamalıdır:

```ts
await waitFor(() => {
  expect(screen.getByRole('button', { name: 'Sepete eklendi' })).toBeEnabled()
})
```

Etkileşimi callback dışına koy. Aksi halde retry her defasında düğmeye yeniden tıklayabilir:

```ts
// Yanlış: retry olursa click birden çok kez yürüyebilir.
await waitFor(async () => {
  await user.click(addButton)
  expect(onAdd).toHaveBeenCalledTimes(1)
})
```

`findBy` tek bir öğe bulunmasını bekler ve çoğu UI testi için daha kısa, niyeti daha net çözümdür. `waitFor` birden fazla koşulu, request günlüğü gibi DOM dışı bir değeri veya özel bir durum birleşimini beklediğinde kullanılır. Bütün testleri `waitFor` içine sarmak, anlık gereksinimi gecikmeliymiş gibi gösterir ve gereksiz bekleme ekler.

Bir timeout’u büyütmeden önce öğenin gerçekten DOM’a eklendiğini, doğru rol ve ada sahip olduğunu ve işlemin tamamlanabildiğini doğrula. Yanlış adla arama yaparken 10 saniye beklemek yalnızca aynı hatayı daha geç gösterir. Test yavaş ağ davranışını özellikle modellemiyorsa, uzun timeout gerçek kullanıcı beklentisi değildir; beklenmeyen gecikmeyi gizleyebilir. `findBy` ve `waitFor` seçenekleri timeout’u yerel olarak ayarlayabilir, ama suite’in her yerinde süreyi büyütmek yerine yalnızca bilinen, meşru gecikme için kullan.

Bir assertion bazen ilk denemede geçip sonra bozulabilir; örneğin iki async iş aynı DOM’u güncelliyorsa önce görünen başlık kısa süre sonra değişebilir. `findBy` öğe ilk kez eklendiği an çözülür, onun sonradan doğru kalacağını garanti etmez. Yarış veya tekrar eden güncelleme söz konusuysa son durumu ayrıca kontrol et ve eski işin state’e yazma hakkını kaldır. Bu ayrım, “öğe bir kere göründü” ile “güncel kullanıcı girdisine ait doğru öğe görünüyor” iddialarını birbirinden ayırır.

:::model[Yarış koşulu]
İstekler başlama sırasıyla bitmek zorunda değildir. Önceki Hook’lar modülünde öğrendiğin gibi cleanup, eski çalışmanın ekrana yazma hakkını kaldırır veya isteği iptal eder. Testte gecikmeli cevapları beklemek bu sırayı görünür kılar; yeni bir cevap geldi diye eski cevabın güvenli olduğunu varsayma.
:::

![Eski yavaş yanıtın yeni hızlı yanıtı ezme riski](diagram:yaris-kosulu)

:::mistake[`waitFor` içine etkileşim koymak]
Belirti → Test bazen callback’i iki kere çağırıyor veya beklenenden fazla kayıt oluşturuyor.  
Neden → Retry mekanizması click ya da submit’i tekrarladı.  
Düzeltme → Eylemi bir kez, dışarıda await et; `waitFor` içinde yalnızca assertion tut.
:::

:::mistake[HTTP 500’ü ağ hatası sanmak]
Belirti → 500 cevabında hata ekranı gelmiyor, başlık bekleme süresi doluyor.  
Neden → `fetch` yalnızca ağ sorunu olduğunda reject eder; HTTP 500 de bir Response olarak resolve olur.  
Düzeltme → Uygulama `response.ok` kontrol etmeli; test de görünür hata durumunu beklemeli.
:::

:::mistake[Eski isteğin cevabını kabul etmek]
Belirti → Yeni parametreyle gelen başlık kısa süre görünür, sonra eski başlık gelir.  
Neden → Yavaş eski cevap yeni state’i ezmiştir.  
Düzeltme → Effect cleanup’ında geç cevabı yok say veya isteği iptal et; testte iki isteğin ters bitiş sırasını oluştur.
:::

## Bekleme koşulunun türünü ayırt et

Asenkron DOM değişiminde üç farklı soru vardır. “Bu öğe şimdi var mı?” için anlık sorgu; “bu öğe daha sonra görünecek mi?” için `findBy`; “şu an görünen öğe artık DOM’dan kaldırıldı mı?” için disappearance helper’ı kullan. Bir koşul birden çok DOM parçasını veya request sayısını kapsıyorsa `waitFor` daha açık olabilir. Her durumda test, zamanlayıcıya değil beklenen durum değişimine bağlanır.

`waitFor` callback’i senkron assertion’larla genellikle yeterlidir. Callback bir Promise döndürürse RTL Promise’in reddedilmesini bekler; Promise başarılı resolve olursa tekrar deneme durur. Bu davranış async callback içinde etkileşim yapmayı daha da riskli kılar: `user.click` tamamlanınca assertion da geçici olarak başarılı görünür ve retry kesilir, ya da interaction retry öncesi birden çok kez yapılır. Eylemi mutlaka dışarı al.

Asenkron hataları sınıflandırırken üç ayrı kaynağı ayır. Ağ bağlantısı kurulamazsa `fetch` Promise’i reject olabilir. Sunucu 500 döndürürse Promise bir `Response` ile tamamlanır ve uygulama `ok` alanını kontrol etmelidir. JSON gövdesi beklenen şemaya uymuyorsa parse veya runtime doğrulaması hata verebilir. Kullanıcının hepsini benzer mesajla görmesi bir ürün tercihi olabilir; ama testlerde farklı handler ve girişle hangi yolu sınadığını bil.

Bir loading göstergesinin çok kısa süre görünmesi, DOM’da bulunabilir olacağı garantisi değildir. Yanıtın zamanlamasını test kontrollü hale getirdiğinde bekleme durumunu deterministik biçimde gözleyebilirsin. Sonrasında başlığın görünmesini bekle; kullanıcı sözleşmesi bunu gerektirmiyorsa geçen süreyi milisaniye hassasiyetinde ölçme.

:::sector
Ekiplerde asenkron testin bekleme koşulu kullanıcı dilinde yazılır: “sonuç başlığı görünür”, “hata mesajı duyurulur”, “kaydetme düğmesi yeniden etkinleşir”. Milisaniye beklemek yerine bu koşulları hedeflemek testleri farklı makinelerde kararlı tutar.
:::

## Özet

- `getBy` anlık, `findBy` gecikmeli varlık, `queryBy` yokluk için uygundur.
- `waitFor` tekrar deneyebilir; içine etkileşim değil assertion koy.
- Sabit uyku yerine görünür DOM koşulunu bekle.
- HTTP hata durumu ile ağ hatasını ayır; uygulamada `response.ok` kontrolü gerekir.
- Eski asenkron cevapların güncel ekranı ezmesine izin verme.

**Kendini yokla:** `waitFor` callback’i neden yan etkisiz olmalıdır?  
*Cevap:* Birden çok kez çalışabilir; etkileşim veya state değişikliğini tekrarlayabilir.

**Kendini yokla:** Beklenen öğenin hemen bulunması gerekiyorsa `findBy` mi `getBy` mi?  
*Cevap:* `getBy`; `findBy` yalnızca sonradan belirmesi beklendiğinde.
