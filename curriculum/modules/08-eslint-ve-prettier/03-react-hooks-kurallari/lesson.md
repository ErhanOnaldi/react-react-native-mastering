---
title: "React Hooks kuralları ve lint"
minutes: 16
kind: concept
---

# React Hooks kuralları ve lint

:::pain[Problem]
Sinema’da film adresini `/movie/550`’dan `/movie/155`’e değiştirdin. URL yeni kimliği gösteriyor, ama başlıkta eski film duruyor. Başka bir sayfada Hook yalnızca `id` doluyken çağrılıyor; ilk açılışta sorun yok, seçim temizlenince React state sıralamasını karıştırabiliyor. İki hata da tip kontrolünden geçebilir.
:::

## React kodundaki iki ayrı sözleşme

ESLint’in `eslint-plugin-react-hooks` eklentisi React Hook’larının kullanımını statik analiz eder. Yaygın `recommended` flat preset’i Hook çağrı kurallarını ve dependency doğruluğunu içerir; ayrıca React Compiler’ın güvenli optimizasyon yapabilmesi için gereken bazı kod kalıplarını işaretler. Lint’in bulduğu mesaj, çalışma zamanında kesin olarak bug çıkacağını değil, React’in beklediği sözleşmenin kaynakta ihlal edildiğini gösterir.

Önce iki temel kuralı ayır. Hook çağrılarının sırası render’lar arasında sabit olmalı. Effect’in okuduğu reaktif değerler ise effect’in hangi render verisiyle güncel kaldığını açıklamalı. Biri “Hook nerede çağrılabilir?”, diğeri “Effect hangi değişiklikte yeniden kurulmalı?” sorusudur. Benzer görünseler de farklı arızaları önlerler.

:::model[Effect yaşam döngüsü]
Bir effect’in setup’ı commit sonrasında çalışır; bağımlılık değiştiğinde React eski setup’ın cleanup’ını çalıştırıp yenisini kurar; bileşen ayrılınca son cleanup çalışır. Lint’in istediği bağımlılık listesi bu yaşam döngüsüne hangi render değerlerinin katıldığını açık eder. Yeni bağlamda, kontrol ettiğimiz şey effect kodunun nasıl çalıştığı değil, React’e değişim sinyalinin dürüstçe bildirilip bildirilmediğidir.
:::

![Effect setup, dependency değişimi, cleanup ve yeniden setup akışı](diagram:effect-yasam-dongusu)

:::model[Closure bayat değer]
Callback, oluşturulduğu render’ın props ve state değerlerini closure içinde yakalar. Sonraki render yeni değer taşısa bile eski callback kendi yakaladığı fotoğrafı otomatik değiştirmez. Burada bu model, lint’in eksik bağımlılık uyarısının neden sadece bir biçim isteği olmadığını açıklar.
:::

![Callback'in oluşturulduğu render'ın değerlerini yakalaması](diagram:closure-bayat-deger)

## Kesin kurallar

1. **Hook’lar üst seviyede çağrılır.** `useState`, `useEffect` ve custom Hook’ları component veya custom Hook fonksiyonunun en üst seviyesinde çağır; `if`, döngü, iç fonksiyon veya erken `return` sonrasında koşullu çağırma.
2. **Her render aynı Hook sırasını üretir.** React state hücrelerini çağrı sırasına göre eşler. Bir render’da ikinci Hook atlanıp diğer render’da çağrılırsa, sonraki state hücreleri farklı anlamda okunabilir.
3. **Hook çağrısını koşullu yapmak yerine işi koşullu yap.** Hook’u üstte çağır; `id` yokken işlem yapılmaması gerekiyorsa bu koşulu effect’in içindeki mantığa taşı.
4. **Effect içindeki reaktif okumaları dependency listesinde bildir.** Props, state ve component gövdesinde türetilen değerlerden effect’in davranışını değiştirenleri listele. Değeri dışarıda okutup listeyi boş bırakmak eski render değerini sabitleyebilir.
5. **Liste değişince önceki setup temizlenir.** Temizlik gerekiyorsa cleanup dön; effect’i her değişimde bağımsız setup/cleanup çifti olarak tasarla.
6. **Uyarıyı susturmak bağımlılığı çözmez.** Eksik değeri kaldırmak ya da lint disable yorumu eklemek effect’in gerçek girdisini değiştirmez. İhtiyaç gereksiz bir dependency ise kod yapısını sadeleştir; değer gerçekten kullanılıyorsa bağımlılığı dürüstçe beyan et.

## İlk örnek: Hook sırası neden sabit?

Bir listede seçili öğe yoksa kısa bir mesaj göstermek istediğini düşün. Kırık biçim erken döner ve Hook’u bazı render’larda hiç çağırmaz:

```tsx title="Kırık örnek"
function SelectedName({ name }: { name: string | null }) {
  if (!name) return <p>Bir ad seç</p>
  const [label, setLabel] = useState(name)
  return <button onClick={() => setLabel(name)}>{label}</button>
}
```

İlk render’da `name` null ise `useState` çağrılmaz; sonraki render dolu bir ad alırsa ilk kez çağrılır. React’in component örneği için tuttuğu Hook sırası bu iki render’da aynı değildir. Hook’u erken dönüşün üstüne taşıyınca sıra sabitlenir; gösterim yine koşullu kalabilir:

```tsx check
import { useState } from 'react'

export function SelectedName({ name }: { name: string | null }) {
  const [label, setLabel] = useState(name ?? '')

  if (!name) return <p>Bir ad seç</p>
  return <button onClick={() => setLabel(name)}>{label}</button>
}
```

Bu düzeltme Hook sırasını çözer, fakat prop değişince `label` değerinin otomatik güncellenmesi gibi ayrı bir state tasarım sorusunu çözmez. Bir lint mesajını ele alırken yalnız işaretli sözleşmeye bak; yanındaki davranış kararını ayrıca değerlendir.

## İkinci örnek: Effect hangi değere bağlı?

Bir saat gösteren panelin effect’i ilk render’daki `zone` değerini okuyor ama bağımlılık listesi boş. Saat dilimi seçimi değişirse eski closure ile kurulan zamanlayıcı aynı bölgeyi kullanmaya devam edebilir:

```tsx title="Kırık örnek"
useEffect(() => {
  const timer = window.setInterval(() => {
    setClock(readClock(zone))
  }, 1000)
  return () => window.clearInterval(timer)
}, [])
```

Bu callback `zone` değerini oluşturulduğu render’dan yakalar. `zone` değişince React’e eski zamanlayıcıyı kapatıp yenisini kurmasını söyleyen hiçbir dependency yoktur. Böyle bir kodu `[zone]` ile dürüstçe bağlamak gerekir; her cleanup eski zamanlayıcıyı kapatır, yeni setup güncel değeri kullanır.

```tsx check
import { useEffect, useState } from 'react'

function readClock(zone: string) {
  return new Intl.DateTimeFormat('tr-TR', { timeZone: zone, timeStyle: 'medium' }).format(new Date())
}

export function ZoneClock({ zone }: { zone: string }) {
  const [clock, setClock] = useState(() => readClock(zone))

  useEffect(() => {
    const timer = window.setInterval(() => setClock(readClock(zone)), 1000)
    return () => window.clearInterval(timer)
  }, [zone])

  return <time>{clock}</time>
}
```

## Zaman içinde iz sürelim

Başlangıçta `zone = 'Europe/Istanbul'` olan bir render’ı, sonra `zone = 'Europe/London'` seçimini izleyelim:

| Zaman | Hook/effect olayı | Yakalanan değer | Sonuç |
| --- | --- | --- | --- |
| İlk render | `useState`, ardından effect kurulur | İstanbul | İlk timer İstanbul saati üretir |
| Commit sonrası | `setInterval` çalışır | İstanbul | Ekrandaki saat yenilenir |
| Kullanıcı seçim yapar | Yeni render aynı Hook sırasını izler | Londra | React yeni commit üretir |
| Dependency karşılaştırması | `Object.is` İstanbul ve Londra’yı farklı bulur | Eski cleanup önce çalışır | İstanbul timer’ı kapanır |
| Yeni setup | Yeni interval oluşturulur | Londra | Bundan sonraki değerler yeni bölgedendir |

Tabloda iki model birlikte işliyor. Hook sırasının sabit olması React’in state’i doğru çağrıya eşlemesini sağlar. Dependency değişimi effect yaşam döngüsünü ilerletir; cleanup, eski closure’ın dış sistemle ilişkisini kapatır. Closure kendi başına hata değildir. Sorun, eski callback’in yaşamaya devam etmesi gerektiği halde güncellendiğinin bildirilmemesidir.

## React Compiler kuralları ne ekler?

Eklentinin güncel preset’lerinde yalnız iki eski kural yoktur. `immutability`, props veya state üzerinde doğrudan değişiklik gibi Compiler’ın güvenle dönüştüremeyeceği kalıpları; `set-state-in-render` render sırasında state güncellemesini işaretleyebilir. Bu kuralları Compiler açık olmasa da ciddiye almak mantıklıdır: değişmez veri ve saf render, React’in güncelleme modelinin temelidir.

Compiler kurallarını “artık elle memo yaz” şeklinde okuma. Bir uyarı, kodu React’in analiz edebileceği bir biçimde tutma isteğidir; her bileşene `useMemo` veya `useCallback` ekleme talimatı değildir. Önce değişmezlik, render saflığı ve doğru effect girdileri gibi temel ilişkiyi çöz. Gerekli memoization kararları performans ölçümü ve ilgili dersin kapsamıdır.

## Sık hatalar

:::mistake[Hook’u erken dönüşün altına koymak]
Belirti → Lint “Hook conditional olarak çağrılıyor” mesajı verir. Neden → Bir render’da erken dönüş Hook’u atlıyor. Düzeltme → Hook’u component’in üst seviyesine al; yalnızca Hook’un içindeki işi koşula bağla veya ayrı bileşen sınırı kur.
:::

:::mistake[Dependency uyarısını kapatmak]
Belirti → Uyarı yok ama seçilen saat dilimi veya film değişince içerik eski kalıyor. Neden → Closure önceki render değerini tutuyor ve React eski setup’ı yenilemedi. Düzeltme → Okunan reaktif değeri ekle; nesne ya da fonksiyon gereksiz değişiyorsa önce onu effect içine taşıma veya daha küçük girdiye indirgeme seçeneğini incele.
:::

:::mistake[Compiler uyarısını otomatik memo çağrısı sanmak]
Belirti → Her uyarı için `useMemo` ekleniyor, kod karmaşıklaşıyor. Neden → Uyarı, optimizasyon API’si seçme emri gibi okundu. Düzeltme → Mesajın anlattığı React sözleşmesini düzelt; memoization’ı yalnız ölçülmüş performans ihtiyacında değerlendir.
:::

:::sector
Ekipler Hook kurallarını CI’da error seviyesinde tutarak stale veri ve render sırası hatalarının code review’a kadar beklemesini önler. Kuralı kapatan yorumlar istisna olmalı ve yakınında nedenini açıklamalı. Lint, karmaşık async davranışı anlamanın yerine geçmez; ancak yanlış yaşam döngüsü varsayımını PR’da görünür hale getirir.
:::

## Özet

- Hook’lar component veya custom Hook’un üst seviyesinde ve sabit sırada çağrılır.
- Koşulu Hook çağrısına değil, Hook içindeki işe uygula.
- Effect’in okuduğu reaktif değerler dependency listesinde yer alır.
- Cleanup dependency değişiminde eski ilişkiyi kapatır; yeni setup güncel closure ile başlar.
- React Compiler kuralları değişmezlik ve saf render gibi temel sözleşmeleri de korur.

**Kendini yokla:** `if (!id) return null` satırından sonra `useEffect` varsa hangi render farkı sorun yaratır?
*Cevap:* `id` boşken Hook atlanır, doluyken çağrılır; Hook sırası render’lar arasında değişir.

**Kendini yokla:** Dependency listesine `zone` eklenince timer için ne olur?
*Cevap:* Bölge değişiminde önce eski timer cleanup ile kapanır, sonra yeni closure ile timer kurulur.
