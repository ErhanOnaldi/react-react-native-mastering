---
title: "Build çıktısı ve üretim önizlemesi"
minutes: 14
kind: concept
---

# Build çıktısı ve üretim önizlemesi

:::pain[Yerelde çalışan sayfa yayında boş]
Sinema geliştirme sunucusunda açılıyor. Aynı kaynak dosyaları statik hosta yükleyince tarayıcı `/src/main.tsx` isteğinde 404 görüyor ve ekran boş kalıyor. Başka bir denemede uygulama `/sinema/` altında açılıyor, fakat JS isteği yanlışlıkla alan adının kökündeki `/assets/...` adresine gidiyor. Geliştirme sunucusunun sunduğu kaynak ile kullanıcının indirdiği üretim dosyası aynı şey değil.
:::

## Kaynaktan tarayıcıya giden dört durak

Vite geliştirirken TSX dosyalarını dönüştürüp tarayıcıya anında sunar. Üretimde ise `vite build` kaynakları işler ve varsayılan olarak `dist/` klasörüne statik dosyalar yazar. Statik host, Vite geliştirme sunucusunu çalıştırmak zorunda değildir; bu dosyaları HTTP üzerinden sunması yeterlidir.

![Kaynak dosyaların Vite build ile hashli çıktıya, oradan host ve tarayıcıya gitmesi](diagram:build-ve-yayin "Build ve yayın akışında HTML ile asset dosyalarının ayrı görevleri vardır.")

Modelin kuralları şöyle:

1. **Kaynak ile çıktı ayrıdır.** `src/` içindeki TSX ve CSS üzerinde çalışırsın. Tarayıcı üretimde `dist/index.html` ile `dist/assets/` içindeki dönüştürülmüş dosyaları alır. `public/` içindeki dosyalar da build çıktısının köküne kopyalanır.
2. **HTML giriş noktasıdır.** `index.html`, çalıştırılacak JS ve kullanılacak CSS dosyalarının URL’lerini taşır. Sayfa ilk açılışında tarayıcı önce HTML’i, ardından onun işaret ettiği asset’leri ister.
3. **İçerik değişirse hash değişebilir.** Örneğin `index-a41c.js` yerine `index-b82d.js` oluşur. İki dosyanın URL’si farklı olduğundan eski asset’in uzun süre saklanması yeni sürümü engellemez. Bunun çalışması için HTML’in güncel dosya adını göstermesi gerekir.
4. **İstemci env’i build sırasında çözülür.** `import.meta.env.VITE_API_URL` gibi değerler build sonucuna yerleşir. Host sürecinde sonradan env değiştirmek statik JS’i değiştirmez. `VITE_` önekli değerler kullanıcıya açıktır; sır saklama yeri değildir.
5. **Yayın kökü URL’lerin parçasıdır.** Uygulama alan adının kökünde değil `/sinema/` altında sunulacaksa Vite `base: '/sinema/'` ayarıyla asset yollarını o öneke göre üretir. `base` sunucunun SPA fallback ayarının yerini almaz; yalnızca üretilen URL tabanını ayarlar.

Sonraki adımda host bu dosyalara farklı cache başlıkları verecek. Şimdilik önemli olan ayrım şu: dosya adının hash’i asset’in kimliğini taşır, HTML ise hangi kimliğin güncel olduğunu söyler.

## Bir build’i zaman sırasıyla izle

Diyelim bir sanat alanı uygulamasının `src/main.tsx` dosyası değişti ve yayın yolu `/sergi/`. Build öncesinde `VITE_API_URL=https://staging.example` verilmiş olsun.

| An | Yapılan iş | Somut sonuç |
| --- | --- | --- |
| 1 | Vite `src/` ve `public/` dosyalarını okur | TSX kaynakları ve favicon girdidir |
| 2 | `VITE_API_URL` çözülür | İstemci kodu staging adresini kullanacak şekilde üretilir |
| 3 | JS ve CSS paketlenir | `dist/assets/index-a41c.js` gibi dosyalar çıkar |
| 4 | HTML bağlantıları yazılır | `/sergi/assets/index-a41c.js` istenir |
| 5 | `vite preview` ile çıktı açılır | Geliştirme dönüşümü değil, `dist/` dosyaları sunulur |
| 6 | Hosttaki env değiştirilir ama build tekrarlanmaz | Tarayıcı hâlâ staging adresini kullanır |

Altıncı satır sık karıştırılır. Statik dosya yayınında çalışma anı env’i istiyorsan uygulamanın açılışta ayrıca bir `/config.json` okuması gibi başka bir tasarım gerekir. Buradaki Vite akışı build anı değerini kullanır. Farklı staging ve production ortamları için ayrı build üretmek basit ve öngörülebilir seçimdir.

Vite, seçilen moda göre `.env` ve `.env.production` gibi dosyalardan değer okuyabilir. `import.meta.env.MODE` modun adını, `import.meta.env.PROD` ve `DEV` ise üretim ve geliştirme ayrımını verir. Bu değerleri de build’in girdileri gibi düşün: yanlış dosyadaki URL ile paket ürettiğinde, host doğru çalışsa bile tarayıcı yanlış API’ye gider. Build öncesinde hangi ortamın seçildiğini kontrol etmek, boş ekranı sonradan aramaktan kolaydır.

## Kırık URL’den doğru URL’ye

Şu örnekte uygulama `/sergi/` altında duruyor, fakat asset adresi alan adı kökünden başlıyor. `base` ayarı olmadan el ile yazılmış bu URL, tarayıcıyı yanlış yere gönderir:

```ts check title="src/lib/brand.ts"
const logoPath = '/brand/galeri.svg'
const siteTitle = 'Kent Galerisi'
console.log(siteTitle, logoPath)
```

Yayın yolu `/sergi/` iken kök varsayılanını bırakırsan çıktıdaki bundle ve asset URL’leri alan adı köküne gider:

```ts title="vite.config.ts (kırık)"
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
})
```

Doğru Vite yapılandırması, yayın yolunu build’e bildirir:

```ts check title="vite.config.ts"
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/sergi/',
  build: { sourcemap: 'hidden' },
})
```

Bu ayarda Vite, ürettiği HTML’de asset URL’lerine `/sergi/` önekini koyar. Aynı build’i alan adı köküne taşırsan bu kez yollar yanlış olur; URL tabanı yayın adresine göre seçilmelidir. `base` değerini gerektiğinde `import.meta.env.BASE_URL` ile okuyabilirsin; sabit string’i uygulamanın çeşitli yerlerine dağıtmak bakım yükünü artırır.

Build çıktısında beklediğin yolu görmek için HTML’i ve asset isteklerini birlikte incele. HTML doğru öneki taşısa da host eski `index.html` dosyasını cache’ten sunabilir. Böyle bir durumda JS dosyaları yeni hash’li adla oluşur ama eski HTML artık var olmayan dosyayı ister. HTML için kısa cache, hash’li statik dosyalar için uzun cache süresi bu ayrımı korur.

`build.sourcemap: 'hidden'` ayrı bir karar verir. Source map dosyası oluşur, ancak JS çıktısına onu işaret eden yorum eklenmez. Hata izleme servisi bu map’i aynı yayın sürümüyle eşleştirerek sıkıştırılmış stack’i özgün dosya ve satıra çevirebilir. Map’i üretmek ile onu halka açık statik hosta yüklemek aynı karar değildir. Üretim dosyalarını yüklerken map erişimini ayrıca sınırlamalısın.

## Preview neyi kanıtlar?

`vite preview`, en son üretilmiş `dist/` çıktısını yerelde sunar. Yanlış `base` ya da build anında eksik env gibi sorunlar burada ortaya çıkabilir. Ancak preview, hostun gerçek yönlendirme, cache ve CSP başlıklarını kendiliğinden taklit etmez. Bu yüzden preview’de açılan bir derin bağlantının yayında da çalışacağını varsayma.

Preview’den önce `vite build` çalıştırman gerekir; kaynak kodu değiştirdikten sonra yeniden build etmezsen eski çıktı gösterilir. `vite dev` ise anlık kaynağı işler. İki sunucu arasındaki fark, yalnızca hız değildir: biri geliştiriciye dönüşüm sağlar, diğeri üretim dosyalarını okur.

:::mistake[Eski API adresi kalıyor]
Belirti → Host panelinde API adresi değiştirildiği halde Network sekmesindeki istek eski adrese gidiyor.  
Neden → `VITE_` değeri mevcut JS üretilirken bundle’a yazıldı.  
Düzeltme → Doğru ortam değeriyle yeniden build edip yeni `dist/` çıktısını yayınla. Çalışma anı ayarı gerçekten gerekiyorsa ayrı bir yapılandırma kaynağı tasarla.
:::

:::mistake[Alt yolda CSS ve JS 404]
Belirti → `/sergi/` HTML’i geliyor; `/assets/index-a41c.js` ve CSS istekleri 404.  
Neden → Build, uygulamanın alan adı kökünde sunulacağını varsaydı.  
Düzeltme → Vite `base` değerini yayın yoluna ayarla, yeniden build et ve HTML’deki URL’leri Network sekmesinde incele. Cache başlıklarının eski HTML’i tutmadığını da doğrula.
:::

:::mistake[Source map herkese açıldı]
Belirti → `assets/*.map` dosyaları doğrudan URL ile indirilebiliyor.  
Neden → Gizli map üretildi ama aynı dosyalar statik hosta da kopyalandı. `hidden`, erişim kontrolü değildir.  
Düzeltme → Map dosyalarını yalnızca hata izleme servisine yükle; halka açık yayın dosya kümesinden çıkar.
:::

:::sector[Sektörde]
Bir ekip her yayına build kimliği koyar ve staging ile production için ayrı çıktı üretir. Pull request önizlemesinde en son `dist/` açılır; gerçek hostta Network sekmesinde HTML ve asset URL’leri ayrıca kontrol edilir. Böylece “yerelde çalışıyor” cümlesi, hangi build’in hangi adreste çalıştığına dönüşür.
:::

## Özet

- `vite build`, kaynakları `dist/` içindeki statik HTML, JS ve CSS dosyalarına dönüştürür.
- HTML güncel hash’li asset adlarına işaret eder; içerik değişimi yeni URL oluşturur.
- `VITE_` env değerleri build anında bundle’a girer ve kullanıcı tarafından görülebilir.
- Alt yola yayın için `base` gerekir; `vite preview` son build çıktısını yerelde sunar.
- `hidden` source map üretir, fakat map dosyalarının yayın erişimini ayrıca yönetmen gerekir.

**Kendini yokla:** Host env’i değiştiği halde API adresi neden aynı kaldı?  
*Cevap:* Tarayıcı eski build’in JS dosyasını indiriyor; env o dosya üretilirken çözülmüştü.

**Kendini yokla:** `/sergi/` altında HTML geliyor ama JS 404 ise ilk nerede bakarsın?  
*Cevap:* Network’te JS URL’sine ve build’in `base` ayarına bakarım; URL’nin `/sergi/assets/...` ile başlaması gerekir.
