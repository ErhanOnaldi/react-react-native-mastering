Sinema'da aynı afiş çerçevesi farklı film içeriğini taşımalı. `PosterFrame` bileşenini kur; alt yazı verilmediyse “Afiş yok” göster.

## Gereksinimler

- İçerik bir `figure` içinde yer almalıdır.
- Metin veya JSX children olarak gösterilebilmelidir.
- `caption` verilmişse `figcaption` içinde, verilmemişse “Afiş yok” görünmelidir.

## Örnek

`<PosterFrame caption="Matrix afişi"><strong>Matrix</strong></PosterFrame>` → film adı ve “Matrix afişi” görünür.

## Sözleşme

- Dosya ve export: `PosterFrame.tsx` → named export `PosterFrame`
- Props: `{ children: ReactNode; caption?: string }`
