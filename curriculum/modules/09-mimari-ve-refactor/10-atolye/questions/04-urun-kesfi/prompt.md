Ürün kataloğunda arama, kategori seçimi, detay ve listeye dönüş sunan keşif deneyimi kur. Kullanıcı seçimleriyle içerik birbirini izlesin.

## Gereksinimler

- Gerçek ürün kayıtları listelensin; kullanıcı metinle arayabilsin ve kategori seçebilsin.
- Bir ürünün ayrıntısı açılıp listesine dönülebilsin.
- Detaydan dönüşte önceki arama ve kategori seçimi korunmalı.
- Bekleme, boş sonuç ve servis hatası anlaşılır ve erişilebilir biçimde görünmeli.
- Paylaşılabilir seçimler adresle geri kurulmalı; geçici görünüm durumu ayrı kalmalı.
- API adresi, hata işleme ve UI işaretlemesi aynı sorumlulukta birikmemeli.
- Bu özelliğin kodu kendi anlaşılır alanı altında düzenlenmeli; ortak kod gerçek kullanıma göre paylaşılmalı.

## Örnek

Ürünlerde `beauty` kategorisini seç → bir ürünü aç → geri dön. Kategori ve ürün listesi korunur. Aramayla eşleşme yoksa boş sonuç, servis cevap vermezse hata açıklaması görünür.

## Sözleşme

- Proje: `atolye`; çalışan uygulamada erişilebilir bir ürün keşif ekranı oluştur.
- Ekran, `projects/atolye` kopyasında çalışmalı ve gerçek servisten veri göstermeli.
- Dosya listesi veya iç component adları sabitlenmez; sahiplik ve düzen rubric ile incelenir.

## Kısıtlar

- Başlamak için repo kökünde sırayla `pnpm setup:projects atolye`, `pnpm install`, `cd projects/atolye && pnpm dev` çalıştır.
- Ekranı deneyip bitince görev sayfasındaki “AI review prompt'unu kopyala” akışıyla incelet.
