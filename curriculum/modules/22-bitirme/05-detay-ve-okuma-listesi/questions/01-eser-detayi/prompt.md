Arama sonucunda bir başlığa tıklayınca Kitaplık artık yalnız bir kart değil, eserin kendisini göstermeli. Open Library'de eser ve yazar ayrı kaynaklar; eksik yazar eseri kaybettirmemeli.

## Sözleşme

- `src/app/routes.tsx` içindeki `createRoutes(queryClient)` ağacına `/works/:workId` yolunu ekle. Arama sonuçlarındaki eser başlıkları `/works/{id}` adresine giden linkler olsun.
- `GET https://openlibrary.org/works/{id}.json` ile eseri getir. `OL893414W` → **Dune**; `OL24252290W` → **Suç ve Ceza**. Başlık `h1`, açıklama ve yazar adını göster.
- `description` düz metin veya `{ type, value }` olabilir; ikisini de metne çevir. Yoksa **“Açıklama yok.”** yaz.
- `authors[].author.key` ile `/authors/{id}.json` isteği at. Yazar isteği 404 olursa ekran çalışsın ve **“Yazar bilinmiyor”** yazsın.
- İlk geçerli `covers` id'sinden `https://covers.openlibrary.org/b/id/{id}-M.jpg` adresini oluştur. `-1` geçerli kapak sayılmaz; görsel yerine yer tutucu göster.
- Eser 404 ise **“Kitap bulunamadı”** göster. Diğer sunucu/ağ hatasında `role="alert"` uyarısı ve **“Tekrar dene”** butonu göster; buton isteği yeniden denesin.
- Aynı sayfa açıkken URL'deki `workId` değişirse yeni eseri göster. 4. dersteki arama sorgusu da çalışmaya devam etsin.

## Nasıl kontrol edeceksin?

`/search?q=dune` → **Chapterhouse Dune** başlığına tıkla → `/works/OL893508W` açılsın. Sonra doğrudan `/works/OL24252290W` aç: açıklama olmadığını ve yazar isteği 404 olsa bile ekranın kaldığını gör. Platform testlerinde 500 ve `-1` kapak durumları da var.

:::tip
API cevabının eksik veya bozuk olabileceğini hesaba kat; ekranda geçerli bir eser modeli kullan.
:::
