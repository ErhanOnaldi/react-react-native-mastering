# Harici URL Doğrulama ve Protokol İzin Listesi

React, JSX metinlerini otomatik kaçışlasa da HTML özniteliklerine (`<a href={userUrl}>`) yerleştirilen değerlerin protokolünü denetlemez.

Tarayıcılar `href="javascript:..."` veya `href="data:..."` özniteliklerine tıklandığında içindeki JavaScript kodunu çalıştırır. Bu durum tipik bir DOM-based XSS açığıdır.

## new URL() ile Protokol İncelemesi

Web standartlarındaki `new URL(string)` constructor'ı mutlak bir URL bekler ve protokolü küçük harfle sonuna iki nokta üst üste ekleyerek verir (`protocol: "https:"`).

Bu sayede:
1. `parsed.protocol.toLowerCase()` ile izin listesi (`['https:', 'http:', 'mailto:']`) denetlenir.
2. Protokol izin verilenler arasındaysa temizlenmiş URL döndürülür.
3. Göreli dizgiler veya bozuk girdiler `TypeError` fırlatacağı için `try...catch` bloğunda yakalanıp güvenli `fallback` değerine yönlendirilir.
