## Neden böyle?

`tagline?: string` ile `tagline: string | null` farklıdır. İlkinde alan hiç gelmeyebilir. API modelinde poster null olasılığını gizleme; görünümde daha sonra fallback seçersin.

`any` veya tip iddiası ile hatayı saklamak yerine verinin olası durumlarını modelle.
