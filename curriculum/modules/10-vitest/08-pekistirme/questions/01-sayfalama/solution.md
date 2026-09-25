## Neden böyle?

Sayfa 2 ilk id, `(page - 1) * pageSize` hesabını güvenceye alır. Sayfa 3 ise kısmi son sayfanın düşürülmediğini gösterir. `toEqual` burada tam dizi sözleşmesine uygun; `toMatchObject` yanlış bir ek filmi kaçırabilir. Sinema arama akışında aynı sınır URL parametresi üzerinden de korunmalı.
