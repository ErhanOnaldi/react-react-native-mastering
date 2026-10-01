---
title: "Acı günlüğü: Saf veri çekmenin sınırları"
minutes: 8
kind: review
---

# Sinema'nın pürüzlerini kaydet

Sinema v1'i kullanırken gördüğün pürüzleri bu derste kanıta dayalı kısa notlara çevireceksin. Amaç çözüm eklemek değil: hangi adımlarda sorun çıktığını, ekranda veya Network sekmesinde ne gördüğünü ve olası nedeni yazmak.

:::model[Effect yaşam döngüsü]
Effect, bileşen ekrana geldiğinde kurulur; bağımlılığı değiştiğinde temizlenip yeniden kurulur; bileşen ekrandan kalktığında da temizlenir. `Unmount`, bileşenin ekrandan kaldırılmasıdır. Yerel state o bileşende tutulduğu için, geri dönünce bileşen yeniden kurulursa eski sonuçları kendiliğinden yanında getirmez.
:::

:::model[HTTP önbellek kararı]
Tarayıcı sakladığı bir cevabı doğrudan kullanabilir ya da güncel olup olmadığını sunucuya sorabilir. Bu HTTP önbelleği ağ cevabıyla ilgilenir; React sayfasının `data` ve `loading` state'ini saklamaz. Bu yüzden geri dönüşte bileşen yeniden yüklenirken bekleme görünmesi ve bir ağ kontrolü yapılması mümkündür.
:::

Günlüğe en az üç ayrı gözlem yaz. Örneğin aramadan detaya gidip geri dön; aynı arama isteği yeniden gidiyor mu ve sonuçlar gelene kadar ekranda ne var, bak. Sonra `HomePage`, `SearchPage`, `MovieDetailsPage` ve `FavoritesPage` dosyalarında yükleme (`loading`) ve hata (`error`) dallarının nasıl tekrarlandığını incele. Son olarak `/movie/550` adresinden uygulama içindeki başka bir film detayına geç; başlık ve isteğin yeni kimliği izleyip izlemediğine dikkat et.

Her notta dört şeyi kendi cümlelerinle kaydet: nasıl yeniden gördüğün, ne gördüğün, olası neden ve kullanıcıya etkisi. Network sekmesinde aynı endpoint ve sorgu parametrelerini karşılaştır; yalnızca ekranda gördüğün tahmine dayanma. Neden konusunda emin değilsen bunu kesin gerçek gibi yazma: gözlemi ve olası açıklamayı ayrı tut.

## Özet

- Her gözlem tekrarlanabilir bir yol ve görülebilir kanıt içersin.
- HTTP önbelleği cevabı ele alır; bileşen state'ini tek başına korumaz.
- Rota değişiminde aynı bileşen kalabilir; effect yeni film kimliğine bağlı değilse eski veri ekranda kalabilir.
- `Unmount`: bileşenin ekrandan kaldırılması. `HTTP önbelleği`: tarayıcının ağ cevaplarını yeniden kullanma veya doğrulama mekanizması.

### Kendini yokla

**Debounce, geri dönüşte aynı arama isteğinin yeniden gitmesini neden tek başına engellemez?**  
Debounce hızlı değişen arama metnini bekletir; önceki cevabı saklamaz. Sayfa yeniden kurulunca arama effect'i tekrar çalışabilir.

**Eski film başlığı rota değişiminden sonra kalıyorsa neyi kontrol edersin?**  
Detay verisini çeken effect'in yeni film `id` değerini bağımlılık olarak izleyip izlemediğini kontrol ederim.
