Sinema uygulamasının v1 sürümü çalışır duruma geldi; ancak saf veri çekme yönteminin getirdiği mimari ve performans maliyetlerini somut kanıtlarla belgelemek gerekir. Uygulamadaki gözlemlerini yapılandırılmış bir acı günlüğü dosyasında topla.

## Gereksinimler

- Belgede en az üç bağımsız mimari veya performans gözlemi yer almalıdır.
- Her gözlem şu dört başlıklı şablonu izlemelidir:
  - **Nasıl tekrarlanır:** Adım adım kullanıcı rotası ve eylemleri.
  - **Ne görüldü:** Ağ sekmesinde atılan istek sayısı veya ekrandaki görsel davranış.
  - **Olası neden:** Bileşen yaşam döngüsü, unmount/mount süreci, önbellek eksikliği veya bağımlılık dizisi analizi.
  - **Kullanıcı etkisi:** Arayüzün titremesi, gereksiz yükleme ekranları veya bayat içerik kalması.
- Gözlemler arasında arama rotasından detaya gidip geri dönüldüğünde aynı ağ isteğinin tekrarlanması (tarayıcı önbelleğinin neden yetersiz kaldığı) mutlaka irdelenmelidir.
- Farklı sayfalardaki yükleme (`loading`) ve hata (`error`) durumlarının kod tekrarı somut dosya adlarıyla belgelenmelidir.
- Aynı detay rotasında farklı bir filme geçildiğinde (`/movie/550` → `/movie/27205`) eski filmin ekranda kalma riski ve bağımlılık dizisi incelenmelidir.

## Örnek

Günlük girdilerinden biri için beklenen biçim örneği:

```markdown
### 1. Geri Navigasyonda Tekrar Eden İstek
- **Nasıl tekrarlanır:** `/search?q=Matrix` açılır, sonuçlar geldikten sonra bir filme tıklanıp detaya gidilir ve tarayıcının geri tuşuna basılır.
- **Ne görüldü:** Ağ sekmesinde aynı `/search/movie?query=Matrix` isteği ikinci kez gönderildi.
- **Olası neden:** Sayfa değiştiğinde arama bileşeni unmount oldu ve state sıfırlandı. Geri dönüldüğünde bileşen yeniden mount oldu ve effect baştan çalıştı.
- **Kullanıcı etkisi:** Kullanıcı daha önce gördüğü sonuçlar için yeniden "Filmler yükleniyor..." ekranını gördü; gereksiz ağ trafiği oluştu.
```

## Sözleşme

- Dosya: `projects/sinema/NOTES.md` (veya proje kökündeki `NOTES.md`)
- Değerlendirme: Bu görev rubric kriterleriyle değerlendirilir.

## Kısıtlar

- Bu aşamada harici önbellek veya durum yönetim kütüphanesi eklenmemeli; yalnızca mevcut durum belgelenmelidir.
