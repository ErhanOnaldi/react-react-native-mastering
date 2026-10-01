## Neden böyle?

`remove` yalnız sunucu isteğini yapar; mutation nesnesi bekleme, başarı ve hata durumlarını bileşene verir. `mutate(movieId)` tıklama handler’ında olduğu için ilk render istek başlatmaz. Hook’un bu görevi cache’i yenilemez; sonraki görev silinen kaydı paylaşılan listeden geçici kaldırıp hatada geri alır.
