`max-age` cevabın kaç saniye doğrudan kullanılabileceğini belirtir. Süre dolduysa veya yanıtta `no-cache` varsa tarayıcı cevabı göstermeden önce sunucuya doğrulatır. `no-store` ise cevabın saklanmaması gerektiğini söyler; bu yüzden elde kalan kopyayı doğrudan kullanmıyoruz.

Tarayıcıların dahili HTTP önbelleği bu kuralları otomatik işletir. Yardımcı fonksiyon, verilen süre ve yönergelerle yalnızca “bu kopyayı sunucuya sormadan kullanabilir miyim?” kararını verir; başlık metnini ayrıştırmaya çalışmaz.
