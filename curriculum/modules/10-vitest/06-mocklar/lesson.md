---
title: "Dış bağımlılığı kontrollü kıl"
minutes: 17
kind: concept
---

# Dış bağımlılığı kontrollü kıl

Bir Sinema yardımcı fonksiyonu tür adlarını film API’sinden alıyor diyelim. Gerçek servise her testte bağlanırsan internet bağlantısı, token ve sunucudaki değişen veriler de sonucu etkiler. Testin yalnızca kendi kontrolündeki koşullarda çalışmasına **deterministic** deriz: aynı kurulumda aynı sonucu verir. Ağ gibi kontrol etmediğin bir bağımlılık varsa, onu testin sınırında geçici olarak değiştirebilirsin.

## Önce küçük bir sahte fonksiyon

Testte gerçek olmayan, ama senin seçtiğin cevabı veren bir nesneye **test double** denir. Günlük dilde buna **mock** da deriz. Böyle bir sahte fonksiyona **fake** denir; Vitest’in `vi.fn` aracı fake üretir, cevabını belirlemene ve hangi argümanlarla çağrıldığını incelemene izin verir.

```ts check
import { expect, it, vi } from 'vitest'

it('seçtiğim tür adını verir ve çağrıyı kaydeder', () => {
  const getGenre = vi.fn((id: number) => `Tür ${id}`)

  expect(getGenre(28)).toBe('Tür 28')
  expect(getGenre).toHaveBeenCalledWith(28)
})
```

Burada `getGenre` gerçek API’ye gitmez; cevabını test belirlemiştir. Bu örnek, test kodunun çalıştığını gösterir ama gerçek client’ın URL hazırlamasını sınamaz. Gerçek client’ı koruyup onun kullandığı dış bağımlılığı değiştirmek daha fazla gerçek kodu testte tutar.

## Client gerçek, ağ sahte

İkinci adımda Sinema’nın tür listesini yükleyen client’ı gerçek bırakıp yalnız `fetch`i değiştiriyoruz. `fetch`, tarayıcı veya çalışma ortamının HTTP isteği gönderme fonksiyonudur. `vi.stubGlobal`, çalışma ortamındaki global değeri geçici olarak sahte bir değerle değiştirir.

```ts check
import { afterEach, expect, it, vi } from 'vitest'

async function loadGenreNames(): Promise<string[]> {
  const response = await fetch('https://sinema.test/genres')
  const data = (await response.json()) as { names: string[] }
  return data.names
}

afterEach(() => vi.unstubAllGlobals())

it('tür adlarını kontrollü cevaptan okur', async () => {
  const fakeFetch = vi.fn<typeof fetch>().mockResolvedValue(
    Response.json({ names: ['Bilim Kurgu'] }),
  )
  vi.stubGlobal('fetch', fakeFetch)

  const names = await loadGenreNames()

  expect(fakeFetch).toHaveBeenCalledTimes(1)
  expect(String(fakeFetch.mock.calls[0][0])).toBe('https://sinema.test/genres')
  expect(names).toEqual(['Bilim Kurgu'])
})
```

Önce `loadGenreNames` gerçek biçimde URL’yi kurup `fetch` çağırır. Yerine koyduğumuz `fakeFetch` isteği kaydeder ve belirlediğimiz yanıtı döndürür; böylece hem istek adresini hem de client’ın sonucu işlemesini ölçeriz. Test bitince `vi.unstubAllGlobals()` ortamın eski global değerlerini geri koyar, böylece sonraki test sahte fetch’i devralmaz.

![Client gerçek kalır, yalnız fetch sınırı kontrollü fake ile değiştirilir](diagrams/mock-siniri.svg "Test client'ın gerçek URL ve yanıt işleme davranışını korur.")

Akışı sırayla okuyalım:

| Adım | Client’ın yaptığı | Testin kontrol ettiği |
| --- | --- | --- |
| 1 | Tür listesi adresini hazırlar | Fake henüz çağrılmamıştır |
| 2 | `fetch`i çağırır | Çağrı sayısı ve adres kaydedilir |
| 3 | Yanıtı okur | Fake, önceden belirlenen JSON’u verir |
| 4 | İsimleri döndürür | Sonuçtaki dizi karşılaştırılır |
| 5 | Test biter | Global `fetch` geri yüklenir |

Test edilen fonksiyonun yerine fake koymadık; sadece ağ sınırını kontrol ettik. Client içindeki URL kurma veya JSON okuma kodunu tümden değiştirirsen bu davranışları sınayamazsın.

## Gerçek davranışı izle: spy

Bazen bağımlılığı değiştirmek istemezsin. Browser storage gibi gerçek ve hızlı bir davranışı çalıştırıp hangi verinin yazıldığını gözlemek yeterlidir. Var olan metoda gözlem ekleyen araca **spy** denir. `vi.spyOn` varsayılan olarak metodu çalışır bırakır; çağrılarını da kaydeder.

```ts check
import { afterEach, expect, it, vi } from 'vitest'

function saveGenreFilter(name: string): void {
  localStorage.setItem('genreFilter', name)
}

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

it('seçilen türü gerçek storage’a kaydeder', () => {
  const setItem = vi.spyOn(Storage.prototype, 'setItem')

  saveGenreFilter('Bilim Kurgu')

  expect(setItem).toHaveBeenCalledWith('genreFilter', 'Bilim Kurgu')
  expect(localStorage.getItem('genreFilter')).toBe('Bilim Kurgu')
})
```

Spy çağrının anahtarını ve değerini gösterir; ardından `localStorage` içeriğini okuyarak gerçek yazımın da olduğunu doğrularız. Yalnızca “metot çağrıldı” deseydik yanlış anahtarı veya yanlış metni kaçırırdık. `vi.restoreAllMocks()` spy’ı eski metoda döndürür; storage içeriğini temizlemek ise testler arasındaki veriyi kaldırır.

## Neyi sahteleştireceğini seç

Üç örnekte üç farklı ihtiyaç vardı: yeni fonksiyon yaratmak için `vi.fn`, global dış bağımlılığı değiştirmek için `vi.stubGlobal`, gerçek metodu çalıştırırken izlemek için `vi.spyOn`. Sahte cevabı ve gözlenen argümanları test belirlediği için testler gerçek internete veya değişken sunucu verisine bağlı kalmaz.

**Sadece çağrı sayısına güvenme.** Bir istek atılmış olsa da query parametresi veya yetki başlığı yanlış olabilir. URL’yi `new URL(...)` ile ayrıştırıp anlamlı query değerini oku; başlığı `new Headers(...)` ile okuyup değerini karşılaştır. Böylece URL’deki parametre sırasına ya da başlığın büyük-küçük harf yazımına bağlanmazsın.

**Sahteyi fazla geniş tutma.** Tüm API client modülünü baştan sona taklit edersen URL hazırlama ve yanıt işleme kodu artık çalışmaz. Ağ isteği gibi değişken sınırı değiştir, test etmek istediğin gerçek client’ı bırak.

:::mistake[Gerçek ağa çıkmak]
Belirti: Aynı test bir gün geçer, başka gün bağlantı ya da servis hatasıyla kalır. → Neden: Test sonucu kendi kontrol etmediği ağa bağlıdır. → Düzeltme: Client’ın kullandığı `fetch` sınırına seçtiğin cevabı veren bir fake koy.
:::

:::mistake[Yalnız çağrının yapıldığını ölçmek]
Belirti: İstek sayısı doğru ama yanlış sayfa veya başlık gidiyor. → Neden: Çağrı kaydedilmiş, argümanları incelenmemiştir. → Düzeltme: URL ve headers içinden sözleşme değerlerini oku.
:::

:::mistake[Globali veya spy’ı geri almamak]
Belirti: Test tek başına geçer, ama tüm dosya birlikte çalışınca sıra etkisi görülür. → Neden: Bir testin değiştirdiği global ya da metot sonraki teste sızmıştır. → Düzeltme: Stub’ları `vi.unstubAllGlobals()`, spy’ları `vi.restoreAllMocks()` ile temizle.
:::

Yanıtı da gerçekçi seç. Kod JSON okuyorsa `Response.json(...)` ile bir Response ver; client status kodunu inceliyorsa testin kurduğu cevapta gereken status bulunsun. Yanlış biçimli sahte cevap, uygulamanın sınamak istediğin koduna hiç ulaşmadan testi bozabilir.

Başarı ve hata davranışları farklı kararlardır. Başarı testi URL’yi, başlığı ve dönen veriyi; hata testi ise örneğin HTTP status’unun nasıl yorumlandığını ölçebilir. Ayrı başlıklar, hangi davranışın bozulduğunu anlamayı kolaylaştırır.

:::info[Derinlemesine (isteğe bağlı)]
`vi.mock` tüm bir modülün yerine geçebilir; sınır geniş olduğundan ancak modülün tamamı dış bağımlılıksa ve daha dar bir seçenek yoksa düşün. `vi.clearAllMocks()` çağrı geçmişini temizler, `vi.restoreAllMocks()` spy’ları eski metotlarına döndürür; bunlar aynı işlem değildir.
:::

## Özet

- Mock, kontrol etmediğin bağımlılığa testin belirlediği cevap verir.
- `vi.fn` yeni sahte fonksiyon kurar; `vi.stubGlobal` global değeri değiştirir.
- `vi.spyOn` gerçek metodu çalışır bırakıp çağrıları kaydeder.
- Test edilen gerçek client’ı tut, yalnızca ağ gibi kontrol dışı sınırı değiştir.
- Değiştirdiğin global ve metotları her testten sonra geri yükle.

**Yeni terimler:**

- **Deterministic:** Aynı kurulumda her çalıştırmada aynı sonucu veren.
- **Test double / mock:** Gerçek bağımlılığın yerine testin kontrol ettiği davranışı veren nesne veya fonksiyon.
- **Fake:** Testte önceden belirlenmiş sonucu döndüren sahte bağımlılık.
- **Spy:** Var olan metodu çalıştırıp çağrılarını gözlemleyen sarmalayıcı.
- **Global stub:** `fetch` gibi çalışma ortamı genelindeki değerin test boyunca değiştirilmesi.

**Kendini yokla:** Client’ın URL kurmasını da sınamak istiyorsan tüm client’ı mı, `fetch`i mi değiştirirsin? `fetch`i değiştiririm; client’ın URL kurma kodu gerçek çalışmalı.

**Kendini yokla:** `vi.spyOn` metodu varsayılan olarak durdurur mu? Hayır; çağrıyı kaydederken gerçek metodu çalışır bırakır.
