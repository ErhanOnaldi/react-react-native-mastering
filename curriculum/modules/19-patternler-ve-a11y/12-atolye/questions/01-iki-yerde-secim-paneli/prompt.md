Ana Sayfa'daki tür seçim paneli çalışıyor: ok tuşlarıyla gezilebiliyor, seçili öğe belli. Aynı seçim davranışı artık Detay sayfasında da gerekiyor — orada farklı bir seçenek listesi (sıralama ölçütü) için, ama klavye ve odak (focus) davranışı birebir aynı kalmalı. İki sayfa kendi seçimini ayrı ayrı hatırlamalı: birinde seçtiğin diğerini değiştirmemeli.

Testler `SelectionPages.tsx` içindeki `SelectionPages` bileşenini açar.

## Arayüz sözleşmesi

- Detay sayfasındaki seçenek listesi en azından `Puan` ve, sağ ok ile ondan hemen sonra ulaşılan, `Tarih` seçeneklerini içersin.
