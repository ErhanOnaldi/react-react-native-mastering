Bir kayıt düğmesi store’daki seçime göre etiketini göstermeli ve tıklanınca seçimi değiştirmeli.

## Gereksinimler

- Başlangıçta kimlik seçiliyse düğme `Favoriden çıkar`, değilse `Favorilere ekle` adını taşır.
- Tıklama gerçek store state’ini değiştirir ve düğme etiketi güncellenir.
- Diğer bir görünüm tercihini izleyen tüketicinin render sayacı, yalnızca kayıt seçimi değiştiğinde artmaz.

## Örnek

Boş seçimle düğme `Favorilere ekle` görünür. Tıklama sonrası store’da `550` bulunur ve düğme `Favoriden çıkar` olur. Tema render sayacındaki tıklama öncesi/sonrası farkı `0` kalır.

## Sözleşme

- Dosya ve export: `FavoriteButton.tsx` → `FavoriteButton({ id }: { id: number })`
- Bileşen Provider altındaki store’u kullanır.
- Düğme metni erişilebilir adı olarak kullanılır; önizlemede `ThemeProbe` sayacı gösterilir.

## Kısıtlar

- Render sayacının mutlak başlangıç değerini sabitleme; yalnızca etkileşim öncesi ve sonrası farkı karşılaştır.
