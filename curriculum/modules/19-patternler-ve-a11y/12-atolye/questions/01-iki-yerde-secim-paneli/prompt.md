Ana Sayfa'daki seçim kontrolü çalışıyor. Detay sayfasında farklı seçeneklerle de aynı klavye ve focus davranışı gerekiyor; iki sayfanın seçimi birbirinden bağımsız kalmalı.

## Gereksinimler

- Ana Sayfa seçenekleri `Aksiyon` ve `Komedi`; Detay sayfası seçenekleri `Puan` ve `Tarih` olsun.
- Her iki yerde de yalnız seçili seçenek Tab sırasına girsin; ok tuşları, Home ve End seçim ile focus'u doğru taşısın.
- Seçenek grupları adlandırılmış ve erişilebilir button kontrolleri olsun.
- Sayfa değiştirip geri dönünce o sayfanın önceki seçimi korunsun.
- Bir sayfadaki seçim diğer sayfanın seçimini değiştirmesin.

## Örnek

Ana Sayfa'da Belgesel seçip Detay'a geç. Puan'ı seçip Ana Sayfa'ya dönünce Belgesel seçimi korunur; Detay'a tekrar geçince Puan seçimi durur.

## Sözleşme

- `SelectionPages.tsx` içinden named export `SelectionPages`.
- Detay sayfasında `Puan` ve sağ okla ulaşılan `Tarih` seçenekleri bulunur.
- Seçenekler `radio` rolü, erişilebilir ad ve doğru `aria-checked` durumuyla bulunur.
