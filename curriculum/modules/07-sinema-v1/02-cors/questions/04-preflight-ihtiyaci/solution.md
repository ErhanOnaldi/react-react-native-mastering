Tarayıcılar güvenlik nedeniyle rastgele yöntem ve başlıkların doğrudan üçüncü taraf sunuculara ulaşmasını engeller. Eğer istek W3C Fetch standardının "basit istek" (simple request) tanımına uymuyorsa, tarayıcı arka planda `OPTIONS` metoduyla preflight gerçekleştirir.

Başlık adları HTTP standartlarında büyük/küçük harf duyarsız olduğundan (`Authorization` ile `authorization` aynıdır) kontroller `toLowerCase()` ile normalize edilir. `Content-Type` değerleri de sıklıkla charset parametresi (`text/plain; charset=utf-8`) içerir; bu nedenle MIME türü ayrıştırılarak incelenmelidir.

Sektörde geliştiricilerin "istek iki kez gidiyor" sandığı durum aslında ilk adımda atılan bu preflight uçuşudur. Sunucu `OPTIONS` isteğini uygun CORS başlıklarıyla cevapladığında tarayıcı hemen ardından asıl isteği gönderir.
