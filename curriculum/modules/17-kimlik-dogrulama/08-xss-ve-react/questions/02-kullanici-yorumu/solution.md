# Güvenli Yorum Gösterimi ve XSS Engelleme

React'in JSX yapısı varsayılan olarak tüm değişken değerlerini metin (string) olarak kabul eder ve `textContent` mantığıyla DOM'a yazar. Yani `<p>{content}</p>` ifadesinde `content` değişkeni `<img src=x onerror=...>` içerse bile tarayıcı bunu bir HTML etiketi olarak yorumlamaz; ekranda düz metin olarak gösterir.

## dangerouslySetInnerHTML Tuzağı

Eğer geliştirici zengin metin göstermek için `dangerouslySetInnerHTML={{ __html: content }}` kullanırsa, React'in bu koruma kalkanı bütünüyle devre dışı kalır. Tarayıcı metni doğrudan HTML olarak ayrıştırır ve `onerror` gibi olay işleyicileri anında JavaScript kodu çalıştırır.

Güvenilir olmayan kullanıcı metinleri daima doğrudan JSX ifadesi (`<p>{content}</p>`) olarak render edilmelidir.

## URL Şemalarının Denetimi

`<a href={websiteUrl}>` gibi bağlantılarda `websiteUrl` değeri `javascript:alert(1)` olursa kullanıcı linke tıkladığında tarayıcı JavaScript kodunu yürütür. Bu sebeple harici bağlantılarda protokol mutlaka `http:` veya `https:` ile sınırlandırılmalı, tersi durumda güvenli bir fallback (`#`) atanmalıdır.
