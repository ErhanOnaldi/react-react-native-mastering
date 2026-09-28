---
title: "Tipleri bir arada kullan"
minutes: 6
kind: practice
---

# Tipleri bir arada kullan

:::pain[Problem]
Tek bir film tipi doğru olsa bile liste cevabının sayfa bilgisi, ham verideki boş alanlar ve ekranda gösterilecek biçim birbirinden farklı kararlardır. Bu pekiştirme, o kararları birlikte uygulamanı sağlar.
:::

## API cevabından görünüm verisine

Önce sayfalanmış cevabın kabını ve eleman tipini bir arada düşün. `results` çok sayıda film tutar; dış nesne ayrıca sayfa ve toplam bilgisi taşır. Sonra ham filmden kartın kullanacağı başka bir nesne üretirken boş tarih ve poster olasılıklarını ayrı ele al.

:::model[Tipler derleme anında yaşar]
Tip açıklamaları derleyiciye yardım eder, fakat API cevabının gerçekten bu şekle sahip olduğunu kanıtlamaz. Bu çalışmada verilen veri sözleşmesini modelle; dış veriyi doğrulama ihtiyacını, `unknown` ile sınırda kontrol yaparken hatırla.
:::

![TypeScript tiplerinin derleme ve çalışma anındaki ayrımını gösteren ortak model](diagram:ts-derleme-ve-calisma)

İki dönüşüm adımını zihninde ayır: önce dizi içindeki nesneleri seç veya dönüştür; sonra eksik alanı görünüm için anlamlı bir değere çevir. `map` yeni bir dizi üretir ve sırayı korur. Kaynak nesneye alan atamak, API verisini değiştirdiği için sonraki kullanım yerlerini şaşırtabilir.

## İlk testini yaz

Modül 0'da `describe`, `it` ve `expect` ile testlerin yapısını okudun. Yeni görevde ilk kez test dosyasını sen yazacaksın: verilen saf fonksiyon için beklentileri `toBe` veya `toEqual` ile kur. Her testte bir davranışa odaklan; olağan bir değer kadar sınır değerini de seç. Fonksiyon kodunu değiştirmeden yalnızca test dosyasında çalışırsın.

Bir test adı davranışı Türkçe bir gereksinim cümlesi gibi anlatmalı. Böylece sonuç raporunda başarısız olan beklenti doğrudan anlaşılır. Tam saat, kısa süre ve geçersiz değerler ayrı davranışlardır; hepsini tek beklentide gizlemek yerine küçük testlere böl.

:::mistake[Tipli veriyi doğrulanmış veri sanmak]
Belirti → Hatalı cevap film gibi kullanılıyor. Neden → Statik tip çalışma zamanındaki JSON'u denetlemiyor. Düzeltme → Sınırda kontrol gerekip gerekmediğini açıkça değerlendir.
:::

:::sector
Saf fonksiyonların testleri ağ ve arayüzden bağımsızdır; hızlı çalışır ve küçük sözleşmeleri korur. Liste verisini görünüm biçimine dönüştürmek de UI bileşenlerinin aynı veri temizleme kurallarını kullanmasına yardım eder.
:::

## Özet

- Sayfalı cevap ile film elemanının sorumlulukları ayrıdır.
- Normalize edilmiş görünüm verisi kaynak nesneyi değiştirmeden üretilir.
- Test adı davranışı, test gövdesi tek bir beklentiyi anlatır.
- Sınır değerleri temel örnek kadar önemlidir.

Kendini yokla: `results.map(...)` neden yeni dizi üretir? Cevap: `map` kaynak elemanlardan callback sonuçlarını toplar; kaynak diziyi değiştirmez.
