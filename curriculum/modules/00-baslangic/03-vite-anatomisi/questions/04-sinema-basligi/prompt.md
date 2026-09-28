Sinema projesinin ana sayfa arayüzüne standart sayfa başlığı ve alt slogan alanını eklemek istiyoruz.

## Gereksinimler

- `projects/sinema/src/App.tsx` dosyası içerisindeki `<main>` alanında bir `<header>` elementi oluşturulmalıdır.
- Başlık elementi bir `<h1>` etiketi olmalı ve `"Sinema"` metnini içermelidir.
- Alt slogan elementi bir `<p>` etiketi olmalı ve `"Bugün ne izlesek?"` metnini içermelidir.
- Başlık ve slogan elementleri `<header>` etiketinin doğrudan çocukları olmalıdır.

## Örnek

Beklenen DOM çıktısı:
```html
<main>
  <header>
    <h1>Sinema</h1>
    <p>Bugün ne izlesek?</p>
  </header>
  ...
</main>
```

## Sözleşme

- Proje ve dosya: `projects/sinema/src/App.tsx`
- Arayüz sözleşmesi: `<header>` kapsayıcısı içinde `<h1>Sinema</h1>` ve `<p>Bugün ne izlesek?</p>`.
