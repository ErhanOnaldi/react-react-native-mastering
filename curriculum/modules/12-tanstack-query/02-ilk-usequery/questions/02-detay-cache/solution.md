## Neden böyle?

`staleTime` olmadan cache dolsa bile yeniden mount arka planda GET başlatabilir. Key’e id eklemek farklı filmlerin karışmasını önler. Başlığı `useState`’e kopyalamaya gerek yok. Üretimde bu fetch, Sinema’daki `movies-api.ts` fonksiyonuna devredilir; sonraki derste key’leri tek yere taşıyacaksın.
