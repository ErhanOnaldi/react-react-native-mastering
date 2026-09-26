## Neden böyle?
Gerçek `<button>`, Tab sırası, Enter ve Space davranışını hazır verir. Simge tek başına ad olmadığı için `aria-label="Favori"` ekledik; simgeyi `aria-hidden` ile gizledik ki ad "☆ Favori" diye karışmasın. Durumu `aria-pressed` taşıyor, bu yüzden ad **sabit** kalıyor: ekran okuyucu "Favori, düğme, basılı değil" / "basılı" der.

### Alternatif
Adı değiştirmek de doğru bir yoldur: "Favorilere ekle" ↔ "Favorilerden çıkar". O durumda `aria-pressed` KOYMAZSIN; aksi halde "Favorilerden çıkar, basılı" gibi çelişen bir cümle duyulur.

### Sık hata
`<div onClick>` + `role="button"`: rol doğru ama Tab ile ulaşılamaz, Enter/Space çalışmaz. Doğal elementi seçmek en kısa yoldur.

### Sektörde ve sıradaki adım
UI kitlerinde "icon button" bileşenleri `aria-label`'ı zorunlu prop yapar. Sinema'nın detay sayfasındaki favori düğmesi şu an iki yolu karıştırıyor; proje görevinde bunu da düzelteceksin.
