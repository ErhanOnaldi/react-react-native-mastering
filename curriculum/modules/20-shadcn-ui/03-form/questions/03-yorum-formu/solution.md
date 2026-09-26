## Neden böyle?
Beş küçük parça, her biri tek bir iş yapıyor:

- `FormField` alanın **adını**, `FormItem` alanın **kimliğini** Context'e koyar. İkisi ayrı, çünkü ad RHF'ten (hangi veri?), kimlik DOM'dan (hangi öğe?) gelir.
- `useFormField` bu ikisini RHF'in alan durumuyla birleştirir. `useFormState({ name })` o alanın durumuna **abone olur**: hata gelince/gidince parçalar yeniden render olur.
- `FormLabel` → `htmlFor`, `FormMessage` → `id`: kimlikler tek bir yerden türediği için asla çakışmaz ve elle yazılmaz.
- `FormControl` bir Slot: kendi DOM öğesi yok, ARIA bağlarını tek çocuğuna yapıştırır. Çocuk textarea da olabilir, Radix RadioGroup da.

`aria-describedby`'yi yalnızca hata varken veriyoruz; var olmayan bir id'ye işaret eden `aria-describedby` hem gereksizdir hem bazı araçlarda uyarı üretir.

### shadcn'in dosyasıyla fark
Gerçek `form.tsx` bir de `FormDescription` içerir ve `aria-describedby`'ye açıklama id'sini de ekler. Ayrıca sınıf adları (`data-[error=true]:text-destructive` gibi) ve `Label` bileşeni vardır. Mekanizma birebir aynı.

### Sık hata
`FormControl`'ün içine bir sarmalayıcı `<div>` koymak: bütün bağlar div'e gider (ders sonundaki quiz).

### Sıradaki adım
Proje görevinde Sinema'nın gerçek yorum formunu CLI'ın kopyaladığı `form.tsx` ile yeniden yazacaksın; puan seçimi de bir Radix `RadioGroup` olacak.
