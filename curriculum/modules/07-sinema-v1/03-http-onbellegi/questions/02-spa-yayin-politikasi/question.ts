import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: '304 cevabında gövde nereden gelir?',
  difficulty: 'orta',
  concepts: ['web.http-cache'],
  question:
    'Tarayıcı bir film türü cevabını `ETag: "genres-v1"` etiketiyle sakladı. `Cache-Control: no-cache` nedeniyle sonraki kullanımda sunucuya sordu ve sunucu `304 Not Modified` döndürdü. Tarayıcı uygulamaya ne sunar?',
  options: [
    {
      text: 'Daha önce sakladığı JSON gövdesini; 304 yalnızca içeriğin değişmediğini bildirir.',
      correct: true,
      explanation:
        'Doğru. 304 cevabının kendisi gövdesizdir. Tarayıcı daha önce sakladığı gövdeyi kullanır; değişmemiş veriyi yeniden indirmez.',
    },
    {
      text: 'Gövdesiz bir cevap; uygulama tür listesini boş dizi olarak görür.',
      explanation:
        '304, başarılı doğrulamadır; boş bir yeni veri cevabı değildir. Eski gövde hâlâ kullanılabilir.',
    },
    {
      text: 'Tarayıcı ETag’i saklasa da veriyi baştan almak için sunucudan yeni bir JSON gövdesi ister.',
      explanation:
        'Sunucu 304 ile içeriğin değişmediğini zaten doğrulamıştır; tarayıcının yeni bir gövde istemesi gerekmez.',
    },
    {
      text: 'Tarayıcı eski gövdeyi siler ve 304 durum kodunu JSON olarak ayrıştırır.',
      explanation:
        '304 yanıtı gövde taşımaz; durum kodu JSON değildir ve saklanan eski gövdeyi silmek için neden oluşturmaz.',
    },
  ],
})
