---
title: "Bir Vite projesinin anatomisi"
minutes: 15
kind: concept
---

# Bir Vite projesinin anatomisi

:::pain[Problem]
`pnpm dev` çalıştırdın ve tarayıcıda zengin bir web sayfası açıldı. Proje klasöründeki `index.html` dosyasını açıp baktığında ise şaşkına dönüyorsun: İçinde sadece **boş bir `<div id="root"></div>`** var. Ekrandaki butonlar, başlıklar ve kartlar nereden geliyor? Bir dosyadaki rengi değiştirdiğinde sayfa hiç yenilenmeden saniyenin onda birinde ekran nasıl güncelleniyor?
:::

## İstekten ekrana: 4 duraklı yolculuk

Geleneksel geliştirme araçlarında (örneğin Webpack veya Create React App) kodunda tek bir satırı değiştirdiğinde bile aracın tüm projeyi baştan paketlemesini ve tarayıcının sayfayı beyaz bir ekranla baştan yüklemesini beklerdin. Sayfadaki form verilerin silinir, açtığın modal kapanır ve zaman kaybederdin.

**Vite**, bu süreci kökten değiştiren yeni nesil bir web geliştirme sunucusudur. Vite'ın kalbindeki temel prensip **istek anında dönüştürme** (on-demand compilation) ve **Hot Module Replacement (HMR)** teknolojisidir.

Bir Vite projesinde tarayıcının adres satırına `http://localhost:5173` yazdığın andan itibaren gerçekleşen olaylar iki aşamada işler:

![Vite istek dönüşümü ve HMR döngüsü](diagrams/vite-ve-hmr.svg "Tarayıcı isteği, Vite on-demand dönüşümü ve HMR Fast Refresh döngüsü")

Bu süreci şu kesin kurallarla zihninde canlandır:

1. **`index.html` projenin kök giriş kapısıdır:** Vite'ta HTML dosyası gizli bir şablon klasöründe değil, doğrudan projenin en tepesindedir. İçinde tek bir kritik script etiketi yer alır: `<script type="module" src="/src/main.tsx"></script>`.
2. **Vite dosyaları paketlemez, anında dönüştürür:** Tarayıcılar `.tsx` uzantılı dosyaları veya JSX söz dizimini doğrudan çalıştıramaz. Tarayıcı `main.tsx` dosyasını talep ettiği anda Vite araya girer; Rust tabanlı Oxc/Rolldown motoruyla milisaniyeler içinde TypeScript tiplerini ve JSX'i saf modern JavaScript'e çevirip tarayıcıya sunar.
3. **`main.tsx` React'i tarayıcı DOM'una bağlar:** `createRoot(document.getElementById('root')!)` fonksiyonu, HTML'deki o boş `div`'i React'in sanal yönetim merkezine çevirir ve kök bileşeni (`<App />`) bu alanın içine çizer.
4. **HMR ve Fast Refresh state'i korur:** Editörde bir bileşeni kaydedip değiştirdiğinde, Vite açık olan WebSocket kanalı üzerinden tarayıcıya sadece o modülün değiştiğini fısıldar. React Fast Refresh mekanizması sayesinde sayfa yeniden yüklenmez; kullanıcının girdiği state (örneğin sayaç veya arama kutusundaki yazı) korunarak sadece o bileşenin DOM düğümleri güncellenir.
5. **Geliştirme sunucusu ile Canlı Paket (Build) farklıdır:** `pnpm dev` geliştirme hızına odaklanırken, `pnpm build` tüm projeyi sıkıştırılmış, optimize edilmiş ve hash'lenmiş birkaç statik dosyaya dönüştürerek `dist/` klasörüne yazar.

## İstekten boyamaya adım adım iz sürme

Tarayıcıda Enter'a bastığın andan ekranda ilk bileşenin belirdiği ana kadar geçen süreci şu zaman tablosuyla izleyelim:

| Zaman | Aktör | Olay / İstek | Gerçekleşen İşlem |
| --- | --- | --- | --- |
| 0 ms | Tarayıcı | `GET /` | Sunucudan kök HTML talep edilir. |
| 2 ms | Vite | `200 OK (index.html)` | İçinde `<div id="root">` ve script referansı olan HTML teslim edilir. |
| 5 ms | Tarayıcı | `GET /src/main.tsx` | Tarayıcı modül script'ini görünce dosyayı sunucudan ister. |
| 7 ms | Vite | On-demand dönüşüm | `main.tsx` okunur, JSX/TSX temizlenir, saf ES modülü olarak cevap verilir. |
| 12 ms | Tarayıcı | `import App from './App'` | `main.tsx` yürütülürken `App.tsx` için yeni bir GET isteği tetiklenir. |
| 15 ms | React | `createRoot(...).render()` | React devreye girer, sanal ağacı kurar ve gerçek DOM'a ilk boyamayı yapar. |

Gördüğün gibi Vite önceden dakikalarca süren bir "bundle" işlemi yapmaz. Tarayıcı hangi dosyaya ihtiyaç duyarsa, Vite yalnızca o dosyayı dönüştürüp servis eder. Bu yüzden projen 10 bileşenden de oluşsa 10.000 bileşenden de oluşsa geliştirme sunucusu hep aynı hızda açılır.

## vite.config.ts dosyasının rolü

Vite'ın davranışını yapılandırdığımız merkez üssü projenin kökündeki `vite.config.ts` dosyasıdır:

```ts title="vite.config.ts"
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),          // JSX dönüşümü ve Fast Refresh desteği sağlar
    tailwindcss(),    // CSS yardımcı sınıflarını anında derler
  ],
  server: {
    port: 5174,       // Geliştirme sunucusunun dinleyeceği port
  },
})
```

Bu dosya tarayıcıya asla gitmez; Node.js ortamında çalışır ve Vite'ın derleme davranışını, eklentilerini (plugins), port ayarlarını ve ileride göreceğimiz yol takma adlarını (path alias) organize eder.

## Kırık örnek

Aşağıdaki bileşende, Vite'ın HMR (Fast Refresh) özelliğini bozan ve her kaydetmede sayfanın baştan yüklenmesine (full reload) yol açan tipik bir hata yer almaktadır:

```tsx
// Kırık: Bileşen dosyası içinde adsız default export ve dosya dışı yan etki
export default function (props: { message: string }) {
  return <div className="alert">{props.message}</div>
}

// TEHLİKE: Modül seviyesinde kontrolsüz global dinleyici
window.addEventListener('resize', () => {
  console.log('Ekran boyutu değişti')
})
```

React Fast Refresh'in bir dosyanın state'ini koruyarak sadece görselini güncelleyebilmesi için katı bir kuralı vardır: **Dosya yalnızca adlandırılmış React bileşenleri export etmelidir.** İsimsiz fonksiyonlar (`export default function()`) veya dosya seviyesinde global değişkenlere/dinleyicilere bağlanan yan etkiler tespit edildiğinde Vite güvenli tarafta kalmak için HMR'ı devre dışı bırakır ve sayfayı tüm state'i sıfırlayarak baştan yükler.

## Doğru örnek

HMR kurallarına tam uyumlu, temiz ve tipli bir duyuru kartı bileşeni:

```tsx check
interface NotificationBannerProps {
  message: string
  level: 'info' | 'warning'
}

export function NotificationBanner({ message, level }: NotificationBannerProps) {
  const isWarning = level === 'warning'

  return (
    <aside
      className={`p-4 rounded-lg border ${
        isWarning
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}
    >
      <span className="font-semibold mr-2">{isWarning ? 'Dikkat:' : 'Bilgi:'}</span>
      <span>{message}</span>
    </aside>
  )
}
```

Bu bileşeni düzenleyip kaydettiğinde, tarayıcıda açık olan sayfa yenilenmez; sadece bu kutunun arka plan rengi veya metni göz açıp kapayıncaya kadar yeni haline bürünür.

## Statik dosyalar: public/ ve src/ farkı

Projende resim, font veya logo gibi statik dosyaları kullanırken iki seçeneğin vardır:

1. **`public/` klasörü:** Bu klasördeki dosyalar (örneğin `public/favicon.svg`) Vite tarafından hiçbir işleme tabi tutulmaz. Olduğu gibi kopyalanır ve doğrudan kök yoldan (`/favicon.svg`) sunulur. Robot txt veya sitemap gibi adresi sabit kalması gereken dosyalar buraya konur.
2. **`src/` içine import edilen görseller:** `import logo from './assets/logo.png'` şeklinde kullandığın dosyalar Vite'ın varlık hattından geçer. Vite bu dosyanın adına benzersiz bir hash ekler (örneğin `logo-d41d8c.png`). Böylece tarayıcılar görseli sonsuza kadar güvenle önbelleğe alabilir; görseli değiştirdiğinde hash değişeceği için kullanıcılar hiçbir zaman bayat dosya görmez.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: HTML içindeki script etiketine type="module" eklemeyi unutmak]
Belirti → Sayfa açılıyor ama bomboş kalıyor; konsolda "Cannot use import statement outside a module" hatası beliriyor.  
Neden → Tarayıcılar standart script etiketlerinde modern `import/export` komutlarını reddeder.  
Düzeltme → `index.html` dosyasındaki script etiketinde mutlaka `type="module"` özniteliği yer almalıdır.
:::

:::mistake[Sık hata: pnpm dev açıkken pnpm build çıktısını görmeye çalışmak]
Belirti → `pnpm build` çalıştırıldı ancak tarayıcıdaki `localhost:5174` adresinde yapılan son optimizasyonlar veya asset yolları görünmüyor.  
Neden → `pnpm dev` dinamik geliştirme sunucusudur; `pnpm build` ise `dist/` klasörüne statik paket üretir.  
Düzeltme → Üretilen paketi canlı ortam simülasyonunda görmek için `pnpm preview` komutunu çalıştırmalısın.
:::

:::sector
Eski nesil bundler'lar (Webpack gibi) yüzlerce dosyalık büyük projelerde geliştirme sunucusunun açılması için 40-50 saniye bekletirdi. Sektörün Vite'a geçişinin en büyük sebebi bu "bekleme süresini" sıfıra indirmesidir. Günümüzde Shopify, OpenAI ve büyük fintech şirketleri dahili araçlarında ve müşteri arayüzlerinde Vite ekosistemini standart kabul etmektedir.
:::

## Özet

- `index.html` projenin giriş kapısıdır; `<div id="root">` React tarafından doldurulur.
- Vite, dosyaları önceden paketlemek yerine tarayıcı istedikçe anında dönüştürür (on-demand).
- `main.tsx` dosyası `createRoot` ile React bileşen ağacını HTML'e bağlar.
- Hot Module Replacement (HMR) ve React Fast Refresh, sayfa yenilenmeden bileşen state'ini koruyarak anlık güncelleme sağlar.
- `pnpm dev` geliştirme sunucusunu, `pnpm build` canlı paketini, `pnpm preview` ise canlı paketin yerel provasını sunar.

**Kendini yokla:** Tarayıcıda bir sayaç açık ve değeri `7`. Butonun arka plan rengini değiştirip kaydettiğinde sayfa yenilenirse (sayacın `0`'a dönerse) sorun ne olabilir?  
*Cevap:* Dosyada HMR kuralları bozulmuştur (örneğin bileşen isimsiz default export edilmiştir veya dosya seviyesinde temizlenmeyen global bir yan etki vardır) ve Vite tam sayfa yenileme (full reload) yapmıştır.

**Kendini yokla:** `index.html` içindeki `<script>` etiketinde neden `type="module"` yazmak zorundayız?  
*Cevap:* Çünkü modern ES modülü söz dizimi (`import/export`) tarayıcı tarafından yalnızca `type="module"` olarak işaretlenmiş script dosyalarında kabul edilir.
