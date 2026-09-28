Arama kutusuna hızlıca yazı yazılırken kullanıcının girdiği harflerin gecikmeden ekranda belirmesini, ağır liste filtreleme işleminin ise kullanıcıyı bekletmeden arka planda tamamlanmasını istiyorsun.

## Gereksinimler
- Arama kutusu kontrollü (controlled) kalmalıdır: kullanıcı yazdığı anda input değeri gecikmeksizin güncellenmelidir.
- Arama sorgusu boşken tüm film başlıkları listelenmelidir.
- Film listesi, arama sorgusunun ertelenmiş değerine göre Türkçe karakterlere duyarlı küçük harf dönüşümü (`toLocaleLowerCase('tr')`) ile filtrelenmelidir.
- Liste henüz son sorguya göre güncellenirken ekranda `Liste güncelleniyor` metni görünmelidir.
- Güncelleme tamamlandığında filtrelenmiş sonuçlar `ul > li` içinde listelenmelidir.

## Örnek
Kullanıcı kutuya "Matrix" yazdığında input anında "Matrix" değerini alır. Liste güncellenirken bir an "Liste güncelleniyor" görünür ve hemen ardından filtrelenen liste ekrana yansır.

## Sözleşme
- Dosya ve export: `DeferredSearch.tsx` → `DeferredSearch({ titles }: { titles: string[] })`
- Arayüz: "Film ara" etiketli input, "Liste güncelleniyor" metni, `ul > li` listesi (`screen.getAllByRole('listitem')`).
