import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TMDB URL’sini güvenle kur',
  difficulty: 'orta',
  concepts: ['fetch.query-params', 'ts.object-types', 'router.search-params', 'js.destructuring'],
  files: ['buildTmdbUrl.ts'],
  hints: [
    'Taban adres ile istek yolunu birleştirirken çift eğik çizgi (//) oluşmasını engellemelisin; sorgu parametrelerini ise tek tek anahtar-değer olarak eklemelisin.',
    'Standart `URL` ve `URLSearchParams` sınıflarını kullanabilirsin. Varsayılan dili belirledikten sonra parametre listesini dolaşabilirsin.',
    'Yolu `path.startsWith("/") ? path.slice(1) : path` ile temizleyip `new URL(cleanPath, "https://api.themoviedb.org/3/")` oluştur. `params` girdisindeki `[key, value]` çiftlerinden `value !== undefined` olanları `searchParams.set(key, String(value))` ile ekle.',
    '`searchParams.append` yerine `searchParams.set` kullanmazsan açıkça verilen `language` parametresi varsayılanın üstüne yazılmak yerine ikinci bir dil anahtarı olarak eklenir.',
  ],
})
