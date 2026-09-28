---
title: "A11y akışını birleştir"
minutes: 8
kind: practice
---

# A11y akışını birleştir

:::pain[Problem]
Parçalar ayrı ayrı çalışıyor. Ama birleşince yeni hatalar çıkıyor: fragman dialogunu arka plana tıklayarak kapatmak istedin, şimdi dialogun **içindeki** başlığa tıklamak da kapatıyor. Videosu olmayan bir filmde de Videolar sekmesi boş bir panel ve gereksiz bir focus durağı olarak duruyor.
:::

## Önce akışı elle izle
Fareyi bırak. Tab ile **Fragmanı aç**'a gel, Enter'a bas. Dialogun adını ve ilk focus'u kontrol et, Tab ile dolaş, Escape ile kapat; focus düğmeye döndü mü? Sonra sekmelerde yön tuşlarıyla gez. Önizlemede focus halkasını izlemek, testin neyi kanıtladığını görmenin en hızlı yolu.

## İki yeni durum
**Arka plana tıklayarak kapatma.** Yaygın bir istek, ama tıklama olayları yukarı **kabarcıklanır** (bubbling). Dialog arka planın içindeyse, dialogdaki her tıklama arka planın `onClick`'ine de ulaşır. Arka plan yalnızca **kendisine** tıklandığında kapatmalı:

```tsx title="Backdrop.tsx"
<div
  className="fixed inset-0 bg-black/60"
  onClick={(event) => {
    if (event.target === event.currentTarget) close()
  }}
>
  <div role="dialog" aria-modal="true" aria-labelledby={titleId}>…</div>
</div>
```

`event.target` tıklanan en içteki öğe, `event.currentTarget` dinleyicinin bağlı olduğu öğedir. Portal kullandığında da aynı kural geçerli: React olayları portal içinden React ağacındaki atalara yayılır.

**Veriden türeyen sekmeler.** TMDB'de bazı filmlerin videosu yok. Sekme listesini sabit yazmak yerine veriden türet. Seçili sekme veriden düşerse (video listesi boşaldı) seçim Özet'e dönmeli; o sekme focus'luysa focus da kaybolmamalı.

:::mistake
Testte yalnızca `getByText` kullanmak rol ve ad eksiklerini gizler. `getByRole('dialog', { name })`, `getByRole('tabpanel', { name })` gibi sorgular kullanıcının gerçekte eriştiği şeyi doğrular.
:::

:::sector
A11y, tasarımın sonunda işaretlenen bir kontrol listesi değil; bileşenin davranış sözleşmesidir. Tasarım "dışarı tıklayınca kapansın" dediğinde, klavye kullanıcısı için karşılığının (Escape) da olduğundan emin ol.
:::
