## Neden böyle?

Her tür farklı sunucu sonucudur. Sorgu kimliği türü içermeyince yeni seçim eski cevabın kimliğini paylaşır; cache sonucu yanlış ekranda gösterir.

Başka geçerli çözüm, tür seçimine göre ayrı kaynak bileşenlerini mount etmek ve her birinde benzersiz sorgu kimliği kullanmaktır. Yalnız isteğin URL'sini düzeltmek yetmez: cache kimliği de değişmelidir. Sonraki birleşik Atölye görevinde URL, sayfa ve cache kimliği birlikte yönetilecek.
