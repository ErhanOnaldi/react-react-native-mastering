## Neden böyle?
Kart, rengin **değerini** değil **rolünü** söylüyor: `bg-card text-card-foreground`. Açık ve koyu değerler CSS değişkenlerinde (`:root` / `.dark`) yaşıyor; tema değişince bileşene dokunmazsın. Başlık, yıl, puan ve açıklama ayrı metinler olarak kalır.

`cn` içindeki `tailwind-merge`, `rounded-lg` ile dışarıdan gelen `rounded-none` çakışınca sonuncuyu bırakır. Sadece `clsx` kullansaydın ikisi de class listesinde kalır, hangisinin kazanacağını CSS dosyasındaki sıra belirlerdi (kullanıcının niyeti değil).

### Alternatif ve sınır
Sabit `bg-white text-black dark:bg-zinc-900 dark:text-white` da çalışır; ama aynı "kart" kararı onlarca dosyaya dağılır ve marka rengi değişince hepsini tek tek açarsın.

### Sıradaki adım
Karttaki tema sınıfı sabit kalırken sonraki görevde sayfanın `.dark` sınıfını açıp kapatarak token'ların yeni değerlerini kullanacaksın.
