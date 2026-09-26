## Neden böyle?

Alan boşken önceki sonuç artık geçerli değildir. Boş arama istek başlatmaz; devam eden aramanın cevabı da temizlenmiş ekrana yazamaz. Her giriş değişiminde önceki işin geçerliliği kaldırılır.

Başka doğru çözüm, devam eden isteği `AbortController` ile iptal etmek ve iptali hata olarak göstermemektir. Yalnızca listeyi temizlemek yetmez; yavaş cevap yeniden doldurabilir. Sonraki Query modülünde benzer sonuç ömrünü sorgu kimliği ve cache ile yöneteceksin.
