Sinema trend akışına yeni sayfaları ekle ve film detayını kullanıcı kartı açmadan önce hazırla.

## Gereksinimler

- Home trend görünümü sayfa 1 ile başlasın ve `Daha fazla` ile sonraki sonuçları eskilerin yanına eklesin.
- Son sayfadan sonra yeni istek olmasın; devam eylemi doğru durumda kapansın.
- Tür filtresinin URL ve mevcut sayfalı keşif davranışı korunsun.
- Film kartına gelindiğinde o filme ait detay verisi önceden alınsın.
- Detay sayfası aynı cache girdisini kullansın; taze veriyle açılış ikinci GET üretmesin.

## Örnek

Trend başlangıcı `page=1`; devamında `page=2` ve ilk sayfanın filmleri hâlâ görünür. `Dövüş Kulübü` kartına gel → detayı hazırla → detayı aç, film endpoint’ine toplam bir GET.

## Sözleşme

- `src/pages/HomePage.tsx` mevcut export’unu korur; trend alanı ve `Daha fazla` eylemi burada görünür.
- `src/features/movies/components/MovieCard.tsx` içindeki kart başlığı erişilebilir bir etkileşim öğesidir.
- Detay key’i `src/features/movies/api/movie-queries.ts` içindeki `movieQueries.detail(id)` ile aynıdır.

## Kısıtlar

- Query cache’te tutulan sayfa sayısı en fazla 3 olsun.
