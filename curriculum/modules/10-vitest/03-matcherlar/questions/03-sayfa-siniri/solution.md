## Neden böyle?

Başarılı dalda `toBe` sayının aynı kalmasını ölçer; hatalı dalda `toThrow` için fonksiyonu bir callback içinde vermek gerekir. `expect(requirePage(0)).toThrow()` yazarsan hata assertion’dan önce fırlar.

Yalnız `page < 1 || page > 500` kontrolü `2.5` ve `NaN` değerlerini kaçırır; `Number.isInteger` bu sınırı kapatır. Kullanıcıya görünen sözleşme sayfanın geçerli olup olmamasıdır. Bir sonraki derste, bu gibi dış davranışları iç algoritmadan bağımsız test etmeyi seçeceksin.
