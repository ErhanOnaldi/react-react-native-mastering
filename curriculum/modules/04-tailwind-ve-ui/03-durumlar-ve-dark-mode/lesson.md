---
title: "Etkileşim durumlarını ve temayı göster"
minutes: 16
kind: concept
---

# Etkileşim durumlarını ve temayı göster

:::pain[Klavye odağı kayboldu]
Bir koleksiyon düğmesi mouse ile üzerine gelince koyulaşıyor. Klavyeyle Tab tuşuna bastığında hangi düğmede olduğunu göremiyorsun; koyu temada da açık renkli düğme kartın üzerinde parlıyor.
:::

## Görünüm, durumun kendisi değildir

Bir düğmenin hover rengi CSS'in görsel tepkisidir. Seçili olup olmadığı React state'inde veya props'ta taşınır; devre dışı olup olmadığı HTML `disabled` niteliğinde bulunur. Bu katmanları ayırmak, aynı öğenin görünüşünü klavye, mouse ve tema bağlamlarında tutarlı kılar.

:::model[Etkileşim durumunu iki kanalda göster]
1. React veya HTML, gerçek durumu taşır: `aria-pressed`, `disabled`, `checked` gibi.
2. Tailwind varyantı, duruma uygun görsel işareti ekler: `focus-visible:`, `disabled:`, `hover:`.
3. Renk veya opacity tek başına davranışı ve erişilebilir durumu bildirmez.
4. Tema varyantı mevcut renk kararını değiştirir; tema seçimini veya kalıcılığını yönetmez.
:::

![Gerçek etkileşim durumu ve görünüm varyantı ilişkisi](diagrams/durum-ve-gorunum.svg)

Bu kurallar her bileşenin aynı sözleşmeyi izlemesini sağlar. `opacity-50` görseli soldurabilir ama tıklamayı kapatmaz. Buna karşılık gerçek `disabled` niteliği form davranışını ve etkileşimi değiştirir; `disabled:opacity-50` kullanıcıya o durumu görünür kılar.

## Focus görünümünü zaman içinde izle

Bir kullanıcı butona Tab ile ulaştığında tarayıcı focus state'ini DOM üzerinde kurar. Tailwind `focus-visible:outline-2` gibi bir class'la bu durumda görünür işaret çizer. Mouse ile tıklama ve klavye gezinmesi farklı focus görünürlüğü üretebilir; `focus-visible:` klavye benzeri gezinme odağına göre tasarlanır.

| An | HTML/DOM durumu | Tailwind koşulu | Kullanıcı ne görür? |
|---|---|---|---|
| İlk render | odak yok | temel class'lar | normal düğme |
| Mouse üzerinde | hover | `hover:*` | hover rengi |
| Tab ile düğmede | klavye odağı | `focus-visible:*` | odak halkası |
| `disabled` prop'u true | `disabled` niteliği var | `disabled:*` | soluk görünüm ve kapalı etkileşim |

Önce kırık durumda yalnız mouse üzerine gelindiğinde değişen bir görünüm var:

```tsx
function IncompleteToggle() {
  return <button className="hover:bg-indigo-800 opacity-50">Koleksiyona ekle</button>
}
```

Bu butonda opacity tıklamayı kapatmaz, klavye odağı da görünmez. Düzeltilmiş örnekte HTML durumu ve uygun varyantlar birlikte bulunur:

```tsx check
type ToggleProps = { selected: boolean; disabled?: boolean }

export function CollectionToggle({ selected, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      className="rounded-lg bg-indigo-700 px-3 py-2 text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {selected ? 'Koleksiyondan çıkar' : 'Koleksiyona ekle'}
    </button>
  )
}
```

`aria-pressed` bir toggle düğmesinin seçili durumunu erişilebilirlik API'sine taşır. Görünen metni de duruma göre değiştiriyorsan, bu seçim ürün metin sözleşmesidir; bazı tasarımlar sabit metin ve yalnız `aria-pressed` kullanabilir. `aria-pressed` değerinin boolean olması önemlidir. `selected="false"` gibi string vermek doğru durum bildirimi değildir.

## Dark varyantına kadar iz sürelim

Tailwind v4'te `.dark` class'ına bağlı dark mode istiyorsan CSS tarafında özel varyant tanımlarsın:

```css title="src/theme.css"
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

Ardından `bg-white text-slate-900 dark:bg-slate-900 dark:text-white` öğeye açık ve koyu tema renklerini verir. Üst kapsayıcıya `.dark` eklendiğinde dark varyantı uygulanır. Tailwind burada tema tercihini saklamaz, sistem ayarını okumaz ve React state'i güncellemez; yalnız CSS koşulunu tanımlar.

| Katman | Örnek | Sorumluluk |
|---|---|---|
| Tema durumu | kökte `.dark` class'ı | hangi tema kurallarının seçildiği |
| CSS varyantı | `dark:bg-slate-900` | seçili temada görünen renk |
| State yönetimi | React veya sayfa kabuğu | kullanıcının tercihini belirleme/saklama |

`dark:` ile yazılan iki rengin kontrastı da düşünülmelidir. Açık temadaki metin koyu arka planda okunur kalmayabilir. Sadece kart arka planını değiştirmek, içindeki border, metin, focus ve hover renklerinin de doğru olacağı anlamına gelmez. Her bileşenin etkileşimli halleri iki temada da gözden geçirilmelidir.

## Grup durumu ve dokunma

`group` üst öğeye, `group-hover:` veya `group-focus-within:` çocuk öğeye bağlı görsel tepki verir. Örneğin kartın tümü focus alan bir link ise kart içindeki simge `group-focus-within:text-indigo-700` ile vurgulanabilir. Ancak yalnız hover ile ortaya çıkan kritik eylem, dokunmatik ekranda veya klavyede görünmeyebilir.

Odak halkasını sadece `outline-none` ile kaldırma. Görsel tasarım başka bir focus işareti sunmuyorsa kullanıcı konumunu kaybeder. Focus renginin arka planla ayrıştığını kontrol et; `outline-offset` halkanın butondan nefes almasını sağlar. Koyu temada aynı focus halkası görünmüyorsa bir `dark:focus-visible:` rengi seç.

Bir butonun `aria-label` değeri varsa görünür metinle tutarlı olsun. Favori yıldızı gibi yalnız simge içeren düğmelerde erişilebilir ad zorunludur; sadece ikonun rengi veya şekli eylemi açıklamaz. Bu derste gözle görülen tema ve focus class'larını kuruyoruz, erişilebilir bileşen sözleşmelerini sonraki modüllerde daha geniş işleyeceksin.

Önce kırık bir görünüm düşün: hover'da koyulaşıyor ama focus ve disabled halleri için hiçbir işaret yok. Klavye kullanan biri butonda olduğunu anlamaz; disabled görünmesi gereken öğe de hâlâ tıklanabilir kalır.

```tsx
function BrokenAction() {
  return <button className="hover:bg-indigo-800 opacity-50">Koleksiyona ekle</button>
}
```

Düzeltilmiş örnekte gerçek durum ve görsel tepki ayrı kurulur:

```tsx check
type ActionProps = { disabled: boolean }

export function SafeAction({ disabled }: ActionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="bg-indigo-700 text-white hover:bg-indigo-800 focus-visible:outline-2 disabled:opacity-50 dark:bg-indigo-400"
    >
      Koleksiyona ekle
    </button>
  )
}
```

Burada dark görünüm için yalnız arka plan örneklenmiştir; metin rengini de seçilen arka plana göre ayarlamalısın. Focus işareti hem açık hem koyu zeminde ayırt edilmelidir. `focus-visible:outline-2` sınıfı outline rengini varsayılan tarayıcı veya proje stiline bırakabilir; ürünün görünür focus rengi varsa `focus-visible:outline-*` ile açıkça belirt.

Hover ile focus aynı değildir. Pointer kullanan kişi hover durumunu görürken klavye kullanıcısı focus state'i görür; dokunmatik ekranın hover davranışı da tutarlı olmayabilir. Bu nedenle kritik açıklama veya eylemi yalnız `group-hover:` ile açma. Grup varyantı, zaten görünür içerikte vurgulama için daha uygundur.

Dark theme de otomatik kontrast denetimi yapmaz. Örneğin açık temada `text-white` okunabilir bir mavi zemin üzerinde olabilir; koyu temada aynı mavi açıldığında beyaz metin yeterli kontrastı korumayabilir. Tasarım token'ı seçerken foreground ve background çiftini birlikte kontrol et; dekoratif border'ın görünürlüğünü de klavye odağına karıştırma.

:::mistake[Belirti → neden → düzeltme]
Devre dışı görünen düğme tıklanabiliyor → yalnız opacity class'ı kullanılmış → gerçek `disabled` niteliğini de ver.
:::

:::mistake[Belirti → neden → düzeltme]
Tab ile gezerken odak seçilemiyor → yalnız hover stili yazılmış veya outline kaldırılmış → görünür `focus-visible:` işareti ekle.
:::

:::mistake[Belirti → neden → düzeltme]
`.dark` eklendi ama görünüm değişmiyor → CSS'te `dark` varyantı tanımlı değil veya class uygun ancestor'da değil → `@custom-variant dark` tanımını ve DOM konumunu kontrol et.
:::

:::sector
Tasarım sistemi ekipleri her interaktif bileşenin hover, focus, disabled ve seçili durumlarını açıkça belirler. Görsel regresyon incelemesinde fareyle tıklamayı yeterli sayma; klavye odağı, koyu tema kontrastı ve gerçek disabled davranışını da dene.
:::

HTML boolean attribute'larının davranışı CSS class'tan bağımsızdır. JSX'te `disabled={false}` niteliği kaldırır; `disabled:opacity-50` class'ı DOM'da bulunsa bile butonun kullanılabilirliğini etkilemez. Benzer biçimde `aria-pressed` toggle state'ini bildirir, React state'ini otomatik değiştirmez. Tıklamadaki state güncellemesini üst bileşen veya kontrollü API yapar.

Hover ile focus birlikte olduğunda hangi rengin kazanacağı class string'inin görsel sırası ile değil CSS varyant kuralları ve cascade ile belirlenir. Aynı property için `hover:bg-*` ve `focus-visible:bg-*` yazıyorsan her iki durumu da gözlemle. Eğer iki durumda aynı görsel sonuç doğruysa class'ları sade tut; her varyantı yalnız ihtiyaç varsa tanımla.

Sistem tercihi `prefers-color-scheme` ile algılanabilir, fakat bu ders `.dark` class'ına bağlı tema örüntüsünü kullanır. `.dark` eklenmesi sistem tercihiyle senkronize olmak, kullanıcı seçimini saklamak ve ilk render'da tema parlamasını önlemek gibi ürün kararlarını çözmez. CSS varyantı seçilmiş bağlamın görsel kurallarını uygular; state ve başlangıç stratejisi ayrıdır.

## Özet

- HTML/React durumu davranışı taşır; Tailwind class'ı bunu görünür kılar.
- `disabled` niteliği tıklamayı kapatır, `disabled:opacity-50` görünümü değiştirir.
- Klavye odağı için görünür `focus-visible:` kuralı gerekir.
- Dark varyantı renk seçer; tema tercihini yönetmez.
- Önemli durumları yalnız renkle anlatma.

**Kendini yokla:** `dark:` class'ı tema tercihini localStorage'a yazar mı? Hayır, sadece CSS varyantıdır.

**Kendini yokla:** Opacity düşükse buton disabled sayılır mı? Hayır; HTML niteliği ve davranışı ayrıca kurulmalıdır.
