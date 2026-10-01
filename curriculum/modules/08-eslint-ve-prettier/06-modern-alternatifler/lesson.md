---
title: "Lint aracı değiştirirken neyi karşılaştırırsın?"
minutes: 10
kind: concept
---

# Lint aracı değiştirirken neyi karşılaştırırsın?

Sinema'da ESLint, `useEffect` içinde kullanılan `filmId` bağımlılığını unutursan uyarı veriyor. Yeni bir proje başka bir lint aracı seçmiş olabilir. Bu, senin projenin hemen değişmesi gerektiği anlamına gelmez: önce şu an hangi hatayı görünür tuttuğunu anlaman gerekir.

Bir **lint aracı**, kaynak kodda seçilmiş sorunları arayıp mesaj veren programdır. Aracı değiştirirken yalnız açılış süresini değil, projenin gerçekten ihtiyaç duyduğu uyarıları da karşılaştır. Önce küçük bir örnekle başlayalım.

## Beklenen geri bildirimi tanı

Bir efekt film kimliğini okuyorsa bu değer değiştiğinde efektin yeniden çalışması gerekir. `useEffect`'in ikinci argümanı olan **dependency list** (bağımlılık listesi), efektin kullandığı ve değişince yeniden çalışması gereken değerleri bildirir.

```tsx
function FilmPreview({ filmId }: { filmId: string }) {
  useEffect(() => {
    loadPreview(filmId)
  }, [])

  return <p>Film: {filmId}</p>
}
```

Bu örnekte `filmId` okunuyor ama listede yok. Sinema'da mevcut ESLint ayarı bunun için uyarı veriyorsa, bu uyarı projenin korumak istediği bir davranıştır. Önce mevcut aracın neyi bulduğunu bilmek, yeni aracın sonucunu yorumlayabilmen için bir başlangıç noktası verir.

## Bir ikinci örnekle karşılaştırmayı genişlet

Şimdi aynı bileşende bağımlılık listesine `filmId` ekleyelim:

```tsx
function FilmPreview({ filmId }: { filmId: string }) {
  useEffect(() => {
    loadPreview(filmId)
  }, [filmId])

  return <p>Film: {filmId}</p>
}
```

Artık listede efektin kullandığı değer var. Beklediğin sonuç, bu kodun bağımlılık eksikliği uyarısı almaması ve önceki sürümün almasıdır. İki örnek birlikte sana bir **karşılaştırma çifti** verir: biri sorunu içeriyor, diğeri düzeltmiş durumda. Böylece aracın her şeye aynı mesajı vermesi veya hiçbir şey bulmaması gibi sonuçları fark edebilirsin.

Bir aday aracı denerken iki sürümü de ona ver. Aday uyarı vermezse gerekli React Hook kontrolü çalışmıyor olabilir; iki sürüme de aynı uyarıyı verirse kural kapsamını ya da config'i incele. Bu sonuçlardan tek başına aracın kötü olduğunu çıkarma; önce doğru ayarın çalıştığını doğrula.

## Üçüncü örnek: aynı dosya, iki araç

Bir araç geçişi için **rule parity** (kural karşılığı), eski araçta önemli olan bir kontrolün yeni araçta da benzer sonucu üretip üretmediğini anlatır. Pariteyi anlamak için aynı dosya ve aynı config beklentisini iki araçta karşılaştır:

| Kod | Mevcut ESLint'ten beklenen | Aday araçtan soracağın |
| --- | --- | --- |
| Bağımlılığı eksik `FilmPreview` | Uyarı | Aynı sorun görünür mü? |
| Bağımlılığı tamam `FilmPreview` | Uyarı yok | Geçerli kod gereksiz uyarı alıyor mu? |
| İki dosya da aynı çalışma alanında | Aynı kapsam | Aday aynı dosyaları tarıyor mu? |

Tablodaki üçüncü satır da önemlidir: bir araç doğru kuralı bilse bile dosyalarını kapsam dışında bırakmış olabilirsin. Bu yüzden aynı küçük dosyayı, aynı hata ve düzeltme çiftiyle çalıştırmak iyi bir başlangıçtır. Sonuçlar eşleşirse başka kuralları ve dosya türlerini ayrıca kontrol edebilirsin.

Hata içeren örneği çalıştırmadan sadece temiz bir dosya denemek yeterli kanıt vermez. Temiz dosyada uyarı çıkmaması beklenir; ama bu, eksik dependency'yi yakalayabildiğini göstermez. Hatanın olduğu ve olmadığı iki sürüm, aracın doğru yerde uyardığını ve doğru yerde sessiz kaldığını anlamana yardım eder.

## Kararı hızdan önce ihtiyaca bağla

Bir araç daha hızlı başlayabilir ya da daha az config isteyebilir. Fakat geçişte gereken uyarı kaybolursa, hız kazanırken bir denetimi de kaldırmış olursun. Önce Sinema'nın hangi sinyallere ihtiyacı olduğunu belirle, ardından adayın bunları aynı örneklerde verip vermediğine bak. Ancak ondan sonra çalışma süresi, editör desteği ve config bakımını tart.

Bir **template**, yeni uygulama oluştururken gelen başlangıç dosyaları ve araç seçimleridir. Yeni bir Vite projesinin bir aracı seçmesi, Sinema'nın da onu kullanması gerektiğini kanıtlamaz. Yeni proje ile uzun süredir çalışan proje farklı kurallara ve geçiş maliyetine sahip olabilir.

Öğrencinin sık yapacağı yanlış, aday araç hızlı diye eski config'i hemen silmektir. Belirti, lint süresinin kısalması ama eksik `filmId` bağımlılığının artık görünmemesidir. Sebep, araçların aynı kuralları çalıştırdığı varsayımıdır. Önce aynı hata örneğinde mesajları karşılaştır; gerekli bir uyarı yoksa ya config'i düzelt ya da mevcut kontrolü koru.

## Araç adları hakkında kısa not

:::info[Derinlemesine (isteğe bağlı)]
ESLint geniş eklenti seçenekleri sunan bir lint aracıdır; Prettier ise biçim kararlarını düzenleyen formatter'dır. Oxlint, hız odaklı bir lint aracıdır ve Rust adlı programlama diliyle yazılmıştır. Biome lint ve format işlerini aynı ürün içinde toplar. Bu tanıtımlar kuralların birebir aynı olduğu anlamına gelmez; gereken React ve TypeScript uyarılarını örnek kodlarda kontrol et.

Bazı ekipler iki lint aracını birlikte çalıştırır. Bunu yapacaksan her aracın ayrı bir sinyal verdiğinden emin ol; aynı kullanılmayan değişken için iki mesaj genellikle yeni bilgi sağlamaz. Ayrıntılı geçişte config, editör davranışı ve CI komutları da birlikte incelenir. Bu kapsamlı değerlendirme, tek bir küçük denemenin sonucundan sonra yapılır.
:::

## Özet

- Araç geçişinden önce mevcut projenin hangi uyarıları koruması gerektiğini belirle.
- Bir hatalı ve bir düzeltilmiş kod örneğini aynı aday araçta karşılaştır.
- Kural karşılığı kadar araçların hangi dosyaları taradığını da kontrol et.
- Hız ve yeni proje template'i, gerekli uyarıların yerini tutmaz.

**Yeni terimler:** lint aracı — kaynak kodda seçilmiş sorunları bulan program; dependency list — efektin kullandığı ve değişince yeniden çalışmasını gerektiren değerleri bildiren liste; rule parity — eski ve yeni araçtaki önemli kontrollerin benzer sonuç vermesi; template — yeni proje için gelen başlangıç dosyaları ve araç seçimi.

**Kendini yokla:** Aday araç hızlı ama eksik effect bağımlılığını bulamıyor. Geçişi tamamlanmış sayar mısın?
*Cevap:* Hayır; gerekli bir uyarı kaybolmuştur. Kuralı çalışır hale getirmeden mevcut kontrolü kaldırmamalısın.

**Kendini yokla:** Yalnızca geçerli bir dosyada uyarı çıkmadığını görmek neyi kanıtlamaz?
*Cevap:* Adayın hatalı dosyada eksik bağımlılığı yakalayabildiğini kanıtlamaz.
