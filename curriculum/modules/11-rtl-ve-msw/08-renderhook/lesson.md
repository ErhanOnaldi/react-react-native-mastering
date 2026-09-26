---
title: "Hook davranışını renderHook ile sınamak"
minutes: 7
kind: concept
---

# Hook davranışını renderHook ile sınamak

:::pain[Problem]
Favoriye iki kez bastığında film listeden çıkmıyor. Hook’u normal fonksiyon gibi çağırıp test etmeye kalkınca Invalid hook call hatası alıyorsun.
:::

## Hook'un kendi sözleşmesini ölç

Hook'lar yalnız React render akışında çağrılabilir; normal fonksiyon gibi doğrudan çalıştırılamaz. `renderHook` küçük bir React ortamı kurup hook'un döndürdüğü değeri ve güncellemelerini gözlemletir. Hook'un bağımsız API'si önemliyse bu uygundur; kullanıcıya görünen sonuç önemliyse component testi daha güçlü olabilir.

Sinema favori hook'unun iki tıklama sonrası döndürdüğü id dizisi, kendi sözleşmesi olarak sınanabilir. Önceki userEvent dersinde ise favori düğmesinin gerçekten tıklanabilir olmasını ölçtün. Hangi sınırın hata yakalayacağını bilerek test düzeyini seç.

## İhtiyaç ve çözüm

`renderHook(() => useMovieTitle(id))` hook’u küçük bir React bileşeninde çalıştırır. `result.current` son değerdir. `rerender` yeni prop’la tekrar çalıştırır; dependency array hatası görünür.

State değiştiren callback’leri `act` içinde çağır. Hook’u yalnızca kendi API davranışı önemliyse ayrı sınarsın; sayfada görünürse bileşen testi daha güçlüdür.

## Hook’u hangi sınırda test edersin?

10. modülde `useDebounce` için `renderHook` gördün: fake timer ve cleanup hatasını yakalamıştın. Burada aynı araç yeni bir bağlamda, favori id listesinin immutable ekle/çıkar davranışını sınar.

```ts title="useFavoriteIds.test.ts"
const { result } = renderHook(() => useFavoriteIds())
expect(result.current.ids).toEqual([])
act(() => result.current.toggle(550))
expect(result.current.ids).toEqual([550])
act(() => result.current.toggle(550))
expect(result.current.ids).toEqual([])
```

`result.current` son render’ın değeridir. State değiştiren çağrı `act` içinde olursa React güncellemeyi assertion’dan önce tamamlar. Props’a bağlı hook’ta `rerender({ id: 603 })` ile yeni id verip dependency array’in davranışını kontrol edebilirsin. Normal fonksiyon çağrısı hook kurallarını ihlal eder; `renderHook` küçük bir React ortamı sağlar.

Hook’un tek başına API’si önemliyse bunu yap. Favori butonunun görünen etiketi önemliyse bileşeni `userEvent` ile sınamak daha doğrudan olur.

:::mistake
`result.current` değerini ilk render’da ayrı değişkene kopyalayıp sonra eski kopyayı okumak güncel state’i vermez. Her assertion’da `result.current` oku.
:::

:::sector[Sektörde]
Hook’un kendi API’si değişim noktasıysa renderHook uygundur; ekranda görünen davranış için bileşen testi daha güçlü bir sözleşmedir.
:::
