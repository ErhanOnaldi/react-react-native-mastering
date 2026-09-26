## Neden böyle?

Sıra bir görünüm tercihidir; favori ise filmin özelliğidir. Favori id'lerini state'te tutup sıralanmış diziyi her render'da kaynak veriden üretmek bu iki bilgiyi ayırır. Kaynak diziyi yerinde sıralamak başka ekranları da etkileyebilir. Sabit `key` öğenin React kimliğini, `aria-pressed` ise kullanıcıya görünen seçimi korur.

Alternatif olarak favori id'lerini bir `Set` içinde tutup her tıklamada **yeni** bir `Set` döndürebilirsin; dizi de aynı davranışı sağlar. Diziyi `sort` ile doğrudan değiştirmek veya favorileri satır index'iyle saklamak yanlış filme işaret taşıyan tuzaklardır.

Sonraki modülde film verisi ağdan geldiğinde de görünür sıra ve favori kimliği ayrı kalacak. Modül 5'te benzer bir ayrımı türetilmiş özet ve kaynak state arasında kuracaksın.
