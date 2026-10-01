## Neden böyle?

`currentTarget` handler’ın bağlandığı input olarak tiplidir; iç içe öğe senaryolarında `target` daha belirsiz olabilir. Bileşen değerin sahibi değildir; controlled değer üstten gelir ve yeni metin callback ile döner. `readOnly` veya eksik callback yazma etkileşimi durdurur. Bir sonraki görev aynı metni form submit’iyle birleştirir.
