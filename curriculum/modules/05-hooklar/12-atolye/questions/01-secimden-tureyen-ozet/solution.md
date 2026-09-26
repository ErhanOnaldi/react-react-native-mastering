## Neden böyle?

Seçilen film id'si gerçek state'tir; başlık ve süre bu id ile hazır film verisinden bulunur. Özeti ayrıca state'e kopyalamak iki kaynak yaratır. Seçim değiştiği render'da filmi yeniden bulmak, eski özetin bir an bile görünmesini önler.

Alternatif olarak seçilen film nesnesini doğrudan state'te tutup onun alanlarını gösterebilirsin; sabit bu veri kümesinde o da geçer. Fakat hem id hem özet saklayıp bunları ayrı ayrı güncellemek yine bayat veri riski taşır. Modül 6'da seçimi URL'den aldığında da görünür veri seçimin güncel değerinden türetilmeli.
