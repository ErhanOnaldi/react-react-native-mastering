---
title: Koşullu render
minutes: 8
kind: concept
---

# Koşullu render

:::pain[Problem]
Sinema’nın “seçili favori sayısı” sıfırken `count && <p>…</p>` yazdın. Yazı gizlendi ama ekranda yalnız bir `0` kaldı.
:::

## Duruma göre ekran seç

Koşullu render, state veya props'a bakarak hangi JSX parçasının üretileceğini belirlemektir. JavaScript koşulları burada aynen çalışır; bu yüzden `&&` operatörünün döndürdüğü değer ile "hiçbir şey gösterme" niyetini karıştırmamalısın. Yükleme, hata, boş sonuç ve başarı ayrı kullanıcı durumlarıdır.

Önceki TypeScript modülündeki discriminated union yalnızca veri tipi değildi; şimdi her dalın ekrandaki karşılığını kuruyorsun. Sinema'nın sıfır favori örneği küçük bir JavaScript ayrıntısını gösterir. Aynı düşünce, ağdan gelen sonucun eksik veya hatalı olduğu daha büyük sayfalarda da gerekecek.

## JSX ifade sonucunu render eder
`&&` operatörü sol taraf yanlışsa onu döndürür. `0` React tarafından metin olarak gösterilir. `count > 0 && ...` gibi boolean koşul veya ternary kullan. Boş liste için erken dönüş de nettir.

```tsx check
export default function FavoriteCount({ count }: { count: number }) {
  return count > 0 ? <p>{count} favori</p> : <p>Henüz favori yok</p>
}
```

Önceki modüldeki `RemoteData<T>` discriminated union’ını hatırla: `status` alanına göre idle/loading/success/error ekranlarını ayır. `success` dalında veri tipinin daralması, zoraki `as` kullanımını önler. Bu derste statik örnek durumlar kullanıyoruz; veri çekme 5. modülde gelecek.

:::mistake
`loading` ve `error` dallarını aynı anda göstermek, kullanıcıya çelişkili durum sunar. Union her an yalnızca bir durumu temsil eder.
:::

:::sector
Açık durum ekranları ve boş durum mesajları, “hiçbir şey görünmüyor” hatasını ürün düzeyinde çözer.
:::
