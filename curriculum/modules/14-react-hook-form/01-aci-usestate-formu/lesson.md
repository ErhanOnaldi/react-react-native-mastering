---
title: "Sekiz alan, sekiz state"
minutes: 7
kind: review
---

# Sekiz alan, sekiz state

:::pain[Problem]
Sinema'da “İzleme listesi oluştur” formuna bir harf yazıyorsun. Formun tamamındaki render sayacı artıyor. Sekiz alanı ve hata koşullarını elle yönettiğinde küçük bir özellik büyük bir bakım yüküne dönüşüyor.
:::

## Bildiğin yöntemle başla

Modül 3'teki controlled input'ta `value` ve `onChange`, React state'ine bağlıydı. Burada ad, açıklama, kapak adı, ilk film, etiket, renk, sıralama ve not için ayrı state tut. Bir tuş, ilgili `setState`'i çağırır ve form bileşeni yeniden render edilir. Bu normal React davranışıdır; tek başına performans hatası demek değildir. Sekiz alan büyüdüğünde asıl sorun aynı kodun ve koşulların tekrarıdır.

```tsx
const [name, setName] = useState('')
// Bileşen her render edildiğinde sayaç artar.
const renders = useRef(0)
renders.current += 1
<input value={name} onChange={(event) => setName(event.target.value)} />
<output aria-label="Render sayısı">{renders.current}</output>
```

Bu blok bir bileşenin içinden kesittir. Önizlemede tek harf yazıp sayacı izle. Test de yazı yazdıktan sonra ilk değerden büyük olmasını bekler; başlangıç sayısını sabitlemez çünkü StrictMode geliştirmede ek render yapabilir.

## Koşullar birikir

`if (!name.trim())`, `else if (name.length < 3)`, `else if (...)` büyüdükçe hangi alanın hatalı olduğunu ve hangi mesajın gösterileceğini sen taşırsın. Bu derste henüz yeni kütüphane yok: önce bildiğin çözümü çalışır hâle getirip yükünü gör.

:::mistake
Her render'ı bir ağ isteği gibi düşünme. Render, React'in UI hesaplamasıdır. Yine de sayacın artışı, bu formda her tuşun tüm bileşeni yeniden çalıştırdığını açıkça gösterir.
:::

:::sector
Ölçmeden “form yavaş” deme. React DevTools Profiler veya küçük bir render sayacı, hangi etkileşimin hangi bileşeni çalıştırdığını görünür kılar.
:::
