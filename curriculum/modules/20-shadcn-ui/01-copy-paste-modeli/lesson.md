---
title: "Kopyaladığın kodun sahibi sensin"
minutes: 14
kind: concept
---

# Kopyaladığın kodun sahibi sensin

Sinema'da aynı görünüme sahip birden fazla düğme var: filme git, favoriye ekle, listeyi aç. Bir düğmenin rengini değiştirmek için her ekrandaki kodu aramak yerine görünümü ortak bir bileşende tutmak işini kolaylaştırır. shadcn/ui bu bileşeni kapalı bir paketin içinden sunmaz; seçtiğin kaynak dosyasını projenin içine kopyalar.

## Önce küçük bir bileşen, sonra sahipliği

Kendi yazdığın bir bileşen zaten sana tanıdık:

```tsx check
function FilmEtiketi({ title }: { title: string }) {
  return <span className="rounded bg-muted px-2 py-1">{title}</span>
}
```

`FilmEtiketi` projenin kaynak kodudur. Dosyayı değiştirince uygulamanın kullandığı kod da değişir. shadcn/ui ile eklenen Button veya Card için de durum aynıdır: CLI kaynak dosyasını üretir, sonra o dosya senin uygulama kodun olarak yaşar.

Burada **upstream**, bileşenin geldiği asıl proje ve onun daha yeni sürümleri demektir. Yerel kopyada yaptığın değişiklik upstream'den kendiliğinden gelmez. Yeni bir sürüm yayımlandığında kendi dosyanı inceleyip hangi değişikliği alacağına sen karar verirsin; bunun nedeni dosyanın artık projenin parçası olmasıdır.

### Bir bileşeni eklerken ne kopyalanır?

Bir Button dosyasının `class-variance-authority` paketini kullandığını düşün:

```tsx check
import { cva } from 'class-variance-authority'

const buttonStyles = cva('inline-flex rounded px-3 py-2', {
  variants: {
    tone: { primary: 'bg-primary text-primary-foreground', quiet: 'border' },
  },
})
```

Dosya projene kopyalanır; `class-variance-authority` paketi kopyalanmaz. Paketlerin ve sürümlerinin listelendiği `package.json` dosyasına **manifest** denir. Uygulama çalışırken import edilen paket manifestin `dependencies` alanında bulunmalıdır. Bu ayrım, kod başka bir bilgisayara taşındığında paketin de kurulmasını sağlar.

**Headless primitive**, görünüşü belirlemeden etkileşim davranışını sağlayan bir bileşendir. Örneğin Radix'in menü primitive'i açılma, klavye ile gezinme ve kapanma gibi işleri üstlenebilir; kopyalanan kaynak ise Sinema'nın renklerini, metnini ve ürün API'sini belirler. Böylece davranışı yeniden yazmazsın ama ürüne özgü kararları korursun.

### Aynı aileyi seçmek neden önemli?

Sinema'nın mevcut Dialog'u Radix kullanıyorsa yeni menüyü de Radix ailesinden üretmek, iki bileşenin benzer etkileşim ve props sözleşmelerini kullanmasını sağlar. Base UI ve Radix benzer sorunları çözse de bileşen adları ve props'ları birebir aynı değildir. Yalnızca import adını değiştirerek bir aileyi diğerine çeviremezsin.

Yeni CLI kurulumunda bu seçimi açıkça belirtebilirsin: `pnpm dlx shadcn@latest init -b radix`. Böylece CLI yeni kaynakları Sinema'nın kullandığı primitive ailesine göre üretir; sonrasında yalnızca ihtiyaç duyduğun bileşenleri eklersin.

Bir primitive'in sağladığı davranış, yalnızca `role="menu"` yazmaktan fazlasıdır. Menüde Tab, ok tuşları ve Escape için tutarlı bir etkileşim beklenir. Tekerleği tekrar icat etmek yerine primitive'in bu davranışını kullanırsın; yine de menü metnini, bağlantısını ve filmle ilgili eylemi uygulama seçer.

Kendi menünü yalnız açılıp kapanan bir `div` olarak kurarsan fareyle çalışıyor gibi görünür:

```tsx
function BrokenPicker() {
  const [open, setOpen] = React.useState(false)
  return <div onClick={() => setOpen(!open)}>{open ? 'Türler' : 'Tür seç'}</div>
}
```

Bu örnekte klavyeyle focus alınabilecek bir kontrol, menü rolü veya Escape ile kapanma davranışı yok. Click handler yalnızca fare tıklamasına tepki verir; görsel olarak açılır panelin tamamını etkileşimli yapmaz.

Radix primitive'ini kullanınca temel etkileşim parçaları açıkça görünür:

```tsx
function GenreMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Türler</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Aksiyon</DropdownMenu.Item>
          <DropdownMenu.Item>Bilim kurgu</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
```

Burada uygulama menü metnini ve seçimleri verir; primitive açılma, kapanma ve klavye etkileşimini yönetir. Portala taşınsa da menü aynı primitive ağacının parçasıdır. Doğru primitive'i seçmek bakım işini azaltır, ama film türü seçilince hangi filtre uygulanacağını hâlâ sen yazarsın.

Bir bileşenin varyantlarını `filmTones` adlı nesnede tuttuğunu düşün. TypeScript'te `typeof filmTones` nesnenin tipini verir; `keyof typeof filmTones` ise anahtar adlarını (`featured`, `quiet`, `alert`) bir tip olarak çıkarır. Böylece yeni görünüm nesneye eklenince props tipi de o anahtarı kabul eder; görünüm listesiyle elle yazılmış bir union birbirinden kopmaz.

:::model[Primitive ve ürün bileşeni]
Primitive etkileşim kurallarını yönetir; kopyalanan UI bileşeni görünüşü ve Sinema'ya ait API'yi verir. Biri diğerinin yerine geçmez: primitive film bağlantısını bilemez, uygulama da klavye davranışını eksiksiz biçimde sıfırdan yazmak zorunda kalmaz.
:::

## Bir import yolunu üç araç okur

Şimdi `@/components/ui/button` gibi kısa bir yol düşün. Bu **alias**, uzun bir dosya yoluna verilen takma addır. TypeScript, Vite ve shadcn CLI bu yolu farklı zamanlarda ve farklı amaçlarla çözer.

| Ayar | Kim okur? | Eksik olduğunda ne görürsün? |
| --- | --- | --- |
| `tsconfig` içindeki `paths` | TypeScript ve editör | Tip kontrolü import'u bulamaz. |
| Vite alias çözümü | Vite ve Vitest | Dev sunucusu veya derleme import'u bulamaz. |
| `components.json` içindeki alias | shadcn CLI | Yeni dosyanın import'u yanlış yere yazılır. |

Örneğin `tsc -b` geçiyor, editör de import'u buluyor ama `pnpm dev` sırasında Vite `Failed to resolve import` diyor. Bu belirti TypeScript ayarının tek başına yetmediğini gösterir: Vite'ın da `@` yolunu çözebilmesi gerekir. Vite 8'de `resolve.tsconfigPaths: true` kullanılabilir; diğer kurulumlarda Vite alias'ını ayrıca tanımlarsın.

`components.json` ise CLI'ın tarifidir: CSS dosyasının, yardımcıların ve bileşenlerin nereye yazılacağını belirtir. Örneğin projede `cn` yardımcısı `src/shared/lib/cn.ts` içindeyse, CLI'a bunu söylemek aynı işi yapan ikinci bir yardımcı dosyasının oluşmasını önler. Tailwind v4 CSS üzerinden yapılandırıldığı için sırf shadcn kurulumu adına eski bir `tailwind.config.js` beklemen gerekmez.

![shadcn CLI yapılandırması uygulama kaynak dosyalarına ve onların runtime paketlerine bağlanır](diagrams/sahiplik.svg)

## Toplu export'u kullanırken yan etkiye dikkat et

Bir dosyadan birden çok bileşeni dışarı açan dosyaya **barrel** denir. Örneğin `components/ui/index.ts`, Button ve Card'ı tekrar dışarı aktarabilir. Böylece çağıran kod kısa görünür:

```tsx
import { Button } from '@/components/ui'
```

Şimdi aynı barrel'ın dışarı aktardığı bir dosyanın import sırasında tema kaydı yaptığını düşün. Named import ile yalnız Button'ı istemen, modül değerlendirilirken o yan etkinin hiç çalışmayacağını garanti etmez. Yan etki, bir dosyanın sadece yüklenmesiyle ekranda render etmeden yaptığı iştir. Kaydı açık bir uygulama başlangıç noktasına taşımak ve gerekirse Button'ı kendi dosyasından import etmek, bu işi görünür kılar.

İzleyebileceğin sıra basit: önce CLI'ın yazdığı dosyayı aç, import'larını oku, sonra bu paketlerin manifestte bulunduğunu kontrol et. Ardından import yollarının TypeScript ve Vite tarafından çözüldüğünü ayrı ayrı doğrula. Son olarak bileşeni klavye ile kullan; ekranda görünmesi tek başına etkileşimin doğru olduğunu kanıtlamaz.

## Birkaç gerçek tuzak

:::mistake[Editör buluyor, uygulama bulamıyor]
Belirti → Editör import'u tamamlıyor, `tsc` geçiyor ama Vite hata veriyor. Neden → `paths` TypeScript'e yol gösterir; Vite'ın kendi çözümlemesi de ayarlanmalıdır. Düzeltme → Vite alias'ını tanımla veya uygun Vite 8 ayarını kullan.
:::

:::mistake[Dosya kopyalandı ama paket bulunamadı]
Belirti → Uygulama başka makinede kurulunca `class-variance-authority` eksik diyor. Neden → CLI kaynak dosyasını kopyalamıştır, npm paketini projeye gömmemiştir. Düzeltme → Runtime import'unu manifestin `dependencies` alanında bildir.
:::

:::mistake[Menü fareyle çalışıyor, klavyeyle çalışmıyor]
Belirti → Tıklayınca menü açılıyor ama Tab veya ok tuşlarıyla içine girilemiyor. Neden → Bir click handler veya `role` tam etkileşim davranışını sağlamaz. Düzeltme → Primitive'in trigger, içerik ve öğe parçalarını kullan; klavyeyle açıp kapatmayı da dene.
:::

:::info[Derinlemesine (isteğe bağlı)]
Compound component, aynı arayüzün `Dialog.Root`, `Dialog.Trigger` ve `Dialog.Content` gibi parçalarını ortak bir bileşen ailesinde sunar. `asChild` ise primitive'in varsayılan DOM öğesini çocuk öğeyle değiştirmeye yarar; Radix `Slot` props ve class'ları tek çocuğa aktarır. Böylece gerçek bir `<a>` link olarak kalır, içine ikinci bir `<button>` yerleşmez. `cva` varyant sınıflarını seçer; `cn` gibi bir yardımcı koşullu class'ları birleştirip Tailwind çakışmalarını çözer. Bu ayrıntılar yararlı ama her kopyalanan bileşenin iç yapısını burada ezberlemek gerekmiyor.
:::

## Özet

- shadcn/ui bileşen kaynağını projeye kopyalar; dosyanın bakımını artık proje yapar.
- Kaynak dosya ile import edilen paket ayrıdır; runtime paketleri manifestte bildirilir.
- Headless primitive etkileşim davranışını, yerel bileşen görünüş ve ürün kararlarını taşır.
- TypeScript, Vite ve CLI alias ayarlarını kendi amaçları için okur; birinin çalışması diğerini yapılandırmaz.
- Barrel import'ları modülleri yükleyebilir; import sırasındaki yan etkileri görünür bir başlangıç noktasına taşı.

**Yeni terimler**

- **Upstream:** Yerel kopyanın geldiği asıl proje ve onun yayımladığı değişiklikler.
- **Manifest:** Projenin paket ve sürüm listesini taşıyan `package.json` dosyası.
- **Headless primitive:** Görünüşten bağımsız etkileşim davranışı sağlayan bileşen.
- **Alias:** Uzun bir kaynak yolunun yerine kullanılan kısa yol.
- **Barrel:** Birden fazla modülün export'unu tek dosyada toplayan dosya.
- **Yan etki:** Bir modül yüklenirken, render'dan bağımsız olarak yaptığı işlem.

Kendini yokla: TypeScript import'u bulduğu halde Vite neden bulamayabilir? Cevap: TypeScript ve Vite ayrı çözümleyiciler kullanır; Vite alias'ı ayrıca ayarlanmalıdır.

Kendini yokla: Bir UI dosyasını kopyalamak onun import ettiği paketi de kopyalar mı? Cevap: Hayır. Paket manifestte bağımlılık olarak bildirilir ve paket yöneticisi tarafından kurulur.
