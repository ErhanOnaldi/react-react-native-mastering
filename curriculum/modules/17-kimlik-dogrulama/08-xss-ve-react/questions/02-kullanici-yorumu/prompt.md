Kullanıcıların girdiği film yorumları güvenilmeyen veri kaynağıdır. Yorum metninde yer alan HTML veya script etiketlerinin tarayıcı tarafından çalıştırılmasını önleyen ve yazarın web sitesi bağlantısını güvenli şemalarla kısıtlayan bir yorum bileşeni oluştur.

## Gereksinimler

- Yazar adını (`author`) ve yorum metnini (`content`) ekranda göster.
- Yorum metnindeki HTML etiketleri (örneğin `<img src=x onerror=alert(1)>` veya `<script>`) DOM öğesi olarak oluşturulmamalı; ekranda salt metin olarak görünmelidir.
- Opsiyonel `websiteUrl` prop'u tanımlıysa bir harici bağlantı (`<a>Web sitesi</a>`) oluşturulmalıdır.
- `websiteUrl` yalnızca `https:` veya `http:` protokolüne sahip olduğunda hedef link olarak kullanılmalı; `javascript:` veya geçersiz şemalarda `href="#"` atanmalıdır.
- Dış bağlantı güvenlik amacıyla `rel="noreferrer noopener"` özniteliğini içermelidir.

## Örnek

| Girdi | Beklenen DOM Davranışı |
| --- | --- |
| `content: "Harika bir film!"` | Ekranda `"Harika bir film!"` metni görünür. |
| `content: "<img src=x onerror=alert(1)>"` | Hiçbir `<img>` etiketi render edilmez; metin aynen görünür. |
| `websiteUrl: "https://ornek.example"` | `<a href="https://ornek.example">Web sitesi</a>` |
| `websiteUrl: "javascript:alert(1)"` | `<a href="#">Web sitesi</a>` |

## Sözleşme

- `SafeComment.tsx` dosyasından `SafeComment(props: SafeCommentProps)` bileşenini named export et.
- `SafeCommentProps` arayüzü `author: string`, `content: string` ve `websiteUrl?: string` alanlarını kabul etmelidir.
