---
title: "Storybook ile bileşen durumlarını paylaş"
minutes: 13
kind: concept
---

# Storybook ile bileşen durumlarını paylaş

:::pain[Problem]
Tasarımcı bir onay penceresinin boş, yükleniyor ve hata görünümlerini karşılaştırmak istiyor. Bu durumları görmek için her seferinde uygulamada aynı sayfaya gitmek, veri hazırlamak ve pencereyi açmak gerekiyor. Geliştirici başka bir dalda çalışırken tasarımcı örneği hiç göremiyor.
:::

## Bileşeni sayfadan bağımsız göster

Storybook, UI bileşenlerini uygulamanın tam akışından ayrı çalıştırıp örneklerini belgeleyen bir araçtır. Story bir ekran görüntüsü değil; bir bileşenin belirli props ve çevre koşullarıyla çalışan küçük bir kullanım örneğidir. Bu sayede tasarımcı ve geliştirici aynı adlandırılmış durumu açıp birlikte konuşabilir.

:::model[Component API]
9. modülde component API'sini çağıranın ihtiyacına göre tasarladın: hangi props gerçekten karar taşır, hangileri iç ayrıntıdır? Storybook bunu katalogda görünür kılar. Her story gerçek public API'nin bir geçerli kullanımını göstermeli; belgede bulunmayan sahte bir prop'u örnek diye eklemek API'yi açıklamaz, yanlış tanıtır.
:::

![Meta varsayılanlarının named story'lere uygulanıp bileşen durum kataloğunda gösterilmesini anlatan diyagram](diagrams/story-akisi.svg)

Bir `Story` dosyası CSF (Component Story Format) düzenini kullanır. Varsayılan export bileşen hakkında meta bilgiyi taşır: hangi component gösterilecek, args ile hangi varsayılan props'lar verilecek, hangi argTypes kullanıcıya ayarlanabilir seçenek sunacak. Named export'lar tek tek story durumlarıdır. `Meta<typeof Component>` ve `StoryObj<typeof meta>` tipleri TypeScript'in bileşen prop'larıyla örnekleri karşılaştırmasına yardım eder.

Modelin kesin kuralları:

1. **Meta bir bileşeni tanımlar.** `component` alanı story'lerin hangi public prop tipini ve render edilecek öğeyi kullandığını belirler.
2. **Meta args başlangıç değeridir.** Her named story yalnızca kendine özel argümanları verebilir; verilmeyenler meta args'ten gelir.
3. **Named export bir durumdur.** Story adı katalogda görünür ve aynı durum kolayca tekrar açılır.
4. **ArgTypes kontrol yüzeyidir.** Yalnız kullanıcının anlamlı şekilde değiştirmesi gereken props'ları kontrol olarak sun; iç uygulama ayrıntılarını story kontrolüne açma.
5. **Story gerçek component API'sini izler.** Bileşenin kabul etmediği prop'u örnek adına eklemek dokümantasyon değil, yanlış kontrattır.

```tsx title="src/components/notice.stories.tsx"
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Notice } from './notice'

const meta = {
  component: Notice,
  args: { title: 'Plan kaydedildi' },
  argTypes: {
    tone: { control: 'select', options: ['positive', 'warning'] },
  },
} satisfies Meta<typeof Notice>

export default meta
type Story = StoryObj<typeof meta>

export const Positive: Story = { args: { tone: 'positive' } }
export const Warning: Story = { args: { tone: 'warning' } }
export const LongMessage: Story = {
  args: { tone: 'warning', description: 'Planı paylaşmadan önce katılımcı listesini gözden geçir.' },
}
```

Burada her export ekipte konuşulabilecek bir durumu isimlendiriyor. `args` değiştiğinde aynı bileşene farklı input sağlanıyor; bu örnekleri gerçek uygulama ekranlarının alternatifi olarak düşünme. Story, tasarım sisteminin izole çalışabildiği en küçük dilimini gösterir.

## Varsayılandan özel duruma iz sürelim

Meta'da başlangıç başlığı `Plan kaydedildi`, `tone` için bir kontrol seçeneği var. `Warning` named export'u `tone: 'warning'` değerini verir. Storybook bileşeni bu argümanla render eder; `title` override edilmediği için meta'daki başlık kalır. `LongMessage` da aynı varsayılan başlığı alır, ama hem `tone` hem açıklama değerini değiştirir. İki story aynı component'i gösterir fakat farklı bir tasarım sorusuna cevap verir.

| Aşama | `Warning` değeri | Neden |
| --- | --- | --- |
| Meta args | `title: 'Plan kaydedildi'` | Tüm örneklerin ortak başlangıcı |
| Story args | `tone: 'warning'` | Bu örneğin değişen yönü |
| Render props | `title` korunur, `tone` warning olur | Bileşen gerçek props ile render edilir |
| Katalog adı | `Warning` | Ekip bu durumu doğrudan açar |

Kırık örnek, her story'de bütün props'u tekrar edip adını belirsiz bırakır:

```tsx
export const State2 = { args: { title: 'Plan kaydedildi', tone: 'warning' } }
export const State3 = { args: { title: 'Plan kaydedildi', tone: 'positive' } }
```

Bu örnekler çalışabilir ama hangi kararın konuşulduğunu adlarından anlayamazsın ve ortak varsayılanlar kopyalanır. Meta'da ortak başlığı tutup `Warning` ve `Positive` story'lerinde yalnız değişen `tone` değerini vermek daha az tekrar ve daha açık katalog sağlar. Özel içerik gerekirse yalnız ilgili story onu override eder.

## Durum kataloğu nasıl okunur?

Story'leri yalnızca “default” ve “primary” gibi görünüş adlarıyla doldurma. Bileşenin ürün içinde karşılaşacağı durumları seç: disabled, uzun metin, hata mesajı, boş liste, bekleyen işlem veya dar yerleşim. Her durum, bir tasarım veya davranış kararını görünür kılmalı.

| Story adı | Girdi | Ekip neyi konuşabilir? |
| --- | --- | --- |
| `Positive` | Onay tonu, kısa metin | Renk, hiyerarşi ve ikon gerekli mi? |
| `Warning` | Uyarı tonu | Metin ve simge yeterince ayırt ediliyor mu? |
| `LongMessage` | Uzun Türkçe açıklama | Satır kırılımı ve kart yüksekliği nasıl değişiyor? |
| `Disabled` | Etkileşim kapalı | Durum yalnız renkle mi belirtiliyor? |

Her story'nin amacı belirli bir karar olmalı. Aynı component'in küçük prop değişimlerini onlarca isimle listelemek katalogu gürültülü yapar. Temel kullanım, sınır durumları ve ürünün gerçekten desteklediği varyantlar genellikle iyi bir başlangıçtır.

Bir story'nin sonucu tekrar açıldığında aynı kalmalı. Rastgele isim, geçici ağ cevabı veya kullanıcının tarayıcı deposundaki eski ayar story'nin başlangıcını değiştirirse tasarım incelemesi tekrarlanamaz. Sabit, anlamlı örnek verisi ve gereken provider'lar bu yüzden story'nin parçasıdır. Provider decorator, birden çok story'nin ortak tema veya context ile render edilmesi gerektiğinde kullanılabilir; her örneğin ihtiyacı olmayan bütün uygulamayı sarmalamak ise izolasyonu azaltır.

## Ekipte ortak dil

Bir story'yi açan kişi aynı props ve aynı başlangıç görünümünü görür. Tasarımcı “warning örneğinde metin iki satır olduğunda ikon aralığını kontrol edelim” diyebilir; geliştirici hangi durumu kastettiğini bilir. Tasarım sistemi kararları PR açıklamasında soyut sözlerle kalmaz, çalıştırılabilir örneğe bağlanır.

Bu ortak dil için isimleri kullanıcı davranışına göre seç. `State2` yerine `EmptySearch` veya `SaveFailed` gibi ad, durumun neyi gösterdiğini açıklar. Story'yi ekipte olmayan kişinin de anlayabilmesi için gerekli fixture verisini ve çevre provider'larını kur. Gizli bir uygulama route'una, kullanıcının localStorage'ına veya dış API erişimine bağlı story kolayca çalışmaz.

Storybook'a erişim verilmiş tasarımcı bileşeni farklı args ile deneyebilir. Ama gerçek tasarım token'ı değiştirmek için uygun yeri bilmesi gerekir: token kaynağı merkezi CSS ise story içindeki rastgele inline renk, gerçek ürün temasını temsil etmez. Story ile tasarım sisteminin kaynak kurallarını aynı tut.

## Erişilebilirlik ve görsel regresyon

Bir bileşen kataloğu etkileşim durumlarını ve erişilebilirlik incelemesini görünür kılar. A11y eklentisi role, ad, kontrast veya klavye sorunlarını yakalamaya yardım edebilir; yine de otomatik kontrol tüm kullanıcı deneyimini kanıtlamaz. Örneğin dialogun klavyeyle açılıp kapanmasını ve focus'un doğru yere dönmesini ayrıca deneyimlemek gerekir.

Görsel regresyon, seçilmiş story'lerin önceki görüntüleriyle yeni görüntülerini karşılaştırır. Bir CSS değişikliği beklenmeyen fark yaratırsa ekip farkı inceler. Bu karşılaştırma davranış testinin yerine geçmez: aynı screenshot'a benzeyen ama Enter ile açılamayan bir menü hâlâ bozuktur. Görsel kontrol piksel düzenindeki değişimi, davranış kontrolü ise kullanıcının yapabildiği işi denetler.

Görsel farklar font yüklenmesi, viewport genişliği ve animasyon zamanlaması gibi çevre koşullarından da etkilenebilir. Karşılaştırılan ortamın boyutu ve fontları sabit değilse her çalışmada gürültülü farklar oluşur. Animasyonlu bir geçiş screenshot anında başka karede yakalanabilir; reduced-motion tercihiyle sakin bir story kurmak veya karşılaştırmada animasyonu devre dışı bırakmak farkları anlamlı kılar. Ekip her farkı otomatik hata saymamalı, fakat bilinçli kabul edilen değişiklik de görünür bir tasarım kararı olmalıdır.

Durum kataloğu tasarım sisteminin kapsamını da gösterir. Örneğin hata story'si yoksa form hata tipografisi hiç gözden geçirilmemiş olabilir. Ancak story varlığı doğru üretim verisinin, tüm tarayıcı ölçülerinin veya ekran okuyucu uyumluluğunun ispatı değildir. Story'yi doğru soruyu konuşmak için kullan; bütün doğrulamayı tek ekrana yükleme.

## Sınır durumları ve sık hatalar

:::mistake[Story üretimde olmayan bir prop kullanıyor]
Belirti → Katalogda görünüm değişiyor ama uygulamada aynı seçenek yok. Neden → Story yalnız hikâye olsun diye gerçek component API'sinin dışına çıkmış. Düzeltme → Story args'larını component'in gerçek prop tipinden üret ve sahte seçenekleri kaldır.
:::

:::mistake[Her ekranı tek story'ye koymak]
Belirti → Kataloğu açınca belirli hata durumuna ulaşmak için birden fazla kontrolü tekrar yapmak gerekiyor. Neden → Story başlangıç state'ini sabitlemiyor. Düzeltme → Bir önemli başlangıç durumuna isim verip gereken fixture ve state'i o story'de kur.
:::

:::mistake[Otomatik a11y kontrolüne tam güvenmek]
Belirti → Araç uyarı vermiyor ama menü ok tuşlarıyla kullanılamıyor. Neden → Statik ağaç denetimi etkileşim sırasını bütünüyle sınamaz. Düzeltme → A11y taramasını klavye ve gerçek odak denemesiyle tamamla.
:::

:::mistake[Story ekran görüntüsünü davranış testi sanmak]
Belirti → Görsel karşılaştırma geçiyor ama kaydet düğmesi işlem yapmıyor. Neden → Görüntü, event sonucunu doğrulamaz. Düzeltme → Görsel ve davranış kontrollerini ayrı kanıtlar olarak kullan.
:::

:::sector
Ürün takımları Storybook'u tasarım sistemi katalogu, component review alanı ve bazı görsel kontroller için kullanır. Story isimleri tasarımcı, mühendis ve kalite ekibinin ortak sözlüğüne dönüşür. Katalogun değeri kurulu olmasından değil, önemli durumların doğru ve güncel örneklerle temsil edilmesinden gelir.
:::

## Özet

- Story, component'i belirli props ve bağlamla uygulamadan bağımsız gösterir.
- CSF'te default export meta bilgisini, named export'lar durum örneklerini taşır.
- Adlandırılmış temel ve sınır durumları ekip konuşmasını somutlaştırır.
- A11y eklentisi, klavye denemesi, davranış testi ve görsel karşılaştırma farklı şeyleri denetler.
- Story'ler gerçek component API'si ve token sistemiyle aynı kalmalıdır.

Kendini yokla: Bir story'de `args` neyi sabitler? Cevap: Bileşene verilen props başlangıç değerlerini ve böylece gösterilen durumu.

Kendini yokla: Screenshot karşılaştırması bir menünün klavyeyle çalıştığını kanıtlar mı? Cevap: Hayır. Etkileşim için klavye ve davranış kontrolü gerekir.
