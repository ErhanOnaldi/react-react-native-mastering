---
title: "Her değişim effect istemez"
minutes: 15
kind: concept
---

# Her değişim effect istemez

Sinema'da puanı `8` olan bir filmi göstereceksek, yıldız sayısını puandan hesaplayabiliriz. Bir değeri başka elimizdeki değerlerden hesaplıyorsak, önce onu render sırasında üretmeyi düşünürüz.

## Elindeki değerden yeni bir değer çıkar

Şu küçük bileşen verilen puanı ekrana yazar:

```tsx check
export function RatingLabel({ rating }: { rating: number }) {
  const stars = '★'.repeat(rating)

  return <p>{stars} ({rating}/10)</p>
}
```

`stars`, `rating` değerinden hemen hesaplanır. Puan `8` ise aynı render'da sekiz yıldız görünür; yıldızları ikinci bir `state` içinde saklamaya gerek yoktur.

Burada `state`, React'in render'lar arasında sakladığı ve değişince ekranı yeniden hesapladığı bileşen verisidir. `props` ise üst bileşenin bu bileşene verdiği girdilerdir. İkisi de render sırasında okunabilir.

Şimdi puan etiketine filmin izlenip izlenmediği bilgisini de ekleyelim. Yeni fikir yalnızca bir koşuldur:

```tsx check
export function RatingLabel({ rating, watched }: { rating: number; watched: boolean }) {
  const stars = '★'.repeat(rating)
  const status = watched ? 'İzlendi' : 'İzleme listesinde'

  return <p>{stars} ({rating}/10) · {status}</p>
}
```

`status` da iki `props` değerinden türetilir. `watched` değişirse React bileşeni yeniden çalıştırır ve yeni durum metnini hesaplar; üçüncü bir state alanı bilgiyi kopyalamış olurdu.

### Aynı girdiden aynı görünüm

Bir fonksiyon, aynı girdiler verildiğinde aynı sonucu üretip dışarıda bir şeyi değiştirmiyorsa **saf** deriz. Bu kuralı render'daki hesaplamalara uygularız: `rating` ve `watched` aynı kaldıkça bileşen aynı metni üretir.

Sinema'nın film kadrosunda arama yapmak biraz daha gerçekçi bir örnek. Bir render sırasında listeyi süzüp ekranda gösterebiliriz:

```tsx check
export function CastPanel({ cast, search }: { cast: string[]; search: string }) {
  const query = search.trim().toLocaleLowerCase('tr')
  const visibleCast = cast.filter((name) =>
    name.toLocaleLowerCase('tr').includes(query),
  )

  return <ul>{visibleCast.map((name) => <li key={name}>{name}</li>)}</ul>
}
```

`visibleCast` her render'da `cast` ile `search` değerlerinden hesaplanır. Kullanıcı aramayı değiştirince yeni render doğrudan yeni eşleşmeleri gösterir; Türkçe küçük harfe çevirme de `I` ve `İ` harflerini doğru ele alır.

Önceki bir sürümde filtrelenmiş liste ayrı state'te tutuluyordu. `useEffect` ise React bileşeni dışındaki bir sistemle, örneğin ağ isteği veya tarayıcı API'siyle, eşzamanlama kuran Hook'tur. Filtreleme yalnızca elimizdeki iki değerin hesabı olduğu için burada effect gerekmez.

| An | `search` | Kopya `visibleCast` state'i | Ekran |
| --- | --- | --- | --- |
| İlk render | `""` | `Bale, Caine` | Bale, Caine |
| Aramaya `cai` yazılır | `"cai"` | hâlâ `Bale, Caine` | Bir render boyunca eski kadro |
| Effect state'i günceller | `"cai"` | güncelleme kuyruğunda | İkinci render planlanır |
| İkinci render | `"cai"` | `Caine` | Caine |

İlk render'da arama prop'u yenidir ama kopya state eskidir; effect çalıştıktan sonra ikinci render gerekir. Hesabı doğrudan render'da yapmak hem bu ara görüntüyü hem de fazladan güncellemeyi kaldırır.

:::mistake[Filtreyi effect ile kopyalamak]
**Belirti:** Arama kutusuna yeni harf yazınca eski film adları kısa süre daha görünür. **Neden:** Filtre sonucu ayrı state'te tutulur ve effect ancak ilk render'dan sonra o state'i günceller. **Düzeltme:** Filtreyi mevcut liste ve sorgudan render sırasında hesapla.
:::

## Kullanıcı eylemi başka, görünüm hesabı başka

Bir işlemin kullanıcı bir şey yaptığı için mi, yoksa ekranda bir durum bulunduğu için mi çalışması gerektiğini sor. Kullanıcı fragman düğmesine bastıysa oynatmayı o düğmenin event handler'ı başlatır. **Event handler**, tıklama veya form gönderme gibi kullanıcı olayına bağlanan fonksiyondur.

```tsx
function TrailerButton() {
  function handlePlay() {
    // Kullanıcı düğmeye bastığında fragmanı başlat.
  }

  return <button onClick={handlePlay}>Fragmanı oynat</button>
}
```

Burada düğme tıklaması zaten sebebi açıklar. Tıklamayı önce `state` içine yazıp ardından effect'in bu state'i görmesini beklemek işi dolambaçlı yapar; ayrıca tekrar çalışmaya yol açabilir. Buna karşılık URL değişince yeni film verisini istemek React dışındaki ağ sistemiyle eşzamanlama olduğundan effect için uygun bir iş olabilir.

## Yerel durumu film kimliğine bağla

Şimdi film ayrıntısında kullanıcının seçtiği oynatma kalitesini düşün. Bu seçimden başka bir değer hesaplanmıyor; kullanıcının yaptığı tercih olduğu için bileşenin yerel state'idir. Farklı filme geçince seçimin başa dönmesini istiyoruz.

```tsx check
import { useState } from 'react'

export function MoviePlayback({ movieId }: { movieId: number }) {
  return <PlaybackOptions key={movieId} />
}

function PlaybackOptions() {
  const [quality, setQuality] = useState('Otomatik')

  return (
    <label>
      Görüntü kalitesi
      <select value={quality} onChange={(event) => setQuality(event.target.value)}>
        <option>Otomatik</option>
        <option>Yüksek</option>
      </select>
    </label>
  )
}
```

`key` React'e bir bileşenin hangi örnek olduğunu ayırt etmeye yarayan kimlik bilgisidir. `movieId` değişince `PlaybackOptions` yeni kimlikle kurulur ve kalite seçimi ilk değeri olan `Otomatik` olur. Aynı film yeniden render edilirse key aynı kalır; kullanıcının seçimi korunur.

Bunu effect içinden `setQuality('Otomatik')` çağırarak yapsaydık, yeni filmin ilk render'ında eski seçim görünür; effect'ten sonra temizlenirdi. Kimlik değişimi ise bileşenin yerel state'ini yeni örnek için en baştan kurar.

:::mistake[Her film bilgisini state'e kopyalamak]
**Belirti:** Listeden silinen film hâlâ seçili ayrıntıda görünür. **Neden:** Seçili filmin tüm nesnesi ayrı state olarak tutulur ve listeyle eşzamanlı güncellenmez. **Düzeltme:** Seçili kimliği sakla; ayrıntıyı güncel film listesinden render sırasında bul.
:::

## Karar verirken soracağın soru

Örneklerden çıkan ayrım basittir: hesaplanan görünüm, kullanıcı tercihi ve dış sistemle eşzamanlama farklı işlerdir. Filtre gibi değerleri eldeki props/state'ten hesapla; kullanıcının değiştirdiği seçimleri state'te tut; ağ, timer veya tarayıcıyla eşzamanlamayı effect'e bırak. Effect'in görevi her değişikliği izlemek değildir.

`useMemo`, hesaplanan değeri render'lar arasında yeniden kullanmaya yarayan bir Hook'tur. Basit filtrelerde varsayılan olarak gerekmez; ölçülmüş bir performans sorunu varsa sonra değerlendirilir. Küçük bir dizi için erken eklemek yalnızca kodu karmaşıklaştırır.

## Özet

- Props ve state'ten hesaplanabilen görünür değerleri render sırasında üret; kopya state ve effect ekleme.
- Saf hesaplama aynı girdilerle aynı sonucu verir ve dışarıda değişiklik yapmaz.
- Kullanıcı olayını event handler'da, React dışındaki sistemle eşzamanlamayı effect'te ele al.
- Alt bileşenin yerel state'ini yeni öğede başlatmak için ona öğe kimliğinden gelen `key` ver.

**Yeni terimler:**

- **Saf fonksiyon:** Aynı girdilerden aynı sonucu üretir ve dış durumu değiştirmez.
- **Effect:** React bileşenini ağ veya tarayıcı gibi dış sistemlerle eşzamanlar.
- **Event handler:** Tıklama gibi kullanıcı olayına çalışan fonksiyon.
- **Key:** React'in listedeki veya ağaçtaki bileşen kimliğini ayırt etmesini sağlayan değer.
- **useMemo:** Hesaplanmış değeri yeniden kullanmaya yarayan, ölçümden sonra düşünülen Hook.

**Kendini yokla:** Arama sonucunu neden ayrı state'te tutmuyoruz?

*Cevap:* Çünkü sonuç mevcut listeyle sorgudan render sırasında hesaplanabilir; kopya state eski kalabilir ve ikinci güncelleme gerektirir.

**Kendini yokla:** Film değişince seçim sıfırlansın ama aynı film render edilince korunsun. Ne kullanırsın?

*Cevap:* Seçimi tutan alt bileşene `key={movieId}` veririm; aynı kimlik state'i korur, yeni kimlik yeni state başlatır.
