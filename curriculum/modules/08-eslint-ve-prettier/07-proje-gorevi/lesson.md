---
title: "Sinema’ya kalite kapısı kur"
minutes: 10
kind: project
---

# Sinema’ya kalite kapısı kur

:::pain[Problem]
Detay sayfasında `/movie/550` → `/movie/155` yaptığında eski film kalabildi. Birkaç kullanılmayan import da dosyalarda duruyor. Yeni PR’da biçim farkları asıl değişikliği saklıyor. Şimdi aynı sorunları gerçek Sinema v1 projesinde yakalayıp düzelteceksin.
:::

## 1. Config ve eski film

Önce `eslint.config.js` oluştur: ESLint 10 flat config, `defineConfig` (`eslint/config`), TypeScript, React Hooks, React Refresh ve en sonda `eslint-config-prettier/flat`. `src` altındaki TS/TSX dosyalarını kapsa. `react-hooks/exhaustive-deps` mesajı verdiğinde `MovieDetailsPage` içindeki `id` akışını düzelt. `id` değişiminde yeni film gelmeli; eski istek geç dönerse ekranı ezmemeli.

## 2. Format ve script’ler

`.prettierrc.json` ve `.prettierignore` ekle. Tailwind v4 class sırası için plugin’in `tailwindStylesheet` değerini projenin `src/index.css` dosyasına bağla. `package.json` içine `lint`, `format`, `format:check` script’lerini ekle. `lint` hatasız bitene kadar kalan sorunları düzelt.

:::tip[Sıra]
Önce `lint` çalıştırıp gerçek mesajları oku. Her hatayı niyetine göre düzelt; kuralı susturmak için `eslint-disable` yazma. Sonra `format` uygula ve `format:check` ile sonucu denetle.
:::

:::sector
Bu kalite kapısı, sonraki modülde 300 satırlık sayfaları refactor ederken güvenli bir başlangıç sağlar. Lint tüm davranış testlerinin yerine geçmez; hatalı effect’i erken görünür kılar.
:::
