Üretimde görülen bir hata, sayfa kapatılırken bile izleme adresine ulaşmalı. Gönderim mümkün olmazsa çağıran kod bunu sonuçtan anlayabilmeli.

## Gereksinimler

- Hata kaydı JSON olarak `name`, `message` ve verilen `context` alanlarını taşır. `Error` olmayan değerlerin adı `UnknownError`, mesajı metne çevrilmiş değeridir.
- Tarayıcının kapanışa uygun gönderimi başarılı olursa ikinci ağ isteği yapılmaz.
- İlk gönderim başarısız olursa JSON gövdesi POST edilir; başarılı HTTP yanıtında `true`, başarısız yanıtta veya ağ hatasında `false` döner.

## Örnek

`new TypeError('Bozuk veri')` ve `{ page: '/etkinlik/42' }` için gövdede `name: 'TypeError'`, `message: 'Bozuk veri'`, `context.page: '/etkinlik/42'` bulunur.

## Sözleşme

- `sendErrorReport.ts` dosyası `sendErrorReport(error: unknown, endpoint: string, context?: Record<string, unknown>): Promise<boolean>` export eder.
