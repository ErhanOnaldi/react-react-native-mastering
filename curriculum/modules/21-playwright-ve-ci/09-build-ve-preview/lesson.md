---
title: "Build çıktısı ve üretim önizlemesi"
minutes: 17
kind: concept
---

# Tarayıcıya hangi dosyalar gider?

Sinema `pnpm dev` ile bilgisayarında açılıyor. Statik bir hosta yalnızca `src/` klasörünü kopyaladığında sayfa açılmıyor: tarayıcı geliştirme sunucusundan aldığı dönüştürülmüş kodu artık bulamıyor. Yayında tarayıcıya kaynak TSX dosyalarını değil, Vite’ın hazırladığı dosyaları vermen gerekir.

Bu hazırlığa **build** denir: kaynak dosyaları tarayıcının çalıştıracağı HTML, JavaScript ve CSS dosyalarına dönüştürür. Üretim için hazırlanan bu dosyalara **asset** denir. Vite’ın `vite build` komutu bunları varsayılan olarak `dist/` klasörüne yazar.

## Kaynaktan ilk üretim dosyalarına

En küçük build’de `index.html` başlangıç sayfası olur; o sayfanın ihtiyaç duyduğu JavaScript ve CSS de çıktıda yer alır:

```text
src/main.tsx       ─┐
src/styles.css      ├─ vite build → dist/index.html
index.html         ─┘              dist/assets/index-a41c.js
                                   dist/assets/index-b82d.css
```

**Ne oldu, neden?** Vite kaynak dosyalarını tarayıcının kullanacağı dosyalara dönüştürdü. Tarayıcı `src/main.tsx` istemez; `dist/index.html` dosyasını açar, sonra HTML’in gösterdiği JS ve CSS’i ister. `public/` içeriği de build sırasında `dist/` köküne kopyalanır.

Bir sonraki örnekte kaynak değişince JavaScript dosya adının değişebileceğini düşün. `index-a41c.js` içindeki **hash**, içeriği temsil eden kısa kimliktir; içerik değişince yeni dosya adı oluşabilir:

| Yayın | HTML’in işaret ettiği dosya | Sonuç |
| --- | --- | --- |
| Önceki build | `assets/index-a41c.js` | Önceki JavaScript içeriği |
| Yeni build | `assets/index-f903.js` | Değişmiş JavaScript içeriği |

**Ne oldu, neden?** Yeni asset farklı URL aldığı için tarayıcı eski dosyayı yeni sürüm sanmaz. HTML’in güncel sürümü yeni hash’li ada işaret eder; eski HTML ise yanlışlıkla tutulursa artık var olmayan eski asset’i isteyebilir. Bu yüzden HTML ile hash’li dosyaların cache süresi farklı seçilir.

## Ortam değeri build’e ne zaman girer?

Sinema’nın API adresi `import.meta.env.VITE_API_URL` ile okunuyor. `VITE_` ile başlayan **env değişkeni**, uygulamanın hangi ortamda çalıştığına bağlı bir ayardır. Vite bu değeri build sırasında JavaScript’e yerleştirir; statik dosyaları sunan host, tarayıcıdaki bundle’a sonradan değer enjekte etmez.

```ts title="src/api.ts"
const apiUrl = import.meta.env.VITE_API_URL
export const searchUrl = `${apiUrl}/search/movie`
```

**Ne oldu, neden?** Build yapılırken `VITE_API_URL` hangi değerse üretilen kod o adrese istek atar. Host panelinde daha sonra env değerini değiştirmen daha önce üretilmiş `dist/` dosyasını değiştirmez; yeni değer için yeniden build gerekir.

İki ortamla zaman çizgisinde iz sürelim. Staging adresiyle oluşturulmuş dosyaları production hosta kopyaladığını varsay:

| An | Yapılan iş | Tarayıcının kullanacağı adres |
| --- | --- | --- |
| 1 | `VITE_API_URL=https://staging.example` ayarlanır | Henüz istek yok |
| 2 | `vite build` çalışır | Staging adresi JavaScript’e yerleşir |
| 3 | `dist/` production hosta kopyalanır | Bundle hâlâ staging adresini taşır |
| 4 | Hostta env `https://api.example` yapılır, build tekrarlanmaz | Eski staging adresi kullanılır |

**Ne oldu, neden?** Tarayıcı host sürecinin env değişkenlerini okuyamaz; o yalnızca sunulan dosyaları indirir. Farklı adresle yeniden build edersen dosyaların içine yeni adres girer. İstemciye açılan her `VITE_` değeri kullanıcı tarafından görülebileceği için parola veya gizli token koyma.

## Alt dizinde doğru adresi üret

Sinema `https://ornek.test/sinema/` altında yayınlanacaksa JS ve CSS dosyaları da o dizinde aranmalı. Vite ayarındaki **base path** (uygulamanın yayınlandığı URL kökü), üretilen HTML’deki asset bağlantılarının hangi önekle başlayacağını söyler.

```ts check title="vite.config.ts"
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/sinema/',
})
```

**Ne oldu, neden?** Vite HTML’e `/sinema/assets/...` adresleri yazar. `base: '/'` kalsaydı tarayıcı `/assets/...` isteyecek ve dosyayı alan adının kökünden arayacaktı. `base` yalnızca üretilen URL’lerin önekini ayarlar; hostun SPA yönlendirme kuralını ayarlamaz.

Vite bu ayara göre kendi ürettiği HTML bağlantılarını düzeltir. Uygulama içinde elle `'/brand/logo.svg'` yazarsan bu adres hâlâ alan adı köküne gider. Uygulama içi asset adresi gerekiyorsa `import.meta.env.BASE_URL` değerini kullan; o da aynı yayın kökünü verir.

Bir adım daha ekleyelim: production hatasını daha sonra okuyabilmek için build ile **source map** de üretebiliriz. Source map, sıkıştırılmış JavaScript satırlarını özgün kaynak dosya ve satırla eşleştiren dosyadır.

```ts check title="vite.config.ts"
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/sinema/',
  build: { sourcemap: 'hidden' },
})
```

**Ne oldu, neden?** Build artık `.map` dosyalarını da üretir, fakat `hidden` bundle’a bu map’i gösteren yorum eklemez. Bu, map’e erişimi gizlemez: `.map` dosyalarını herkese açık hosta kopyalarsan URL’sini bilen herkes indirebilir. Hata izleme servisine yükleyeceksen yayın klasöründen ayrı tut.

## Son build’i yerelde kontrol et

`vite dev` kaynak kodunu geliştirirken işler. `vite preview` ise en son `vite build` ile üretilen `dist/` klasörünü yerelde sunar:

```sh
pnpm build
pnpm exec vite preview
```

**Ne oldu, neden?** İlk komut dosyaları üretir; ikincisi o dosyaları açar. Kaynağı değiştirdikten sonra build’i tekrarlamazsan preview eski `dist/` içeriğini gösterir. Preview; build çıktısını, env’den gelen adresi ve asset URL’lerini kontrol etmek için yararlıdır.

Preview gerçek hostun bütün ayarlarını taklit etmez. Özellikle alt yoldaki derin bağlantıların yönlendirmesi, cache başlıkları ve Content Security Policy (CSP; tarayıcının hangi kaynaklardan kod yükleyebileceğini sınırlayan başlık) hosta bağlıdır. Dolayısıyla preview’in açılması build dosyalarının doğru olduğunu gösterir; yayındaki bütün sunucu kurallarını kanıtlamaz.

:::mistake[Host env değişti ama eski API adresi kaldı]
**Belirti:** Network’te istek hâlâ staging adresine gidiyor. → **Neden:** Vite env değeri mevcut JavaScript build edilirken koda yerleşti. → **Düzeltme:** Doğru ortam değeriyle yeniden build et ve yeni `dist/` dosyalarını yayınla.
:::

:::mistake[Alt yolda JS ve CSS bulunamıyor]
**Belirti:** `/sinema/` sayfası geliyor ama asset istekleri `/assets/...` adresinden 404 dönüyor. → **Neden:** Build alan adı kökünde yayınlanacakmış gibi ayarlanmış. → **Düzeltme:** `base` değerini yayın dizinine ayarla, yeniden build et ve Network’te asset URL’sini kontrol et.
:::

:::info[Derinlemesine (isteğe bağlı)]
Vite `.env`, `.env.production` gibi dosyaları seçili moda göre okuyabilir. `import.meta.env.MODE`, `DEV` ve `PROD` da build modunu anlatır; bunları da istemci kodunda sır gibi saklama. İstek sırasında değişen runtime config gerekiyorsa uygulama açılışta ayrı bir config dosyası okuyabilir; bu derste build-time env kullanıyoruz.
:::

## Özet

- `vite build`, kaynaklardan `dist/` içindeki HTML, JavaScript, CSS ve public dosyalarını üretir.
- Hash’li dosya adı değişen içeriği yeni URL ile ayırır; HTML güncel ada işaret eder.
- `VITE_` değerleri build sırasında istemci koduna yerleşir ve gizli bilgi sayılmaz.
- Alt dizin yayını için `base` ayarlanır; elle yazılan mutlak URL’leri ayrıca düzelt.
- `vite preview` son build’i açar; gerçek host kurallarını tümüyle sınamaz.

**Yeni terimler**

- **Build:** Kaynak koddan tarayıcıya hazır üretim dosyaları çıkarma işlemi.
- **Asset:** Sayfanın kullandığı JavaScript, CSS, görsel gibi dosya.
- **Hash:** Dosya içeriğini temsil edip asset URL’sini sürümleyen kısa kimlik.
- **Build-time env:** Build sırasında istemci koduna yerleşen ortam ayarı.
- **Base path:** Üretilen asset URL’lerinin başladığı yayın dizini.
- **Source map:** Sıkıştırılmış JavaScript’i özgün dosya ve satırla eşleştiren dosya.
- **Preview:** Son `dist/` build’ini yerelde sunma biçimi.

**Kendini yokla:** Hostta `VITE_API_URL` değişti, fakat yeni build alınmadı. Tarayıcı hangi adresi kullanır?  
*Cevap:* Eski build sırasında JavaScript’e yerleşen adresi.

**Kendini yokla:** Sinema `/sinema/` altında açılıyor ama JS `/assets/...` yolunda 404. İlk hangi ayarı incelersin?  
*Cevap:* Vite config’indeki `base` değerini; build `/sinema/` önekini üretmeli.
