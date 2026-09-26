## Neden böyle?

URL'deki sorgu her gezinmede değişebilir. Arama çalışmasını bu değere bağlamak yeni isteği başlatır; cleanup ise artık geçerli olmayan cevabın listeyi değiştirmesini engeller. Geri tuşu da yeni bir gezinmedir. Ağın cevap sırası, URL'nin hangi sorguyu temsil ettiğine karar veremez.

Alternatif olarak önceki isteği `AbortController` ile iptal edip `AbortError`'ı normal sayabilirsin. Yalnızca `[q]` bağımlılığı eklemek yeterli değildir: önceki istek yine sonra bitebilir. Sorguyu ayrıca yerel state'e kopyalamak da URL ile iki doğru kaynak yaratır. Modül 9'da URL, geçici UI ve sunucu verisi sınırlarını birlikte seçeceksin.
