Film keşif ekranında görünüm seçince içerik kayboluyor; tür filtresine gidip dönünce kişisel seçim unutuluyor. Ekran bu iki davranışı düzeltmeli. Bu görünüm ve favori bilgileri başka ekranlarla paylaşılmıyor: bu görevde Redux gerekli mi, karar ver ve seçtiğin state sahibini kullan.

## Gereksinimler

- `Kart görünümü` seçilince film listesi görünür kalır.
- Film favorisi başka türe geçip geri dönünce aynı film üzerinde kalır.
- Tür değişimiyle arayüz görünüm seçimi birbirini sıfırlamaz.

## Örnek

Bir filmi favorile → `Kart görünümü`ne geç: film görünür ve işaretli kalır. Başka türe geçip geri dön: aynı filmin `aria-pressed` değeri `true` olur.

## Sözleşme

- Dosya ve export: `MovieWorkspace.tsx` → `MovieWorkspace`
- `Kart görünümü` erişilebilir adlı bir düğmedir.
- Favori düğmesinin adı `{film adı} favori`, durumu `aria-pressed` ile okunur.
