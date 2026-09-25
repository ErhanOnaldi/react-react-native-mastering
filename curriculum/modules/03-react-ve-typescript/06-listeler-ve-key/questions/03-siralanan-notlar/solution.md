## Neden böyle?

Testin kontrol ettiği davranışın kaynağı props ve state akışıdır. Görünümü yalnızca sabit metinle taklit etmek farklı props veya ikinci tıklamada bozulur. Gereksiz kopya state yerine mevcut veriden hesaplanan sonucu kullan; event işleyicisinde eski değere bağlı değişiklik varsa updater seç. HTML’nin doğal rol ve etiketleri hem klavyeyle kullanımı hem test edilebilirliği iyileştirir. İleride aynı bileşenler API verisiyle beslenecek; veri kaynağı değişirken bu davranış sözleşmesi korunur.
