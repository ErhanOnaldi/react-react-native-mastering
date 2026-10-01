---
title: "Formdaki kayıp durumları teşhis et"
minutes: 6
kind: practice
---

# Formdaki kayıp durumları teşhis et

Bu atölyede iki form davranışını inceleyeceksin: seçilen liste değişince doğru başlangıç değerlerini göstermek ve sunucu reddedince kullanıcının girdisini korumak. Bir belirtiyi yeniden üret, hangi değerlerin değiştiğini izle, sonra en küçük düzeltmeyi yap.

:::model[Form başlangıcı ve kayıt sonucu]
`defaultValues`, RHF formu ilk kurulduğunda başlangıç değerlerini verir; yeni `props` gelmesi onları kendiliğinden değiştirmez. `isDirty`, güncel değerlerin bu başlangıçtan farklı olup olmadığını söyler. `reset(values)` değerleri ve karşılaştırma başlangıcını yeniler. Ağ hatası ise kaydın tamamlandığı anlamına gelmez; formu başarı koşuluna göre temizle.
:::

## Başlangıçtan sonuca doğru izle

İlk olarak Sinema'daki seçili koleksiyon adını düşün. Liste A ekranda ve form başlangıcı A'nın adı; şimdi liste B seçiliyor. B'nin prop'u değişmiştir ama aynı form duruyorsa input hâlâ A'yı gösterebilir. Belirtiyi gözle: başlık B'yi mi söylüyor? Formun hangi anda yeni başlangıç alması gerektiğini belirle.

İkinci örnekte aynı koleksiyon üzerinde çalışıyorsun. Henüz alanı değiştirmediysen `isDirty` false kalır; bu yüzden Kaydet işlemini kapalı tutmak gereksiz kayıt çağrısını engeller. Açıklamaya bir kelime ekleyince form başlangıçtan ayrılır ve kaydetme anlamlı hale gelir. Kaydetme başarılı olup değerler onaylandığında form yeni başlangıcı benimsemeli; böylece aynı ekranda artık bekleyen değişiklik yoktur.

Üçüncü örnekte film puanı sunucuya gönderilir. İstek sürerken bekleme durumunu göster, cevap geldiğinde sonucu ayırt et. Hata olursa kullanıcı aynı puanla yeniden deneyebilmeli; başarı olursa eski hata mesajı ekranda kalmamalı.

| Sıra | Olay | Form değeri | Form durumu / ekran |
|---|---|---|---|
| 1 | Yeni kayıt seçilir | Yeni kaydın değerleri başlangıç olur | `isDirty` false; Kaydet kapalı |
| 2 | Kullanıcı alanı değiştirir | Güncel değer başlangıçtan ayrılır | `isDirty` true; Kaydet açılır |
| 3 | İstek başlar | Kullanıcının değeri durur | Düğme bekleme boyunca kapalı |
| 4a | Sunucu hata verir | Değer korunur | Hata görünür; yeniden deneme mümkün |
| 4b | Sunucu başarı verir | Onaylanan değer yeni başlangıç olur | Hata kalkar; değişiklik kalmadığı için Kaydet kapanır |

İlk iki adım form durumunu, son ikisi sunucu sonucunu anlatır; alanın değişmiş olması kayıt kabul edildi demek değildir. **Remount**, component'i kaldırıp yeni bir örnek olarak kurmaktır; başlangıcı yenileyebilir ama yerel arayüz durumunu da sıfırlar.

:::mistake[Hata cevabında puan kayboldu]
**Belirti:** Sunucu isteği reddediyor; ekranda artık seçili puan yok. → **Neden:** Form, başarı olup olmadığı anlaşılmadan temizleniyor. → **Düzeltme:** Temizleme ve eski hatayı kaldırma işini başarı dalına koy; hata dalında değeri koruyup mesajı göster.
:::

## Çalışırken neyi kontrol et

Düzeltmeyi yalnız JSX'te arama: seçilen kaydı ve RHF başlangıç değerini, sonra da `isDirty` sonucunu izle. Sunucu örneğinde submit öncesi, bekleme ve cevap sonrası değeri karşılaştır; başka kayıtla ve yeniden denemeyle kontrol et.

:::model[Alan hatası ve erişilebilir ilişki]
Hata mesajı ilgili alanın yanında görünmeli ve `aria-describedby` ile alana bağlanmalı; `aria-invalid` geçersiz durumu belirtir. Bu atölyedeki sunucu hatası form genelindedir; alan doğrulama hatalarıyla karıştırma.
:::

## Özet

- Yeni `props` almak mevcut formun başlangıç değerlerini otomatik değiştirmez.
- `isDirty`, değerlerin mevcut başlangıçtan ayrıldığını gösterir; değişiklik yokken kayıt çağırma.
- Sunucu yanıtı gelmeden alanı temizleme; hatada tekrar deneme değerini koru.
- Düzeltmeyi yeni kayıt seçimi, değişiklik ve hata/başarı adımlarında yeniden gözle.

**Terimler:** **`defaultValues`** — RHF'nin form için başlangıç değerleri. **`isDirty`** — güncel değerlerin başlangıçtan farklı olup olmadığını gösteren durum. **Remount** — component'i kaldırıp yeni bir örnek olarak kurma.

**Kendini yokla:** Kayıt seçimi değiştiği halde input niçin eski adı gösterebilir? Başlangıç değerleri yalnız form ilk kurulduğunda uygulandığı için. Sunucu hata verirse kullanıcı neden puanı yeniden seçmek zorunda kalmamalı? Aynı değerle yeniden deneyebilmesi için.
