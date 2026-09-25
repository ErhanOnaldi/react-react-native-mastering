---
title: Kartın geri kalan UI parçaları
minutes: 9
kind: practice
---

# Kartın geri kalan UI parçaları

:::pain[Problem]
Button tamam ama puan etiketi, kart çerçevesi ve yüklenme yeri her sayfada yeniden yazılıyor. Skeleton alan tutmazsa yükleme bitince ızgara sıçrıyor.
:::

## Farklı bileşenler, aynı ilkeler

`Badge` kısa bilgiyi (`8.4`, `Dram`) gösterir; `Card` içeriği görsel bir sınırda toplar; `Skeleton` yüklenirken yaklaşık aynı alanı tutar. Bunlar ayrı sorumluluklar olduğu için hepsini bir Button varyantına sıkıştırma. Her biri `className` ve `data-*` props'larını doğal HTML öğesine iletebilir.

```tsx check
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-sky-100 px-2 py-1 text-xs text-sky-900">{children}</span>
}
export function MovieSummary() {
  return <article className="rounded-xl border p-4"><h2>Dövüş Kulübü</h2><Badge>8.4</Badge></article>
}
```

Skeleton yalnızca görsel yükleme işaretidir: `aria-hidden="true"` ile ekran okuyucudan gizlenebilir, kapsayıcıda bir "Yükleniyor" metni bulunabilir. Sonraki modülde gerçek veri yükleme state'i ne zaman Skeleton gösterileceğini belirleyecek.

`Card` ve `Badge` `children` ile composition kullanır. `Input` doğal input props'larını iletir; kullanım yerinde görünen `<label>` veya `aria-label` ver. `className="p-4"` temel `p-2` ile çakışırsa `cn` override'ı korur. Testte `toHaveClass`, rol/ad ve `data-*` niteliği sözleşmeyi anlatır.

:::sector
Küçük UI parçaları arama, detay ve favori ekranında tekrar kullanılır. Görünüm değişirken erişilebilir HTML props'larını korumak kalıcı bir sözleşmedir.
:::
