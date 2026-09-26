## Neden böyle?

Başarısız HTTP cevabı başarılı veri sayılmaz. Her yeni deneme veya film kimliği için görünür durum baştan kurulmalı; eski isteğin geç cevabı da yeni filme yazmamalı.

Başka doğru yol, durumları bir reducer ile yönetip her isteğe kimlik vermektir. `fetch` yalnız ağ hatasında reject eder; 500 için `response.ok` kontrolü gerekir. Sonraki Query modülünde hata ve yeniden deneme davranışlarını sorgu durumlarıyla kuracaksın.
