## Neden böyle?
Dinamik import ayrı chunk oluşturur. `Suspense` beklemeyi görünür kılar. Bileşeni her render içinde `lazy` ile yeniden tanımlamak yeni tip yaratır ve state'i sıfırlayabilir. Route düzeyinde benzer işi React Router 8 `lazy` route modülü yapar; `path` statik kalır.
