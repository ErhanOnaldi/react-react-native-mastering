---
title: "Neden React Testing Library?"
minutes: 7
kind: concept
---

# Neden React Testing Library?

:::pain[Problem]
Sinema testinde fetch mock sırası değişince yeşil test kırmızı oldu. Kullanıcı aynı butona basıp aynı filmi görüyor; test neden bozuldu?
:::

## Component'i kullanıcı yüzeyinden test et

Saf fonksiyon testinde girdi ve dönüş değeri yeterliydi. React component'inde kullanıcı DOM'daki kontrolü görür, ona tıklar ve ekrandaki sonucu okur. React Testing Library bu yüzeyi test etmeye yarar; component'in iç state'ini veya özel callback'lerini doğrudan kurcalamayı merkeze almaz. Böylece iç düzen değişse de kullanıcı davranışı korunur.

Sinema favori düğmesi yalnız `onClick` prop'u var diye çalışıyor sayılmaz. Vitest'te kurduğun beklenti düzeni burada render, erişilebilir sorgu ve kullanıcı etkileşimiyle birleşir. Sonraki MSW dersleri aynı testi ağlı ekranlara genişletecek.

## İhtiyaç ve çözüm

Vitest ile fonksiyonun dönüşünü sınadın. Bileşende DOM’a bakmak gerekir. RTL’nin `render` fonksiyonu bileşeni gerçek DOM’a yerleştirir; `screen` kullanıcının gördüğü öğeleri bulur. `getByRole`, butonun rolünü ve erişilebilir adını birlikte sınar.

`container.querySelector` ile CSS class aramak tasarıma bağlanır. Callback’i doğrudan çağırmak butonun çalıştığını göstermez. Butona basıp ekrandaki değişikliği gözle.

## Kırılan testin gösterdiği şey

Önceki modülde `vi.fn` ile `onToggle` çağrısını sınamak makuldü; saf fonksiyonun sınırı buydu. Bileşen sınırında kullanıcı callback’i göremez. Yalnızca butonun adını, tıklanıp tıklanmadığını ve sonuçta değişen ekranı görür. Disabled bir butonun callback’ini elle çağırırsan test yeşil kalır; kullanıcı ise favori ekleyemez.

```tsx title="FavoriteButton.test.tsx"
const user = userEvent.setup()
render(<FavoriteButton movieId={550} isFavorite={false} onToggle={onToggle} />)
await user.click(screen.getByRole('button', { name: 'Favorilere ekle' }))
expect(onToggle).toHaveBeenCalledWith(550)
```

Burada `render` React bileşenini jsdom’a yerleştirir. `screen` sayfanın tamamını arar. `getByRole('button', { name })` hem semantik buton olmasını hem erişilebilir adının doğru olmasını ister. `user.click` disabled durumda etki etmez. Testin görebildiği sınır hâlâ callback’tir; bu örnekte tıklamanın gözlenebilir sonucu onu çağırmaktır.

:::mistake
Bileşenin iç state’ini okumaya veya CSS class’ını sabitlemeye çalışma. Tasarım değişirken kullanıcı davranışı aynı kalabilir. Testi görünen davranışa bağla.
:::

:::sector[Sektörde]
Ekipte test adını kullanıcı eylemi ve sonucu olarak yaz: “favoriye basınca film id’si bildirilir”. Refactor sırasında hangi akışın kırıldığını hemen görürsün.
:::
