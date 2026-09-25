## Neden böyle?

`toMatchObject` nesnenin ilgili alt kümesini denetler. `toBe` yeni nesnede referans arardı; `toEqual` ise yeni bir `has_more` alanı eklenince gereksiz yere kırılabilirdi. Ancak `toMatchObject({})` hiçbir şey kanıtlamaz: sayfa ve toplam sayfa birlikte gereklidir. Bir sonraki derste iç uygulama yerine bu tür gözlenen sözleşmeleri seçeceksin.
