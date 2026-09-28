## Neden böyle?

`createMemoryRouter` gerçek tarayıcı geçmişi oluşturmadan route ağacını çalıştırır. Test hem adresi hem ekrandaki içeriği gözlemlediği için sayfa numarasının yalnızca yerel state'te tutulduğu çözüm yeterli olmaz.

Sayfa parametresi URL'den metin olarak gelir. Metne matematik uygulamak (`'1' + 1`) yeni bir sayı yerine `'11'` üretir; önce dönüştürüp tam sayı ve aralık kontrolü yapmak gerekir. Bozuk URL kullanıcı girdisidir, ekranı çökertmek yerine güvenli ilk sayfaya dönmek daha dayanıklıdır.

Burada statik veri kullanılır; ağ taklidi veya asenkron bekleme gerekmez. Daha büyük uygulamada route ağacı aynı kalırken sayfa içeriği bir sunucu sorgusundan gelebilir.
