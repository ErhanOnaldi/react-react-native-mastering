Kitaplık arama ekranında kullanıcının kitap araması yapabilmesi, sonuçlar arasında sayfalanabilmesi, aynı aramaya geri dönüldüğünde gereksiz ağ isteği atılmadan sonucun önbellekten gelmesi ve bulunamayan sonuçlarda bilgilendirme yapılması gerekiyor.

## Gereksinimler

- `Kitap ara` metin kutusuna terim yazılıp `Ara` butonuna basıldığında arama başlatılmalı ve sonuçlar listelenmelidir.
- Arama sorgusu ve sayfa bilgisi adres çubuğundaki parametrelerle (`?q=...&page=...`) senkronize çalışmalıdır; ilk sayfa 1'dir.
- `Sonraki sayfa` butonuna tıklandığında sayfa numarası artmalı ve yeni sayfanın sonuçları listelenmelidir.
- Tarayıcı geçmişinde geri gidildiğinde önceki sayfanın sonucu yeni bir ağ isteği atılmadan gösterilmelidir.
- Arama sonucu boş döndüğünde ekranda tam olarak belirtilen bilgilendirme metni gösterilmelidir.

## Örnek

Kullanıcı "Dune" arar → 1. sayfa sonuçları gelir → "Sonraki sayfa"ya basar → "Dune Messiah" gelir → Geri döner → 1. sayfa sonuçları ("Dune") yeni bir ağ isteği atılmadan anında ekranda belirir.

## Sözleşme

- Dosya ve dışa aktarma: `BookSearch.tsx` → `export function BookSearch(): React.JSX.Element`
- Arayüz elemanları:
  - Metin kutusu erişilebilir adı: `Kitap ara`
  - Arama butonu: `Ara`
  - Sayfa butonu: `Sonraki sayfa`
  - Sonuç bulunamadı mesajı: `Kitap bulunamadı`

## Kısıtlar

- Aynı arama ve sayfa kombinasyonuna geri dönüldüğünde yeni bir ağ isteği atılmamalı; sonuçlar önbellekten karşılanmalıdır.
