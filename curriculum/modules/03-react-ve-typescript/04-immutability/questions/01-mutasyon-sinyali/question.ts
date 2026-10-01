import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Mutasyon sinyali',
  difficulty: 'kolay',
  concepts: ['react.immutability'],
  question: `State'teki film dizisini \`map\` ile yenileyip içerideki filmi doğrudan değiştirirsen hangi sorun sürer?`,
  options: [
    {
      text: 'Eski ve yeni dizi aynı film nesnesini paylaşabilir; önceki state de değişmiş olur.',
      correct: true,
      explanation:
        'Yeni dış dizi, iç nesneleri otomatik kopyalamaz. Değişen film için yeni nesne üret.',
    },
    {
      text: '`map` her öğeyi mutlaka deep copy yaptığı için içerik kaybolur.',
      explanation:
        '`map` yalnız yeni dizi kurar; döndürdüğün öğelerin nesnelerini kendin kopyalarsın.',
    },
    {
      text: 'React state içinde nesne tutmaya izin vermez.',
      explanation: 'Nesne state olabilir; güncellerken onu yerinde değiştirmemek gerekir.',
    },
    {
      text: 'Yeni dizi üretildiğinde React artık state güncellemesini izleyemez.',
      explanation:
        'Yeni referans güncellemeyi görünür kılar; önemli olan değişen nesne yolunu da kopyalamaktır.',
    },
  ],
})
