## Neden böyle?

Önceki `URLSearchParams` değerini kopyalayıp yalnızca gereken anahtarları değiştirmek komşu filtreleri korur. Query değişince page silmek boş sonuç yanılsamasını çözer. Controlled input değeri doğrudan URL'den gelir; ayrı state iki kaynak yaratır. Sonraki görevde sayfa değişirken q ve genre korunacak.

:::sector
Sektörde bağımsız filtre kontrolleri komşu query parametrelerini silmemelidir.
:::
