---
title: "Sinema’da kalıcı test alışkanlığı kur"
minutes: 7
kind: project
---

# Sinema’da kalıcı test alışkanlığı kur

:::pain[Sinema’da ne oldu?]
Platformdaki egzersizler geçiyor ama Sinema’nın kendi test komutu yok. Projedeki bir refactor sonrasında arama davranışı sessizce bozulursa aynı güvenceyi nasıl tekrar çalıştıracaksın?
:::

## Proje içindeki test akışı

Kalıcı testler uygulamanın yanında yaşar ve geliştirici her değişiklikte yeniden çalıştırabilir. Proje ayarı test ortamını tanımlar; script tek komutla runner’ı başlatır; test dosyaları davranış sözleşmelerini taşır. Bir test kırmızıya döndüğünde geliştirici değişikliğin beklenen davranışı bozduğunu görür.

Bu projede farklı sınırlar birlikte çalışır. Saf biçimleme için doğrudan girdi ve çıktı karşılaştırılır. Ağ client’ında dış fetch davranışı kontrol altına alınır. Zamana bağlı hook’ta gerçek bekleme yerine sanal saat ilerletilir. Her sınırın setup ve cleanup’ı olmalıdır; bir testteki fake global diğerini etkilememelidir.

## Değişikliği doğrula

Önce proje içinde bulunan Vite ayarlarını ve bağımlılık sürümlerini incele. Mevcut alias, plugin ve env ayarlarını koruyarak test ortamını ekle. Runner API’lerini dosyada açıkça import et; test adları Türkçe davranış cümleleri olsun.

1. Test komutunu tek seferlik çalıştır.
2. Beklenen değeri geçici olarak yanlış yapıp kırmızı sonucun geldiğini gör.
3. Beklentiyi geri al ve yeşil sonucu doğrula.
4. Ağ ve timer gibi global değişiklikleri testten sonra temizle.

Test dosyasının varlığı tek başına kalite değildir. Yanlış değerle kırmızı sonuç görmek, assertion’ın çalıştığını kanıtlar; önemli davranışları kapsamak ise test tasarımının sorumluluğundadır. Hata raporunda ad ve beklenen/gelen değer geliştirme sırasında hızlı teşhis sağlar.

:::mistake[Script’i güvence sanmak]
Belirti: pnpm test başarılı ama beklenen davranış hiç ölçülmüyordur. → Neden: Script yalnızca test runner’ı başlatıyor; anlamlı assertion eklenmemiştir. → Düzeltme: Her test için hangi bozuk davranışta kalacağını belirle.
:::

:::sector
Ekip projelerinde test komutları yerelde ve CI’da aynı biçimde çalışır. Kalıcı testler geçmiş regresyonları korur; yeni davranış ekleyen değişiklikler de aynı sözleşmeye yeni örnekler ekler.
:::

## Özet

- Proje config’i ortamı, script test komutunu, dosyalar davranış sözleşmesini tanımlar.
- Saf fonksiyon, ağ sınırı ve zaman davranışı farklı kontrol yöntemleri ister.
- Setup ve cleanup testleri birbirinden bağımsız kılar.
- Yanlış beklentiyle geçici kırmızı sonuç, testin gerçekten çalıştığını gösterir.

**Kendini yokla:** Yeni bir testin anlamlı olduğunu ne gösterir? Bilinen yanlış davranışta kalması ve gereksinimi açıkça ölçmesi.
