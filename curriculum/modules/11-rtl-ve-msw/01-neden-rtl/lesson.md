---
title: "Bileşeni kullanıcı gibi sınamak"
minutes: 14
kind: concept
---

# Bileşeni kullanıcı gibi sınamak

:::pain[Problem]
Favori testi `onToggle(550)` fonksiyonunu doğrudan çağırıyor ve yeşil. Ekrandaki gerçek düğmeye `disabled` eklenince kullanıcı tıklayamıyor, ama test hâlâ yeşil kalıyor. Test kodu olayın sonucunu çalıştırdı; kullanıcının o sonuca ulaşabildiğini hiç sormadı.
:::

## Testin sınırı ekranda başlar

3. modülün 10. dersinde `render`, `getByRole` ve `userEvent` ile React bileşenini kullanıcı yüzeyinden sınamaya başladın. Burada aynı kurulumu baştan anlatmıyoruz; yeni adım, hangi davranışın hangi test sınırına ait olduğunu ve iç ayrıntıyı nasıl dışarıda bırakacağını seçmek. Bir bileşen props alır, DOM üretir, kullanıcı olaylarına yanıt verir ve bazen dış sistemlerden veri ister. Kullanıcının erişebildiği kısım DOM ve etkileşimdir. State değişkeninin adı, handler gövdesi veya CSS class’ı tek başına kullanıcı sözleşmesi değildir.

React Testing Library (RTL), bileşeni gerçek DOM’a yakın bir ortamda render eder. Sen ekrandaki kontrolleri bulur, kullanıcı olayını uygular ve ortaya çıkan DOM’u incelersin. Test, bileşenin içini açmaya değil, bileşen sınırından görülen davranışı korumaya çalışır.

Kesin kurallar:

1. **Gözlenebilir sonucu seç.** Kullanıcının görebildiği metin, erişebildiği kontrol, URL değişimi veya gönderilen istek gibi bir davranışı doğrula.
2. **Kontrolü erişilebilir kimliğiyle bul.** Düğme, bağlantı, başlık, textbox veya status gibi rolü ve gerekiyorsa erişilebilir adı kullan.
3. **Etkileşimi kullanıcıdan başlat.** Bir callback’i doğrudan çağırmak yerine DOM’daki düğmeye tıkla ya da alana yaz.
4. **İç uygulama ayrıntısını gereksiz yere sabitleme.** State değişkeninin adını, class sırasını veya bileşen ağacının belirli bir iç sarmalayıcısını test etme.
5. **Her assertion bir gereksinimi korusun.** Test adı ve beklenti birlikte, kullanıcı açısından neyin doğru kalması gerektiğini anlatsın.

Bu, her testte bütün uygulamayı açman gerektiği anlamına gelmez. Bir saf fonksiyon için birim testi en ucuz ve doğru sınırdır. Bir bileşenin ekrana ne çizdiğini, router veya ağla nasıl birleştiğini ölçmek için entegrasyon testi gerekir. Gerçek tarayıcıda tüm uygulamayı çalıştırmak ise uçtan uca testin işidir.

![Birim, entegrasyon ve uçtan uca testin sorumluluklarını gösteren piramit](diagram:test-katmanlari)

## Aynı davranışın iki testi

Kampanya kartında “İzleme listeme ekle” düğmesi olsun. Aşağıdaki test, sonucu doğrudan üretir:

```tsx
// Kırık sınır: kullanıcının ulaşacağı düğme devre dışı olsa bile geçer.
const toggle = vi.fn()
toggle(72)
expect(toggle).toHaveBeenCalledWith(72)
```

Burada test edilen şey `toggle` mock’unun kendisidir. Bileşen render edilmediği için düğmenin DOM’da bulunması, doğru adla duyurulması veya gerçekten çalışması hakkında kanıt yoktur.

Doğru sınır, render edilmiş kontrolü çalıştırır. Örnekte `WatchlistButton` bambaşka bir görev senaryosudur; ders, görevlerdeki bileşen adlarını veya çözümü kullanmaz:

```tsx check
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

function WatchlistButton({ itemId, onAdd }: { itemId: number; onAdd: (id: number) => void }) {
  return <button onClick={() => onAdd(itemId)}>İzleme listeme ekle</button>
}

it('izleme listesine ekleme isteğini iletir', async () => {
  const user = userEvent.setup()
  const onAdd = vi.fn()
  render(<WatchlistButton itemId={72} onAdd={onAdd} />)

  await user.click(screen.getByRole('button', { name: 'İzleme listeme ekle' }))

  expect(onAdd).toHaveBeenCalledWith(72)
})
```

Bu blok tek başına derlenebilir bir modül olarak tasarlanmıştır; örnek bileşenin dosyası bu öğretim örneği için mevcut kabul edilir. `render` DOM’u oluşturur, `screen` o DOM’da arama yapar, `user.click` gerçek etkileşim dizisini başlatır. `await`, olay dizisi tamamlanmadan assertion’a geçmemeni sağlar.

## Test akışını satır satır izle

Yukarıdaki testte zaman ve veri akışı şöyle ilerler:

| Sıra | Çalışan ifade | Değer / gözlem |
|---|---|---|
| 1 | `userEvent.setup()` | Tıklama için bir kullanıcı oturumu hazırlanır. |
| 2 | `vi.fn()` | Henüz çağrılmamış `onAdd` kaydedicisi oluşur. |
| 3 | `render(...)` | Bileşen DOM’a eklenir; düğme erişilebilir adını alır. |
| 4 | `getByRole(...)` | Tam bir düğme bulunur; yoksa test hemen hata verir. |
| 5 | `await user.click(...)` | Kullanıcı olayları tamamlanır; bileşen handler’ı çalışabilir. |
| 6 | `toHaveBeenCalledWith(72)` | Düğmenin doğru öğe kimliğiyle callback’i çağırdığı doğrulanır. |

Test, callback çağrısını doğruluyor olsa da onu bileşenden bağımsız çalıştırmıyor. Önemli fark, çağrının DOM’daki düğmeye kullanıcı etkileşimiyle ulaşarak gerçekleşmesidir. Test ayrıca erişilebilir adı sorguladığı için etiketsiz ya da farklı adla duyurulan bir kontrolü kabul etmez.

## Test katmanı gereksinime göre seçilir

Bir formülün yüzde hesabı birim testinde doğrulanabilir. Bir formun alanı, hata mesajı ve submit davranışı birlikte çalışırken RTL entegrasyon testi daha anlamlıdır. Uygulamanın gerçek bir tarayıcıda açılıp farklı sayfalar arasında dolaşması ise Playwright gibi uçtan uca bir araç ister.

Test katmanı seçerken “hangi araç daha güçlü?” diye değil, “bu gereksinim için hangi çevre gerçekten gerekli?” diye sor. Birim testini router, ağ ve tarayıcıyla kurmak yavaşlık ve bakım maliyeti getirir. Buna karşılık, iki bileşen arasındaki URL değişimini yalnızca saf fonksiyon testiyle doğrulayamazsın. En küçük doğru sınırı seçmek, hata çıktısını da daha anlaşılır kılar.

:::model[Test anatomisi]
Her testte önce koşulu hazırla, sonra davranışı çalıştır, en son sonucu doğrula. Bir test “saf fonksiyon = test edilebilir gereksinim” fikrini takip eder; bileşen testinde çalıştırma adımı kullanıcı etkileşimiyle görünür olur. Testi ayrıca küçük bir yanlış sürüme karşı düşün: hangi hata bu assertion’ı kırmalı?
:::

:::model[Test katmanları]
Saf fonksiyon, reducer gibi küçük davranışlar birim testinde; component ile router ve ağ sınırının birlikte çalışması entegrasyon testinde; tarayıcıdaki tam kullanıcı yolculuğu uçtan uca testte doğrulanır. Bu derste component’in DOM ve etkileşim sınırına odaklanıyoruz; gerçek HTTP servisini çalıştırmak gerekmiyor.
:::

Örnekte `disabled` ekleyen bir mutant, tıklama akışını bozmalıdır. `onAdd` hiçbir zaman çağrılmazsa son assertion kırılır. Sadece `onAdd(72)` yazan test ise mutantı yakalayamaz; çünkü düğme ve DOM yoktur. Mutant düşünmek her zaman ayrı bir mutation aracı kullanmak demek değildir. Beklentinin hangi gerçek hatayı durdurduğunu sormak test tasarımını keskinleştirir.

## Sınırları doğru adlandır

:::mistake[İç state’i doğrulamak]
Belirti → Test `isFavorite === true` kontrol ediyor, ama düğmenin adı hâlâ “İzleme listeme ekle”.  
Neden → Test, kullanıcının gördüğü işaret yerine iç değişkeni ölçüyor.  
Düzeltme → State değerinden türetilen DOM davranışını doğrula: erişilebilir ad, `aria-pressed` veya görünür durum metni.
:::

:::mistake[Her şeyi ekran testi yapmak]
Belirti → Basit tarih biçimi testi onlarca satır provider ve router kuruyor.  
Neden → Saf hesaplama için gerekmeyen React ortamı eklenmiş.  
Düzeltme → Biçimlendirme fonksiyonunu birim testinde; bu sonucu ekrana bağlayan davranışı bileşen testinde sınırla.
:::

:::mistake[Her assertion’ı class’a bağlamak]
Belirti → Görsel düzen değiştiğinde “favoriye eklendi” testi bozuluyor.  
Neden → Tasarım sınıfı, kullanıcı gereksinimiymiş gibi test edilmiş.  
Düzeltme → Metin, rol veya semantik durum gibi kullanıcıya açık bir çıktı seç. Class testi ancak class’ın kendisi ürün sözleşmesiyse uygundur.
:::

## Kullanıcı sözleşmesi nerede biter?

Bir düğmenin metni ve `aria-pressed` durumu ürün davranışının parçası olabilir; onun `className` değeri genellikle değildir. Tasarım değişince rengi lacivertten yeşile çevirmek testleri bozmamalıdır. Ama klavyeyle erişim veya seçili durumu ekranda göstermek gereksinimse bunları DOM üzerinden doğrulamak anlamlıdır.

Her testin mutlaka yalnızca DOM’a bakması gerektiğini de düşünme. Örneğin bir formun submit callback’ine doğru değer gönderdiğini görmek için `vi.fn()` kullanmak geçerlidir; fakat callback’e kullanıcı olayıyla ulaş. Test bileşenin çıktısını ve dışa verdiği davranışı aynı akışta gözlemleyebilir. Önemli olan callback’in içeride hangi satırda çalıştığı değil, kullanıcının beklenen kontrolle ona ulaşmasıdır.

RTL, “kullanıcı gibi” derken gerçek bir browser’ın bütün özelliklerini simüle ettiğini iddia etmez. jsdom DOM davranışlarının çoğunu test edilebilir kılar; gerçek layout, ekran okuyucunun seslendirmesi veya gerçek ağ performansı bu ortamın kapsamı değildir. Testin sınırı bu nedenle ürünün gözlenebilir sözleşmesini korur, tarayıcı ve assistive technology doğrulamasının tümünü üstlenmez.

Bu ayrımı yapmak testleri hem daha kararlı hem daha dürüst kılar. Bir DOM testi erişilebilir rol ve isim ilişkisinin oluşturulduğunu kanıtlar; gerçek kullanıcıların tüm cihazlarda aynı deneyimi aldığını kanıtlamaz. Geniş uyumluluk veya görsel yerleşim gerekiyorsa ayrı browser/E2E ya da manuel değerlendirme gerekebilir. Bunu her küçük component testine taşımak yerine doğru katmana bırak.

:::sector
Ekipler test adlarını çoğu zaman gereksinim cümlesi gibi yazar: “Klavye ile açılan menü seçilen öğeyi gösterir.” Bu cümle, kod gözden geçirmesinde testin hangi ürün davranışını koruduğunu anlatır. İç ayrıntılar sık değişirken, bu testler davranışın bozulduğunu haber verir.
:::

## Özet

- RTL testi DOM’a yakın bir sınırdan bileşen davranışını doğrular.
- Bir kontrolü rolü ve erişilebilir adıyla bul; iç class ya da state adına bağlanma.
- Callback’i doğrudan çalıştırmak yerine kullanıcı etkileşimiyle bileşene ulaş.
- Birim, entegrasyon ve uçtan uca sınırı gereksinime göre seç.
- Her beklentinin hangi gerçek hatayı yakaladığını düşün.

**Kendini yokla:** Düğmenin `disabled` olması kullanıcı davranışı testinde nasıl görünür?  
*Cevap:* Kullanıcı tıklaması callback’i çalıştırmaz; testin son assertion’ı kalır.

**Kendini yokla:** Basit bir `formatDuration` fonksiyonunu test etmek için neden RTL gerekmez?  
*Cevap:* Saf fonksiyon DOM veya React yaşam döngüsüne ihtiyaç duymaz; birim testi yeterlidir.
