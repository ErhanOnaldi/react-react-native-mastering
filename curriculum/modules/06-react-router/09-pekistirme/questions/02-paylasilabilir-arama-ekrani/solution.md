## Neden böyle?

Liste, props ve URL'den türetilir; onu ayrıca state'te tutmak geri tuşuyla uyuşmaz. Önce filtreleme, sonra `slice` yapmak doğru sayfa sınırını verir. `setParams({ page: ... })` diğer filtreleri siler; callback içinde kopya almak korur. Gerçek ürünlerde de paylaşılabilir filtreler destek ekibinin hatayı aynı adresle yeniden açmasını sağlar. Modül 7'de bu üç değer statik liste yerine TMDB isteklerine girecek.
