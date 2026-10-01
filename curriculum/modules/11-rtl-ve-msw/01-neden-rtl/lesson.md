---
title: "Bileşeni kullanıcı gibi sınamak"
minutes: 16
kind: concept
---

# Bileşeni kullanıcı gibi sınamak

Sinema’daki bir film kartında “İzleme listeme ekle” düğmesi olduğunu düşün. Kartın callback’ini doğrudan çağırmak kolaydır; ama düğme ekranda yoksa ya da `disabled` ise kullanıcı bu callback’e ulaşamaz. Testin bunu fark etmesi için sonucu içeriden üretmek yerine ekrandaki yoldan ilerlemesi gerekir.

## Önce testin neyi kanıtladığına bakalım

Aşağıdaki test, bir callback’e sayı gönderir:

```tsx
const addToList = vi.fn()
addToList(72)
expect(addToList).toHaveBeenCalledWith(72)
```

Beklenti yeşil olur; fakat bu kod bir React bileşeni bile render etmedi. “Render etmek”, bileşeni DOM’da görülebilecek çıktıya dönüştürmektir. Bu nedenle test, düğmenin varlığını, adını veya tıklanabilir olup olmadığını kanıtlamaz. `vi.fn()` burada Vitest’in çağrılarını kaydeden sahte bir fonksiyonudur; callback’in gerçekten kullanıcı yolundan çağrılıp çağrılmadığını görmemizi sağlar.

React Testing Library (RTL), React bileşenini DOM’a render edip ekrandaki davranışı sınamamıza yarayan araçtır. DOM, tarayıcının sayfadaki düğme ve metin gibi öğeleri tuttuğu ağaç yapıdır. RTL’de bileşeni render eder, kullanıcıya sunulan kontrolü bulur, etkileşimi başlatır ve görünen sonucu doğrularız.

## Ekrandaki düğmeye ulaşalım

İlk adımda yalnızca `WatchlistButton` bileşenini render edip düğmeye basacağız. **Erişilebilir ad**, kontrolün ekran okuyucu gibi yardımcı teknolojilere hangi isimle sunulduğudur; bu örnekte düğmenin içindeki metindir.

```tsx check
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

function WatchlistButton({ onAdd }: { onAdd: () => void }) {
  return <button onClick={onAdd}>İzleme listeme ekle</button>
}

it('izleme listesi düğmesine basılmasını bildirir', async () => {
  const user = userEvent.setup()
  const onAdd = vi.fn()
  render(<WatchlistButton onAdd={onAdd} />)

  await user.click(screen.getByRole('button', { name: 'İzleme listeme ekle' }))

  expect(onAdd).toHaveBeenCalledOnce()
})
```

Burada `getByRole` düğmeyi kullanıcıya sunulan rolü ve adıyla bulur. `user.click` gerçek tıklama akışını başlatır; akış tamamlanmadan son beklentiye geçmemek için `await` kullanırız. Artık test, callback’in düğme üzerinden ulaşılabilir olduğunu kanıtlar.

## Testi bir adım daha gerçekçi yapalım

Bir film kartında düğmenin hangi film için çalıştığını da bilmek isteyebiliriz. Şimdi bileşene bir film numarası ekliyoruz; önceki örneğe eklenen tek yeni fikir budur.

```tsx
function WatchlistButton({
  movieId,
  onAdd,
}: {
  movieId: number
  onAdd: (id: number) => void
}) {
  return <button onClick={() => onAdd(movieId)}>İzleme listeme ekle</button>
}
```

Render edilen düğmeye tıkladığında bileşen `movieId` değerini dışarı iletir. Bu davranışın testi yine kullanıcı yolunu izlemeli: düğmeyi bul, tıkla, sonra kaydediciye doğru numaranın gittiğini doğrula. `onAdd(72)` çağrısını testte elle yapmak bu bağlantıyı atlar.

Şimdi farklı bir film davranışı ekleyelim: fragman oynarken ekranda kısa bir durum mesajı belirsin. Böyle bir mesaj, bir buton veya state değişkeninin adı yerine kullanıcıya görünen sonucu sınamamıza örnektir.

```tsx
function TrailerStatus({ playing }: { playing: boolean }) {
  return playing ? <p role="status">Fragman oynatılıyor</p> : null
}
```

`playing` doğru olduğunda kullanıcı bir `status` mesajı görür; yanlış olduğunda mesaj DOM’da yoktur. Test bu iki sonucu sınayabilir ve bileşenin içeride boolean mı, başka bir state yapısı mı kullandığına bağlanmaz. Bir düğmenin seçili durumunu göstermek gerektiğinde `aria-pressed` da kullanıcıya sunulan semantik bir durumdur.

## Akışı satır satır izle

İlk testte olanlar şu sıradadır:

| Sıra | İfade | Gözlem |
|---|---|---|
| 1 | `userEvent.setup()` | Bu test için etkileşim oturumu hazırlanır. |
| 2 | `render(...)` | Bileşen DOM’a eklenir. |
| 3 | `getByRole(...)` | Adı eşleşen düğme bulunur; bulunamazsa test hemen hata verir. |
| 4 | `await user.click(...)` | Tıklama olayları tamamlanır ve bileşenin handler’ı çalışabilir. |
| 5 | `expect(...)` | Callback’in kullanıcı etkileşimiyle çağrıldığı doğrulanır. |

Bu sıra, testin neden callback’i doğrudan çağırmaması gerektiğini gösterir: doğrudan çağrıda 2–4. adımlar yoktur. Düğme `disabled` olursa gerçek etkileşim callback’i çağırmaz ve son beklenti hata verir.

## Birim mi, bileşen mi?

Bir başlığı biçimlendiren saf fonksiyon için React ve DOM kurmaya gerek yoktur; fonksiyona girdi verip çıktısını birim testinde sınarsın. Bir bileşenin kullanıcıya sunduğu kontrolü ve tıklama sonucunu RTL ile sınamak daha uygun olur. Birden fazla parçanın birlikte çalışmasını daha geniş sınırda doğrulayan teste entegrasyon testi denir; bu modülde component ile DOM etkileşimine odaklanıyoruz.

![Birim, entegrasyon ve uçtan uca test katmanları](diagram:test-katmanlari)

:::mistake[Testte callback’i elle çalıştırmak]
Belirti → Callback beklentisi geçer ama gerçek düğme `disabled` olduğu için kullanıcı hiçbir şey yapamaz.
Neden → Test sonucu kendisi üretti; arayüzden sonuca giden yolu çalıştırmadı.
Düzeltme → Bileşeni render et, düğmeyi rolü ve adıyla bul, `user.click` ile etkileş.
:::

:::mistake[İç ayrıntıyı ürün davranışı sanmak]
Belirti → `className` veya state değişkeni değişince, kullanıcı davranışı aynı kaldığı halde test bozulur.
Neden → Test, kullanıcıya sunulmayan bir uygulama ayrıntısına bağlanmıştır.
Düzeltme → Metin, rol, input değeri veya `aria-pressed` gibi gözlenebilir sonucu doğrula.
:::

RTL testi gerçek tarayıcıyı veya gerçek ekran okuyucuyu çalıştırmaz. `jsdom`, Node içindeki testlerde DOM benzeri bir ortam sağlayan kütüphanedir; gerçek yerleşimi, görsel görünümü ve yardımcı teknolojilerin seslendirmesini taklit etmez. Yine de rol ve ad gibi DOM bilgisini doğrulamak, erişilebilir arayüz kurmana yardım eder.

:::info[Derinlemesine (isteğe bağlı)]
Test piramidinde birim testleri dar ve hızlı, entegrasyon testleri birkaç parçanın birleşimine, uçtan uca (E2E) testler ise gerçek tarayıcıdaki tüm kullanıcı yolculuğuna bakar. Playwright, tarayıcıda E2E testleri çalıştıran araçlardan biridir. Mutation testing, kodun küçük ve hatalı bir sürümünü çalıştırıp testlerin bu hatayı yakalayıp yakalamadığını kontrol eder; `mutant` bu hatalı sürüme verilen addır. Bunlar RTL’nin her testte yapması gereken işler değildir.
:::

## Özet

- Testi kullanıcının ekranda izlediği yoldan kur: render et, kontrolü bul, etkileş, sonucu gör.
- Callback’i elle çağırmak bileşenin erişilebilir ya da tıklanabilir olduğunu kanıtlamaz.
- Rol, erişilebilir ad ve görünür durum genellikle iç state veya class’tan daha iyi test sınırlarıdır.
- Test ortamının gösterebildiği şeyleri gerçek tarayıcı veya ekran okuyucu deneyimiyle karıştırma.

**Yeni terimler**

- **RTL:** React bileşenlerini DOM üzerinden test etmeye yarayan React Testing Library.
- **DOM:** Tarayıcının sayfadaki öğeleri tuttuğu ağaç yapısı.
- **Erişilebilir ad:** Bir kontrolün yardımcı teknolojilere sunulduğu isim.
- **jsdom:** Testte DOM benzeri ortam sağlayan Node kütüphanesi.
- **Mutant:** Testin yakalayıp yakalamadığını ölçmek için kullanılan kasıtlı hatalı kod sürümü.
- **Entegrasyon testi:** Birden fazla parçanın birlikte doğru çalışıp çalışmadığını sınayan test.

**Kendini yokla:** Düğme `disabled` olduğunda doğrudan callback testi neden yine geçebilir?
*Cevap:* Callback doğrudan çağrılır; düğmenin gerçekten tıklanması hiç denenmez.

**Kendini yokla:** Bir tarih biçimlendirme fonksiyonu için RTL neden gerekmeyebilir?
*Cevap:* Fonksiyon React veya DOM kullanmıyorsa girdi ve çıktısını birim testiyle sınamak yeterlidir.
