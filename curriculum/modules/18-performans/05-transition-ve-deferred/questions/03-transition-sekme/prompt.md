## Durum
Detay sayfasındaki oyuncu sekmesi büyük bir alt ağaç açıyor. Tıklamanın beklediğini kullanıcıya hissettir.

## Yap
- Sekme state güncellemelerini `startTransition` içinde başlat.
- `isPending` sırasında `Sekme açılıyor` durumunu göster.
- Özet ve Oyuncular arasında geçiş çalışsın.

`useTransition` ağ isteğini iptal etmez; render önceliğini yönetir.
