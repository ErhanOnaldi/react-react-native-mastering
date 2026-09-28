---
title: "A11y akışını birleştir"
minutes: 6
kind: practice
---

# A11y akışını birleştir

:::pain[Belirti]
Tek tek çalışan modal ve sekme davranışları bir araya gelince yeni durumlar çıkar. Arka plana tıklayarak kapatma eklenince başlığa tıklamak da pencereyi kapatıyor. Videosu olmayan bir filmde boş Videolar sekmesi klavye sırasına giriyor.
:::

Bu pekiştirmede bir modal akışını ve veriye göre değişen bir sekme grubunu birleştiriyorsun. İlk görevde içerideki click ile arka plan click'ini ayır; açılış focus'u, iki yönlü Tab döngüsü, Escape ve focus iadesini koru. İkinci görevde sekme listesini film verisine göre kur; kullanılmayan video seçeneği ve paneli gösterme.

## Elle dolaşım

Fareyi bırakıp önce klavyeyle dene. Tab ile tetikleyiciye gel, Enter ile aç, dialog adını kontrol et, Tab ve Shift+Tab ile sınırları geç, Escape ile kapat. Focus'un açana döndüğünü gör. Sonra arka planı ve dialog içindeki başlığı ayrı ayrı tıkla; yalnızca arka plan davranışının kapatması gerekir.

Sekmelerde Tab ile seçili öğeye gir, ok tuşlarıyla dolaş. Video verisi yokken son sekmeden ilk sekmeye dönmeyi kontrol et. Sonra veri değiştiğinde seçili öğenin kaybolması durumunu düşün: yeni listede olmayan seçimi göstermek yerine anlamlı bir varsayılan seçilmelidir. Focus kaldırılmış bir sekmedeyse kullanıcı klavyede konumunu da kaybetmemelidir.

Bu görevlerde önce her kuralı tek başına çöz, sonra birleşik akışın hangi state'i ve hangi DOM ilişkisini etkilediğini takip et. `target` ile handler sahibini, seçili `value` ile görünen panelleri ayrı ayrı kontrol et. State'te tutulması gerekmeyen bir değeri veriden yeniden hesaplayıp hesaplayamayacağını sor.

:::sector
Erişilebilir bileşenler gerçek kullanıcı akışları içinde değerlendirilir. Modal açılıp kapandığında sekme sayfasında klavye odağı kaybolmamalı; veri yenilendiğinde de kullanılmayan kontrol odak sırasına girmemeli. Takım arkadaşından yalnız fareyle değil, klavyeyle de kısa bir tur yapmasını iste.
:::

## Özet

- Dialog içi click ile arka plan click'i aynı şey değildir.
- Modalın açılış ve kapanış focus'u tek bir akış olarak kalmalı.
- Sekme listesi gerçekten kullanılabilir veriden türemeli.
- Veri değişince geçersiz seçimi ve focus'u birlikte ele al.
