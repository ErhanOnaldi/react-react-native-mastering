## Neden böyle?
Factory testte yalnızca anlamlı farkı gösterir. `Partial<T>` override tipini güvenli tutar; `null` değeri TMDB’nin gerçek boş poster sözleşmesidir. Yeni dizi üretmek testler arası veri sızıntısını önler. Sonraki pratikte fabrika verisini MSW cevabına koyacaksın.
