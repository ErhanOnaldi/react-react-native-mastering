---
title: Odak ve render dışı küçük bellek
minutes: 8
kind: concept
---

# Odak ve render dışı küçük bellek

:::pain[Problem]
Arama kutusu açılıyor ama imleç orada değil. Klavye ile film adını hemen yazamıyorsun.
:::

## Ne değişiyor?

DOM düğümüne `useRef<HTMLInputElement>(null)` bağla; event handler içinde `inputRef.current?.focus()` çağır. Ref değişimi render başlatmaz.

## Sinema'da dene

Timer id gibi ekranda gösterilmeyen mutable değerler ref’te tutulabilir. Ekranda görünmesi gereken bilgi ise state olmalı. React 19’da kendi bileşenin `ref` prop’unu alabilir; sırf bunun için `forwardRef` gerekmez.

## DOM’a ulaş, render’ı kirletme

```tsx
const inputRef = useRef<HTMLInputElement>(null)
return <><button onClick={() => inputRef.current?.focus()}>Ara</button>
  <input ref={inputRef} /></>
```

İmleç odağı tarayıcı DOM’unda yaşar. Düğmeye tıklanınca ref üzerinden `focus()` çağırırsın. `current` değişince React yeniden render etmez; ekranda gösterilecek arama sorgusunu ref’e koymamalısın.

Önceki sorgu ya da timer kimliği de ref’te tutulabilir. Önceki sorguyu render sırasında yazarsan “önceki” değer aynı anda “şimdiki” olur. Effect sonrası ref’i güncellemek, sonraki render’da eski değerin okunmasını sağlar. Timer kimliğinde cleanup `clearTimeout(timerRef.current)` ile dış sistemi temizler.

React 19’da kendi input bileşenin `ref` prop’unu doğrudan alabilir: `function SearchInput({ ref }: { ref: React.Ref<HTMLInputElement> }) { return <input ref={ref} /> }`. Eski örneklerdeki `forwardRef` bu basit aktarım için artık gerekli değildir.

:::mistake[Sık hata]
Ref’i state yerine kullanırsan görünen içerik güncellenmez. Render sırasında `ref.current` yazmak da saf render ilkesini bozar.
:::

:::sector
Render sırasında `ref.current` okuyup yazma; render saf kalmalı.
:::
