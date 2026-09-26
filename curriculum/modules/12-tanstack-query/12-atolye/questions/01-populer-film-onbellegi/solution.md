## Neden böyle?

Popüler liste tek kaynaktır ve kısa dönüşte taze kabul edilebilir. Aynı sorgu kimliği ve bir dakikalık tazelik süresi, yeniden mount sırasında ikinci isteği önler.

Başka geçerli yaklaşım, ekranın üstünde kalıcı bir veri katmanı kurup dönüşte aynı sonucu paylaşmaktır. Her mount'ta yeni client oluşturmak cache'i sıfırlar; varsayılan sıfır tazelik de arka planda yeniden istek gönderebilir. Sonraki görevde tür ve sayfa ayrı sonuç kimlikleri oluşturacak.
