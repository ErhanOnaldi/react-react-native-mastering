## Neden böyle?
State'i inputa yakın tutmak geniş render ağacını önler. Değişmeyen `onResultsRender` prop'lu küçük panelde `memo` gözlemlenebilir bir fark üretir. Gerçek film sonuçları query'ye bağlıysa panelin güncellenmesi gerekir; körlemesine atlamak eski veri gösterir. Profiler ile gerçek darboğazı ölç.
