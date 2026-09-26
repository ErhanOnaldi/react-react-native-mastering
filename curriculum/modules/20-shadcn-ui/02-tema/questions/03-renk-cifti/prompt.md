Koyu temayı eklerken `--primary`'yi açtın ama `--primary-foreground`'ı unuttun; düğme yazısı okunmuyor. Bunu gözle yakalamak yerine tema token'larını tarayan küçük bir **bekçi** yaz. (CI'da çalışan bir tema testi olarak düşünebilirsin.)

## Görev
`contrastPairs.ts` içindeki iki fonksiyonu tamamla.

### `oklchLightness(value)`
OKLCH değerinin ilk sayısını (algısal açıklık) 0–1 aralığında döndür.

| Girdi | Çıktı |
| --- | --- |
| `oklch(0.55 0.18 40)` | `0.55` |
| `oklch(78% 0.14 45)` | `0.78` |

### `findLowContrastPairs(tokens, minGap = 0.4)`
- Rol çiftlerini adlandırma sözleşmesinden bul: `--x-foreground` varsa yüzeyi `--x`'tir.
- İstisna: `--foreground`'ın yüzeyi `--background`'dır; bu çiftin rol adı `background`.
- Eşi olmayan token'ları (`--border`, `--radius`…) yok say.
- İki açıklık arasındaki mutlak fark `minGap`'ten küçükse rol adını (`--` ve `-foreground` olmadan) listeye ekle. Sıra, token nesnesindeki sırayı izlesin.

Örnek: `--primary: oklch(0.85 …)` ve `--primary-foreground: oklch(0.98 …)` → fark 0.13 → `['primary']`.

Not: Açıklık farkı kaba bir ön kontroldür. WCAG kontrast oranı göreli parlaklıkla hesaplanır; gerçek üründe tarayıcı araçlarıyla da ölç.
