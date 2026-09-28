Kitaplık arama sonuçlarında seçilen bir kitabın detay sayfasını oluşturman, Open Library eser ve bağımlı yazar verilerini güvenle çekip birleştiren dayanıklı bir eser görünümü kurman gerekiyor.

## Gereksinimler

Eser detay sayfasını (`/works/:workId`) şu davranışlarla geliştir:

1. **Rota ve Gezinme:**
   - Arama sonuçlarındaki kitap başlıkları `/works/{id}` adresine yönlendiren bağlantılar olmalıdır.
   - Aynı sayfa açıkken URL'deki `workId` parametresi değiştiğinde yeni eserin bilgileri getirilmelidir.
2. **Eser Verisi ve Başlık:**
   - Eser bilgisi `GET https://openlibrary.org/works/{id}.json` adresi üzerinden çekilmelidir.
   - Eser başlığı seviye 1 başlık (`h1`) olarak gösterilmelidir.
3. **Açıklama Alanı Normalizasyonu:**
   - API'den gelen `description` alanı düz metin veya `{ type: string, value: string }` biçiminde bir nesne olabilir. Her iki durum da düzgün metne dönüştürülmeli; açıklama yoksa ekranda tam olarak **“Açıklama yok.”** ifadesi yer almalıdır.
4. **Bağımlı Yazar İsteği:**
   - Eser kaydındaki `authors[].author.key` referansı kullanılarak `GET https://openlibrary.org/authors/{id}.json` isteği atılmalıdır.
   - Yazar isteği 404 dönerse veya başarısız olursa ana eser ekranı çalışmaya devam etmeli ve yazar alanında **“Yazar bilinmiyor”** gösterilmelidir.
5. **Kapak Görseli:**
   - `covers` dizisindeki ilk geçerli pozitif id kullanılarak `https://covers.openlibrary.org/b/id/{id}-M.jpg` adresi oluşturulmalıdır.
   - `-1` değeri veya negatif sayılar geçerli kapak sayılmaz; bu durumda kırık görsel yerine yerel bir yer tutucu gösterilmelidir.
6. **Hata ve Durum Yönetimi:**
   - Eser isteği 404 dönerse ekranda **“Kitap bulunamadı”** mesajı görünmelidir.
   - Diğer sunucu veya ağ hatalarında `role="alert"` içeren bir uyarı ve **“Tekrar dene”** butonu gösterilmeli; butona basıldığında istek tekrarlanmalıdır.

## Örnek

Kullanıcı `/works/OL893414W` adresine gider:
- Eser başlığı `h1` içinde "Dune" olarak belirir.
- Bağımlı yazar isteği tamamlanır ve yazar adı "Frank Herbert" olarak görüntülenir.
- Kapak görseli ve kitap açıklaması eksiksiz ekrana basılır.

## Sözleşme

- Dışa aktarılan rota ağacı:
  - `src/app/routes.tsx` içinde `createRoutes(queryClient)` fonksiyonuna `/works/:workId` rota tanımı eklenmelidir.
- Arayüz metinleri:
  - Eksik açıklama metni: `Açıklama yok.`
  - Eksik/bulunamayan yazar metni: `Yazar bilinmiyor`
  - Eser bulunamadı mesajı: `Kitap bulunamadı`
  - Hata uyarısı rolü: `role="alert"`, buton: `Tekrar dene`

## Kısıtlar

- Yazar isteği başarısız olsa bile eser ekranı sağlam kalmalıdır; yazar hatası eser sayfasını çökertmemelidir.
