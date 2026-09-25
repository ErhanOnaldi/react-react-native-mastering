## Neden böyle?

Hook’u erken dönüşün üstüne taşı; `if (id)` koşulunu effect’in içine koy. Böylece Hook sırası sabit kalır, davranış koşullu kalabilir. `useEffect`’i ayrı bileşene taşımak da bazı tasarımlarda geçerlidir ama bu küçük bileşen için gereksizdir. Yeni bağlam: sorun dependency değil, çağrı sırasıdır.
