---
title: "Davranışı koru, uygulama ayrıntısını değil"
minutes: 16
kind: concept
---

# Davranışı koru, uygulama ayrıntısını değil

Bir fonksiyona `page=2` verdiğinde Sinema’nın ikinci sayfasını istemesini beklersin. Fonksiyonun bunu `URLSearchParams` ile mi yoksa başka bir string işlemiyle mi yaptığı, çağıranın ihtiyacı değildir. Test yazarken hangi farkın gerçek bir bug olduğunu seçmek, neyi ölçtüğün kadar önemlidir.

## Önce sonucu sınayalım

Bir **davranış sözleşmesi**, kodu kullanan kişinin güvenebileceği gözlenebilir sonuçtur. Aşağıdaki küçük fonksiyon sayfa numarasını URL’ye ekliyor; test de çıkan değeri kontrol ediyor.

```ts check
import { expect, it } from 'vitest'

function pageUrl(page: number): string {
  return `https://sinema.test/films?page=${page}`
}

it('ikinci sayfanın adresini üretir', () => {
  const url = new URL(pageUrl(2))
  expect(url.searchParams.get('page')).toBe('2')
})
```

Test gerçek sonucu URL olarak okur ve `page` değerini karşılaştırır. Böylece 2 yerine 1 yazılması yakalanır. Fonksiyonun içinde hangi değişken adını kullandığı veya URL’yi hangi satırda kurduğu bu davranış için önemli değildir.

## İçeriyi değil, kararı ölç

Bir **refactor**, dışarıdaki davranışı korurken kodun iç yapısını değiştirmektir. Örneğin `pageUrl` fonksiyonu aynı URL’yi iki farklı yöntemle üretebilir:

```ts check
function pageUrlWithTemplate(page: number): string {
  return `https://sinema.test/films?page=${page}`
}

function pageUrlWithParams(page: number): string {
  const url = new URL('https://sinema.test/films')
  url.searchParams.set('page', String(page))
  return url.toString()
}

const first = new URL(pageUrlWithTemplate(2))
const second = new URL(pageUrlWithParams(2))
if (first.searchParams.get('page') !== '2') throw new Error('İlk adres yanlış')
if (second.searchParams.get('page') !== '2') throw new Error('İkinci adres yanlış')
```

İki uygulama da `page=2` sözleşmesini karşılıyor. Test yalnızca iç yöntemlerden birini zorunlu kılsaydı, doğru bir refactor’dan sonra bozulabilirdi. Çıktıyı doğrulamak sana uygulamayı değiştirme özgürlüğü verir.

:::mistake[İçte kullanılan aracı zorunlu kılmak]
Belirti: URL doğru olduğu halde refactor sonrası test kalır. → Neden: Test dış sonucu değil, belirli bir yardımcıya kaç kez başvurulduğunu bekliyordur. → Düzeltme: Ürünün ihtiyaç duyduğu URL değerini karşılaştır.
:::

## “Çağrıldı” demek yeterli mi?

Sinema API’sinden sayfa yükleyen kodda sadece `fetch` çağrıldı mı diye bakmak zayıf bir beklentidir. Çağrı yapılabilir ama yanlış sayfa istenebilir. Burada önemli olan dışarı gönderilen isteğin sayfa değeridir.

```ts check
import { expect, it } from 'vitest'

function searchUrl(page: number): string {
  const url = new URL('https://sinema.test/search/movie')
  url.searchParams.set('page', String(page))
  return url.toString()
}

it('üçüncü sayfa için page=3 taşır', () => {
  const request = new URL(searchUrl(3))
  expect(request.searchParams.get('page')).toBe('3')
})
```

Fonksiyonun dönmesi tek başına yeterli bilgi değil; URL içindeki doğru parametreyi ölçtük. Ham URL string’ini bütünüyle karşılaştırmak da gereksiz olabilir: query parametreleri farklı sırada yazılsa bile `page=3` aynı anlama gelir. URL’yi ayrıştırıp anlamlı alanı kontrol etmek, biçim farklarını bug sanmaz.

## Dışarıdan görünen başka bir sonuç

Sinema’da seçilen sekmenin değeri de davranış sözleşmesi olabilir. Aşağıdaki yardımcı URL’deki seçimi başlığa çeviriyor. Test, içeride hangi değişkeni tuttuğunu değil, seçimin doğru başlığa dönüştüğünü sınar.

```ts check
import { expect, it } from 'vitest'

function tabHeading(tab: string): string {
  return tab === 'saved' ? 'Kayıtlılar' : 'Popüler'
}

it('saved sekmesini Kayıtlılar diye adlandırır', () => {
  expect(tabHeading('saved')).toBe('Kayıtlılar')
})
```

Burada `saved` seçiminin “Kayıtlılar” sonucuna dönüşmesi kullanıcının göreceği farktır. Bir entegrasyon testi, yani birkaç gerçek parçayı birlikte çalıştıran test, bu seçimin ekranda doğru listeyi açtığını da kontrol edebilir. Küçük bir fonksiyon testi tek başına bütün ekranın bağlı olduğunu kanıtlamaz; her test yalnızca çalıştırdığı akış hakkında kanıt verir.

## Assertion’ı gereksinime bağla

Bir **uygulama ayrıntısı**, dışarıdan gözlenmesi gerekmeyen iç seçimdir: geçici değişken adı, yardımcı çağrısı ya da URL metnindeki parametre sırası gibi. Ama bazı ayrıntılar dış sözleşmenin parçası olabilir. API client’ın gönderdiği `Authorization` başlığı sunucunun beklediği protokolün parçasıysa, onu test etmek anlamlıdır.

Kendine şu soruyu sor: “Bu test geçerken hangi gerçek hata hâlâ oluşabilir?” Yalnızca “fonksiyon çağrıldı” diye doğruluyorsan, yanlış sayfa numarası veya yanlış sekme bu testten kaçabilir. Beklentiyi hatanın görülebileceği sonuca daralt: URL parametresi, gösterilen başlık veya saklanan anahtar gibi.

:::mistake[Sadece çağrı sayısını kontrol etmek]
Belirti: Test yeşildir ama kullanıcı yanlış sayfayı görür. → Neden: Fonksiyonun çalıştığı doğrulanmış, taşıdığı değer doğrulanmamıştır. → Düzeltme: URL içinden `page` değerini oku ve beklenen sayıyla karşılaştır.
:::

:::mistake[Her iç ayrıntıyı yasak saymak]
Belirti: Gerekli bir başlık kaybolur ama testler geçer. → Neden: Protokol gereksinimi sıradan iç yapı sanılmıştır. → Düzeltme: Çağıran veya servis için kararlı olan dış sınır değerlerini açıkça doğrula.
:::

:::info[Test katmanları]
Bir **unit test**, küçük bir fonksiyonun davranışını tek başına ölçer; bir **integration test** birkaç gerçek parçanın birlikte çalışmasını ölçer. Bunlar testin kapsamını anlatır: hangisini seçersen seç, assertion’ı o testin gerçekten çalıştırdığı akışa göre kur.
:::

## Özet

- Testin merkezine çağıranın gördüğü davranış sözleşmesini koy.
- `page=2` gibi anlamlı değeri ölç; onu üreten iç yöntemi gereksiz yere sabitleme.
- Bir çağrının yapılması, çağrının doğru argüman taşıdığını kanıtlamaz.
- Protokol başlığı gibi dış gereksinimler de davranış sözleşmesinin parçası olabilir.
- Her test yalnızca gerçekten çalıştırdığı akış hakkında kanıt verir.

**Yeni terimler:**

- **Davranış sözleşmesi:** Kodun çağırana veya kullanıcıya sunması gereken gözlenebilir sonuç.
- **Refactor:** Dış davranışı koruyup kodun iç yapısını değiştirme.
- **Uygulama ayrıntısı:** Gereksinim olmadıkça dışarıdan gözlenmesi gerekmeyen iç seçim.
- **Unit test:** Küçük bir parçanın davranışını tek başına sınayan test.
- **Integration test:** Birkaç gerçek parçanın birlikte çalışmasını sınayan test.

**Kendini yokla:** `fetch` çağrıldıysa ikinci sayfanın doğru istendiği kesin midir? Hayır; URL içindeki `page` değerini de doğrulamak gerekir.

**Kendini yokla:** `URLSearchParams` tam bir kez oluşturulmalı diye test etmek neden kırılgan olabilir? Aynı doğru adres başka bir yöntemle üretilebilir.
