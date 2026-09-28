Uygulamanın en üst kısmında sayfa başlığını ve alt slogan metnini hiyerarşik olarak sunan bir başlık bileşeni oluşturmak istiyoruz.

## Gereksinimler

- Bileşenin en dış kapsayıcısı bir `<header>` etiketi olmalıdır.
- `title` prop değeri bir `<h1>` başlık elementi içinde render edilmelidir.
- `tagline` prop değeri bir `<p>` paragraf elementi içinde render edilmelidir.
- Verilen farklı props değerleri arayüzdeki ilgili alanlara dinamik olarak yansıtılmalıdır.

## Örnek

Verilen props:
```json
{
  "title": "Sinema",
  "tagline": "Bugün ne izlesek?"
}
```

Beklenen DOM yapısı:
```html
<header>
  <h1>Sinema</h1>
  <p>Bugün ne izlesek?</p>
</header>
```

## Sözleşme

- Dosya ve export: `AppHeader.tsx` → `export function AppHeader(props: AppHeaderProps): JSX.Element`
- Arayüz sözleşmesi: Testler en dış kapsayıcıda `<header>` (banner rolü) ve başlıkta `<h1>` (1. seviye heading) arar.
