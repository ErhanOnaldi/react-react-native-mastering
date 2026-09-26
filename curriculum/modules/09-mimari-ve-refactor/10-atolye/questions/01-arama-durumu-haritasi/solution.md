## Neden böyle?

Metin ve sayfa URL'de yaşayınca paylaşım ve geri/ileri kendiliğinden anlam kazanır. Panel yalnızca o anki ekranın geçici seçimidir. Sunucu sonucu ayrı tutulur; URL değişimi yeni isteği tetikler ve eski cevabın ekranı ezmesi önlenir.

Başka geçerli yol, router loader ile URL'ye göre veriyi almak ve yerel paneli bileşende tutmaktır. Geciken cevapları görmezden gelmemek ve paneli URL state'ine karıştırmak sık hatalardır. Sonraki Query modülünde sunucu sonucunun ömrünü cache yönetecek.
