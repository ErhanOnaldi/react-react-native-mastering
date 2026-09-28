---
title: "Paylaşılabilir URL'leri pekiştir"
minutes: 7
kind: practice
---

# Paylaşılabilir URL'leri pekiştir

:::pain[Problem]
`/search?q=Matrix&page=3&genre=28` linkini paylaşıyorsun. Arkadaşın aynı adresi açınca başka bir sayfa veya boş liste görürse URL'yi kaynak saymak işe yaramaz.
:::

Bu bölümde path ve search parametrelerini, statik film verisini ve route bileşenlerini bir arada kullanacaksın. Önce filtre ve sayfalama sırasını düşün: önce listeyi daralt, sonra mevcut sayfaya ait öğeleri seç. Filtre değiştiğinde eski sayfa numarası artık anlamını yitirebilir; sayfa ileri/geri giderken diğer seçimler korunmalıdır.

:::model[URL state]
URL route'u ve görünüm seçimlerini taşır; ekran bu değerlerden yeniden kurulur. Bu tekrar merdiveninde yenilik, tek bir parametre okumak değil, sorgu, tür, sayfa ve listeden bulunamayan id gibi birden fazla sınırı birlikte yönetmektir. Bozuk veya eksik URL değeri kullanıcı girdisidir; varsayılan davranışını açıkça seç.
:::

## Çalışma sırası

1. Her URL parçasının ne anlattığını ayır: path hangi sayfayı, query string hangi görünüm seçimini anlatıyor?
2. Metin gelen değerleri sayıya çevirmeden önce eksik, bozuk, ondalıklı ve aralık dışı durumları düşün.
3. Arama ve tür filtrelerini uygula; toplam kayıt sayısı yerine filtrelenmiş listenin sayfalarını hesapla.
4. URL'de olmayan değeri varsayılanla göster ve bir filtre değiştiğinde ilişkili sayfayı sıfırla.
5. Birden fazla adresten açılış ve kullanıcı gezinmesini düşün: ekran hem doğrudan URL ile hem link üzerinden aynı seçimi kurmalı.

Pekiştirme soruları artan bütünlük ister. Küçük saf dönüşümde parametre metnini güvenli sayıya çevir; ardından kontrolleri olan bir bileşende URL güncellemelerini koru; son olarak statik liste, arama ve sayfa seçimlerini bir ekranda birleştir. Son soruda kendi testini yazarken bir kullanıcı yolunu baştan sona düşün: başlangıç adresi, görünen içerik, eylem, yeni adres ve sınır değeri.

`createMemoryRouter` tarayıcı penceresine ihtiyaç duymadan gerçek route ve URL davranışını bellekte açar. `RouterProvider` aynı uygulama bağlamını kurar; `userEvent` kullanıcı eylemini taklit eder. Bir testte hem adresi hem ekrandaki başlığı doğrulamak, yalnızca `page` değerini test etmekten daha anlamlı bir sözleşme verir. Bozuk URL ile başlatmak da bileşenin doğrudan açılışa dayanıklı olup olmadığını gösterir.

:::sector
Arama ekranları destek kaydı, analitik bağlantısı ve paylaşılan filtreler için tekrarlanabilir olmalıdır. Ekipler URL şemasının davranışını test ederek geri/ileri gezinme ve kullanıcı tarafından elle yazılan adreslerin aynı sonuçları ürettiğinden emin olur.
:::

## Özet

- Filtrelemeden sonra sayfala; toplam listeyi erkenden kesme.
- Query parametrelerini birbirini silmeden güncelle ve bağlı sayfa numarasını sıfırla.
- URL metinlerini doğrula, güvenli varsayılan kullan.
- Route testinde adres, görünür sonuç ve eylem sonrası değişimi beraber düşün.

**Kendini yokla:** Tür filtresi aynı kalırken sorgu değişince sayfa neden başa döner?

*Cevap:* Yeni filtrelenmiş listenin önceki sayfa indeksinde içerik olmayabilir.
