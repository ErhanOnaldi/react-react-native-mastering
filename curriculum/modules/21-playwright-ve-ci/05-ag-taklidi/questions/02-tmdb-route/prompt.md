Tarayıcıdaki arama, dış film servisine çıkmadan tekrarlanabilir yanıt almalı. Yetkisiz istek başarılı sonuç gibi görünmemeli.

## Gereksinimler

- TMDB arama adresine yapılan GET isteklerini yakala; query string değerleri değişebilir.
- Authorization Bearer token yoksa 401 ve status_code 7 cevabı ver.
- query değeri dövüş ise id 550 ve Dövüş Kulübü başlıklı film içeren liste dön.
- Başka sorgularda boş results dön.
- Liste yanıtında page ve total_pages 1; total_results sonuç sayısı olmalı.

## Örnek

Bearer başlıklı dövüş araması bir film döndürür. Bearer başlıklı bilinmeyen sorgu boş liste verir. Başlıksız dövüş araması 401 döndürür.

## Sözleşme

- Dosya ve export: mockSearch.ts içinden mockSearch(page: Page): Promise<void> fonksiyonunu export et.
- İstek adresi https://api.themoviedb.org/3/search/movie, metodu GET’tir.
- Film alanları id ve title içerir; liste gövdesi page, results, total_pages ve total_results alanlarını taşır.
