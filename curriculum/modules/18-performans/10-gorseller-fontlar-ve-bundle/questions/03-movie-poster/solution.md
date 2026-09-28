# Neden böyle?

## LCP için priority ayrımı
Bir web sayfasında aynı anda onlarca görsel bulunabilir. Tarayıcı tüm görselleri aynı öncelikle indirmeye çalışırsa veya ilk ekrandaki en büyük görsele yanlışlıkla `loading="lazy"` verilirse, sayfanın ana görseli saniyelerce ertelenir ve Largest Contentful Paint (LCP) skoru çöker.

`priority: true` bayrağı ile ilk 1–2 afişe:
- `loading="eager"` (hemen indir, erteleme)
- `fetchPriority="high"` (ağ kuyruğunda diğer alt görsellerin önüne geçir)
verilir. Ekran dışındaki diğer tüm afişlere ise `loading="lazy"` verilerek kullanıcının kotası ve bant genişliği korunur.

## decoding="async"
Büyük bir JPEG veya WebP görseli ağdan indikten sonra tarayıcı onu piksellere dönüştürmek için CPU üzerinde kod çözme (image decode) işlemi yapar. Varsayılan senkron decode işlemi ana iş parçacığını (main thread) kilitleyebilir ve tam o anda kullanıcı ekrana dokunursa INP gecikmesine yol açar. `decoding="async"` tarayıcıya bu işlemi ana iş parçacığı dışında asenkron yapmasını söyler.

## width ve height ile CLS önleme
Eğer bir `<img>` etiketinde `width` ve `height` yoksa, tarayıcı görsel inene kadar onun boyutunu `0 × 0` kabul eder. Görsel 450px yüksekliğinde indiği anda altındaki tüm kartlar 450px aşağı fırlatılır. `width` ve `height` öznitelikleri verildiğinde modern tarayıcılar görselin en-boy oranını (aspect ratio) otomatik olarak hesaplar ve görsel henüz inmeden önce boş bir yer tutucu alan ayırarak yerleşim kaymasını (CLS) tamamen engeller.
