import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TMDB URL’sini güvenle kur',
  difficulty: 'orta',
  concepts: ['fetch.query-params', 'ts.object-types', 'ts.record', 'router.search-params', 'js.destructuring'],
  files: ['buildTmdbUrl.ts'],
  hints: [
    'Taban adres ile istek yolunu birleştirirken çift eğik çizgi (//) oluşmasını engellemelisin; sorgu parametrelerini ise tek tek anahtar-değer olarak eklemelisin.',
    'Standart `URL` ve `URLSearchParams` sınıflarını kullanabilirsin. Varsayılan dili belirledikten sonra parametre listesini dolaşabilirsin.',
    'Önce varsayılan dili ekle. Sonra verilen parametreleri dolaş; açıkça gelen değer varsayılanı değiştirebilmeli ve tanımsız değer URL’ye girmemeli.',
    'Bir parametre için tek değer kalması gerektiğini düşün. URL nesnesinin arama parametreleri API’sinde aynı anahtarı güncelleyen ve yeni anahtar ekleyen işlemler arasındaki farka bak.',
  ],
})
