Poster bulunmadığında kart boş kalıyor. `PosterFrame` bileşeni `children: ReactNode` ve opsiyonel `caption?: string` alsın. `<figure>` içinde çocuk içeriği, `<figcaption>` içinde caption göster. Caption verilmezse “Afiş yok” yaz. JSX çocuk da geçilebilmeli.

**Örnek:** `<PosterFrame><strong>Matrix</strong></PosterFrame>` → Matrix içeriği ve “Afiş yok” caption’ı.
