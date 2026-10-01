---
title: "Editör, commit ve CI katmanları"
minutes: 15
kind: concept
---

# Editör, commit ve CI katmanları

Bir film kartında tırnakları ve satır sonlarını Prettier ile düzenledin. Şimdi bu kontrolü ne zaman çalıştıracağını düşün: yazarken mi, değişikliği Git'e kaydederken mi, yoksa sunucuda mı? Aynı komut bu anların birkaçında kullanılabilir; zamanlama, hatayı ne kadar erken göreceğini ve hangi dosyaların denetleneceğini değiştirir.

## İlk geri bildirim editörde

`FilmCard.tsx` üzerinde çalışırken editörün **Format on Save** özelliği dosyayı kaydettiğin anda Prettier çalıştırabilir. Bir **editör eklentisi**, editöre eklenen ve kodla ilgili yardım sunan küçük bir araçtır. Örneğin çift tırnakla yazdığın başlık kaydetme anında proje tercihindeki tek tırnağa döner.

```tsx
const title = "Kıyı";
```

Kaydetme sonrası dosyada şunu görürsün:

```tsx
const title = 'Kıyı'
```

Bu ilk örnekte tek bir dosya anında düzeldi; ekranda biçim uyarısı görmek için terminale geçmen gerekmedi. Ama bu rahatlık senin bilgisayarındaki editör ayarına bağlıdır: başka bir geliştiricinin editöründe otomatik biçimleme kapalı olabilir. O nedenle editör, hızlı kişisel geri bildirimdir; ekipte herkesin uyduğunu tek başına kanıtlamaz.

## İkinci durak: commit öncesi yerel kontrol

Birden çok değişikliği **stage etmek**, Git'e bir sonraki kayda hangi değişiklikleri dahil edeceğini seçmektir. Seçilen değişiklikleri içeren kayıt **commit** olarak adlandırılır. Git'in **pre-commit hook**'u, commit oluşturulmadan hemen önce otomatik çalışan yerel komuttur.

Örneğin `FilmCard.tsx` ile `FilmList.tsx` üzerinde değişiklik yaptın. Commit'e geçmeden önce hook, seçtiğin dosyalara hızlı lint veya biçim kontrolü çalıştırabilir. Hata bulursa commit'i durdurur; böylece düzeltmeyi aynı anda yaparsın. Bu, hatayı CI sonucunu beklemeden görmene yarar.

İkinci örnekte editör dışındaki yol devreye girdi: dosyayı farklı editörde açsan da commit anında yerel kontrol çalışabilir. Yine de hook bilgisayarında kurulu olmayabilir veya bir kişi onu atlayabilir. Bu yüzden yerel kontrol, ek güvenlik ağıdır; ortak son karar değildir.

## Üçüncü durak: CI ortak denetimi

**CI** (continuous integration), kod değişikliğini sunucuda otomatik komutlarla denetleyen süreçtir. Sinema'da bir pull request (bir değişikliği ana projeye katmak için açılan inceleme isteği) geldiğinde CI tüm kaynak dosyalarında lint ve `format:check` çalıştırabilir. Yerel hook atlanmış olsa bile sunucu aynı proje script'lerini kullanarak sonucu gösterir.

Burada iki komut adı arasındaki farkı açık tut:

```json title="package.json içinden örnek"
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint ."
  }
}
```

`format` dosyaları yazar; geliştirici biçimi yerelde düzeltmek için bunu çalıştırır. `format:check` yalnızca biçim farkını raporlar; CI'ın çalışma ağacını değiştirmeden başarısız olması beklenir. `lint` ise seçilmiş kod kurallarını çalıştırır. Aynı adımlarda her komutun ayrı bir sorusu vardır: görünüş doğru mu, kaynak kuralları sağlıyor mu?

Bu üç örnek bir merdiven oluşturdu: editör tek dosyada anında yardım eder, hook commit öncesi seçilmiş değişiklikleri kontrol eder, CI ise depodaki kuralları ortak sunucuda uygular. Erken geri bildirim düzeltmeyi kolaylaştırır; CI sonucu ise yerel tercihlerin farklılığından bağımsızdır.

![Editör, pre-commit ve CI kalite savunma katmanları](diagrams/kalite-savunma-katmanlari.svg "Geri bildirim yazarken başlar, CI'da ortaklaşır.")

## Bir değişikliğin yolunu izleyelim

`QueuePanel.tsx` üzerinde düzenleme yaptığını düşün. Tablo dosyanın ne zaman değişebileceğini ve hatayı nerede göreceğini gösteriyor:

| Sıra | Durak | Ne çalışır? | Dosya değişebilir mi? | Hata nerede görünür? |
| --- | --- | --- | --- | --- |
| 1 | Editörde kaydetme | Formatter ve lint eklentisi | Evet, format açıksa | Editörde uyarı veya biçimlenmiş dosya |
| 2 | Stage seçimi | Commit'e girecek değişiklikler belirlenir | Hayır | Git'te seçilen fark |
| 3 | Pre-commit hook | Yerel, hızlı lint/format kontrolü | Yapılandırmaya göre | Commit başlamadan terminalde |
| 4 | CI | Proje script'leri, örneğin `lint` ve `format:check` | Hayır | Pull request kontrolünde |
| 5 | İnsan incelemesi | Değişikliğin amacı ve davranışı okunur | Hayır | İnceleme yorumunda |

Özellikle dördüncü satıra dikkat et: CI'ın görevi dosyayı sessizce düzeltmek değil, commit edilmiş içeriğin kurala uyup uymadığını bildirmektir. Kontrol başarısızsa sen yerelde düzeltme yapıp yeni commit gönderirsin. CI sonra yeni commit'i tekrar denetler.

## Gerçek hata: `check` adında yazma komutu

Şu script'in adına bakınca yalnızca kontrol yaptığını sanabilirsin:

```json
{
  "scripts": {
    "format:check": "prettier --write ."
  }
}
```

Ama komut adını değil, `--write` seçeneğini incelemelisin: bu komut dosyaları değiştirmeye çalışır. CI'da bu fark iş akışını belirsizleştirir; sunucu biçimlenmiş bir çalışma ağacı oluşturabilir ama bu değişiklik commit'inde yoktur. Düzeltme, CI script'inde `prettier --check .` kullanmak ve yazma komutunu yerel düzeltmeye ayırmaktır.

Başka bir belirti de “pre-commit geçti, demek ki herkes denetlendi” düşüncesidir. Hook yalnız yerelde çalışır, kurulmamış ya da atlanmış olabilir. Bir PR CI'da yine lint hatası gösterirse bu beklenen son kontroldür; yerelde aynı script'i çalıştırıp düzeltmeyi yeni commit'e koyarsın.

## Araçları hafif tut

:::info[Derinlemesine (isteğe bağlı)]
**Husky**, Git hook komutlarını repo ile paylaşmayı kolaylaştıran bir araçtır. **lint-staged**, yalnızca stage edilmiş dosyaların listesini lint veya formatter komutuna vermeye yardım eder. Küçük projede bu iki ek araç şart değildir; önce `format`, `format:check` ve `lint` script'lerini tanımlayıp CI'da çalıştırabilirsin.

Stage edilmiş değişiklik ile dosyanın henüz seçilmemiş yerel değişiklikleri farklı olabilir. `git diff --cached` stage'e alınmış farkı gösterir; otomatik biçimleme kullanan hook sonrası commit'e girecek içeriği kontrol etmek için işe yarar. **Branch protection**, seçilmiş CI kontrolleri geçmeden ana dala birleştirmeyi engelleyen depo ayarıdır. Bu ayrıntıları hook kurmaya başladığında öğrenmen yeterli.
:::

## Özet

- Editör yazarken hızlı biçim ve lint geri bildirimi verir; kişisel ayarlara bağlıdır.
- Pre-commit hook commit öncesi yerel kontrol sunar; kurulmamış veya atlanmış olabilir.
- CI proje script'lerini sunucuda çalıştırır ve herkes için ortak sonuç üretir.
- `--write` düzeltir, `--check` yalnız denetler; CI genellikle değiştirmeyen kontrolü çalıştırır.

**Yeni terimler:** stage — sonraki commit'e girecek değişiklikleri seçme; pre-commit hook — commit öncesi yerel çalışan komut; CI — kodu sunucuda otomatik denetleyen süreç; editör eklentisi — kod yazarken ek yardım veren editör aracı.

**Kendini yokla:** Yerel hook başarılı olduğu halde CI neden yine lint çalıştırır?
*Cevap:* Hook kurulmamış veya atlanmış olabilir; CI ortak sunucu denetimidir.

**Kendini yokla:** CI'da biçim farkı göstermek için `--write` neden uygun değildir?
*Cevap:* Dosyayı değiştirmeye çalışır; CI yalnız farkı raporlamalıdır.
