---
title: "Kopyaladığın kodun sahibi sensin"
minutes: 13
kind: concept
---

# Kopyaladığın kodun sahibi sensin

:::pain[Problem]
Sinema'nın film menüsüne klavye ile açılma, yön tuşlarıyla gezinme, Escape ile kapanma ve kapandığında odağı tetikleyiciye geri verme özellikleri gerekiyor. Görsel bir `<div>` çizmek kolay; bu davranışları her menüde baştan yazmak hem zaman alıyor hem de küçük farklarla erişilebilirliği bozuyor.
:::

## Kaynak kodunun yeri, sorumluluğun yeri

shadcn/ui sana tek bir kapalı bileşen paketinden `Button` import ettirmez. CLI seçtiğin bileşenin kaynak kodunu uygulamana kopyalar. Sonrasında `src/components/ui` altındaki dosya senin uygulama kodundur: inceleyebilir, değiştirebilir, test edebilir ve kendi tasarım kararlarına uydurabilirsin. Bu sahiplik rahatlık kadar sorumluluk da getirir; upstream'de çıkan değişiklik dosyana kendiliğinden gelmez.

Kopyalama, alttaki her bağımlılığı kopyalamaz. Üretilen dosya `radix-ui`, `class-variance-authority` veya `lucide-react` import ediyorsa bu paketler uygulamanın normal bağımlılıklarıdır. Paket yöneticisi manifestte bu bağımlılıkları görmelidir. `shadcn` komutu ise genellikle dosya üretmek ve yapılandırmayı güncellemek için çalışır; tarayıcıda kullanılacak bir `shadcn` Button runtime paketi bekleme.

Bu ayrım bakım kararını görünür yapar:

1. **Üretilen bileşen kaynak dosyadır.** Görünüş ve public prop'lar projede düzenlenir.
2. **Import edilen paket hâlâ bağımlılıktır.** Uygulama onu `package.json` içinde bildirir ve lockfile sürümünü sabitler.
3. **CLI yapılandırması üretim tarifidir.** `components.json` CLI'a stil ailesi, CSS yolu, alias'lar ve çıktı konumlarını söyler.
4. **Kopya güncellemesi bir bakım işidir.** Yerel farkı upstream değişikliğiyle ekip karşılaştırır, test eder ve bilinçli aktarır.

![CLI yapılandırmasından uygulama kaynaklarına, oradan paket bağımlılıklarına giden ilişkiyi gösteren diyagram](diagrams/sahiplik.svg)

## Üç ayrı çözümleyici, üç ayrı sözleşme

Bir `@/components/ui/button` import'u geliştirme sunucusunda çalışsın diye tek bir ayar yetmez. TypeScript, shadcn CLI ve Vite dosya yolunu ayrı ayrı yorumlar. TypeScript'in `paths` ayarı editöre ve `tsc`'ye yol gösterir; Vite runtime sırasında kendi modül çözümlemesini yapar. CLI ise `components.json` içindeki alias haritasını kullanarak yeni kaynak dosyalarına import yazar.

Sinema'da `@/*` alias'ını kök `tsconfig.json`'a, `tsconfig.app.json`'a ve `vite.config.ts`'e tanıtmak gerekir. Vite 8'de `resolve.tsconfigPaths: true` kullanılabiliyorsa ayrıca elle alias tanımı gerekmeyebilir. `components.json` içindeki `aliases.utils` değeri ise yardımcı fonksiyonun yerini söyler. CLI varsayılanı `src/lib/utils.ts` olabilir; projede `src/shared/lib/cn.ts` zaten varsa bu yolu seçmek aynı yardımcıyı iki kez üretmez.

Her ayarın sahibi bellidir:

| Ayar | Tüketen | Eksikse görülen belirti |
| --- | --- | --- |
| `tsconfig` `paths` | TypeScript ve editör | Tip kontrolü import'u bulamaz. |
| Vite alias çözümü | Vite ve Vitest | Derleme ya da dev sunucusu import'u bulamaz. |
| `components.json` alias | shadcn CLI | Yeni dosyalar yanlış import yolu üretir. |

Tailwind v4'te tema CSS üzerinden tanımlanır. `components.json` içinde CSS değişkenli tema seçimi yapılabilir; eski `tailwind.config.js` dosyasını sırf CLI kurulumunda bekleme.

## Davranışı primitive'e, ürünü bileşene bırak

Bir menünün klavye ve focus davranışı uygulama genelinde yeniden kullanılan bir problemdir. Radix gibi headless primitive, bu etkileşimi yönetir; uygulamadaki kopyalanmış dosya ise primitive'i ürünün görünüşü ve API'siyle birleştirir. `Dialog` için başlık, açıklama, açma düğmesi ve kapatma kontrolü gibi parçalar bir araya gelir. `DropdownMenu` seçim ve menü öğesi rollerini, ok tuşu hareketini ve kapanış davranışını sağlar.

Bu katmanlar birbirinin yerine geçmez. `role="menu"` yazmak klavye modelini uygulamaz. Primitive'in yalnız görünüşünü kullanıp etkileşim sözleşmesini atlamak da yeterli değildir. Tersine, erişilebilir davranışa sahip bir primitive bile ürünün Türkçe adını, doğru bağlantısını ve gerçek favori state'ini senin yerine bilemez.

19. modüldeki **compound component** ve **asChild** modelleri burada yeniden kullanılır. Compound API, tek bir dialogun parçalarını ortak bağlamda tutar. `asChild` ise primitive'in oluşturacağı DOM öğesini çocuk bağlantıyla değiştirir; `<a>` içine `<button>` yerleştirmez. `Slot` bunu yaparken props ve class'ları çocuğa geçirir. Link semantiği link olarak kalır, klavye ile Enter davranışı da tarayıcının link davranışıdır.

Küçük bir örnekte, film bağlantısı buton görünümüne sahip olabilir. Kodun dışarıya sunduğu `variant` tipi, stil sözlüğünün anahtarlarından türetilebilir; yeni stil anahtarı eklenince ikinci bir elle yazılmış union güncelliğini kaybetmez.

```tsx
import { Slot } from 'radix-ui'
import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

const linkStyles = cva('inline-flex items-center rounded-md px-3 py-2', {
  variants: {
    tone: { accent: 'bg-primary text-primary-foreground', quiet: 'border border-input' },
  },
  defaultVariants: { tone: 'accent' },
})

type LinkTone = 'accent' | 'quiet'

function CatalogLink({
  asChild = false,
  tone = 'accent',
  className,
  children,
}: {
  asChild?: boolean
  tone?: LinkTone
  className?: string
  children: ReactNode
}) {
  const Element = asChild ? Slot.Root : 'button'
  return <Element className={cn(linkStyles({ tone }), className)}>{children}</Element>
}
```

Bu parça şematik bir örnektir: gerçek bir button ayrıca button props'larını ve ref'ini taşır; bir link de `href` alır. Önemli fikir, görsel API'nin bir bileşende, klavye davranışının ise onu kullanan primitive'de kalmasıdır. `class-variance-authority` stil seçeneklerini üretir; `cn` koşullu sınıfları birleştirip Tailwind çakışmalarını çözer.

## Kurulumu izleyelim

Sinema'da yeni bir bileşen eklerken şu sırayı izle:

| Adım | Okunan bilgi | Sonuç |
| --- | --- | --- |
| Kurulum seçimi | Projenin primitive ailesi Radix | CLI çağrısında aile açıkça seçilir. |
| Dosya tarifi | CSS yolu ve alias'lar | CLI doğru import'ları yazar. |
| Kaynak üretimi | İstenen bileşen adları | Dosyalar uygulama içinde oluşur. |
| Paket kontrolü | Üretilen dosyanın import'ları | Gerekli runtime bağımlılıkları manifestte görünür. |
| Davranış kontrolü | Yerel kaynak ve ürün kullanımı | Değişiklikler uygulamanın kendi testleriyle korunur. |

Yeni kurulumlarda CLI'ın primitive varsayılanını varsayma. Sinema Radix kullandığı için aileyi komutta açıkça seçersin: `pnpm dlx shadcn@latest init -b radix`. Sonra yalnız ihtiyaç duyulan bileşenleri eklersin. Üretilmiş dosyanın package import'larını okuyup manifestle karşılaştırmak, başka makinede eksik paket sürprizini önler.

## Önce kırık, sonra doğru beklenti

Kendi menünü yalnızca açılıp kapanan bir panel gibi kurarsan görsel olarak yeterli görünebilir:

```tsx
function BrokenPicker() {
  const [open, setOpen] = React.useState(false)
  return <div onClick={() => setOpen(!open)}>{open ? 'Ayarlar' : 'Seçenekler'}</div>
}
```

Burada klavye kullanıcısı için odaklanabilir kontrol yok; rol, ad ve Escape davranışı da yok. `onClick` eklemek bu sözleşmeyi tamamlamaz.

Primitive ile doğru sorumluluk paylaşımında:

```tsx check
import { DropdownMenu } from 'radix-ui'

export function PreferenceMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger aria-label="Görünüm seçenekleri">Görünüm</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Liste görünümü</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
```

Uygulama hâlâ öğenin metnini ve ne yapacağını seçer. Primitive ise açılma/kapanma, focus ve klavye etkileşimlerini sağlar. Gerçek ürün bileşeninin class'ları ve API'si kopyalanan kaynakta yaşar.

## Sınır durumları ve sık hatalar

:::mistake[TypeScript geçiyor, Vite bulamıyor]
Belirti → Editör import'u tamamlıyor ve `tsc -b` geçiyor; Vite `Failed to resolve import` diyor. Neden → `paths` TypeScript içindir, Vite kendi çözümlemesini kullanır. Düzeltme → `vite.config.ts`'te alias tanımla veya Vite 8'in `resolve.tsconfigPaths` seçeneğini kullan.
:::

:::mistake[Dosya var, bağımlılık yok]
Belirti → Başka makinede kurulum sonrası `class-variance-authority` bulunamadı hatası çıkıyor. Neden → Kaynak projeye kopyalanmış olsa da import edilen paket otomatik olarak kaynak kodla birlikte taşınmaz. Düzeltme → Runtime import'larını `package.json` bağımlılıkları olarak kaydet, lockfile'ı güncelle.
:::

:::mistake[Menü görünür ama kullanılamaz]
Belirti → Fareyle açılıyor, Tab ya da ok tuşlarıyla içine girilemiyor. Neden → Görsel rol veya click handler, tam klavye etkileşim modelini sağlamaz. Düzeltme → Primitive'in trigger, içerik ve item parçalarını birlikte kullan; en az bir kez klavyeyle dene.
:::

:::mistake[Barrel import'u yan etki çalıştırıyor]
Belirti → Sadece Button kullanılan sayfa tema kaydı gibi alakasız bir işi başlatıyor. Neden → Toplu export dosyası import edilen tüm modülleri değerlendirebilir. Düzeltme → Yan etkiyi açık kurulum noktasına taşı ve gerekiyorsa bileşeni doğrudan dosyasından import et.
:::

:::sector
Takım, üretilen UI dosyalarını üçüncü taraf paket kodu değil ürün kaynak kodu gibi inceler. Bileşen değişikliği API, klavye davranışı, kontrast ve testlerle birlikte gözden geçirilir. Bir upstream güncellemesi geldiğinde geliştiriciler yerel özelleştirmeleri diff üzerinden seçerek taşır; otomatik sürüm yükseltmesine güvenmez.
:::

## Özet

- CLI bileşen kaynaklarını projeye kopyalar; import edilen runtime paketleri manifestte yine yer alır.
- `components.json`, TypeScript `paths` ve Vite alias'ı farklı araçların farklı ihtiyaçlarını karşılar.
- Radix primitive etkileşim davranışını taşır; yerel kaynak dosya ürün API'sini ve görünümünü taşır.
- Compound component parçaları ve `asChild` modeli 19. modülden devam eder.
- Üretilen kodun güncelleme ve test sorumluluğu uygulama ekibindedir.

Kendini yokla: `tsc` geçerken Vite alias hatası vermesi ne anlatır? Cevap: TypeScript yolu bulmuştur ama Vite'ın çözümleyicisi aynı alias ile yapılandırılmamıştır.

Kendini yokla: Kopyalanmış Button `cva` import ediyorsa paketi nerede bildirirsin? Cevap: Uygulamanın `package.json` dosyasındaki runtime `dependencies` alanında.
