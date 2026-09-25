## Neden böyle?

Effect dış dünyadaki asenkron isteği yönetir; `id` dependency’si farklı filme geçişi başlatır. Cleanup hem abort sinyali verir hem eski Promise’in state yazmasını engeller. `load` fonksiyonunun referansını kullanım yerinde kararlı tutmak gerekir; yoksa her render yeni effect açabilir. Sonraki görevde bileşen bu union’ı yalnız görünüm için kullanacak.
