## Neden böyle?

Ortak Promise, aynı anda gelen 401’lerin tek kullanımlık refresh token için yarışmasını önler. `finally` Promise’ı temizler; ilerideki süresi dolumları yeni işlem başlatabilir. Bir 401 yanıtı, başka istek refresh’i bitirdikten sonra gelebilir; “istekte kullandığım token storage’dakinden eski mi?” kontrolü gereksiz ikinci refresh’i önler.

Alternatif, istekleri baştan sıraya sokmaktır; bu, geçerli token varken bile trafiği yavaşlatır. Burada yalnız hata onarımını koordine ediyoruz. Üretimde logout/oturum değişimi sırasında eski refresh’in yeni oturumu ezmemesi için oturum kimliği veya iptal mekanizması eklenir.
