## Neden böyle?

`vi.fn` ağ sınırını kontrol ederek hem cevabı hem çağrı argümanlarını görünür kılar. `new URL` ve `new Headers` ile sözleşmeyi okursan query sırası veya header yazım biçimi değişse de testin dayanır. `ApiError` için yalnız “reject oldu” demek yetmez; 404 ile TMDB `status_code: 34` farklı bilgiler.

Debounce testinde ilk timer’ın dolduğu anı ayrıca ölçmek cleanup hatasını yakalar. Tek bir 500 ms bekleme testi yalnız gecikmeyi görür. `act`, React state güncellemesini assertion’dan önce tamamlar; fake timer ise testi gerçek beklemeye bağımlı bırakmaz.

`vi.unstubAllGlobals()` ve `vi.useRealTimers()` temizliği testleri bağımsız tutar. Bir sonraki modülde aynı HTTP akışını `fetch`i elle taklit etmek yerine MSW ile sınayacaksın.
