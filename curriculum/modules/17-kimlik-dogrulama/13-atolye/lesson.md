---
title: "Oturum ve hata akışı"
minutes: 7
kind: practice
---

# Oturum ve hata akışı

Bu atölyede üç kısa Sinema akışındaki belirtiyi inceleyip onaracaksın: kayıtlı oturumla açılış, süresi dolan oturum ve başarısız girişten sonra yeniden deneme. Görevler çözüm yolunu adım adım söylemez. Önce belirtiyi üret, sonra hangi state, istek ya da ekrandaki mesajın beklenmedik kaldığını bul.

:::model[Effect yaşam döngüsü]
Effect, render’dan sonra çalışan bir React işlevidir. Dependency (effect’in izlediği değer) değişince önceki effect’in cleanup’ı (önceki çalışmayı kapatan fonksiyon) çalışır, ardından yeni effect başlar. İstek cevabı geç gelirse cleanup yardımıyla artık geçerli olmayan cevabın ekranı değiştirmesini engelle.
:::

İlk akışta, tarayıcıda zaten token varken profilin açılışta görünmesini ve profil isteğinin bir kez gitmesini takip et. Ardından normal form girişini dene. İki yolu da şu sırayla izle: bileşen hangi başlangıç değerini aldı, hangi olay istek başlattı, cevap gelince hangi ekran göründü? Bu sıra, başlangıçta token’ın kaybolduğu yerle aynı isteğin iki kez başladığı yeri ayırmana yardım eder.

:::model[Token yenileme]
Access token ile yapılan istek `401` (kimlik bilgisi kabul edilmedi yanıtı) alırsa refresh token yeni bir token çifti almak için kullanılır; profil isteği yeni access token’la tekrar denenir. Bu yenileme de başarısız olabilir, bu yüzden her hata yolunun kullanıcıyı bekleme durumundan çıkardığını kontrol et.
:::

İkinci akışta önce süresi dolmuş oturumla profil yenilemeyi dene, sonra yanlış parola ve doğru parolayla giriş sırasını izle. Beklenen geçişi tabloya dök:

| Olay | Beklenen durum |
| --- | --- |
| Profil isteği başlar | Bekliyor |
| Access token reddedilir | Token yenileme deneniyor |
| Yenileme başarılı olur | Profil yeniden istenir, sonra görünür |
| Yenileme başarısız olur | Bekleme biter; tekrar giriş yolu görünür |
| Giriş yeniden gönderilir | Önceki hata mesajı yeni denemeye taşınmaz |

Bu sırayı görmek, yalnızca ekrandaki sonuca bakmaktan daha yararlıdır: sonsuz yüklenme çoğunlukla bekleme state’inin bir hata dalında kapanmamasını, eski hata metni ise yeni denemenin eski state’i temizlememesini işaret eder.

:::model[Yarış koşulu]
Birden fazla asenkron iş farklı sırada tamamlanabilir. Token değiştiğinde önceki isteğin cevabı sonradan gelirse güncel hesabın ekranını ezmemeli; eski sonucu yok say ya da isteği iptal et.
:::

Son akışta yanlış bilgilerle gönderim yapıp uyarının göründüğünü ve kullanıcı adının korunduğunu kontrol et. İstek sürerken düğmeye art arda basmayı da dene: tek gönderim tek ağ isteği olmalı. Ekran okuyucuya hata bildiren `role="alert"` bir işarettir; hata mesajının yalnızca görünür olması herkesin onu duyacağı anlamına gelmez.

:::mistake[Yükleniyor durumunda kalma]
Belirti → profil yenileme başarısız olunca ekranda bekleme sürüyor. Neden → hata dalı state’i başka bir duruma geçirmiyor. Düzeltme → isteğin başarı, hata ve yenileme başarısızlığı yollarının her birinde hangi ekranın gösterileceğini tek tek izle.
:::

## Nasıl çalış

Her senaryoda aynı küçük döngüyü kullan: belirtileri yeniden üret, ilgili state ve istek sırasını not et, bir davranışı düzelt, sonra aynı denemeyi tekrarla. Takılırsan ipuçlarını sırayla aç; önce yönü bulmaya çalış, sonra yönteme bak, en son kısa iskeleye geç. Böylece hazır çözümü kopyalamadan kendi teşhisini yaparsın.

## Özet

- Açılışta kayıtlı token ve formdan gelen token aynı profil akışına ulaşmalı.
- Her istek yolunda başarı ve hata sonrasında arayüzün hangi durumda olduğunu izle.
- Yenileme başarısızsa bekleme bitmeli; yeni giriş denemesi eski hatayı taşımamalı.
- Kullanıcı adı korunmalı, hata erişilebilir olmalı ve sürmekte olan gönderim tekrarlanmamalı.

**Terimler**

- **Cleanup:** Dependency değişince ya da component kaldırılınca önceki effect’i kapatan fonksiyon.
- **401:** İsteğin geçerli kimlik bilgisiyle yetkilendirilmediğini bildiren HTTP yanıt kodu.
- **Race condition (yarış durumu):** İşlerin farklı bitiş sırası yüzünden eski sonucun güncel ekranı bozması.

**Kendini yokla:** Yenileme isteği de başarısız olursa arayüz neden yüklenmede kalmamalı?

Cevap: Kullanıcının beklemesini bitirip tekrar giriş yapabileceği bir duruma geçmeli.

**Kendini yokla:** Başarısız girişten sonra kullanıcı adı neden silinmemeli?

Cevap: Kullanıcı yalnızca hatalı bilgiyi düzeltebilsin; tekrar baştan yazmak zorunda kalmasın.
