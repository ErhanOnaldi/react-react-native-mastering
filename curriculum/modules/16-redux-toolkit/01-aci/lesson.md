---
title: "Beş Context’in render maliyeti"
minutes: 7
kind: concept
---

# Beş Context’in render maliyeti

:::pain[Sinema’da sorun]
Favori yıldızına bastın; tema düğmesinin ve izleme listesi formunun render sayacı da arttı. Beş provider iç içe olunca değişimin yayılma alanını gözden kaçırmak kolay.
:::

## Sorunu çöz

Context kötü bir araç değildir. Provider değeri değişince onu okuyan bileşenler yeniden render olur. Bir provider değeri büyük bir nesneyse farklı alanları okuyan tüketiciler de etkilenir. Ayrıca provider gövdesindeki çocuk ağacı kendi başına yeniden render olabilir; sayacı yorumlarken bunu ayır.

## Sinema örneği

Önce `renderCount += 1` ile tema tüketicisini ölç. Yalnızca favoriyi güncelle; sayaç 1’den 2’ye çıkıyorsa ihtiyaç somut. Sonra state sahiplerini ve abonelik sınırını düşün.

## Sayacı gerçekten gör

Aşağıdaki eski Context örneğinde tema tüketicisi yalnız `theme` alanını kullanır. Ancak tek Context’in `value` nesnesi favori değişiminde yeniden oluşursa tüketici tekrar çalışabilir:

```tsx title="Context ile ilk deneme"
const value = { favoriteIds, theme, watchlists }
return <AppContext.Provider value={value}><App /></AppContext.Provider>
```

Bir render sayacı eklediğinde önceki değeri kaydet; favori action’ını bir kere gönderip farkına bak. Testte `expect(after - before).toBe(0)` gibi bir hedef koyabilirsin. StrictMode geliştirmede ilk render’ı tekrar çağırabildiği için `after === 1` gibi mutlak sayı güvenilir değildir.

Context küçük, seyrek değişen global tercihler için hâlâ işe yarar. Buradaki ağrıyı yaratan, değişimleri sık olan alanların tek abonelik sınırında birleşmesi. Sonraki derslerde önce verinin sahibini, sonra abonelik biçimini belirleyeceğiz.

:::mistake[Sık hata]
Sayıyı React StrictMode altında kesin kez diye ezberleme: geliştirmede ek render olabilir. Testte başlangıç sayısını kaydet, yalnızca eylem sonrası artışı karşılaştır.
:::

:::sector[Sektörde]
Gerçek uygulamada React Profiler ile ölç; küçük ağaçta Context gayet yeterli olabilir.
:::
