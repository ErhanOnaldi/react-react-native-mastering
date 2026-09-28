import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi araç: Döngü içinde hedefi yakala',
  difficulty: 'kolay',
  concepts: ['tooling.browser-devtools', 'tooling.debugging'],
  question: `500 filmlik bir liste üzerinde dönen bir hesaplama döngüsünde yalnızca \`id === 550\` olan filmde beklenmedik bir değer üretiliyor.

Her filmde tek tek duraklamadan, yalnızca o film işlenirken kodun durmasını sağlamak için Sources panelinde hangi aracı kullanırsın?`,
  options: [
    {
      text: 'Koşullu Breakpoint (Conditional Breakpoint): `movie.id === 550`',
      correct: true,
      explanation:
        'Doğru. Satır numarasına sağ tıklayıp bir koşul yazdığında (Conditional Breakpoint), tarayıcı döngüyü hızlıca çalıştırır ve yalnızca bu ifade `true` olduğunda duraklar.',
    },
    {
      text: 'Standart satır breakpoint’i koyup 550 kez F10 (Step over) tuşuna basmak',
      explanation:
        'Bu yöntem son derece yavaştır ve geliştirme sürecini tıkar; koşullu breakpoint doğrudan hedefe ulaşır.',
    },
    {
      text: 'Console panelinde `console.clear()` çalıştırmak',
      explanation:
        'Konsolu temizlemek kodun çalışma akışını etkilemez veya belirli bir satırda duraklatmaz.',
    },
    {
      text: 'Network sekmesinde "Preserve log" seçeneğini işaretlemek',
      explanation:
        'Preserve log sayfa yenilendiğinde ağ istek geçmişini korumaya yarar; döngü içi duraklama sağlamaz.',
    },
  ],
})
