Ana sayfayı açan kullanıcı haftanın trend filmlerini görmeli. Senaryo, içerik eksik olduğunda da sessizce başarılı sayılmamalı.

## Gereksinimler

- Ana sayfayı göreli kök yoldan aç.
- H1 başlığının Sinema, bölüm başlığının Bu haftanın trend filmleri olduğunu doğrula.
- Dövüş Kulübü film başlığının görünmesini doğrula.
- Uygulama farklı bir origin’de sunulduğunda aynı senaryo çalışabilsin.
- Boş sayfa, yanlış başlık veya yüklenmeyen film listesi senaryoyu başarısız kılsın.

## Örnek

Ana sayfa açılır → Sinema başlığı görünür → Bu haftanın trend filmleri bölümü görünür → Dövüş Kulübü görünür.

## Sözleşme

- Dosya ve export: homeScenario.ts içindeki homeScenario(page: Page): Promise<void> fonksiyonunu export et.
- Test altyapısı Playwright Page sağlar ve uygulamayı baseURL üzerinden açar.
- Beklenen erişilebilir içerik: H1 Sinema, Bu haftanın trend filmleri başlığı ve Dövüş Kulübü film başlığı.
