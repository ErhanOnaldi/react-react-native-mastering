Paket yöneticileri bir kütüphaneyi kurarken eldeki sürümün istenen semver şapka (`^`) aralığını karşılayıp karşılamadığını denetler. Verilen bir sürümün belirlenen aralığa uygunluğunu sınayan fonksiyonu tamamla.

## Gereksinimler

- İncelenen sürümün MAJOR numarası, aralıktaki MAJOR numarası ile birebir aynı olmalıdır (farklı MAJOR sürümler doğrudan reddedilir).
- Sürüm, aralıkta belirtilen taban sürümden büyük veya taban sürüme eşit olmalıdır.
- Taban sürümden daha büyük bir MINOR sürüm geldiğinde PATCH değeri daha küçük olsa dahi geçerli sayılmalıdır (`19.4.0 ≥ 19.3.7`).
- Aynı MINOR sürümde ise PATCH değeri taban sürümün PATCH değerinden küçük olamaz (`19.3.1 < 19.3.2`).

## Örnek

| Sürüm | Aralık | Sonuç |
| --- | --- | --- |
| `"19.3.0"` | `"^19.3.0"` | `true` |
| `"19.3.5"` | `"^19.3.0"` | `true` |
| `"19.4.0"` | `"^19.3.7"` | `true` |
| `"20.0.0"` | `"^19.3.0"` | `false` |
| `"19.2.9"` | `"^19.3.0"` | `false` |

## Sözleşme

- Dosya ve export: `semver.ts` → `export function satisfiesCaret(version: string, range: string): boolean`
- Hazır yardımcı: `export function parseVersion(text: string): Version`
