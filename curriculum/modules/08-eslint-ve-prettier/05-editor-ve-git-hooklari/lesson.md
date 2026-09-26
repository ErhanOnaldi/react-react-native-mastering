---
title: "Editör ve Git hook’ları"
minutes: 7
kind: concept
---

# Editör ve Git hook’ları

:::pain[Problem]
Sinema’da `MovieCard.tsx`’i sen formatladın; ekip arkadaşın kaydettiğinde dosya tekrar değişti. Bir commit’te 40 dosyalık biçim farkı oluştu ve eski film hatası arada kayboldu.
:::

## Kontrolün çalıştığı zaman

Aynı kalite kuralı farklı anlarda çalışabilir: editör kaydederken hızlı geri bildirim verir, Git hook commit öncesi seçili dosyaları kontrol eder, CI ise herkes için ortak son kapıdır. Bu katmanlar farklı amaçlar taşır; birinin atlanabilir olması diğerinin değerini azaltmaz. Hepsi repodaki aynı config'e dayanmalıdır.

Sinema'da ekip üyelerinin dosyayı farklı biçimde kaydetmesi önceki Prettier kararının uygulama sorunudur. Şimdi kuralın yalnız belgede kalmamasını sağlıyorsun. CI'nın görevi dosyayı sessizce değiştirmek değil farkı görünür kılmaktır.

## Geri bildirimi erkene çek

Önce tek kaynak: `.prettierrc.json` ve `eslint.config.js`. Editörde “format on save” ve Prettier varsayılan formatter seçilirse kaydederken aynı kurallar uygulanır. Editör ayarı kişisel olabilir; repodaki `format:check` komutu ekip için kesin ölçüdür.

`package.json` script’leri terminalden ve CI’dan aynı şekilde çağrılır:

```json title="package.json"
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

`.prettierignore` içine `dist`, `coverage` gibi üretilmiş klasörler girer. ESLint 10 ignore listesi ise flat config’te yer alır; `.eslintignore` çalışmaz.

## Commit öncesi ne olur?

`husky` Git hook komutunu bağlar; `lint-staged` yalnızca **staged** dosyalarda komut çalıştırır. Bu büyük repoda beklemeyi azaltabilir. Yine de hook yerel makinede atlanabilir; CI kontrolü güvenilir son kapıdır. Bu modülde paket eklemiyoruz, dolayısıyla Sinema’ya hook kurmayacağız; kavramı anlaman yeterli.

:::mistake[Sık hata]
`format:check` yerine `format` komutunu CI’da çalıştırma: CI’nın dosyayı sessizce değiştirmesi hata nedenini gizler. CI kontrol eder, geliştirici `format` ile düzeltir.
:::

:::sector
Birçok ekip kaydederken format ve CI kontrolünü birlikte kullanır. Hook varsa daha erken geri bildirim verir; CI’yı silmez.
:::
