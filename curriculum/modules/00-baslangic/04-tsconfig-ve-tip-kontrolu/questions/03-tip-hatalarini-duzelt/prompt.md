Bir takım arkadaşın `movie-utils.ts`'i yazmış ve "testler geçiyor, bitti" demiş. Gerçekten de **testlerin hepsi yeşil**. Ama bu platformda (ve sektördeki CI'da) tip hatası olan kod kabul edilmez.

1. Önce hiçbir şeyi değiştirmeden **Çalıştır**'a bas ve sonuç panelindeki **Tip hataları** bölümünü oku.
2. Editörde de aynı satırların altı çizili olmalı; üzerine gelince mesajı görürsün.
3. Hataları düzelt — **davranışı değiştirmeden** (testler yeşil kalmalı). `titleById` bulunamayan bir id için `"Bilinmeyen film"` döndürmeli.

`types.ts` salt okunur.
