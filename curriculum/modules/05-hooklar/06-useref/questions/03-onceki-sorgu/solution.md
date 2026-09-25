Bu görev ref’in ekranda görünen state yerine geçmediğini gösterir: render’ı query prop değişimi tetikler; ref yalnızca önceki değeri saklar. Render sırasında ref yazmak React’in saf render beklentisini bozar.

## Alternatif ve tuzak

Ref’i render sırasında güncellersen “önceki” metin güncel metne eşitlenir. Ref yazımı tek başına render başlatmadığı için görünen sorgu yine prop/state olmalı.

## Sektörde ve sonra

Timer kimliği de aynı tür ekranda görünmeyen mutable bellektir.
