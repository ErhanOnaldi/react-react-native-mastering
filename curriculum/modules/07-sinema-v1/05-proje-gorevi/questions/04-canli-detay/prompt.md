Kullanıcı bir film kartına tıkladığında veya favoriler sayfasına gittiğinde filmin detayları, afişi ve oyuncu kadrosu canlı veritabanından çekilmelidir. Film detay ve favoriler sayfalarını canlı API'ye bağla.

## Gereksinimler

- Film detay sayfasında rota parametresinden film kimliği (`id`) okunmalıdır.
- Okunan film kimliği geçerli bir pozitif tam sayı değilse ağ isteği gönderilmemeli; `role="alert"` içinde "Geçersiz film adresi" hata mesajı gösterilmelidir.
- Geçerli kimlik için film detayları ve oyuncu kadrosu (`append_to_response=credits,videos` ve `language=tr-TR` parametreleriyle) çekilmelidir.
- Ekranda filmin başlığı (`heading`), özeti, varsa afişi ve oyuncu kadrosundaki (`credits.cast`) oyuncu adları gösterilmelidir.
- Afiş yolu bulunmayan filmlerde (`poster_path: null`) görsel alanı güvenle yönetilmeli, arayüz çökmemelidir.
- Yükleme ve hata durumları için kullanıcıya açıklayıcı durum metinleri sunulmalı; mevcut favori ekleme/çıkarma düğmesi çalışmaya devam etmelidir.
- Favoriler sayfasında, favoriye eklenmiş tüm film kimliklerinin detayları harici servisten çekilerek film kartları listelenmelidir. Favori listesi boşken ağ isteği atılmamalı ve boş liste durumu gösterilmelidir.

## Örnek

- Kullanıcı `/movie/550` adresine gittiğinde başlıkta "Dövüş Kulübü" ve kadroda "Brad Pitt" yer alır.
- Kullanıcı `/movie/abc` gibi geçersiz bir adrese gittiğinde ağ isteği atılmadan "Geçersiz film adresi" uyarısı görünür.
- Kullanıcı "Dövüş Kulübü" filminde "Favoriye ekle" düğmesine tıklayıp `/favorites` sayfasına geçtiğinde listede "Dövüş Kulübü" kartı görünür.

## Sözleşme

- Dosya ve export: `src/pages/MovieDetailsPage.tsx` → `MovieDetailsPage` (named export)
- Dosya ve export: `src/pages/FavoritesPage.tsx` → `FavoritesPage` (named export)
- Rota yapısı: `src/router.tsx` dosyasında `/movie/:id` ve `/favorites` yolları.
- Geçersiz kimlik hatası: `role="alert"` ögesi içinde `/geçersiz film adresi/i` kalıbı.
- İstek: `/movie/:id` yolu (`append_to_response=credits,videos` ve `language=tr-TR` parametreleriyle).
