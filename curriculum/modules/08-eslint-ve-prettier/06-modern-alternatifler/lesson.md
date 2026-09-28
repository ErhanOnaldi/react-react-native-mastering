---
title: "Lint ve format aracı seçimi"
minutes: 13
kind: concept
---

# Lint ve format aracı seçimi

:::pain[Problem]
Yeni bir Vite React + TypeScript projesi açan ekip arkadaşı başlangıç config’inde Oxlint görüyor. Sinema’da ESLint ve Prettier var. “Biz eski aracı mı seçtik?” diye soruyor. Yalnız aracın adını veya ilk hız ölçümünü karşılaştırmak, yakalamak istediğimiz React ve TypeScript hatalarını hesaba katmıyor.
:::

## Araç değil, gerekli geri bildirim

Bir lint/format seçimi, projenin istediği geri bildirime göre yapılır. Ekip hangi hataları erkenden bulmak istiyor? React Hooks kuralları ve Compiler tavsiyeleri var mı? TypeScript sözdizimi ve tip farkındalığı gerekli mi? Özel plugin’ler veya kurallar kullanılıyor mu? Formatter, Tailwind class’larını da sıralamalı mı? Bu soruların cevabı araç adından önce gelir.

ESLint’in gücü geniş plugin ekosistemi ve ayrıntılı config’idir. Prettier yaygın, ayrı bir formatter’dır. Oxlint Rust tabanlı hızlı bir linter’dır; yeni template’lerde başlangıç tercihi olabilir. Biome lint ve formatı bir üründe birleştirir. Ancak aynı isimli “lint” özelliği her araçta aynı kural kümesini veya aynı davranışı garanti etmez. Gerekli kuralları dosya üzerinde sınamak gerekir.

Güncel create-vite React TypeScript template’i Oxlint kullanabilir. Bu, bütün mevcut projelerin ESLint’ten geçmesi gerektiğini söylemez. Bir template’in hızlı başlangıç seçimi, eski ve çalışan bir uygulamayı taşımak için kendi başına gerekçe değildir. Göç maliyeti, CI süresi, IDE desteği ve ekibin kuralları birlikte değerlendirilir.

## Seçim için beş kesin adım

1. **Önce hata sınıflarını yaz.** Örneğin eksik `useEffect` bağımlılığı, koşullu Hook çağrısı, TypeScript’te kullanılmayan import ve ortak format kararı.
2. **Mevcut kural setini isimle kaydet.** Hangi plugin, preset ve custom rule çalışıyor? Yalnızca “ESLint var” demek yeterli tanım değildir.
3. **Aday araçların eşdeğerini doğrula.** Kuralın mevcut araçtaki adının yeni araçta karşılığı var mı, hangi dosya uzantılarında çalışıyor, hata mı uyarı mı veriyor?
4. **Temsili dosyalarda sınama yap.** Bir geçerli TS dosyası, bir kullanılmayan tanım, eksik dependency ve koşullu Hook örneğiyle raporu karşılaştır.
5. **Göç maliyetini ölç, sonra kararı belgele.** Çalıştırma süresi, editör entegrasyonu, plugin uyumu, mevcut disable yorumları ve config bakımını birlikte tart.

## Karşılaştırma tablosu

| Seçenek | Güçlü taraf | Önce doğrula |
| --- | --- | --- |
| ESLint + TypeScript/React plugin’leri | Geniş ekosistem, ince ayarlı kurallar | Config karmaşıklığı ve lint süresi |
| Prettier | Yaygın, belirgin biçim çıktısı | Gerekli plugin ve proje seçenekleri |
| Oxlint | Hızlı lint geri bildirimi, yeni projelerde kolay başlangıç | Kullanılan React/TS kurallarının kapsamı ve davranışı |
| Biome | Lint ve formatı birlikte sunar | Gerekli rule/plugin karşılıkları ve format uyumu |
| İki linter birlikte | Hızlı tarama ile ayrıntılı özel kuralı birleştirebilir | Aynı soruna çift mesaj, bakım ve toplam süre |

Bir projede ESLint ve Oxlint’i birlikte çalıştırmak mümkün olabilir. Fakat “ikisini de koyalım” kararı otomatik olarak daha iyi kapsama getirmez. Aynı unused değişken için iki farklı mesaj, geliştiriciye gerçek bir ikinci sinyal sağlamayabilir. Hızlı tarama birinci kapı, özel kural ikinci kapı olacaksa roller ve CI sırası açık olmalıdır.

Biome’un birleşik lint/format yaklaşımı yapılandırma sayısını azaltabilir. Bu kolaylık, ekibin mevcut kurallarının hepsinin aynı biçimde çalışacağı anlamına gelmez. Özellikle React Hook analizi, TypeScript farkındalığı ve Tailwind sıralaması gibi somut gereksinimlerin karşılığını aracı seçmeden önce kontrol et. Eşdeğer kural yoksa iki seçenek vardır: aracı kullanmamak ya da eksik kontrolü başka katmanda sürdürmek.

## Küçük bir denemeyi izle

Bir göç denemesinde ana dalın config’ini hemen değiştirmek yerine temsili bir dosya kümesi belirle. `src/components/TimerPanel.tsx`, bir saf `.ts` yardımcı ve bir generated çıktıdan oluşan küme yeterli bir ilk örnek olabilir. Bir dosyada doğru effect, birinde eksik dependency, birinde koşullu Hook ve birinde kullanılmayan tanım olsun.

| Dosya | Beklenen bilgi | Karar için gözlem |
| --- | --- | --- |
| TSX, doğru effect | Hata çıkmamalı | Geçerli kod gereksiz uyarı almıyor mu? |
| TSX, eksik dependency | Hook ilişkisi mesajı | Eski ve yeni araç aynı sorunu bildiriyor mu? |
| TSX, koşullu Hook | Sıra hatası mesajı | Kural kapsamı etkin mi? |
| `.ts`, unused import | Kullanılmayan tanım mesajı | TypeScript parser/kuralı çalışıyor mu? |
| `dist` dosyası | Hiç taranmamalı | Ignore davranışı doğru mu? |

Önce eski aracın çıktısını, sonra adayın çıktısını aynı commit ve dosyalarda al. Mesaj sayısından çok hangi sinyal kayboldu veya eklendi diye bak. Hız ölçerken aynı makine, aynı dosya kümesi ve benzer cache durumu kullan; tek bir ilk çalıştırmayı kalıcı performans kanıtı sayma. Sonra CI’da neyin zorunlu kalacağını belirle.

## Kırık karar, daha sağlam karar

Kırık karar: “Oxlint daha hızlı görünüyor, tüm config’i kaldıralım.” Bu cümle hangi hataların artık denetlenmeyeceğini söylemiyor. ESLint’in React Hooks kuralı yoksa stale veri hatası yine sessiz kalabilir. Formatter geçişinde Tailwind plugin’i yoksa class sırası farklılaşabilir.

Daha sağlam karar şöyle görünür: “Projenin mevcut kuralları şunlar; aday araçta şu örneklerin sonuçları aynı, şu kural eksik, bu nedenle şimdilik ESLint’i koruyup Oxlint’i ayrı hızlı tarama olarak deneyeceğiz.” Ya da “Biome gerekli TS/React kurallarını ve class biçimini karşılıyor; CI’da eski config’i çıkarıp temsilî PR’larda çıktıyı gözleyeceğiz.” Her iki karar da ölçülebilir ve gözden geçirilebilir.

```ts check
type LintDecision = {
  requiredRules: string[]
  candidate: 'eslint' | 'oxlint' | 'biome'
  missingRules: string[]
  ciCommand: string
}

const decision: LintDecision = {
  requiredRules: ['unused-imports', 'rules-of-hooks', 'exhaustive-deps'],
  candidate: 'eslint',
  missingRules: [],
  ciCommand: 'pnpm lint',
}

console.log(decision.candidate)
```

Bu yalnız bir karar kaydının hangi soruları taşıyabileceğini gösterir. Gerçek projede her kural adını kullanılan araca göre doğrula; bu örnek, belirli bir aracın bütün kuralları desteklediğine kanıt değildir.

## Sık hatalar

:::mistake[Hız tek karar ölçütü]
Belirti → Lint süresi azaldı, fakat eksik Hook bağımlılığı artık görünmüyor. Neden → Yeni araçta hız ölçüldü, gereken kurallar karşılaştırılmadı. Düzeltme → Kural paritesi ve çıktı kalitesini ölçmeden mevcut kapıyı kaldırma.
:::

:::mistake[Aynı kural iki araçta açılıyor]
Belirti → Her commit’te aynı unused tanım için iki mesaj geliyor. Neden → Araçların sorumlulukları ve kural örtüşmesi planlanmadı. Düzeltme → Her aracın hangi sinyali verdiğini ayır; tekrarı kaldır veya bilinçli olarak gerekçelendir.
:::

:::mistake[Template tercihi proje zorunluluğu sanılıyor]
Belirti → Çalışan config yalnız template farklı araç getiriyor diye değiştiriliyor. Neden → Başlangıç varsayılanı, proje ihtiyacının yerine kondu. Düzeltme → Var olan kuralları listele ve yeni projeyle mevcut uygulamanın koşullarını ayrı değerlendir.
:::

:::sector
Araç göçleri genellikle küçük bir dosya kümesi ve deneme CI işiyle başlatılır. Ekip gerçek lint mesajlarını ve süreleri görür, eksik kurallara karar verir, sonra ana config’i değiştirir. Başarı ölçüsü yalnız daha az saniye değil; daha az bakım yüküyle gerekli hataların görünür kalmasıdır.
:::

## Özet

- Araç seçiminden önce yakalanması gereken hata sınıflarını belirle.
- Rule parity, dosya kapsamı, editör ve CI davranışını örnek kodla karşılaştır.
- Hız, kural kapsamı ve göç maliyetini birlikte değerlendir.
- İki aracı birlikte çalıştırıyorsan yinelenen sinyalleri ve görev paylaşımını açıkla.
- Template tercihi mevcut projenin ihtiyacına otomatik olarak karar vermez.

**Kendini yokla:** Daha hızlı bir araç eksik dependency kuralını çalıştırmıyorsa geçiş tamam mıdır?
*Cevap:* Hayır; gerekli davranış sinyali kaybolmuştur. Eksik kural karşılanmadan eski kapı kaldırılamaz.

**Kendini yokla:** Biome’un lint ve formatı birleştirmesi neyi otomatik garanti etmez?
*Cevap:* Projenin istediği bütün React/TypeScript kurallarının ve plugin davranışlarının karşılandığını garanti etmez.
