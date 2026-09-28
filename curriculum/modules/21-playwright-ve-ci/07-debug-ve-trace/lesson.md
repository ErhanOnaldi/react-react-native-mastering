---
title: "Kalan E2E testini izle: UI mode ve trace"
minutes: 14
kind: concept
---

# Test neden CI’da kaldı?

:::pain[Problem]
 “Seramik atölyesi” arama testi yerelde geçiyor, CI’da `toBeVisible` zaman aşımı veriyor. Hemen `waitForTimeout(5000)` eklersen test beş saniye yavaşlar, asıl sebep gizli kalır. CI ekran görüntüsünde yalnızca “Program yükleniyor…” yazıyor.
:::

## Trace, tek hata mesajından daha fazla kanıt taşır

:::model[Zaman çizgisi ve kanıt]
Trace, test eylemlerini, locator sonuçlarını, browser görüntüsünü, DOM snapshot’ını, Console mesajlarını ve ağ olaylarını aynı zaman sırasına bağlar. Önce başarısız assertion’ın hangi kullanıcı koşulunu beklediğini bul, sonra o anın çevresindeki kanıtı incele.

![Trace incelemesinde başarısız adımdan ağ ve görünüm kanıtına ilerleme](diagrams/iz-surme-kanitlari.svg)
:::

Kesin kurallar:

1. Trace, son ekran görüntüsünden fazlasını saklar: eylemleri ve tarayıcı kanıtını birlikte gösterir.
2. İlk başarısız adımın öncesini ve sonrasını incele; hata çoğu zaman beklenen sonucun oluşmadığı noktadan önce başlar.
3. Network istek URL’si, durum kodu ve zamanı; Console tarayıcı hatalarını; DOM snapshot locator’ın gördüğü içeriği gösterir.
4. Retry trace’i seçilen tekrar koşusunda üretir; artifact olmazsa CI bittiğinde kanıt kaybolabilir.
5. Bekleme süresini artırmadan önce uygulamanın gerçekten hangi durumu ürettiğini doğrula.

Bir kartı açma testi kaldığında trace’te click adımının tamamlandığını ve doğru bağlantıya gittiğini gör. Ardından detay API isteğinin durumunu, Console’daki render hatasını ve başlık snapshot’ını karşılaştır. Bu sıra “locator yanlış” ile “sayfa doğru açıldı ama içerik yüklenmedi” durumlarını ayırır.

| Aşama | Görünen kanıt | Sorulacak soru |
| --- | --- | --- |
| 1 | Assertion zaman aşımına uğramış | Hangi kullanıcı sonucu bekleniyordu? |
| 2 | Önceki click başarılı | Eylem hedeflenen öğeye gitti mi? |
| 3 | Network 401 | İstek başlığı ve yanıt doğru mu? |
| 4 | DOM’da alert var | Uygulama hata durumunu gösterdi mi? |
| 5 | Console render hatası yok | Sorun veri/route mu, çökme mi? |

Trace’te ağ isteği 401 dönüyorsa locator’a beş saniye daha eklemek anlamlı değildir. Network başarılı ama DOM eski içeriği gösteriyorsa beklenen koşul veya uygulamanın güncelleme davranışı incelenmelidir. Kanıt kopuşun yerini daraltır; tek başına düzeltmeyi seçmez.

## İlk bakış: UI mode

`npx playwright test --ui` komutu testi adım adım çalıştırıp locator’ları ve DOM’u inceletir. Başarısız adıma tıkla: hangi locator beklendi, sayfada o anda ne vardı? Burada `query` URL’ye yazılmamışsa sorun bekleme süresinde değil, uygulamadadır.

Yerelde geçip CI’da kalan test için `trace: 'on-first-retry'` ayarını config’e koy. İlk kalıştan sonraki denemede Playwright trace toplar. `npx playwright show-trace <dosya.zip>` ile aç; Actions, Network, Console ve DOM snapshot’larını birlikte incele.

```ts title="playwright.config.ts"
import { defineConfig } from '@playwright/test'

export default defineConfig({
  retries: process.env.CI ? 1 : 0,
  use: { trace: 'on-first-retry' },
})
```

## Hangi kanıt neyi söyler?

| İz | Olası neden |
| --- | --- |
| Network’te TMDB 401 | Token/header eksik veya route taklidi yanlış |
| Console’da render hatası | Bileşen çöktü; locator’ı değiştirmek çözmez |
| DOM’da eski sonuçlar | Yeni sorgunun tamamlanmasını beklemiyorsun |
| `/login` boş, yönlendirme tekrar ediyor | Korumalı route yanlış grupta |

`toMatchAriaSnapshot()` ile küçük bir bölgenin erişilebilir ağacını da karşılaştırabilirsin. Tüm sayfanın metnini dondurmak kırılgandır; ana menü veya form gibi kararlı parçayı seç. Modül 19’un a11y çalışması burada test sinyaline dönüşür.

## Hata sınıfını kanıttan seç

İlk başarısız assertion sana beklenen koşulu söyler, trace ise uygulamanın o anda ne yaptığını gösterir. Bu ikisini yan yana koymadan locator, timeout veya uygulama kodunu değiştirme. Önce page açılmış mı, eylem doğru öğeye gitmiş mi, ağ yanıtı başarılı mı, DOM beklenen duruma geçmiş mi diye ilerle. Her cevap bir sonraki bakış noktasını seçer.

| Belirti | Trace kanıtı | Muhtemel katman | Sonraki kontrol |
| --- | --- | --- | --- |
| Sayfa boş | Console’da render exception | Uygulama başlangıcı | İlk stack ve env |
| Başlık yok | İstek 401 veya 500 | Ağ/kimlik | Request header ve response body |
| Yanlış sayfa | URL beklenenden farklı | Router/etkileşim | Önceki link ve history |
| Bazen eski sonuç | Yeni isteğin yanıtı geç | Zamanlama/veri | Sonuç başlığı ve ağ sırası |
| Click başarısız | Üstte başka öğe var | Yerleşim | Screenshot ve actionability |

Trace eylemden önceki snapshot’ı da tuttuğu için, test bittiğinde canlı uygulamayı yeniden açıp aynı anda incelemek zorunda değilsin. Fakat trace geçmiş koşunun kanıtıdır: uygulamanın son kodunu açtığında o koşunun tam durumuyla aynı olmayabilir. Artifact üzerinde commit veya build bilgisini tutmak bulguyu kod değişikliğiyle eşleştirmeyi kolaylaştırır.

UI mode yerelde etkileşimli keşif için elverişlidir; CI trace’i otomatik kanıt paketidir. UI mode’da başarısız adıma tıklayıp locator’ın neye çözüldüğüne bakarsın. Trace Viewer’da ise action listesi, snapshot, network ve console arasında aynı zaman noktasında gezinirsin. İkisi de gözlem aracıdır; senaryoda neyin başarı sayılacağını assertion belirler.

Trace’ler hassas veriyi de taşıyabilir: form alanları, URL query’leri, ekran görüntüleri veya istek gövdeleri. Bu nedenle gerçek parolalarla test yapma, trace’i herkese açık loglara koyma ve saklama süresini sınırlı tut. Test hesabı kullan, gerçek kullanıcı verisini maskele ve paylaşmadan önce artifact içeriğini kontrol et.

## Saat kaynaklı test

Kırık teşhis, her kalışta bir saniye daha bekleme eklemektir. Bu değişiklik gerçek nedenin bulunmadığını gizler:

~~~ts
await page.waitForTimeout(5000)
await expect(page.getByRole('heading', { name: 'Etkinlik ayrıntısı' })).toBeVisible()
~~~

Düzeltilmiş teşhis önce beklenen duruma bağlı assertion kullanır; süre dolarsa trace’te hangi kanıtın eksik olduğunu incelersin:

~~~ts check
import { expect, test } from '@playwright/test'

test('takvim seçimi gün başlığını gösterir', async ({ page }) => {
  await page.goto('/takvim')
  await page.getByRole('button', { name: '28 Eylül' }).click()
  await expect(page.getByRole('heading', { name: 'Seçilen günün programı' })).toBeVisible()
})
~~~

Sinema’da “oturum süresi doldu” davranışı `Date`’e bağlıysa Node’daki `vi.useFakeTimers()` tarayıcı saatini değiştirmez. Playwright’ın `page.clock.install({ time: new Date(...) })` API’sini **gezinmeden önce** kur; sayfa açılırken oluşturulan timer’lar da denetim altında olur. Bu başka bir bağlamda önceki fake timer bilgisini tekrar kullanır.

:::mistake[Sabit beklemeyle hatayı örtmek]
**Belirti:** Test beş saniye daha yavaş olur ama CI’da yine kalır. → **Neden:** İstenen UI durumu hiç oluşmamıştır; beklemek yalnızca hatayı geciktirir. → **Düzeltme:** İlk başarısız assertion’ı ve o andaki trace kanıtını incele.
:::

:::mistake[Trace’i kaybetmek]
**Belirti:** CI işi bittiğinde başarısız adımın kaydı yoktur. → **Neden:** Retry trace’i artifact olarak yüklenmemiştir. → **Düzeltme:** test-results içeriğini başarısız koşulda artifact yap; trace’i repoya commit etme.
:::

:::mistake[Saat kaynağını karıştırmak]
**Belirti:** Node fake timer’ı browser oturum süresini etkilemez. → **Neden:** Browser ayrı süreç ve zaman kaynağı kullanır. → **Düzeltme:** Playwright clock’u sayfayı açmadan önce kur.
:::

:::sector[Sektörde]
CI artifact’ları inceleme için süreli saklanır. Takımlar kişisel veri, token veya parola içerebilecek trace’leri herkese açık depolara koymaz. Retry tanı için yararlıdır; tekrarlayan kalışı görünmez biçimde telafi etmemelidir.
:::

## Özet

- Trace eylem, DOM, Console ve Network kanıtlarını aynı zaman çizgisinde birleştirir.
- Önce başarısız assertion’ı, sonra onu çevreleyen ilk kopukluğu ara.
- 401 gibi ağ hatasına bekleme eklemek çözüm değildir.
- Browser saati Playwright clock ile, Node saati Vitest timer’larıyla değiştirilir.

**Kendini yokla:** Assertion kaldı ve trace’te istek 401. İlk bakacağın kanıt nedir?  
*Cevap:* İsteğin başlıkları ve route’un döndürdüğü yanıt.

**Kendini yokla:** Neden sabit bekleme yerine web-first assertion kullanırsın?  
*Cevap:* Koşul oluştuğunda hemen biter; olmazsa anlamlı timeout hatası verir.
