---
title: "Tema token'larıyla ortak karar"
minutes: 16
kind: concept
---

# Tema token'larıyla ortak karar

:::pain[Ürün rengi nerede tanımlı?]
Uygulamada üç başlıkta üç yakın mavi tonu var. Yeni marka rengi gelince her sayfayı elle arıyorsun; koyu temada iki başlığın tonu değişiyor, üçüncüsü unutuluyor.
:::

## Rengi değer değil, görev olarak adlandır

Bir hex renk değeri nasıl göründüğünü söyler, neden seçildiğini değil. `brand`, `surface`, `danger` veya `muted` gibi token adı renk kararının görevini anlatır. Bir token birkaç bileşende aynı ürünü temsil ediyorsa değer değişikliği tek noktadan yapılabilir.

Tailwind v4 `@theme` içindeki değişkenleri tanır ve uygun namespace'lerden utility class üretir. Bir CSS değişkeni ise runtime'da değer saklar; tek başına Tailwind utility üretmez. Bu iki katmanın bağlantısı `@theme` tanımından geçer.

:::model[Token'dan utility'ye üç adım]
1. Tasarım kararı anlamlı bir isim alır: örneğin marka metin rengi.
2. CSS'te uygun `@theme` namespace'i altında değişken tanımlanır: `--color-brand-700`.
3. Tailwind bu adı kullanım class'ına bağlar: `text-brand-700` veya `bg-brand-700`.
4. Tema başına farklı değer gerekiyorsa CSS değişkeni o tema kapsamındaki değerle güncellenir; JSX class adı sabit kalabilir.
:::

![Tasarım token'ı, CSS değişkeni ve utility zinciri](diagrams/token-zinciri.svg)

Bu zincir değeri, anlamı ve kullanımı birbirinden ayırır. Bir başlık rengini değiştirmek için JSX'teki her `text-brand-700` kullanımını bulmazsın; CSS token değerini değiştirirsin. Ancak `text-brand-700` yanlış rolde, örneğin tehlike mesajında kullanılıyorsa token adını değiştirmek sorunu çözmez. Önce kullanım semantiğini doğru seç.

## Utility namespace'i nasıl çalışır?

Tailwind `--color-*` namespace'inden renk utility'leri, `--font-*` namespace'inden font family class'ları üretir. Örneğin:

```css title="src/styles.css"
@import "tailwindcss";

@theme {
  --color-accent-600: oklch(0.5 0.14 250);
  --color-accent-300: oklch(0.82 0.08 245);
  --font-heading: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

Kullanım tarafında `bg-accent-600`, `text-accent-300`, `font-heading` class'ları seçilebilir. Buradaki `--color-*` özel isim alanı Tailwind'in değerleri algılamasını sağlar. `--brand-blue` gibi sıradan bir CSS variable de kullanılabilir, ancak otomatik `bg-brand-blue` class'ı oluşmaz.

```tsx check
export function ExhibitTitle({ children }: { children: string }) {
  return <h2 className="font-heading text-accent-600">{children}</h2>
}
```

Kod bloğundaki class adları yalnızca CSS'te token tanımlandığında beklenen karşılığı alır. Token tanımının bulunmaması TypeScript hatası vermez; görünüm eksikliği tarayıcı CSS'inde ortaya çıkar. Bu, tip kontrolü ile stil üretiminin farklı araçlarda incelendiği bir sınırdır.

## Bir token'ı bir render boyunca izle

`ExhibitTitle` render edildiğinde React `className` değerini DOM'a yazar. Tailwind build çıktısında `text-accent-600` için CSS kuralı bulunur. Tarayıcı kural içindeki CSS değişkeni değerini çözer ve metin rengini çizer:

| Zaman | Katman | Olan |
|---|---|---|
| Build | Tailwind | kaynak class'ı algılar, utility kuralını üretir |
| Render | React | sabit utility adını `<h2>` üzerine yazar |
| Style hesaplama | CSS | token değişkenini gerçek renk değerine çözer |
| Paint | Tarayıcı | yazıyı çözülmüş renkle gösterir |
| Tema değişimi | CSS cascade | aktif kapsamda değişken değeri yenilenir |

Bu yüzden token değeri runtime'da değişse bile JSX class'ı değişmek zorunda değildir. React state ile tema seçimini saklayabilirsin, fakat o state yalnız `.dark` class'ını değiştirse de CSS değişkeni doğru kapsamda yeniden tanımlanmış olmalıdır.

```css title="src/styles.css"
@import "tailwindcss";

@theme {
  --color-accent: oklch(0.5 0.14 250);
}

.dark {
  --color-accent: oklch(0.82 0.08 245);
}
```

Bu örnekte `text-accent` iki tema için aynı utility adını kullanır; `.dark` kapsamı yalnız değişken değerini değiştirir. Başka bir tasarımda `dark:text-accent-300` gibi ayrı tonlar seçmek daha açık olabilir. İki yaklaşımı karıştırmadan, ekibin token stratejisine göre seç.

## Token, utility ve bileşen nerede ayrılır?

Token, renk veya font gibi değerleri adlandırır. Utility bir ya da birkaç CSS bildirimini kısa adla çağırır. Bileşen ise HTML yapısını, props sözleşmesini ve tekrarlanan görsel kararı paylaşır. Örneğin `Button` için `--color-action` token olabilir; `bg-action` utility olur; `<Button variant="primary">` semantik bileşen API'si olur.

Her `p-4` için özel token üretmek gereksiz olabilir; spacing scale zaten tutarlılık sağlar. Her kartın kendine özgü tek seferlik rengini token yapmak da sözlüğü şişirir. Token şu iki şartta güçlüdür: karar birden fazla kullanımda ortak ve tasarım ekibi onu adla konuşabiliyor.

Önce kırık bir tema yaklaşımına bak: aynı marka rengi üç farklı yerde literal değer olarak tanımlanmışsa bir değişiklikte tek bir yeri güncellemeyi unutmak kolaydır.

```css
.page-title { color: #075985; }
.action-link { color: #075985; }
.rating { color: #075985; }
```

Bu değerlerin hepsi marka rengi rolündeyse `@theme` içinde tek bir token'a geçmek tutarlılık sağlar. Ancak benzer görünen değerler farklı rollere sahipse — biri metin, diğeri dekoratif yüzey — körlemesine aynı token'ı kullanmak tasarım sistemini yanlış sadeleştirir. Tasarım niyetini teyit et.

Token değişikliğinin etkisi derleme ve runtime katmanlarına yayılır. Tailwind class adı kaynakta bulunduğundan CSS kuralı build'de üretilir. Uygulamanın CSS variable değeri daha sonra `.dark` veya başka selector altında değiştirilebilir. Token adını `--color-accent`ten alakasız `--font-accent`e çevirirsen kullanım class'ı da değişir; sınıf adı ile namespace arasındaki bağın parçası build-time'dır.

CSS variable scope'u da önemlidir. `:root`'ta tanımlanan değişken bütün belgeye ulaşabilir; `.dark` altında tekrar tanımlanan aynı değişken yalnız o kapsamdaki element ve çocukları için geçerlidir. Nested temalarda daha yakın selector kazanabilir. Tema köküne `.dark` eklemek butona özel state değildir; dokümanın görsel bağlamını değiştirir.

Bir token için erişilebilir renk çiftleri seçmek gerekir. Sadece `brand-700` değerini düşünmek yerine üzerinde gösterilecek metin rengi, focus halkası ve hover rengiyle birlikte bir palette kur. Tailwind token'ı kullanmak tek başına kontrastı garanti etmez; renk çifti tarayıcı ve tasarım incelemesiyle değerlendirilir.

V4'te özel utility tanımlamak için CSS `@utility` kullanılır. Bu, tekrar eden bir kuralı isimlendirir; token değerinin yerine geçmez. Örneğin `poster-crop` hem `aspect-ratio` hem `object-fit` kararını kapsayabilir. Sadece bir yerde kullanılan iki bildirim için yeni utility açmak, bakımı kolaylaştırmaktan çok gizli sözlük oluşturabilir.

`@theme` içindeki bir font token'ı da font dosyasını indirmez. `--font-heading` font family utility'sini tanımlar; gerçek web fontu için kaynak, `@font-face`, fallback ailesi ve yükleme biçimi ayrıca gerekir. Tasarım token'ı görünümü düzenler, eksik asset'i oluşturmaz.

Marka rengi değiştiğinde bazı bileşenlerin istisna bırakması gerekebilir. Logo özel marka tonunu korurken butonun kontrastı için daha koyu tonu seçebilirsin. Tek token'ı zorla bütün kullanımlara uygulamak yerine ayrı rol token'ı (`brand`, `action`, `on-action`) tanımlamak bu farkı anlaşılır kılar. Adlar CSS rengi yerine rolü ifade etsin.

`@theme` token'ı utility ad alanına bağlanırken CSS custom property scope'u da önemlidir. `:root`'ta tanımlanan değer belge genelinde kullanılabilir; `.dark` altında yeniden tanımlanan değer o kapsam içindeki öğeleri etkiler. Nested temalarda daha yakın selector devreye girer. JSX class'ı aynı kalabilir, ama CSS değişkeninin tanımlandığı kapsam doğru olmalıdır.

:::mistake[Belirti → neden → düzeltme]
`bg-brand-700` arka planı üretmiyor → `--brand-700` sıradan değişkeni kullanılmış → Tailwind'in tanıdığı `--color-brand-700` namespace'ini tanımla.
:::

:::mistake[Belirti → neden → düzeltme]
Koyu temada bir kullanım eski rengi gösteriyor → bileşenlerden biri token yerine sabit renk class'ı taşıyor → ortak rol token'ını kullan ve açık/koyu değerleri aynı kaynaktan yönet.
:::

:::mistake[Belirti → neden → düzeltme]
Tema dosyası çok sayıda tek kullanımlı token içeriyor → her görsel ayrıntı tokenlaştırılmış → yalnız ekipçe paylaşılan, tasarım anlamı olan kararları isimlendir.
:::

:::sector
Ürün ekipleri token adlarını tasarım diliyle eşleştirir: marka, yüzey, vurgu, tehlike gibi roller görsel spesifikasyonda da kodda da aynı anlama gelir. Bir rengin değişmesi çok sayıda JSX dosyası düzenletiyorsa ortak değer katmanında eksik vardır.
:::

## Özet

- Token değeri değil, tekrar kullanılan tasarım kararının anlamını adlandırır.
- `@theme` namespace'i utility adlarını Tailwind'e bağlar.
- React class'ı yazar, tarayıcı CSS değişkenini çözer ve görünümü boyar.
- Açık/koyu tema değerini token katmanında ya da açık dark utility'leriyle yönet; stratejiyi tutarlı tut.
- Tek kullanım veya her spacing için token oluşturmak gereksiz sözlük üretir.

**Kendini yokla:** `--brand-blue` otomatik olarak `bg-brand-blue` üretir mi? Hayır, Tailwind namespace'i olan `--color-*` gerekir.

**Kendini yokla:** Tema token'ı HTML davranışını değiştirir mi? Hayır; token CSS değerini etkiler.
