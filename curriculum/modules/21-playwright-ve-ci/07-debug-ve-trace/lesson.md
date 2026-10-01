---
title: "Kalan E2E testini izle: UI mode ve trace"
minutes: 16
kind: concept
---

# Bir test kaldığında kanıtı izle

Sinema’da bir arama testi geçmiyor. Test, “Kayıp Şehir” başlığını bekliyor; hata mesajı yalnızca başlığın görünmediğini söylüyor. Uygulama isteği hiç göndermemiş olabilir, sunucu hata vermiş olabilir ya da başlık başka bir nedenle ekrana gelmemiş olabilir. Önce hangisinin olduğunu bulalım.

## Beklemek yerine ne olduğunu gör

İlk akla gelen çözüm, sayfaya daha çok zaman tanımak:

```ts title="tests/search.spec.ts (kırık)"
await page.waitForTimeout(5000)
await expect(page.getByRole('heading', { name: 'Kayıp Şehir' })).toBeVisible()
```

`waitForTimeout(5000)`, testin beş saniye boyunca hiçbir şey yapmadan beklemesidir. Başlık hiç oluşmayacaksa test yine kalır; yalnızca sonucu geç öğrenirsin. Süreyi artırmak yerine sayfanın gerçekten ne yaptığını görmemiz gerekiyor.

**Ne oldu, neden?** Sabit bekleme yalnızca saate bakar; aramanın gönderilip gönderilmediğini veya yanıtın başarılı olup olmadığını söylemez. Testin asıl sorusu “beş saniye geçti mi?” değil, “beklediğim film başlığı geldi mi?” olmalı.

Bir **trace**, Playwright koşusunun zaman sırasına dizilmiş kaydıdır: eylemler, sayfanın görüntüsü, DOM ve ağ istekleri. DOM, tarayıcının o anda sayfada bulunan öğeler ağacıdır. Trace, başarısız testte “ne bekliyorduk?” ile “sayfada gerçekte ne vardı?” sorularını yan yana getirir.

```ts title="playwright.config.ts"
import { defineConfig } from '@playwright/test'

export default defineConfig({
  use: { trace: 'on-first-retry' },
})
```

`on-first-retry`, test ilk kez kalırsa sonraki denemede trace toplamayı ister. Böylece her başarılı koşunun ağır kaydını tutmadan, incelenmesi gereken koşuya kanıt eklersin. CI, yani **continuous integration** (değişiklikleri temiz bir makinede otomatik kontrol etme işi), bittiğinde trace dosyasını ayrıca saklamak gerekir; indirilebilir bu dosya bir **artifact**’tır.

**Ne oldu, neden?** İlk denemede testin normal akışı korunur. Kalınca Playwright aynı testi yeniden dener ve o denemenin ayrıntılarını kaydeder. Trace saklanmazsa CI işi sona erdiğinde bu kanıt da kaybolabilir.

## Trace’te önce kopan yeri bul

Şimdi varsayalım arama alanına “Kayıp Şehir” yazdın ve Arama düğmesine bastın. Trace Viewer’da adımlar, Network (tarayıcı isteklerinin listesi), Console (tarayıcı hata mesajları) ve DOM görüntüsü aynı koşudan incelenebilir.

| Sıra | Gözlem | Sorduğun soru |
| --- | --- | --- |
| 1 | Başlık görünür olsun assertion’ı zaman aşımına uğradı | Kullanıcı ne görmeliydi? |
| 2 | Arama alanına yazma ve click tamamlandı | Eylem hedeflenen öğeye ulaştı mı? |
| 3 | Arama isteği `401` yanıt verdi | İstek kimlik bilgisi ve taklit yanıtı doğru mu? |
| 4 | DOM’da hata uyarısı var | Uygulama yanıtı hata durumu olarak gösterdi mi? |
| 5 | Console’da render hatası yok | Sayfa çöktü mü, yoksa veri mi gelmedi? |

**Ne oldu, neden?** Trace’te istek `401` döndüğü için uygulamaya geçerli arama verisi ulaşmadı. `401` yetkilendirme hatasıdır; isteğin başlığı veya testteki ağ taklidi incelenmelidir. Locator’a beş saniye eklemek yanıtı değiştirmez.

Trace’i adım adım açarken önce son başarısız assertion’ı seç, sonra hemen öncesindeki eyleme ve isteklere dön. Bir detail sayfası boşsa önce bağlantıya tıklandığını, sonra doğru adrese gidildiğini, ardından isteğin başarılı olup olmadığını kontrol et. Her yeni bulgu aradığın katmanı daraltır; trace tek başına hangi satırı değiştirmen gerektiğini seçmez.

![Trace incelemesinde başarısız adımdan ağ ve görünüm kanıtına ilerleme](diagrams/iz-surme-kanitlari.svg "Bekleme süresini değil, başarısız adımın çevresindeki kanıtı izle.")

| Belirti | Trace’teki kanıt | Sonraki kontrol |
| --- | --- | --- |
| Sayfa boş | Console’da render hatası | İlk hata mesajı ve uygulama başlangıcı |
| Başlık yok | İstek `401` veya `500` döndü | Request başlığı ve response gövdesi |
| Yanlış sayfa | URL beklenenden farklı | Önceki link ve yönlendirme |
| Eski arama sonucu | Yeni isteğin yanıtı geç geldi | İstek sırası ve gösterilen başlık |
| Click başarısız | Hedefin üstünde başka öğe var | Screenshot ve öğenin tıklanabilirliği |

Öğenin başka bir katmanla örtülmesi, Playwright’ın **actionability** kontrolünde (eylemin güvenle yapılabilir olup olmadığı denetimi) görünür. Bu durumda screenshot’a bak; locator’ı değiştirmek yerine üstteki katmanın neden orada olduğunu bul.

Yerelde aynı adımları etkileşimli incelemek için `npx playwright test --ui` çalıştırabilirsin. **UI mode**, testleri adım adım açıp locator’ın hangi öğeyi bulduğunu görmeni sağlar. Bu, yerel keşif için kullanışlıdır; CI’daki trace ise bitmiş koşunun kaydıdır.

**Ne oldu, neden?** UI mode’da o anki koşuyu açıp başarısız adıma tıklarsın; trace’te ise tamamlanmış koşunun eylem, ekran, DOM ve ağ kanıtları arasında gezersin. İkisi de gözlem sağlar. Testin ne zaman geçeceğini hâlâ assertion belirler.

## Testin saati hangi saattir?

Bir başka arama akışı, film oturumu süresi dolunca giriş sayfasına yönlendiriyor. Tarayıcıdaki uygulama `Date.now()` ile zamanı okuyorsa Vitest’in `vi.useFakeTimers()` ayarı tarayıcı saatini değiştirmez: Vitest kodu Node.js sürecinde, E2E sayfası ayrı browser sürecinde çalışır.

En küçük fikir şudur: saati, onu kullanan yerde değiştir. Playwright’ın `page.clock` arayüzü browser saatini denetler. Sayfa açılınca timer kurulabileceği için saati gezinmeden önce kur:

```ts title="tests/session.spec.ts"
await page.clock.install({ time: new Date('2026-09-28T10:00:00Z') })
await page.goto('/oturum')
```

**Ne oldu, neden?** Önce browser saati seçilen ana ayarlandı; sonra uygulama açıldı. Uygulamanın sayfa yüklenirken oluşturduğu zamanlayıcılar da bu saatle başlar. `vi.useFakeTimers()` başka süreci etkilediğinden bu sayfanın saatini değiştiremez.

Bir adım daha ileri gidip seçilen zamanda oturumun bitmesini bekleyebilirsin. Böylece testi gerçek hayatta dakikalarca bekletmeden sona erme davranışını incelersin:

```ts title="tests/session.spec.ts"
await page.clock.install({ time: new Date('2026-09-28T10:00:00Z') })
await page.goto('/oturum')
await page.clock.fastForward('31:00')
await expect(page).toHaveURL(/giris/)
```

| Adım | Browser’daki saat | Beklenen durum |
| --- | --- | --- |
| `install` | 10:00 | Sayfa henüz açılmadı |
| `goto('/oturum')` | 10:00 | Oturum sayfası başladı |
| `fastForward('31:00')` | 10:31 | Oturum süresi geçti |
| URL assertion’ı | 10:31 | Giriş sayfasına yönlendirildi |

**Ne oldu, neden?** Test saati ileri aldı; uygulama da süre dolduğunu gördü ve yönlendirdi. Tablo, hangi saatte hangi eylemin yapıldığını görünür kılıyor. Gezinmeden önce saati kurmak başlangıçtaki timer’ları da denetim altına alır.

:::mistake[Sabit bekleme ile sonucu saklamak]
**Belirti:** Test beş saniye daha yavaş olur ama başlık hâlâ görünmez. → **Neden:** Beklenen arayüz durumu hiç oluşmadı; süre yalnızca hatayı geciktirdi. → **Düzeltme:** Başarısız assertion’a dön ve trace’te ilk eksik kanıtı ara.
:::

:::mistake[Node saatini browser saati sanmak]
**Belirti:** `vi.useFakeTimers()` açık, ama E2E oturumu gerçek zamanda sona eriyor. → **Neden:** Vitest ve browser ayrı süreçlerdir. → **Düzeltme:** `page.clock.install()` ile browser saatini sayfayı açmadan önce ayarla.
:::

Trace’ler form değerleri, URL sorguları veya istek gövdeleri gibi hassas veriler içerebilir. Sinema testlerinde sahte hesap kullan ve trace’i paylaşmadan önce içeriğine bak; gerçek parola ya da kullanıcı verisini herkese açık loglara koyma.

:::info[Derinlemesine (isteğe bağlı)]
Trace’in retry koşusunda hangi dosyalara yazıldığı Playwright config’indeki `outputDir` ve raporlayıcı ayarlarına bağlıdır. CI workflow’unda başarısız işte de bu dizini artifact olarak saklarsan indirip `npx playwright show-trace <dosya.zip>` ile açabilirsin. Trace’i repoya commit etme.
:::

## Özet

- Trace, test eylemlerini, DOM’u, görüntüyü ve ağ olaylarını zaman sırasıyla gösterir.
- Başarısız assertion’dan geriye git; ağ hatasına bekleme eklemek yanıtı düzeltmez.
- UI mode yerelde adımları inceler; CI trace’i tamamlanmış koşunun kanıtıdır.
- Vitest saati Node sürecini, `page.clock` browser sürecini denetler.

**Yeni terimler**

- **Trace:** Playwright koşusunun sıralı eylem ve browser kanıtı kaydı.
- **DOM:** Tarayıcının o anki sayfa öğeleri ağacı.
- **CI:** Değişiklikleri temiz bir makinede otomatik kontrol etme işi.
- **Artifact:** CI bitince indirilebilir olarak saklanan dosya.
- **Actionability:** Playwright’ın eylemin güvenle yapılabilir olup olmadığını denetlemesi.
- **UI mode:** Playwright testlerini yerelde adım adım inceleme arayüzü.

**Kendini yokla:** İstek `401` dönmüş. İlk olarak neyi incelersin?  
*Cevap:* İstek başlığını ve ağ taklidinin döndürdüğü yanıtı.

**Kendini yokla:** Neden `page.clock.install()` gezinmeden önce çağrılır?  
*Cevap:* Sayfa açılırken kurulabilecek timer’lar da seçilen browser saatini kullansın diye.
