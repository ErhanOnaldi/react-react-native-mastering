---
title: "Tabs parçaları birlikte çalışsın"
minutes: 9
kind: concept
---

# Tabs parçaları birlikte çalışsın

:::pain[Problem]
Film detayında Özet, Oyuncular, Videolar sekmelerine ayrı `active`, `onChange`, `id` props'ları taşıyorsun. Bir panel yanlış sekmeye bağlanınca arayüz sessizce bozuluyor.
:::

## Tek kök, ilişkili parçalar
`<Tabs><Tabs.List><Tabs.Trigger value="cast">Oyuncular</Tabs.Trigger></Tabs.List><Tabs.Panel value="cast">…</Tabs.Panel></Tabs>` API'sinde ortak seçim state'i ve id eşlemesi Context'te durur. Trigger ve Panel yalnızca `value` bilir; dışarıdaki sayfa hangi panelin açık olduğunu yine `defaultValue` ile belirleyebilir.

```tsx title="MovieDetails.tsx"
<Tabs defaultValue="summary">
  <Tabs.List aria-label="Film bilgileri">
    <Tabs.Trigger value="summary">Özet</Tabs.Trigger>
    <Tabs.Trigger value="cast">Oyuncular</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="summary">Dövüş Kulübü özeti</Tabs.Panel>
  <Tabs.Panel value="cast">Oyuncu listesi</Tabs.Panel>
</Tabs>
```

Kök Context'i oluşturur. Alt bileşenler provider dışında kullanılırsa anlaşılır bir hata vermek, sessizce boş çalışmaktan iyidir. `aria-controls` ve `aria-labelledby` için kararlı id'ler üret. Seçili tab `tabIndex=0`, diğerleri `-1` alır.

## İkinci ihtiyaç: yön tuşları
Bir sekme tıklamayla seçildiğinde kolaydır; klavyede ArrowRight/ArrowLeft, Home/End de seçimi ve focus'u birlikte taşımalıdır. Trigger'ların DOM sırasını kullan; böylece film detayına yeni sekme eklendiğinde indeksleri elle güncellemezsin.

:::mistake
Sadece paneli gizlemek yetmez. Seçili sekmenin `aria-selected` değeri ve focus sırası da güncellenmeli.
:::

:::sector
Bu API, `Modal.Trigger` ve `Modal.Content` için de iyi bir temel; ancak her compound bileşenin klavye kuralları farklıdır.
:::
