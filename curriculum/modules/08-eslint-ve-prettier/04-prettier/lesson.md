---
title: "Prettier ile ortak biçim"
minutes: 8
kind: concept
---

# Prettier ile ortak biçim

:::pain[Problem]
Sinema’daki `MovieCard` bir bilgisayarda çift tırnak ve noktalı virgülle, diğerinde tek tırnak ve noktalı virgülsüz kaydediliyor. PR’da gerçek değişikliği yüzlerce biçim satırı arasında arıyorsun.
:::

## Biçimi otomatikleştir

Prettier 3.9 kodu ayrıştırır ve seçilen seçeneklerle yeniden yazar. `singleQuote`, `semi` ve `printWidth` ortak dosyada yaşar. Kodun anlamını veya Hook bağımlılığını düzeltmez; o ESLint’in alanıdır.

```json title=".prettierrc.json"
{
  "singleQuote": true,
  "semi": false,
  "printWidth": 100
}
```

`prettier.format(source, { parser: 'typescript', ...options })` bir Promise döndürür. Kod görevinde bu API gerçek girdi ve beklenen çıktıyla çalışacak. `prettier --check .` yalnızca farklı biçimli dosyaları bildirir; `--write` değiştirir.

## ESLint ile sınır

`eslint-config-prettier/flat` config dizisinin **sonuna** gelir ve biçimle çakışan lint kurallarını kapatır. ESLint mantıksal hataları; Prettier biçimi kontrol eder. Prettier’ın bir Hook hatasını yakalamasını bekleme.

## Tailwind v4 class sırası

`prettier-plugin-tailwindcss` class’ları önerilen sıraya dizer. Tailwind v4’te tema `src/index.css` içindeyse `.prettierrc.json` içinde `"plugins": ["prettier-plugin-tailwindcss"]` ve `"tailwindStylesheet": "./src/index.css"` yaz. Plugin stylesheet’i bu yoldan bulur; eski `tailwindConfig` JS ayarı v4 için doğru adres değildir.

:::mistake[Sık hata]
Plugin ayarının adı tam olarak `tailwindStylesheet`; `tailwindStyleSheet` yazımı çalışmaz. Dosya yolu config’in bulunduğu klasöre göre çözülür.
:::

:::sector
Kod incelemesinde biçim tartışmasını azaltmak için `format:check` CI’da çalışır. Kaydederken format ise aynı sonucu daha erken görmeni sağlar.
:::
