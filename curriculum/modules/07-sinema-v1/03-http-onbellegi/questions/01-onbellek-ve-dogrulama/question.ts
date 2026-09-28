import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'no-cache ile no-store arasındaki fark nedir?',
  difficulty: 'kolay',
  concepts: ['web.http-cache'],
  question:
    'Bir API cevabında `Cache-Control: no-cache` başlığı gördüğünde tarayıcının izleyeceği kesin kural nedir?',
  options: [
    {
      text: 'Cevabı önbelleğe kaydedebilir; ancak her kullanımdan önce sunucuya doğrulama (ETag / If-None-Match) isteği atmak zorundadır.',
      correct: true,
      explanation:
        'Doğru. `no-cache`, "önbelleğe alma" demek değildir; "sunucuya doğrulatmadan kullanma" demektir. Değişiklik yoksa sunucu 304 döner ve yerel veri kullanılır.',
    },
    {
      text: 'Cevabı belleğe ya da diske kesinlikle kaydetmez, her seferinde tüm veriyi baştan indirir.',
      explanation:
        'Bu davranış `no-store` yönergesine aittir. `no-cache` veriyi saklar fakat sunucuya doğrulatır.',
    },
    {
      text: 'Cevabı yalnızca tarayıcı kapatılana kadar bellekte tutar.',
      explanation:
        'Oturum sonuna kadar saklama tarayıcı bellek yönetimiyle ilgilidir; `no-cache` spesifikasyonu doğrulamayı şart koşar.',
    },
    {
      text: 'Cevabı 1 yıl boyunca sunucuya hiç sormadan kullanır.',
      explanation:
        'Bu davranış `max-age` ve `immutable` yönergeleriyle elde edilir; `no-cache` tam tersidir.',
    },
  ],
})
