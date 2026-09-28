---
title: "UI ile davranışın sınırını çiz"
minutes: 17
kind: concept
---

# UI ile davranışın sınırını çiz

:::pain[Problem]
Bir hava durumu sayfası metin kutusunu, istek URL'sini, yükleniyor durumunu, hata mesajını, Celsius dönüşümünü ve bütün JSX'i tek dosyada yönetiyor. Yeni bir şehir seçme paneli ekleyince istek kodunu kopyalıyorsun; Celsius/Fahrenheit anahtarı da üç ayrı yerde güncelleniyor.
:::

## Görünür durum ile tekrar eden davranışı ayır

Bileşen kullanıcının göreceği yapıyı ve erişilebilir etkileşimleri sunar. Hook birden fazla görünümün kullanabileceği state geçişini veya yaşam döngüsü davranışını paketler. Saf yardımcı ise girdiden çıktıya çevrim yapar; React state'i veya JSX'i yoktur. Her satırı ayrı dosyaya bölmek hedef değildir. Sınır, değişiklik nedeni ve tekrar kullanımını kolaylaştırmalı.

![Sayfanın hook, saf dönüşüm ve UI bileşeniyle ilişkisini gösteren akış](diagrams/ui-mantik-siniri.svg "Veri yükleme ve çizim ayrı sorumluluklardır.")

:::model[State kategorileri]
Bir değeri taşımadan önce sahibini belirle: servis cevabı server state, paylaşılabilir seçimi URL state, kullanıcının yerel tercihi client state, gönderilmemiş alan form state'tir. Aynı değeri iki yerde tutuyorsan eşitleme kuralını açık yaz. Burada yeni olan, sahiplik kararını dosya sınırına da uygulamak: istek davranışı bir hook'ta, kullanıcıya sunulan durumlar bileşende görünür.

![Server, client, URL ve form state'in sahibini gösteren karar haritası](diagram:state-kategorileri)
:::

Bu ayrım için kurallar:

1. **Hook'a davranış taşı; bütün JSX'i saklama.** Hook veri yükleme, abonelik, loading/success/error geçişi veya ortak event davranışı sunabilir. Butonların sırası, başlık ve boş mesaj gibi görünür seçimler UI katmanında kalsın.
2. **Component'e görünür durum sözleşmesi ver.** Bileşen yükleme, hata, boş başarı ve dolu başarı hallerinde ne gösterdiğini açıkça ele alsın. `error` ile `[]` aynı sonuç değildir.
3. **Saf dönüşümü state yapma.** `items.length`, toplam oy ortalaması veya seçili verinin etiketi doğrudan props'tan hesaplanabiliyorsa yeni state ve effect kurma. Kopya değerlerin senkronizasyon hatası çıkarır.
4. **Dış sistem etkisinin yaşam döngüsünü sahibi yönetsin.** İstek veya event listener hook içindeyse cleanup/iptal davranışı da aynı sınırda olmalı. Bileşen yalnız sonucu kullanır.
5. **Parametre değişimini davranış sözleşmesine dahil et.** Hook `cityId` ile çalışıyorsa id değişince yeni veri yüklenmesi ve önceki sonucun geç gelmesine karşı ne yapılacağı belirli olmalı.

## Şehir seçimini adım adım izle

Kullanıcı Oslo yerine Ankara'yı seçtiğinde şöyle bir sıra beklenir:

| Zaman | Davranış | Hook state'i | UI sonucu |
| --- | --- | --- | --- |
| `cityId = oslo` | İlk istek başlar | `{status: 'loading'}` | Bekleme metni |
| Cevap gelir | Oslo verisi kabul edilir | `{status: 'success', forecast}` | Sıcaklık ve şehir adı |
| Kullanıcı Ankara seçer | Eski istek temizlenir, yeni istek başlar | `{status: 'loading'}` | Ankara yükleniyor |
| Ankara cevabı gelir | Yeni veri kabul edilir | `{status: 'success', forecast}` | Ankara değerleri |
| Eski Oslo cevabı gecikir | Artık aktif olmayan cevap yok sayılır | Ankara success korunur | Oslo, Ankara'nın üstüne yazmaz |

Bu sıralamada URL'den gelen şehir seçimi URL state olabilir; dış servis cevabı server state'tir. Hook bu ikisini karıştırıp URL'yi kendi içinde icat etmemeli. Sayfa `cityId` değerini sahibinden alır ve yükleme davranışına verir.

Görünümün beklediği veri şekli açık bir discriminated union olabilir:

```ts check
type Forecast = { city: string; temperature: number }
type LoadState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T }

export function summary(state: LoadState<Forecast>): string {
  if (state.status === 'loading') return 'Yükleniyor'
  if (state.status === 'error') return `Hata: ${state.message}`
  return `${state.data.city}: ${state.data.temperature}°`
}
```

Union'da her varyantın gereken alanı bulunur. `status === 'success'` kontrolünden sonra TypeScript `data` bulunduğunu bilir. UI bunu paragraph, alert veya listeye çevirir. Bileşen dışında bu union bir sözleşmedir; React'a bağlı değildir ve unit test edilebilir.

## Önce kırık, sonra sorumlulukları ayır

Aşağıdaki bileşende türetilmiş sıcaklık değeri ayrı state'e yazıldığı için kaynak değer değişince bir render boyunca eski sonuç gösterebilir. Ayrıca endpoint davranışı JSX'in yanında durur:

```tsx
function WeatherCard({ temperature }: { temperature: number }) {
  const [fahrenheit, setFahrenheit] = useState(temperature * 9 / 5 + 32)
  return <p>{fahrenheit}°F</p>
}
```

Türetilmiş sonucu render sırasında hesapla; veri yükleme gibi tekrarlanan davranışı hook'a koy, JSX'i component'te bırak:

```tsx check
import { useEffect, useState } from 'react'

type Weather = { city: string; celsius: number }
type WeatherState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; weather: Weather }

export function fahrenheit(celsius: number): number {
  return Math.round(celsius * 9 / 5 + 32)
}

export function useWeather(
  city: string,
  load: (city: string, signal: AbortSignal) => Promise<Weather>,
): WeatherState {
  const [state, setState] = useState<WeatherState>({ status: 'loading' })
  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading' })
    load(city, controller.signal).then(
      (weather) => {
        if (!controller.signal.aborted) setState({ status: 'success', weather })
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ status: 'error', message: error instanceof Error ? error.message : 'İstek başarısız' })
        }
      },
    )
    return () => controller.abort()
  }, [city, load])
  return state
}
```

`load` fonksiyonu component içinde her render'da yeni kimlikle üretilirse dependency değişimi yeni istek başlatabilir; loader'ı kararlı tut veya ağ katmanından dışarı ver. Abort sinyali loader tarafından desteklenmeli; desteklenmiyorsa cleanup içinde aktif istek kimliğini takip edip geç kalan sonucu yok say. Gerçek kütüphane (örneğin Query) istek/cache yaşam döngüsünü daha kapsamlı yönetebilir; burada önemli olan davranışın görünümden ayrılmasıdır.

Örnek kısaltılmış state başlangıcı ilk render'da `loading` gösterir. Effect commit sonrası çalışır, controller yaratır ve loader'ı çağırır. Promise başarılıysa ve signal iptal edilmediyse success'e geçer. City prop'u değiştiğinde önce cleanup eski controller'ı iptal eder, sonra effect yeni city ile kurulur. Eski istek sinyale uymasa bile abort sonrası `signal.aborted` kontrolü state yazımını durdurur. Böylece veri geç gelse de yanlış şehir başlığıyla gösterilmez.

Bir davranışın hook'a taşınması, mutlaka yeniden kullanılacağı anlamına gelmez. İsimli bir hook sınırının faydası, çağıranın gözünden ayrı yaşam döngüsünü saklaması veya birden fazla kullanımın aynı davranış kuralını paylaşmasıdır. Tek satırlı dönüşümü sadece test edilebilir olsun diye React hook'una çevirmek gereksiz olabilir; saf fonksiyon daha basit birimdir. Hook kullanan kodu iki dosyaya ayırmak kendi başına kalite hedefi değildir.

UI tarafında da veri durumunu kullanıcı eylemiyle karıştırma. “Yeniden dene” düğmesi etkileşimdir ve bir event handler ile isteği tekrar başlatabilir. Bunun render sırasında request başlatan component gövdesine yazılması her render'da yeni istek doğurur. Benzer biçimde render'da filtreleme, sıralama veya etiket üretme saf hesap olarak kalabilir; dış sistemle senkronizasyon gerekmiyorsa effect'e taşınmaz.

Bir hook'un döndürdüğü state şekli component'in neyi göstereceğini kararlaştırmasını sağlar, ama tasarımı tek bir JSX şablonuna zorlamaz. Aynı success cevabı bir sayfada tablo, başka yerde kart olabilir. Bu nedenle data state'in içinde DOM node ya da stil class'ı taşımak yerine alanları ve durumu sun. Presentation component'leri semantic HTML ve accessible name gibi kullanıcıya dönük sözleşmeleri korur.

## Sınır durumları ve sık hatalar

:::mistake[Belirti: şehir değişince başlık değişiyor ama değer eski]
**Belirti →** Ankara başlığı altında Oslo sıcaklığı görünüyor. **Neden →** Önceki istek geç tamamlandı ve yeni state'i ezdi. **Düzeltme →** Cleanup'ta isteği abort et veya aktif isteğin cevabını yok say; id değişiminde loading durumunu da tanımla.
:::

:::mistake[Belirti: başarı cevabında boş liste, yükleniyor olarak kalıyor]
**Belirti →** Servis boş sonuç döndürdü ama spinner kaybolmuyor. **Neden →** Başarı yalnız `data.length > 0` koşulunda işaretlenmiş. **Düzeltme →** İstek sonucu boş olsa bile `success` durumudur; boş görünüm component'te ayrı dal olmalı.
:::

:::mistake[Belirti: item sayısı bazen listeyle uyuşmuyor]
**Belirti →** Filtre sonrası liste üç öğe ama yanındaki sayaç dört. **Neden →** Sayaç ve liste ayrı state olarak tutulmuş. **Düzeltme →** İkisini aynı source list'ten render sırasında türet.
:::

:::mistake[Belirti: hook dosyası bütün sayfanın JSX'ini döndürüyor]
**Belirti →** Aynı veri davranışını başka bir kart görünümünde kullanmak için hook'u değiştirmek gerekiyor. **Neden →** Davranış ile presentation tek sorumluluğa sıkıştırılmış. **Düzeltme →** Hook değer ve durum sözleşmesi döndürsün; component bunları markup'a dönüştürsün.
:::

:::sector
Ürün ekipleri veri yükleme ve retry politikasını UI'dan ayrı tutarak aynı kaynak durumunu farklı sayfalarda kullanabilir. UI sözleşmesi loading/error/empty/success hallerini erişilebilir metinlerle gösterir. Sonradan server cache kütüphanesine geçerken component'in göreceği union değişmezse görünüm kodu büyük ölçüde yerinde kalır.
:::

## Özet

- Hook tekrar kullanılan state ve etki davranışını paketler; JSX zorunlu değildir.
- Component açık durum sözleşmesini kullanıcıya görünür hale getirir.
- Türetilmiş veriyi ikinci state olarak saklama.
- Parametre değişiminde loading, cleanup ve geç cevap politikasını kur.
- Boş başarı ile hata farklı kullanıcı durumlarıdır.

**Kendini yokla:** `items.length` için ayrı state tutmanın riski nedir?  
*Cevap:* Liste değişirken sayaç senkron kalmayabilir; sayıyı listeden render sırasında türet.

**Kendini yokla:** Eski istek yeni ekranın üstüne yazmasın diye hangi iki yaklaşım kullanılabilir?  
*Cevap:* İsteği AbortController ile iptal etmek veya aktif olmayan cevabın state güncellemesini yok saymak.
