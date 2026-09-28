import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Gereksinimi test başlığından oku',
  difficulty: 'kolay',
  concepts: ['test.vitest-basics', 'test.what-to-test', 'test.reading-results'],
  question: `Bir test dosyasında şu blok yer alıyor:

\`\`\`ts
describe('formatBadge', () => {
  it('yeni çıkan film için "YENİ" etiketi döner', () => { ... })
  it('puanı 8.0 ve üstü filmde "ÖNE ÇIKAN" etiketi döner', () => { ... })
  it('her iki şart da sağlanmazsa null döner', () => { ... })
})
\`\`\`

Geliştirici, hiçbir şartı karşılamayan sıradan bir film için fonksiyonun ne döndürmesi gerektiğini nereden anlar?`,
  options: [
    {
      text: "`it('her iki şart da sağlanmazsa null döner')` test başlığından",
      correct: true,
      explanation:
        'Doğru. İyi yazılmış test adları doğrudan bir gereksinim cümlesidir. Fonksiyonun bu sınır durumunda `null` dönmesi gerektiği test başlığında açıkça tanımlanmıştır.',
    },
    {
      text: 'Bileşenin CSS class listesinden',
      explanation:
        'Hayır. CSS stilleri görünümü belirler; fonksiyonun mantıksal dönüş kurallarını testler tarif eder.',
    },
    {
      text: 'Boş string (`""`) döneceğini tahmin ederek',
      explanation:
        'Hayır. Tahmin etmek yerine test şartnamesine bakılır; test açıkça `null` döneceğini söylemektedir.',
    },
    {
      text: '`package.json` içindeki bağımlılık listesinden',
      explanation:
        'Hayır. `package.json` paketleri yönetir; fonksiyonların iş kurallarını barındırmaz.',
    },
  ],
})
