---
title: "Kitaplık bağlamında bağımsızlık"
minutes: 6
kind: practice
---

# Kitaplık bağlamında bağımsızlık

:::pain[Problem]
Öğrenirken görev metinleri sana hangi dosyayı açacağını, hangi hook'u çağıracağını ve hangi export adını kullanacağını söyledi. Ancak bağımsız bir projede karşına sadece şu sorunlar çıkar: kitap araması sayfalanınca geri tuşunun eski sonucu unutması, bir kitaptan diğerine geçildiğinde yazar bilgisinin eski kitapta takılı kalması, veya iki farklı API sınırı arasında seçim yapma zorunluluğu.

Bu son Atölye'de sana rehberlik eden hazır bir iskelet yok. Yalnızca kullanıcı belirtileri, iş gereksinimleri ve testlerin aradığı sözleşmeler var.
:::

Bu ders, Modül 22 boyunca inşa ettiğin Kitaplık zihniyetini tamamen bağımsız olarak sınadığın bir uygulama alanıdır. Kodlama kararları, state ayrımı ve veri sınırları tamamen senin sorumluluğundadır.

## Neler ölçülüyor ve nasıl çalışacaksın?

Bu atölyede dört bağımsız görev seni bekliyor:

1. **Kitap arama ve geri dönüş (`code`):** Kullanıcı bir kitap arayıp sayfalar arasında gezindiğinde ve geri tuşuna bastığında, eski sonuçların gereksiz ağ isteği atılmadan önbellekten anında gelmesi ölçülür. Arama metni ve sayfa numarası URL üzerinde tek bir doğruluk kaynağı olarak yönetilmelidir.
2. **Eser değişince yazarın güncellenmesi (`code`):** Bir eserden diğerine geçildiğinde, yazar sorgusunun eski eserin önbelleğinde takılı kalmadan yeni eserin anahtarına göre doğru güncellenmesi sınanır. Bağımlı sorgu yaşam döngüsü ve bulunamayan yazar durumu denetlenir.
3. **Okuma listesi tasarlama (`project`):** `projects/atolye` içinde Open Library verileriyle çalışan tam bir kitap keşif ve kişisel liste ekranı kurarsın. Arama/eser sunucu verisi, kalıcı okuma listesi ve geçici ekran durumlarının birbirinden temiz biçimde ayrılıp ayrılmadığı ölçülür.
4. **Kitaplık kararlarını kaydetme (`project`):** Arama sonucundaki özet yazar bilgisi ile ayrı bir yazar uç noktasına gitmek arasındaki mimari ödünleşimi değerlendirir, seçimini `KARAR.md` dosyasında gerekçelendirirsin.

## Çalışma yöntemi

- Kod görevlerinde (`01` ve `02`) doğrudan bileşen dosyası üzerinde çalış ve `pnpm validate:content -m 22` komutuyla testlerini doğrula.
- Mimari görevlerde (`03` ve `04`) `projects/atolye` dizininde çalış. Ekranı tarayıcıda açıp klavye erişilebilirliğini ve hata durumlarını elle test et.
- Mimari görevleri tamamladığında platformdaki **“AI review prompt'unu kopyala”** düğmesini kullanarak kodunu ve karar notlarını değerlendir.

:::sector[Mülakatlarda Atölye Deneyimi]
Yazılım mülakatlarında sana sıfırdan bir problem verildiğinde ölçülen şey API ezberin değil, belirsizlik karşısındaki duruşundur: "Önce problemi sınırlandırdım, URL'i tek kaynak yaptım, önbellek stratejisini belirledim ve depolama sınırını korudum." Bu dört görev, o mülakat masasında kendi başına karar verebildiğini kanıtlar.
:::
