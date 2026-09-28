## Neden böyle?

Testler doğrulayıcının dışarıdan görünen sözleşmesini ölçer: geçerli kayıt kabul edilir, eksik ya da türü bozuk alanlar reddedilir. Ek alanı kabul etmemiz bilinçli; API yeni alan eklediğinde mevcut istemcinin doğrulaması kırılmaz.

Her mutant farklı bir açık bırakır. Null kontrolünün atlanması boş değeri kayıt sayar; adres alanının kontrol edilmemesi eksik veriyi geçirir; adın metin kontrolünün gevşemesi beklenmeyen değerin `Venue` gibi kullanılmasına izin verir. Testlerin her mutantta kalması, yalnız mutlu yolun test edilmediğini gösterir.

## Sektörde

Type guard testi, tip predicate'inin gerçek runtime davranışına uyup uymadığını güvenceye alır. Büyük ve iç içe API sözleşmelerinde elle guard yerine runtime schema kullanmak daha bakımı kolay bir seçenek olabilir.
