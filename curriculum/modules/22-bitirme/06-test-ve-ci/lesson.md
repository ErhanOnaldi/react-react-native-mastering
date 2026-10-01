---
title: "Test stratejisi ve CI"
minutes: 8
kind: project
---

# Test stratejisi ve CI

“Bilgisayarımda çalıştı” başka bir makinede de çalışacağını göstermez. Kitaplık’ta bunu sınamak için dış API yanıtlarını kontrolünde tutmalı, kullanıcıya görünen davranışları doğrulamalı ve aynı komutları her kod değişikliğinde çalıştırmalısın.

:::model[Test katmanları]
Saf fonksiyonlar ve şema dönüşümleri birim testiyle hızlıca denetlenir. Bileşen testinde RTL kullanıcıya görünen arayüzü, MSW ise ağ yanıtını taklit eder. Playwright E2E testi gerçek tarayıcıda birkaç kritik adımı birleştirir. Her katman farklı bir riski kontrol eder; aynı ayrıntıyı her katmanda tekrar etme.
:::

## Testin tekrar edilebilir olması

**Deterministik veri**, her çalıştırmada aynı yanıtı ve sonucu veren kontrollü veridir. Testin gerçek Open Library ağına çıkarsa yanıt yavaşlayabilir, değişebilir veya gelmeyebilir. MSW ile Vitest testlerindeki yanıtı, Playwright’ta `page.route` ile tarayıcı yanıtını taklit et; böylece test ağ durumuna bağlı kalmaz.

Gerçek zamanlamaya göre bazen geçen bazen kalan teste **flaky test** denir. Örneğin “bir saniye bekle, sonra başlık vardır” varsayımı, ağ daha yavaşsa bozulur. Sabit bekleme yerine başlığın görünmesini bekle. MSW’de tanımsız istekleri hata yapmak da yanlış adrese sessizce çıkılmasını engeller.

## CI’da aynı sırayı çalıştır

**CI** (continuous integration), yeni kod gönderildiğinde kalite kontrollerini otomatik çalıştıran sistemdir. İş akışında önce Node/pnpm ortamını hazırla ve bağımlılıkları kur; ardından lint, format, tip kontrolü, Vitest, üretim build’i ve Playwright’ı çalıştır.

`pnpm install --frozen-lockfile` **frozen lockfile** kullanır: CI, `pnpm-lock.yaml` ile `package.json` uyuşmuyorsa bağımlılıkları sessizce güncellemek yerine hata verir. Böylece başka bir bilgisayarda farklı paket sürümleriyle “şans eseri” çalışan bir kurulum oluşmaz.

| Sıra | Kontrol | Ne yakalar? |
| --- | --- | --- |
| 1 | Lint, format, typecheck | Kod kuralları ve tip sorunları |
| 2 | Vitest | Mantık ve bileşen davranışı |
| 3 | Build | Üretim paketleme sorunları |
| 4 | Playwright | Kritik tarayıcı akışı |

![Birim, entegrasyon ve uçtan uca testler CI kalite kontrol hattında yer alır](diagram:test-katmanlari)

Test stratejisi belgesinde hangi gereksinimin hangi katmanda kontrol edildiğini ve nelerin açık risk kaldığını yaz. Örneğin dış servisin güncel olup olmadığını taklit edilmiş kullanıcı testi kanıtlamaz; bu ayrı bir izleme ihtiyacıdır.

:::mistake[Gerçek ağa güvenmek]
Belirti: Test yerelde geçerken ağ yavaşladığında veya API içeriği değiştiğinde CI’da kalır. Neden: Test sonucu dış servisin o anki durumuna bağlıdır. Düzeltme: Test yanıtını MSW veya `page.route` ile sabitle; gerçek servis kullanılabilirliğini bu davranış testinden ayrı değerlendir.
:::

## Özet

- Birim, bileşen ve E2E testleri farklı riskleri kapsar.
- Deterministik yanıtlar ağ değişkenliğini testten çıkarır.
- Sabit süre beklemek flaky test üretir; görünür koşulu bekle.
- Frozen lockfile CI kurulumunda paket sürümlerinin değişmesini önler.

**Yeni terimler:** Deterministik veri: her çalıştırmada aynı sonucu veren kontrol edilen veri. Flaky test: aynı kodla bazen geçen, bazen kalan test. CI: kod değişince kontrolleri otomatik çalıştıran süreç. Frozen lockfile: kilit dosyasıyla paket tanımları uyuşmazsa kurulumu durduran seçenek.

### Kendini yokla

1. E2E testinde neden `waitForTimeout` yerine görünür başlığı beklersin? **Cevap:** Başlığın hazır olması gereken koşuldur; sabit süre makine/ağ hızına bağlıdır.
2. CI’da frozen lockfile neyi garanti etmeye yardım eder? **Cevap:** CI’ın kilit dosyasında seçilmiş sürümlerle kurulmasını; tanım uyumsuzsa hatayı görünür kılmayı.
