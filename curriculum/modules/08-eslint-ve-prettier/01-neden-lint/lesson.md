---
title: "Neden lint?"
minutes: 7
kind: concept
---

# Neden lint?

:::pain[Problem]
Sinema v1’de detay sayfası 550’den 155’e geçince eski filmi gösteriyor. `tsc -b` temiz; `pnpm dev` açılıyor. Bir de eskiden kalmış `import MovieCard` var. Hangi satırları gözden geçireceksin?
:::

## Önce bildiğin yöntem

Dosyayı elle oku; `useEffect` içinde `id` kullanılıp dependency array’de bulunmadığını ve `MovieCard` import’unun artık kullanılmadığını fark et. Bir dosyada yapılabilir. Beş sayfa ve her değişiklikte tekrar etmek zorlaşır.

## ESLint neyi kontrol eder?

ESLint kodu ayrıştırır ve **kuralları** çalıştırır. Çıktı `ruleId`, satır ve mesaj taşır. `no-unused-vars` gibi genel kurallar çöplüğü gösterir; React eklentileri Hook kullanımı gibi framework bilgisini ekler. Lint bir statik analizdir: uygulamayı çalıştırmadan olası hataları gösterir, fakat her kullanıcı davranışını kanıtlamaz.

```js title="Örnek lint çıktısı"
{
  ruleId: 'no-unused-vars',
  message: "'MovieCard' is defined but never used.",
  line: 1
}
```

İlk kod görevinde bu çıktıyı üreten dosyayı düzelteceksin. Test, ESLint’in Node API’siyle gerçek kaynak metni lint edecek. Böylece “güzel görünüyor” yerine somut `errorCount` göreceksin.

## Tip kontrolüyle ilişkisi

TypeScript `id` değişince effect’in tekrar çalışması gerektiğini söylemez. `noUnusedLocals` açıksa bazı boş import’ları yakalayabilir; bizim TS kontrolünde bu ayar açık değil. ESLint kural seçimiyle bu boşluğu kapatır. Testler de çalışma zamanı davranışını ayrıca korur.

:::mistake[Sık hata]
Konsoldaki uyarıyı susturmak için kuralı kapatmak hatayı çözmez. Önce kodun niyetini kontrol et: import gereksizse sil; kullanılması gerekiyorsa doğru yere bağla.
:::

:::sector
CI’da `lint` komutu değişikliği birleştirmeden önce aynı kuralları herkes için çalıştırabilir. Editör uyarısı hızlı geri bildirimdir; terminal sonucu ortak kayıttır.
:::
