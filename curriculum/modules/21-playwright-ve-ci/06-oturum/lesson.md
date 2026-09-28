---
title: "Oturum durumunu sonraki testlere taşı"
minutes: 14
kind: concept
---

# Giriş testini her senaryoda tekrarlama

:::pain[Problem]
Rezervasyon testleri üyelik formunu her seferinde dolduruyor. Kimlik servisi bazen yavaşlayınca bütün paket uzuyor; bir senaryoda kayıt hatası, diğerinde koltuk seçme hatası var ama ikisi aynı başlangıç adımında kalıyor.
:::

## Oturum bir başlangıç durumudur

:::model[Kaydedilmiş tarayıcı durumu]
Girişten sonra browser context’in cookie ve localStorage içeriğini bir kez kaydedebilirsin. Sonraki testler bu durumu kendi yeni context’lerinde başlangıç noktası olarak yükler. Bu, canlı context’i testler arasında paylaşmak değildir: her test ayrı tarayıcı durumunda başlar.

![Bir giriş setup’ı storageState üretir, testler bunu ayrı context’lerde kullanır](diagrams/oturum-yeniden-kullanimi.svg)
:::

Kesin kurallar:

1. storageState tarayıcı oturum verisini taşır; uygulama veritabanını veya server state’ini kopyalamaz.
2. Giriş setup’ı yönlendirme veya giriş sonrası görünür durumu bekledikten sonra snapshot alır.
3. Testler aynı başlangıç kimliğini yüklese de ayrı browser context’lerinde çalışır.
4. Ana auth yolculuğu en az bir testte boş oturumla giriş formundan başlayıp gerçekten yürünür.
5. Kimlik dosyası gizli olabilir; gerçek oturumu repoya commit etme, CI’da test için yeniden üret.

## Bir setup’ın ömrünü izleyelim

Etkinlik rezervasyon sayfasında her testin oturum açması gerektiğini düşün. Setup test runner çalışırken giriş formunu doldurur, giriş sonrası profil ekranının görünmesini bekler ve cookie/localStorage verisini kaydeder. Proje bağımlılığı tamamlandıktan sonra rezervasyon testi yeni context açar, dosyayı yükler ve doğrudan rezervasyon sayfasına gider.

| Sıra | Context | Olay | Ne paylaşılır? |
| --- | --- | --- | --- |
| 1 | Setup page | Giriş akışı tamamlanır | Başlangıçta henüz kayıt yok |
| 2 | Setup context | storageState yazılır | Cookie ve localStorage verisi |
| 3 | Test A context | Kaydedilen veriyle açılır | Oturum başlangıcı |
| 4 | Test B context | Aynı dosya yüklenir | Aynı kimlik başlangıcı |
| 5 | Test biter | Context kapanır | Canlı sayfa ve değişiklikleri taşınmaz |

Bu ayrım özellikle testlerin server tarafında ortak kaynak değiştirdiği durumlarda önemlidir. Tarayıcı localStorage’ı ayrı olsa bile iki test aynı uzak hesap üzerinde rezervasyon oluşturuyorsa veri paylaşılmıştır. Her testin benzersiz kayıt kullanması veya fixture sonunda temizlemesi gerekir.

Kırık yaklaşım, her testi giriş ekranından başlatıp aynı yavaş API yolunu tekrar tekrar yürütmektir. Bu, ürünün ana giriş davranışını her senaryoda yeniden test etmez; yalnızca süreyi ve hata noktalarını çoğaltır. Doğru yaklaşım iki tür kanıtı ayırır: bir kritik test boş oturumdan login’i doğrular, login sonrası çok sayıda senaryo kaydedilmiş durumla başlar.

Snapshot’ı giriş isteği başlamadan yazmak çoğu zaman boş oturum dosyası üretir:

~~~ts
await page.context().storageState({ path: 'playwright/.auth/user.json' })
await page.getByRole('button', { name: 'Giriş yap' }).click()
~~~

Düzeltilmiş sıra önce kullanıcıya görünen başarıyı bekler, sonra kaydeder:

~~~ts check
import { expect, test } from '@playwright/test'

test('rezervasyon üyeliği sonrası oturum saklanır', async ({ page }) => {
  await page.goto('/uye-ol')
  await page.getByLabel('E-posta adresin').fill('ada@example.test')
  await page.getByLabel('Yeni parola').fill('ornek-parola')
  await page.getByRole('button', { name: 'Üyeliği başlat' }).click()
  await expect(page.getByRole('heading', { name: 'Rezervasyon hesabın hazır' })).toBeVisible()
  await page.context().storageState({ path: 'playwright/.auth/member.json' })
})
~~~

~~~ts
await page.context().storageState({ path: 'playwright/.auth/user.json' })
~~~

Snapshot’ı çok erken alırsan dosyaya henüz oturum yazılmamış olabilir. Görünür ve güvenilir bir login sonrası koşulu bekle, sonra kaydet. Uygulama auth bilgilerini yalnızca sessionStorage’a koyuyorsa storageState onu taşımaz; bu durumda başka bir başlangıç stratejisi gerekir.

## Oturum nerede duruyor?

Modül 17’de auth state’in kalıcı kısmını `localStorage`’a koydun. Playwright `storageState()` ile cookie ve localStorage’ı dosyaya kaydedebilir. Yeni bir browser context bu durumla başlar. Bir kez giriş yap, diğer rezervasyon testleri aynı kimlikle başlayabilir.

```ts title="e2e/auth.setup.ts"
import { test as setup, expect } from '@playwright/test'

setup('etkinlik üyeliği oturumunu kaydet', async ({ page }) => {
  await page.route('https://members.events.example/session', (route) =>
    route.fulfill({ json: { id: 12, email: 'ada@example.test', token: 'test-member-token' } }),
  )
  await page.goto('/uye-ol')
  await page.getByLabel('E-posta adresin').fill('ada@example.test')
  await page.getByLabel('Yeni parola').fill('ornek-parola')
  await page.getByRole('button', { name: 'Üyeliği başlat' }).click()
  await expect(page).toHaveURL('/rezervasyonlarim')
  await page.context().storageState({ path: 'playwright/.auth/member.json' })
})
```

`playwright/.auth` klasörünü `.gitignore`’a ekle: oturum dosyası sırdır. CI’da dosyayı her çalıştırmada test hesabıyla yeniden üret. İlk üyelik akışını yine browser’da yürüt; storageState ile giriş formunu atlayıp route hatasını gizleme.

## Kullanım ve sınır

Birden çok spec giriş gerektiriyorsa setup project’i dependency yapıp `use.storageState` yolunu ver. Bu, setup sonrasında yazılmış dosyayı okur. `page.context().storageState()` tüm oturumu yakalar; `page.evaluate(() => localStorage...)` ile elle kopyalama hatasına gerek kalmaz.

Aynı `storageState` ile açılan testler başlangıç kimliğini paylaşır; **canlı browser context’i paylaşmaz**. Bir testin oluşturduğu rezervasyon başka testte otomatik görünmez. Sunucuda ortak kullanıcı verisi varsa her test için ayrı kayıt veya temizleme gerekir.

## Sınır durumları: kimlik, süre ve server verisi

Kaydedilmiş oturum dosyasının içinde token veya kişisel bilgi bulunabilir. Dosyayı kaynak kontrolüne ekleme; dosyanın yolu test çıktılarında görünse bile içeriğini paylaşma. CI’da kimlik test verisiyle üretilmeli ve artifact’lara auth dosyası eklenmemelidir. Teste gereken bilgiyi ver, gerçek kullanıcının oturumunu kopyalama.

Bir oturumun geçerliliği sonsuza kadar sürmez. Token süresi doluyorsa testlerin uzun süre aynı state dosyasını kullanması aniden 401 üretir. Setup projesi her Playwright çalıştırmasında yeniden koşmalı; eğer setup başarısız olmuşsa onu atlayıp eski dosyayı kullanmak yerine test açıkça başarısız olmalıdır. CI’da job başına geçici test verisi üretmek bu davranışı belirginleştirir.

Birden fazla kullanıcı rolü varsa her role ayrı state dosyası üret. Örneğin organizatör etkinlik oluşturabilir, katılımcı yalnızca koltuk seçebilir. Testin hangi yetkiyi varsaydığı açık olmazsa yanlış hesapla başlayan senaryo beklenmedik 403 alır. Dosya adı rolü anlatabilir ama token içeriğini veya kullanıcı sırrını adın kendisine koyma.

Süresi dolmuş state’in bilinçli olarak test edildiği senaryoda geçerli state kullanma. Boş context açıp oturumun süresinin dolduğunu tarayıcı davranışıyla üret veya sahte servis cevabını kontrollü biçimde 401 yap. Böylece normal senaryolar taze kimlikle hızlı çalışırken expiry davranışı ayrı ve anlaşılır bir kanıt olur.

Storage snapshot’ı localStorage ve cookie başlangıcını kapsar, fakat sessionStorage’ı veya sunucu tarafındaki kullanıcı kayıtlarını otomatik yönetmez. Ayrıca localStorage verisinin kendisi uygulamada beklediğin şemaya uygun mu sorusu önemlidir. Uygulama migration veya parse hatasında oturumu temizliyorsa storageState yüklenmiş görünse bile kullanıcı tekrar login’e dönebilir.

Kayıt adımından sonra kullanıcıyı aynı hesapla açılan iki testin farklı server verisi göreceğini varsayma. Context yalıtımı tarayıcı tarafında geçerlidir; API veritabanı ortak olabilir. Her test benzersiz bir kayıt adı kullanabilir, test sonunda kaydı silebilir veya fixture’ın kurduğu server kaynağını temizleyebilir. Temizlik çalışmazsa sonraki koşuların başlangıcı test sırasına bağlı hale gelir.

Worker scope’u da bir maliyet ve yalıtım seçimi. Pahalı ama değişmeyen bir test kaynağı worker başına kurulabilir; kullanıcıya ait değişebilir oturum state’i genellikle test seviyesinde tutulur. Bir worker’ın state’i diğer worker’a aktarılmaz. Paralellik ayarı artınca aynı uzak hesapta çakışma çıkıyorsa önce ortak server verisini araştır.

:::mistake[Sık hata]
**Belirti:** Kaydedilen dosyayla açılan sayfa tekrar girişe yönlenir. → **Neden:** Snapshot giriş tamamlanmadan alınmıştır veya oturum verisi desteklenmeyen depodadır. → **Düzeltme:** Giriş sonrası görünür koşulu bekle ve cookie/localStorage kullanımını doğrula.
:::

:::mistake[Uzak kullanıcı verisini yalıtılmış sanmak]
**Belirti:** Bir testin eklediği rezervasyon sonraki testte görünür. → **Neden:** Ayrı context’ler aynı server hesabını kullanıyor. → **Düzeltme:** Test başına benzersiz veri üret veya fixture teardown’ında temizle.
:::

:::sector[Sektörde]
Giriş UI’sini bir E2E testinde yürüt; diğer testlerde `storageState` ile zamandan kazan. Yetkisiz yönlendirme için ayrıca boş oturumla açılan bir test tut.
:::

## Özet

- storageState cookie ve localStorage başlangıcını taşır; canlı page’i paylaşmaz.
- Snapshot’ı login sonrası görünür başarıdan sonra al.
- Kritik giriş UI’sini boş context ile en az bir kez yürüt.
- Tarayıcı context’inin ayrı olması ortak server verisini yalıtmaz.

**Kendini yokla:** İki test storageState kullansa da neden ayrı context alır?  
*Cevap:* Aynı başlangıç kimliğini kullanırlar ama sayfa ve tarayıcı değişiklikleri birbirine sızmaz.

**Kendini yokla:** Her test sonunda state neden temizlenmeyebilir?  
*Cevap:* storageState tarayıcı verisini taşır; uzak server’daki hesap verisini yönetmez.
