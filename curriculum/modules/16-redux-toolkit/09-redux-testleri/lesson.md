---
title: "Reducer ve UI bağlantısını sınamak"
minutes: 7
kind: practice
---

# Reducer ve UI bağlantısını sınamak

:::pain[Sinema’da sorun]
Testte `useSelector` mock’ladın; buton etiketi doğru çıktı. Gerçek uygulamada tıklayınca store değişmedi, çünkü test Provider, action dispatch’i ve reducer bağlantısını hiç çalıştırmamıştı.
:::

:::model[Redux veri akışı]
Action reducer’dan geçip store’u günceller; selector yeni değeri bileşene taşır. Testte reducer’ı doğrudan çağırmak state kuralını, gerçek store ve Provider kullanmak ise React bağlantısını kanıtlar. Bu iki kanıt farklı sorulara yanıt verir.
:::

![Redux dispatch'ten UI seçimine uzanan akış](diagram:redux-veri-akisi)

## İki katmanda düşün

Reducer testinde başlangıç state’i ve action bellidir. Sonuçta yeni state’i kontrol et; eski state’in değişmediğini de doğrula. Bu, React render etmeden saf kuralı hızlıca sınar.

```ts title="Reducer geçişini doğrudan ölç"
const previous = { ids: [4, 7] }
const next = readingSlice.reducer(previous, readingSlice.actions.openArticle(12))
expect(next.ids).toEqual([12, 4, 7])
expect(previous.ids).toEqual([4, 7])
```

Bileşen entegrasyonunda yeni store kur, `<Provider store={store}>` altında render et, kullanıcı etkileşimi yap ve görünür sonucu sorgula. Testin önceden store’u değiştirdiğini görmek istiyorsan action’ı sen dispatch et; yoksa düğmeye tıklayıp gerçek zincirin çalıştığını kanıtla.

```tsx title="Kullanıcı davranışını gerçek store ile ölç"
const store = setupStore({ reading: { ids: [] } })
render(<Provider store={store}><ReadingCount /></Provider>)
await user.click(screen.getByRole('button', { name: 'Makaleyi sıraya ekle' }))
expect(screen.getByText('1 kayıt')).toBeInTheDocument()
expect(store.getState().reading.ids).toEqual([12])
```

### İz sürme

1. Her test için yeni store oluştur; singleton state önceki testten sızmasın.
2. Gerekiyorsa `preloadedState` ile başlangıç koşulunu açıkça ver.
3. Bileşeni Provider altına yerleştir; selector ve dispatch gerçek store’a bağlansın.
4. `userEvent` ile kullanıcı eylemini yap; test ID yerine rol ve erişilebilir adla kontrol et.
5. Kullanıcının göreceği metni doğrula. Store içini kontrol edeceksen bunu UI davranışını desteklemek için yap.

Bu modülden önceki RTL derslerinde `render`, `screen`, `userEvent` ve davranış odaklı sorguları gördün. Burada yeni bağlam Redux bağlantısıdır: hook’ları taklit etmek testin ölçmesi gereken Provider/store hattını kaldırır.

:::mistake[Belirti → UI testi action’ı görmüyor]
Belirti → Mock selector doğru değeri verir ama tıklama sonrası etiket değişmez.  
Neden → `dispatch` mock’u gerçek reducer’a bağlı değil.  
Düzeltme → Bileşeni gerçek, teste özel store ile Provider altında çalıştır.
:::

:::mistake[Belirti → Test sırası değişince sonuç bozuluyor]
Belirti → Bir test tek başına geçiyor, tüm dosyada kalıyor.  
Neden → Birden çok test aynı store singleton’ını kullanıyor.  
Düzeltme → Her test için `setupStore()` çağır; başlangıç state’ini açıkça kur.
:::

:::sector
Ekipler reducer kurallarını saf testlerle, kullanıcıya görünen kritik bağlantıları entegrasyon testleriyle sınar. Her action için ağır UI testi yazmak gerekmez; her component hook’unu mock’lamak da gerçek entegrasyon hatalarını kaçırır. Test katmanını kanıtlamak istediğin davranışa göre seç.
:::

## Özet

- Reducer testi geçiş kuralını ve eski state’in korunduğunu gösterir.
- UI testi gerçek store, Provider ve kullanıcı etkileşimi kullanır.
- Her testte yeni store kur; mock hook’lar Redux bağlantısını kanıtlamaz.
- RTL’de erişilebilir rol ve adla görünen davranışı ölç.

**Kendini yokla:** Reducer testi Provider gerektirir mi?  
*Cevap:* Hayır; reducer saf fonksiyon gibi doğrudan çağrılabilir.

**Kendini yokla:** Gerçek kullanıcı tıklamasının store’u güncellediğini nasıl kanıtlarsın?  
*Cevap:* Provider altında gerçek store kullanır, etkileşim yapar ve görünür sonucu doğrularsın.
