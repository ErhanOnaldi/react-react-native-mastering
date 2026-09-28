---
title: "Editör, commit ve CI katmanları"
minutes: 14
kind: concept
---

# Editör, commit ve CI katmanları

:::pain[Problem]
Ekipte biri kaydederken formatlıyor, diğeri etmiyor. Bir PR’da kırk dosyada yalnız tırnak ve satır kırımı değişmiş; gerçek Hook düzeltmesi arada gözden kaçıyor. Yeni bir commit’e aynı farkları taşımamak için kuralı nerede çalıştıracağını seçmen gerekiyor.
:::

## Aynı kural, farklı zamanlar

ESLint ve Prettier config’i depoda dursa da geliştirici bu araçları ne zaman çalıştıracağını bilmeyebilir. Geri bildirimi erken almak, yanlış dosyanın commit edilmesini azaltır. Ancak yerel editör ve Git hook’u kullanıcının ayarına bağlıdır. Ortak doğrulama için CI’da değişmeyen kontrol gerekir.

Bu üç durak aynı zincirin farklı savunma katmanlarıdır: editör çalışırken, commit hazırlanırken ve değişiklik sunucuya ulaştığında. Her biri aynı config ve script’i çağırabilir; fark, hangi dosyaların seçildiği ve hatanın hangi anda görüldüğüdür.

![Editör, pre-commit ve CI kalite savunma katmanları](diagrams/kalite-savunma-katmanlari.svg)

## Üç kapının görevi

1. **Editör, yazarken hızlı geri bildirim verir.** Kaydetme anında Prettier çalıştırabilir veya lint uyarılarını kodun yanında gösterebilir. Yanlış yapılandırılmış bir editör başka formatter seçebilir ya da hiç formatlamayabilir; bu yüzden ekip tercihi depodaki config’te kalmalıdır.
2. **Git pre-commit hook’u commit öncesi yerel kontrol yapar.** Husky hook komutunu Git olayına bağlayabilir. `lint-staged` yalnız stage’e alınmış dosyalara komut çalıştırır. Bu büyük repoda hızlıdır; tüm dosya ağacını her commit’te yeniden taramak gerekmez.
3. **CI değişiklik depoya ulaştığında ortak kararı doğrular.** `lint` ve `format:check` gibi script’ler aynı repodaki kuralları çalıştırır. Hata varsa PR kırmızı kalır; geliştirici düzeltmeyi commit eder.
4. **Katmanlar aynı config’i paylaşır.** Editörde farklı formatter seçmek veya hook’ta farklı komut çalıştırmak iki ayrı sonuç üretir. Ortak package script’leri bu farkı azaltır.
5. **Yerel kapılar atlanabilir.** Git hook’u kurulmamış olabilir, kullanıcı `--no-verify` kullanabilir, editor integration devre dışı kalabilir. CI depoda zorunlu kural olarak ayarlanırsa herkes aynı son kontrolden geçer.

## Değişiklik akışını izleyelim

Bir geliştirici `QueuePanel.tsx` dosyasını düzenliyor. Kaydetme, commit ve PR adımlarındaki geri bildirimi takip et:

| Sıra | Katman | Neyi çalıştırır? | Dosya değişir mi? | Hata olursa |
| --- | --- | --- | --- | --- |
| 1 | Editör kaydetme | Formatter ve editör lint entegrasyonu | Format açıksa evet | Dosya içi uyarı gösterir |
| 2 | Stage | Geliştirici değişiklikleri seçer | Hayır | Git diff neyin seçildiğini gösterir |
| 3 | Pre-commit | Hook üzerinden staged dosyalar için lint/format | İstenirse evet | Commit başlamadan hata döner |
| 4 | CI | Tam proje `lint` ve `format:check` script’leri | Hayır | PR kontrolü başarısız olur |
| 5 | Review | İnsan davranış ve niyeti inceler | Bir sonraki commit’te | Eksik iş yorumla geri döner |

Burada otomatik biçimleme ile otomatik kontrolün farkı önemlidir. Pre-commit staged dosyaları düzeltebilir; bu durumda Git’e hangi sürümün gittiğini ve değişikliğin stage’e tekrar alınıp alınmadığını araç davranışına göre izlemek gerekir. Basit akışta hook yalnız kontrol de yapabilir. CI ise dosyayı düzeltmek yerine eksikliği raporlar; sunucu tarafında değiştirilmiş bir çalışma ağacı geliştiricinin niyetini gizler.

## Kırık akış ve düzeltilmiş akış

Kırık bir CI script’i şöyle olabilir:

```json title="Kırık package.json parçası"
{
  "scripts": {
    "format:check": "prettier --write ."
  }
}
```

Adında `check` yazsa da komut tüm dosyaları değiştirmeye çalışır. CI format farkını raporlamak yerine çalışma ağacını değiştirir; ekip hangi dosyayı kendisinin düzeltmesi gerektiğini anlamayabilir.

Doğru sorumluluk ayrımı, yerelde yazma komutu ve CI’da kontrol komutudur:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint ."
  }
}
```

Bu JSON parçası format script’lerinin ne yaptığını gösterir; gerçek `package.json` içinde var olan diğer script’leri koruyup yeni anahtarları eklemelisin. Hook’ta staged dosya kapsamı için `lint-staged` kullanılabilir; CI’da tam kapsam için `eslint .` çalıştırılabilir. Dosya sayısı küçükse her commit’te tam lint taraması da kabul edilebilir; süreyi ölç, ihtiyaca göre kapsam seç.

## Kimin makinesinde hangi ayar?

Editörde “Format on Save” açmak geliştiricinin zaman kazanmasını sağlar; repodaki config dosyasını editör otomatik üretmek zorunda değildir. Ekip üyeleri Prettier eklentisini kurabilir ve proje formatter’ını varsayılan seçebilir. Lint entegrasyonu da diagnostic mesajları dosyada gösterebilir. Bu kolaylıklar, terminaldeki ortak script’i çalıştırıp aynı sonucu almaya engel olmamalıdır.

Git hook’ları çalışma alanındaki yerel `.git/hooks` mekanizmasına bağlıdır. Husky hook dosyalarını repo ile paylaşılabilir bir biçimde kurmaya yardımcı olur; ama her geliştiricinin bağımlılıkları yüklenmiş ve kurulum adımı tamamlanmış olmalıdır. Hook hatası commit’i kesebilir. Bu nedenle hook’u hızlı tut, yavaş tam test paketlerini gereksiz yere her commit’te çalıştırma.

`lint-staged` komutları yalnız hazırlanmış dosya listesine uygular. Eğer dosya geçerli ama henüz stage edilmemiş değişiklik içeriyorsa, komut kapsamı ve otomatik düzeltme davranışı konusunda dikkatli ol. Çalışma ağacını değiştiren araç, staged ve unstaged farkları karıştırabilir. En güvenli pratik, küçük bir commit’te `git diff --cached` ile stage’e giren sonucu kontrol etmektir.

CI’da komutun başarısız olması da bir geri bildirimdir, rastgele yeniden çalıştırma çağrısı değildir. Önce rapordaki dosya ve kuralı bul; yerelde aynı proje script’ini çalıştırıp düzeltmeyi yap. Sonra değişikliği yeni commit ile gönder; başarılı CI sonucu artık o commit’in içeriğine aittir. Branch protection ayarı bu kontrolün geçmesini birleşme şartı yapabilir. Bir check’i zorunlu tutmak için adının sabit ve anlaşılır olması, PR’ı açan kişinin doğru sonucu kolayca bulmasını sağlar.

Kontrollerin süresi ekip deneyimini etkiler. Format kontrolü genellikle hızlıdır ve her commit’te çalışabilir. Tam lint ve test paketi büyük depoda daha uzun sürebilir; bunları staged dosyalar üzerinde tekrarlamak yerine CI’da tam kapsamla çalıştırıp hook’u kısa tutmak iyi bir başlangıçtır. Küçük depoda ise bu ayrım gereksiz karmaşıklık olabilir. Süreyi ölç, hata kaçırma riskini ve geliştiricinin bekleme maliyetini birlikte tart.

Bir formatter staged dosyayı otomatik değiştiriyorsa, hook yöneticisinin değişen içeriği tekrar stage edip etmediğini bil. Aksi halde editörde gördüğün dosya ile commit’e giden snapshot farklı olabilir. Hook’u ilk kez eklediğinde boş olmayan staged değişiklikle dene, sonra `git diff --cached` çıktısını oku. Yerel kolaylığın commit’in ne taşıdığını gizlemesine izin verme.

Bu modüldeki Sinema görevinde otomatik Git hook’u kurmak yerine lint ve format script’lerini ekleyeceksin. Bu, paket kurulumuna bağlı ek bir yerel adım gerektirmeden ortak kalite kapısını görünür yapar. Gerçek ekipte hook kararı, repo büyüklüğü, commit süresi ve CI gecikmesine göre verilir.

## Sık hatalar

:::mistake[Editör çalıştıysa herkes güvendedir]
Belirti → Bir geliştiricinin dosyası doğru biçimli, başka birinin commit’i değil. Neden → Format on save yerel editör ayarıdır ve atlanabilir. Düzeltme → Repoda formatter config’i tut, CI’da `format:check` çalıştır.
:::

:::mistake[Hook CI yerine geçer]
Belirti → Bir PR’da lint hatası var ama commit yerel hook’tan geçmiş. Neden → Hook kurulu olmayabilir veya atlanmış olabilir; kapsamı da staged dosyalarla sınırlı olabilir. Düzeltme → CI’da ortak tam kapsamlı denetim çalıştır; hook’u hızlı geri bildirim katmanı say.
:::

:::mistake[CI biçimi kendi düzeltir]
Belirti → Başarısız iş dosya değiştirmiş, ama commit farklı kalmış. Neden → CI’da `--write` kullanıldı. Düzeltme → CI’da check moduna geç; yazma işlemini geliştiricinin yerel düzeltmesine bırak.
:::

:::sector
Takımlar genellikle editörde kaydetme biçimini açar, staged dosyaları commit öncesi kontrol eder ve CI’da lint/format script’lerini zorunlu tutar. Yerel kontrollerin hız avantajı, CI’nın tekrarlanabilir son kararını kaldırmaz. Bir kontrol gereğinden uzun sürüyorsa hangi kapsamın gerçekten o anda gerekli olduğunu ölçerek ayarla.
:::

## Özet

- Editör yazarken, pre-commit commit öncesi, CI ise sunucu tarafında geri bildirim verir.
- Husky hook’u bağlar; lint-staged staged dosyaları seçmeye yardım eder.
- Yerel katmanlar atlanabilir; CI ortak ve tekrarlanabilir kontrol olmalıdır.
- Yazma komutu geliştiricide, check komutu CI’da çalışır.
- Tüm katmanlar repodaki aynı config ve script’leri kullanmalıdır.

**Kendini yokla:** Pre-commit hook’u geçtiği halde CI neden yine lint çalıştırır?
*Cevap:* Yerel hook kurulmamış veya atlanmış olabilir; CI herkes için ortak son denetimdir.

**Kendini yokla:** Format farkını CI’da göstermek için neden `--write` kullanmazsın?
*Cevap:* CI dosyayı değiştirip commit’e girmeyen farklar üretmemeli; yalnız başarısızlığı raporlamalıdır.
