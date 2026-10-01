import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'İlk refactor adımı',
  difficulty: 'kolay',
  concepts: ['arch.refactoring', 'test.what-to-test'],
  question: `Çalışan arama ekranını iki component'e ayıracaksın. Şu an \`Dövüş\` araması iki sonuç, \`Matrix\` araması bir sonuç gösteriyor; boş aramada "Sonuç yok" yazıyor. Başlangıç davranışını en iyi hangi not kaydeder?`,
  options: [
    {
      text: 'Dövüş, Matrix ve boş arama için görünen sonuçları ve metinleri kaydet',
      correct: true,
      explanation:
        'Bunlar normal, farklı sayıda sonuç ve boş sınırını kapsar; refactor sırasında karşılaştırma sağlar.',
    },
    {
      text: "İlk olarak yeni component'in props adlarını tasarlayıp mevcut ekranı sil",
      explanation: 'Hata çıkınca kaynağını izlemek zorlaşır.',
    },
    {
      text: 'Sadece iki sonuçlu aramayı kaydet; boş sonuç zaten görünür bir durum değil',
      explanation:
        'Boş arama davranışının refactor sırasında değişmediğini bu kayıtla karşılaştıramazsın.',
    },
    {
      text: 'Yeni tasarıma daha uygun olsun diye "Sonuç bulunamadı" metnini de değiştir',
      explanation:
        'Metin değişimi refactor davranışını da değiştirir; hata kaynağını ayırmak zorlaşır.',
    },
  ],
})
