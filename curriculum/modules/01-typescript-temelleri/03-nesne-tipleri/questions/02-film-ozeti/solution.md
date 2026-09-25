## Neden böyle?

`tagline?: string` ile `tagline: string | null` farklıdır. İlkinde alan hiç gelmeyebilir. API modelinde poster null olasılığını gizleme; görünümde daha sonra fallback seçersin.

## Alternatif ve dikkat

Slogan yoksa `??` ile boş metin seçmek de mümkün; ayırıcıyı yalnızca dolu sloganda eklemelisin. Opsiyonel alanı zorunlu yazmak gerçek veriyle uyumsuz olur.

## Sektörde ve devamında

API modeli ile kartın gösterim kararı ayrı tutulur.
