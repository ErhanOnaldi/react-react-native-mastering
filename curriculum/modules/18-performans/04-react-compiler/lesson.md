---
title: "React Compiler ile varsayılan yol"
minutes: 16
kind: concept
---

# React Compiler ile varsayılan yol

:::pain[Problem]
Önceki derste gördüğümüz manzarayı hatırla: Bir bileşenin gereksiz render olmasını engellemek için bileşeni `memo` ile sardın. Ardından ona geçen fonksiyon için `useCallback` yazdın. Fonksiyona geçen nesne için `useMemo` yazdın. Bağımlılık dizisine bir değişken eklemeyi unuttun, bayat closure hatası çıktı; ekledin, bu sefer her render'da yeni referans oluştuğu için `memo` bozuldu!

Birkaç ay içinde projedeki kodların neredeyse üçte biri, sırf React'e "bu değeri lütfen aklında tut" demek için yazılan karmaşık `useMemo`, `useCallback` ve bağımlılık dizisi hamallığına dönüşür. Geliştirici iş mantığı yazmak yerine React'in referans eşitliğiyle savaşır. Bu manuel yük neden bir derleyici tarafından otomatik olarak yapılmasın?
:::

:::model[Render tetikleyicileri ve memo sınırları]
Önceki derslerde kurduğumuz modeli hatırla:

![Render tetikleyicileri ve memo sınırları](diagram:render-nedenleri)

Üst bileşen render olduğunda varsayılan olarak tüm alt ağaç çağrılır. Biz bu dalgayı durdurmak için elle `memo` sınırları koyuyor ve props referanslarını `useMemo`/`useCallback` ile sabitliyorduk. React Compiler, bu sınırları senin yerine **otomatik ve çok daha hassas** biçimde kurar.
:::

## React Compiler nedir ve nasıl çalışır?

React Compiler (eski adıyla React Forget), React ekibi tarafından geliştirilen ve Ekim 2025'te 1.0 kararlı sürümüne ulaşan resmi bir derleme aracıdır (build-time compiler).

Zihinsel modelini şu temel ilkelerle kur:

1. **Çalışma zamanında değil, derleme anında çalışır:** React Compiler tarayıcıda çalışmaz. Sen `pnpm build` veya `pnpm dev` çalıştırdığında, Vite/Babel derleme hattında TypeScript ve JSX kodunu inceler.
2. **Otomatik ve ince taneli (fine-grained) memoization:** Derleyici, bileşen ve hook gövdelerindeki veri akışını matematiksel olarak analiz eder. Hangi değişkenin hangi JSX düğümünü etkilediğini çıkarır. Gereken yerlere gizli önbellek yuvaları (`$[]`) yerleştirir.
3. **Erken dönüşlerden (early return) sonra bile çalışır:** Elle yazılan `useMemo` ve `useCallback` hook kuralları gereği bir `if` koşulundan sonra çağrılamaz. Ancak React Compiler derleme düzeyinde çalıştığı için erken dönüşlerin (`if (!data) return null`) altındaki kısımları da kusursuzca memoize eder.
4. **Bozuk kodu düzeltmez, saf kod ister:** Derleyici sihirli bir değnek değildir. Eğer bir bileşenin içinde render anında doğrudan değişken mutasyonu yapıyorsan (`props.items.push(...)` veya `window.counter++`), derleyici bu kodun güvenli olmadığını anlar ve o bileşeni optimize etmeyi **sessizce atlar**.

## Paket kurulumu ve Vite konfigürasyonu

React Compiler'ı bir Vite projesine dahil etmek için gerekli araçlar derleme ortamında (Node.js sürecinde) çalışır. Bu nedenle paketler `devDependencies` altına eklenir.

### 1. Gerekli paketleri projene kur

Terminalinde şu komutu çalıştırarak kararlı Babel eklentisini ve Rolldown/Babel köprüsünü kur:

```bash
pnpm add -D babel-plugin-react-compiler @rolldown/plugin-babel
```

### 2. Vite konfigürasyonunu güncelle

Vite 8 ve `@vitejs/plugin-react` 6 ekosisteminde resmi olarak önerilen kararlı yol, `@rolldown/plugin-babel` eklentisi üzerinden `reactCompilerPreset()` kullanmaktır:

```ts title="vite.config.ts"
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
})
```

> [!NOTE]
> `@vitejs/plugin-react` eklentisinin içinde doğrudan `react({ compiler: true })` şeklinde bir native Oxc seçeneği de bulunmaktadır; ancak bu yol henüz **deneysel** olarak etiketlenmiştir. Üretim ortamında ve bu platformda kararlı standart, Babel önayarı (`reactCompilerPreset`) üzerinden giden yoldur.

## Manuel memoization ile Compiler karşılaştırması

Şimdi bir harcama özeti bileşeninde iki yaklaşımı karşılaştıralım.

### Eski yol: Her satırda manuel hook hamallığı

```tsx
// ESKİ YOL: Manuel ve kırılgan
import { useMemo, useCallback } from 'react'

export function ExpenseBreakdown({ items, filterCategory, onSelect }: Props) {
  // 1. Ağır hesaplamayı manuel saklamak zorundaydık
  const filtered = useMemo(() => {
    return items.filter((item) => item.category === filterCategory)
  }, [items, filterCategory])

  const total = useMemo(() => {
    return filtered.reduce((acc, curr) => acc + curr.amount, 0)
  }, [filtered])

  // 2. Fonksiyon referansını manuel korumak zorundaydık
  const handleClick = useCallback((id: string) => {
    onSelect(id)
  }, [onSelect])

  return (
    <div>
      <h3>Toplam: {total} ₺</h3>
      <ItemList items={filtered} onItemClick={handleClick} />
    </div>
  )
}
```

Bu kodda her bir `useMemo` ve `useCallback` için bağımlılık dizilerini (`[]`) takip etmek, referansların kararlılığını test etmek zorundaydın.

### Yeni yol: Sade, saf JavaScript kodu

React Compiler açıkken aynı bileşeni tıpkı standart bir JavaScript fonksiyonu gibi yazarsın:

```tsx check
export interface ExpenseItem {
  id: string
  title: string
  amount: number
  category: string
}

interface ExpenseBreakdownProps {
  items: ExpenseItem[]
  filterCategory: string
  onSelect: (id: string) => void
}

export function CleanExpenseBreakdown({
  items,
  filterCategory,
  onSelect,
}: ExpenseBreakdownProps) {
  // useMemo YOK! Compiler bu filtrelemeyi ve toplamı otomatik olarak memoize eder.
  const filtered = items.filter((item) => item.category === filterCategory)
  const total = filtered.reduce((acc, curr) => acc + curr.amount, 0)

  // useCallback YOK! Compiler bu fonksiyonu ve alt bileşenin props eşitliğini korur.
  function handleClick(id: string) {
    onSelect(id)
  }

  return (
    <section>
      <h3>Toplam Harcama: {total} ₺</h3>
      <ul>
        {filtered.map((item) => (
          <li key={item.id} onClick={() => handleClick(item.id)}>
            {item.title}: {item.amount} ₺
          </li>
        ))}
      </ul>
    </section>
  )
}
```

Derleyici derleme sırasında bu kodu alır ve arka planda şu kontrolü üretir: *"Eğer `items` ve `filterCategory` değişmediyse, `filtered` ve `total` için önceden hesaplanan sonucu döndür; JSX ağacını da yeniden üretme!"*.

Sen tek bir hook dahi yazmadan, el yazısıyla yazılabilecek en kusursuz memoization performansını elde edersin.

## Derleyicinin geçiş kapısı: ESLint ve Saflık Kuralları

React Compiler kodunu optimize edebilmek için kodun **React Kuralları'na (Rules of React)** uyduğundan emin olmak zorundadır.

Eğer bir bileşen şu kuralları ihlal ederse, derleyici o bileşeni optimize edemez:

1. **Render anında yan etki (side-effect) üretmemek:** Render fonksiyonunun içinde doğrudan `fetch` atmak, `localStorage` yazmak veya DOM elementlerini değiştirmek yasaktır.
2. **Props ve State'i asla doğrudan mutasyona uğratmamak:** `props.items.sort()` veya `state.user.name = 'Ahmet'` yazarsan derleyici nesnenin değiştiğini takip edemez.
3. **Hook'ları koşulsuz çağırmak:** `if` blokları veya döngüler içinde hook çağırmak kesinlikle yasaktır.

`eslint-plugin-react-hooks@6` artık doğrudan React Compiler analiz kurallarını içerir. ESLint'i çalıştırdığında gelen `react-hooks/rules-of-hooks` hatalarını çözmek, aynı zamanda React Compiler'ın kapılarını ardına kadar açmak demektir.

## Sınır durumları ve sık yapılan hatalar

:::mistake[1. Mevcut tüm useMemo ve useCallback'leri körlemesine projeden silmek]
- **Belirti:** Compiler'ı projeye kurduktan sonra tüm projede arama yapıp bütün `useMemo` ve `useCallback` satırlarını sildin; bazı harici kütüphaneler veya özel `useEffect` bağımlılıkları bozuldu.
- **Neden:** Bazı durumlarda bir fonksiyon referansının kararlı olması sadece bir performans optimizasyonu değil, harici bir kütüphaneye veya web API'sine verilen bir sözleşmedir (contract).
- **Düzeltme:** Mevcut kodundaki çalışan `useMemo` ve `useCallback`'leri aceleyle silme. Derleyici el yazısı memoization'ı zaten bir ipucu olarak görür ve saygı duyar. Yeni yazacağın kodlarda ise varsayılan olarak derleyiciye güven; manuel memo hook'larına yalnızca özel bir ihtiyaçta başvur.
:::

:::mistake[2. Gerekli build paketlerini sadece dependencies'e koymak ya da unutmak]
- **Belirti:** `vite.config.ts` dosyasına eklentileri yazdın; ancak `pnpm build` çalıştırıldığında `Module not found` hatası alıyorsun.
- **Neden:** `babel-plugin-react-compiler` ve `@rolldown/plugin-babel` paketleri projeye kurulmamış.
- **Düzeltme:** Paketleri `pnpm add -D babel-plugin-react-compiler @rolldown/plugin-babel` komutuyla `devDependencies` altına ekle.
:::

:::mistake[3. Geliştirme modu Profiler sürelerini canlı ortam sanmak]
- **Belirti:** Geliştirme sunucusunda React Compiler açık olmasına rağmen Profiler sürelerinin çok az değiştiğini görüyorsun.
- **Neden:** Vite geliştirme ortamında React geliştirici kontrolleri, HMR (Hot Module Replacement) kodları ve `StrictMode` çift render'ları çalışır.
- **Düzeltme:** Derleyicinin gerçek hız farkını görmek için daima `pnpm build` ile üretim paketi üretip `pnpm preview` üzerinde ölçüm yap.
:::

:::sector[Sektörde nasıl kullanılır?]
React Compiler sektörde hızla endüstri standardı haline gelmektedir:

- **Meta:** Instagram ve Quest Store web arayüzlerinde React Compiler'a geçildikten sonra sayfa yükleme sürelerinde %12'ye varan hızlanma ve etkileşim gecikmelerinde 2.5 kata varan iyileşme kaydedilmiştir.
- **Modern Kod Standartları:** Yeni başlayan projelerde artık geliştiricilere "Her şeye memo yaz" eğitimi verilmemektedir. Bunun yerine saf JavaScript fonksiyonları yazma, state'i doğru yerde tutma ve derleyicinin işini yapmasına izin verme kültürü yerleşmektedir.
:::

## Özet

- React Compiler 1.0, bileşen ve hook gövdelerini derleme anında otomatik olarak memoize eden resmi React aracıdır.
- Yeni kod yazarken varsayılan yaklaşım şudur: Kodu saf fonksiyon olarak yaz, memoization'ı derleyiciye bırak; yalnızca özel referans sözleşmelerinde manuel hook kullan.
- Kurulum için `pnpm add -D babel-plugin-react-compiler @rolldown/plugin-babel` paketleri eklenir ve Vite konfigürasyonunda `reactCompilerPreset()` önayarı tanımlanır.
- Derleyicinin kodu optimize edebilmesi için kodun saf render kurallarına ve Hook kurallarına uyması şarttır; ESLint kontrolleri bu uyumu garanti eder.

### Kendini yokla

1. **Soru:** React Compiler açık olan bir projede bir geliştirici neden `useMemo` yazmadan sadece `const total = items.reduce(...)` yazabilir?
   - **Cevap:** Çünkü derleyici AST analizi ile `items` dizisinin değişip değişmediğini derleme anında takip eder ve arka planda bu hesaplamayı otomatik olarak önbelleğe alır.

2. **Soru:** React Compiler, render sırasında `props.list.push(newItem)` yapan hatalı bir bileşeni düzelterek performansını artırabilir mi?
   - **Cevap:** Hayır, artıramaz. Derleyici saf olmayan, render sırasında doğrudan mutasyon yapan bileşenleri güvenli bulmaz ve optimizasyon dışı bırakır.
