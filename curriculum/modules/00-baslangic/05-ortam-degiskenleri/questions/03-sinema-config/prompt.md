Sinema'nın başlığı şu anda uygulamanın içinde sabit duruyor. Başlığı proje ayarından okuyup uygulamada göster; ayar verilmediğinde anlaşılır bir varsayılan kullan.

## Gereksinimler
- Başlık, `VITE_APP_TITLE` ortam değişkeni ayarlıysa onun değerinden gelsin.
- Değişken tanımlı değilse başlık `Sinema` olsun.
- Uygulamanın ana başlığı bu değeri göstersin.
- `Bugün ne izlesek?` alt yazısı görünmeye devam etsin.
- `VITE_TMDB_TOKEN` zorunlu, `VITE_APP_TITLE` isteğe bağlı ortam değişkeni olarak tiplensin.

## Örnek
`VITE_APP_TITLE=Film Evi` ayarında ana başlık `Film Evi` görünür. Başlık ayarı yoksa `Sinema` görünür; alt yazı her iki durumda da `Bugün ne izlesek?` olarak kalır.

## Sözleşme
- `projects/sinema/src/vite-env.d.ts` içinde iki ortam değişkeninin tiplerini tanımla: `VITE_TMDB_TOKEN` zorunlu, `VITE_APP_TITLE` isteğe bağlı.
- `projects/sinema/src/config.ts` dosyasından `appTitle` adlı sabiti export et.
- `projects/sinema/src/App.tsx` içindeki birinci seviye başlık `appTitle` değerini kullansın.
