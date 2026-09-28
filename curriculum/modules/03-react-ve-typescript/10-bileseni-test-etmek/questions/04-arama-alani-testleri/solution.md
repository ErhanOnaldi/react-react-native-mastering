## Neden böyle?

Testler üç ayrı kullanıcıya açık davranışı korur: doğru adla bulunabilirlik, arama alanı semantiği ve yazının dışarı bildirilmesi. `userEvent` gerçek klavye etkileşimine yakın olay dizisi üretir; en son callback çağrısını beklenen sorguyla karşılaştırmak, kullanıcının tamamladığı yazımı denetler.

Mutantların her biri farklı bir gereksinimi bozar. Yanlış etiket rol + ad sorgusunu kalır; `onQueryChange` çağrısının kaldırılması yazma testini kalır; `type="text"` ise `searchbox` rolünü kaybettirir. Böylece testler yalnızca render edilen bir input’un varlığını değil, arama kontrolünün sözleşmesini de kapsar.

## Alternatif ve tuzak

Alanı `getByTestId` ile bulup yalnızca `value` niteliğine bakmak yanlış etiketi ve sıradan metin alanını kaçırabilir. Testi kullanıcının arayüzde bulduğu anlamsal role bağla.

## Sektörde ve sonra

Test adları, hata raporunda davranış gereksinimi olarak görünür. Küçük bileşenlerde etkileşimleri DOM üzerinden test etmek hızlıdır; ağla çalışan tam ekranların test yaklaşımı daha sonra ele alınır.
