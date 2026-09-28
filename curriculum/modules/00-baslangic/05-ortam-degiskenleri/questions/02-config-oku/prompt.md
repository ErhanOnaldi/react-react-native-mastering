Yaz, uygulama ayarlarını başlangıçta tek noktadan okuyan bir yapılandırma işlevi. Eksik zorunlu erişim anahtarı anlaşılır hatayla durmalı; isteğe bağlı başlık ve sayfa boyutu güvenli varsayılanlara sahip olmalı.

## Gereksinimler
- Erişim anahtarının başındaki ve sonundaki boşlukları temizle.
- Anahtar eksik ya da yalnızca boşluksa hata fırlat; hata mesajı VITE_TMDB_TOKEN içersin.
- Başlığın boşluklarını temizle; eksik veya boş başlıkta Sinema kullan.
- Sayfa boyutunu pozitif tam sayıya dönüştür; geçersiz, sıfır veya negatif değerde 20 kullan.

## Örnek
{ VITE_TMDB_TOKEN: " abc ", VITE_APP_TITLE: " Film Evi ", VITE_PAGE_SIZE: "12" } girdisi { tmdbToken: "abc", appTitle: "Film Evi", pageSize: 12 } üretir.

## Sözleşme
- Dosya ve export: config.ts → readConfig(env: Env): AppConfig
- Env, string ya da eksik değerlerden oluşan env nesnesidir; AppConfig alanları tmdbToken: string, appTitle: string, pageSize: number biçimindedir.
