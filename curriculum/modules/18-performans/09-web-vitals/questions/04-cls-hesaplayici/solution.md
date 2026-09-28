# Neden böyle?

## hadRecentInput filtresi
CLS (Cumulative Layout Shift) metriği, kullanıcının beklemediği görsel sıçramaları ölçmek için tasarlanmıştır. Kullanıcı bir akordeon başlığına tıkladığında veya bir formu açtığında sayfa öğelerinin aşağı kayması beklenen bir durumdur. Tarayıcı, kullanıcı girdisinden (tıklama, dokunma, tuş vuruşu) sonraki 500 milisaniye içinde meydana gelen tüm `layout-shift` olaylarına otomatik olarak `hadRecentInput: true` bayrağı koyar.

Eğer bu bayrak dikkate alınmazsa, meşru kullanıcı hareketleri de "hata" gibi puanlanır ve CLS skoru yapay şekilde bozulur. Bu yüzden `hadRecentInput: true` olan kayıtlar doğrudan elenir.

## Kayan nokta (Floating point) yuvarlaması
JavaScript'te ondalık sayılar IEEE 754 standardına göre tutulur. `0.1 + 0.2` toplandığında `0.30000000000000004` üretilmesi gibi kaymalar performans skorlarında çirkin küsuratlara yol açar. `Math.round(total * 10000) / 10000` formülü, 4 basamak hassasiyetle temiz bir sayı elde etmenin en sade ve performanslı yoludur.

## Sektör standardı: Session Windows
Google'ın resmi `web-vitals` kütüphanesinde CLS hesabı tüm sayfa ömrünün toplamı yerine en fazla 5 saniye süren ve aralarında en fazla 1 saniye boşluk olan "oturum pencereleri" (session windows) içinde toplanır ve en büyük pencerenin skoru CLS kabul edilir. Bu görevde temel kümülatif toplama ve girdi filtreleme mantığını pekiştirdik.
