Tema CSS'inde eşleşen yüzey ve metin renk çiftlerini denetle. Açıklık farkı küçük olan roller için tasarım ekibine inceleme listesi döndür.

## Gereksinimler
- `oklchLightness(value)` OKLCH değerinin ilk açıklık sayısını 0–1 aralığında döndürsün; `78%` girişi `0.78` olsun.
- `findLowContrastPairs(tokens, minGap = 0.4)` her `--x-foreground` token'ını `--x` yüzeyiyle eşleştirsin.
- `--foreground` özel olarak `--background` ile eşleşsin ve sonuçta `background` rolü olarak adlandırılsın.
- Eşi olmayan token'lar yok sayılsın. Açıklık farkı `minGap` değerinden küçükse rol adı döndürülsün.
- Sonuçlar `tokens` nesnesindeki eşleşen foreground sırasını izlesin.

## Örnek
- `oklchLightness('oklch(78% 0.14 45)')` → yaklaşık `0.78`.
- `--primary` açıklığı `0.85`, `--primary-foreground` açıklığı `0.98` ve `minGap: 0.4` ise sonuç `['primary']` olur.

## Sözleşme
- `contrastPairs.ts` → `ThemeTokens`, `oklchLightness(value: string): number`, `findLowContrastPairs(tokens: ThemeTokens, minGap?: number): string[]` export'ları.

## Kısıtlar
- Bu açıklık farkı yalnızca kaba bir inceleme uyarısıdır; WCAG kontrast oranı değildir.
