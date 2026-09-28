Arama kutusundaki metin değiştikçe sonuç sayısı da o metne göre yenilenmeli. Boş aramada istek atılmamalı.

## Gereksinimler

- `query=""` iken arama endpoint'ine istek atılmaz.
- Dolu sorguda `/search/movie` endpoint'inden dönen `total_results` değeri `N sonuç` biçiminde görünür.
- `query` prop'u değişince yeni sorgu ile yeni istek atılır.
- Türkçe karakter içeren sorgular URL içinde güvenle taşınır.
- TMDB yetkilendirme başlığı gönderilir.

## Örnek

`query="Dövüş"` için ilk istek `query=Dövüş` taşır. Aynı bileşen `query="Matrix"` ile yeniden render edilince ikinci istek `query=Matrix` taşır.

## Sözleşme

- Dosya ve export: `SearchCount.tsx` → `SearchCount`
- Prop: `{ query: string }`
- Testler `N sonuç` metnini ve arama isteklerinin query parametrelerini kontrol eder.
