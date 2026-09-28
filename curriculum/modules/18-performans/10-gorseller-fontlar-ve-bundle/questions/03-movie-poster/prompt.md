Sayfa açılışında en üstteki ana görselin (LCP adayı) hızlıca inmesini sağlayan, listenin altındaki ekran dışı görselleri ise kullanıcı yaklaşana kadar erteleyen ve yerleşim kaymalarını (CLS) önleyen bir film afişi bileşeni yaz.

## Gereksinimler

- Bileşen bir `<img>` elementi render etmelidir.
- `priority: true` verildiğinde:
  - `loading` özniteliği `"eager"` olmalıdır.
  - `fetchPriority` özniteliği `"high"` olmalıdır.
- `priority` verilmediğinde veya `false` olduğunda:
  - `loading` özniteliği `"lazy"` olmalıdır.
  - `fetchPriority` özniteliği `"low"` veya `undefined` (varsayılan) olabilir.
- Her durumda:
  - Görsel kod çözme işleminin ana iş parçacığını kilitlememesi için `decoding="async"` özniteliği bulunmalıdır.
  - Yerleşim kaymalarını önlemek için verilen sayısal `width` ve `height` öznitelikleri `<img>` elementine yansıtılmalıdır.
  - Verilen `src`, `alt` ve varsa `className` değerleri `<img>` etiketine aktarılmalıdır. `alt` boş bir dize (`""`) olarak verilse bile `alt=""` olarak DOM'a geçmelidir.

## Örnek

\`\`\`tsx
// İlk ekrandaki vitrin afişi (LCP adayı)
<MoviePoster
  src="/posters/matrix.jpg"
  alt="Matrix"
  width={300}
  height={450}
  priority
/>
// Çıktı: <img src="/posters/matrix.jpg" alt="Matrix" width="300" height="450" loading="eager" fetchpriority="high" decoding="async" />

// Listenin altındaki normal afiş
<MoviePoster
  src="/posters/fight-club.jpg"
  alt="Dövüş Kulübü"
  width={300}
  height={450}
/>
// Çıktı: <img src="/posters/fight-club.jpg" alt="Dövüş Kulübü" width="300" height="450" loading="lazy" decoding="async" />
\`\`\`

## Sözleşme

- Dosya ve export: `MoviePoster.tsx` → `MoviePoster(props: MoviePosterProps)` (named veya default export; named export tercih edilir)
- Tip tanımı:
  \`\`\`ts
  export interface MoviePosterProps {
    src: string
    alt: string
    width: number
    height: number
    priority?: boolean
    className?: string
  }
  \`\`\`
