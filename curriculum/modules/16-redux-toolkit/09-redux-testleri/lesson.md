---
title: "Reducer ve UI bağlantısını sınamak"
minutes: 7
kind: practice
---

# Reducer ve UI bağlantısını sınamak

Bir Redux testi yazarken önce şu soruyu seç: state kuralını mı, yoksa kullanıcıdan ekrana uzanan bağlantıyı mı kanıtlıyorsun? Reducer testi ilkini; gerçek store ve React Testing Library (RTL) ile yazılan test ikincisini gösterir. Aynı testte her katmanı kurmak gerekmez.

Test yazarken bazen sana bilerek hatalı bir uygulama sürümü verilir. Bu sürüme `mutant` denir; yazdığın test doğru sürümde geçmeli, davranış bozulduğunda mutant’ta kalmalıdır.

:::model[Redux veri akışı]
Bileşen bir action dispatch eder; reducer yeni state üretir; selector gereken değeri bileşene verir. Reducer’ı tek başına çağırmak state geçişini, gerçek store’u Provider altında kullanmak bu geçişin arayüze ulaşmasını sınar.
:::

![Redux dispatch’ten UI seçimine uzanan akış](diagram:redux-veri-akisi)

## Önce state kuralını küçült

Bir watchlist’te aynı film ikinci kez eklenmemeli. Bunu görmek için React’e gerek yok; başlangıç state’ini ve action’ı verip çıkan state’i karşılaştırırsın.

```ts title="Saf state geçişi"
const previous = { ids: [8] }
const next = watchlistReducer(previous, addMovie(15))

expect(next.ids).toEqual([8, 15])
expect(previous.ids).toEqual([8])
```

Reducer doğrudan çalıştı ve yeni listeyi verdi. İkinci beklenti, eski state’in de değişmeden kaldığını gösterir; böylece test yalnızca doğru sonucu değil, immutable güncellemeyi de korur.

## Sonra kullanıcı bağlantısını sınamaya geç

Bir başlık sayacı, store’daki kayıt sayısını gösteriyor olsun. Burada asıl soru butona basınca gerçek action’ın store’a ulaşıp başlığı güncelleyip güncellemediğidir.

```tsx title="Gerçek bağlantı için test akışı"
const store = setupStore({ watchlist: { ids: [] } })
render(<Provider store={store}><WatchlistCount /></Provider>)

await user.click(screen.getByRole('button', { name: 'Listeye ekle' }))
expect(screen.getByText('1 film')).toBeInTheDocument()
```

Bu testte bileşen gerçek Provider’a ve yeni store’a bağlı. Tıklama dispatch’e, dispatch reducer’a, yeni state selector’a gider; ekrandaki metin kullanıcıya ulaşan sonucu doğrular.

## Bir başlangıç durumu daha ekle

Aynı bağlantıyı dolu bir store ile açınca sayaç ilk render’da da doğru olmalı. Buna başlangıç state’i test vererek bakabilirsin.

```tsx title="Başlangıç görünümünü ayrıca kontrol et"
const store = setupStore({ watchlist: { ids: [8, 15] } })
render(<Provider store={store}><WatchlistCount /></Provider>)

expect(screen.getByText('2 film')).toBeInTheDocument()
```

`setupStore` test için yeni store kurar; `preloadedState`, store oluşturulurken verilen başlangıç state’inin adıdır. Bu sayede testi action sırasına bağımlı kılmadan belirli bir görünümden başlatırsın.

## Bir etkileşimi adım adım izle

Entegrasyon testindeki sıra önemlidir: önce başlangıç görünümü, sonra kullanıcı eylemi, en son gözlenebilir sonuç. Testi bu sırayla kurduğunda hangi davranışın bozulduğunu daha rahat anlarsın.

| Adım | Ne çalışır? | Ne görürsün? |
| --- | --- | --- |
| 1 | `setupStore` boş başlangıç state’i kurar | Store’da kayıt yoktur |
| 2 | RTL bileşeni `<Provider>` altında render eder | Sayaç `0 film` gösterir |
| 3 | Kullanıcı düğmeye basar | Gerçek action dispatch edilir |
| 4 | Reducer state’i günceller, selector yeni değeri okur | Sayaç `1 film` olur |

## Gerçekçi bir test hatasını düzelt

Bazen test, selector hook’unu mock’layıp ekranda `1 film` gösterir. Sonra tıklama hiçbir şeyi değiştirmez. Belirti şudur: ilk görüntü doğru görünür ama Redux bağlantısındaki hata saklı kalır. Nedeni, mock’un gerçek store, reducer ve dispatch yolunu devreden çıkarmasıdır; bağlantıyı sınayacağın testte gerçek Provider ve yeni store kullan.

`singleton`, uygulama boyunca paylaşılan tek bir nesnedir. Her test aynı store singleton’ını kullanırsa bir testin eklediği film ötekine sızabilir; `setupStore()` çağrısını her testte yeniden yapmak bu karışmayı önler.

:::tip[Test türünü seç]
State geçişini sınamak için reducer’ı doğrudan çağır. Kullanıcının tıklamasıyla görünen sonucun değiştiğini sınamak için gerçek store, Provider ve erişilebilir adı olan bir düğme kullan. UI testinde rol ve görünen metin, test ID’sinden daha iyi bir kullanıcı davranışı tarif eder.
:::

:::info[Derinlemesine (isteğe bağlı)]
Çok sayıda test aynı başlangıç biçimini kullanıyorsa küçük bir `renderWithProviders` yardımcısı tekrarları azaltabilir. Yardımcı, her çağrıda yeni store üretmeli; paylaşılan singleton store’u gizlice kullanmamalıdır.
:::

## Özet

- Reducer testi state kuralını ve eski state’in korunmasını ölçer.
- Gerçek UI bağlantısı için Provider altında yeni store kullan.
- Etkileşimi başlangıç görünümü → kullanıcı eylemi → görünür sonuç sırasıyla izle.
- Selector hook’unu mock’lamak Redux bağlantısını sınamaz.

**Yeni terimler:**
- `preloadedState`: Store kurulurken verilen başlangıç state’i.
- `singleton`: Uygulama boyunca paylaşılan tek bir nesne.
- `Provider`: React ağacına store’u sunan bileşen.
- `mutant`: Beklenen davranışı bozacak şekilde değiştirilmiş uygulama sürümü.

**Kendini yokla:** Reducer testi için Provider gerekir mi?  
*Cevap:* Hayır; reducer doğrudan çağrılarak state geçişi sınanabilir.

**Kendini yokla:** Tıklamanın ekrandaki sayacı değiştirdiğini hangi test gösterir?  
*Cevap:* Gerçek store’u Provider’a verip kullanıcı etkileşimi sonrası görünen metni kontrol eden RTL testi.
