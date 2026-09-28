---
title: "Asenkron belirtilerden başlayarak düzelt"
minutes: 5
kind: practice
---

# Asenkron belirtilerden başlayarak düzelt

:::pain[Problem]
Arama alanı boşken eski sonuç birkaç an sonra geri geliyor. Detay sayfasında istek başarısız oluyor ama yükleme göstergesi ekranda kalıyor. İki sorun da ağın zamanlamasında görünür, fakat kullanıcı yalnızca bozuk sonucu görüyor.
:::

:::model[Yarış koşulu]
İstekler başladıkları sırayla tamamlanmayabilir. Yeni bir arama veya kimlik değiştiğinde önceki iş artık geçerli değilse onun state’e yazma hakkını kaldır; testte de eski cevabı yeni durumdan sonra tamamlat. Buradaki belirtiler, asenkron geçişleri gerçek kullanıcı akışında gözlemletir.
:::

## Önce belirtiyi tekrar et

Her çalışma, ekranda görünen bir durumdan başlar. Arama görevinde metni girip sonra temizle; detay görevinde hata cevabını alıp yeniden dene ve farklı kayda geç. Gözlediğin sorunu tekrar üreten en kısa akışı not et. İlk adımda uygulamayı baştan tasarlama: önce hangi state’in bayat kaldığını veya hangi geçişin eksik olduğunu ayırt et.

Kendine şu soruları sor: Boş giriş gerçekten yeni bir arama anlamına geliyor mu? Önceki isteğin cevabı hâlâ bu ekrana ait mi? HTTP 500 uygulamanın başarı yolundan mı geçti? Retry sonrası status hangi film kimliğine bağlı? Bu sorular, hatayı doğru sınırda daraltır.

## Çalışırken kanıt topla

1. İlgili kontrolü rol ve erişilebilir adıyla bul; kullanıcı etkileşimini `user-event` ile yeniden üret.
2. DOM’da status, başlık ve alert değişimini zaman sırasıyla izle.
3. Gerekirse MSW ile gecikmeli cevap veya HTTP hatası oluştur.
4. Bir kez çalıştırıp belirtinin tekrarlandığını doğrula; sonra düzeltmeyi uygula.
5. Eski cevap yeni ekrana yazabiliyor mu ve hata sonrası yükleme kapanıyor mu diye tekrar bak.

Çözümün yalnızca assertion’ı susturmadığından emin ol. Boş aramada ağ isteği atılmamalıysa bu davranış korunmalı; film kimliği değişince önceki hata yeni filme taşınmamalı. Aynı testte bütün olasılıkları karıştırmak yerine, bir belirtinin tekrar adımlarını ve beklenen son görünümü net tut.

:::sector
Hata ayıklarken ekipler önce kısa bir tekrar senaryosu yazar ve Network/DOM durumlarını karşılaştırır. Yarış koşulları normal internet bağlantısında her zaman görünmeyebilir; kontrollü yanıt sırası onları güvenli ve tekrar edilebilir hale getirir.
:::

## Özet

- Görevi kullanıcı belirtisini en kısa yoldan tekrarlayarak başlat.
- DOM’daki durumların zaman içindeki sırasını izle.
- Eski isteğin yeni ekrana yazıp yazmadığını kontrol et.
- HTTP hata yanıtından sonra loading’in kapanması gerektiğini unutma.
