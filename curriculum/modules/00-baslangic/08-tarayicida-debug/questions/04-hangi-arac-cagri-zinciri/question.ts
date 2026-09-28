import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi araç: Çağrı zincirini izle',
  difficulty: 'orta',
  concepts: ['tooling.browser-devtools', 'tooling.debugging'],
  question: `Bir yardımcı fonksiyon çalışıyor ve beklenmedik şekilde bir modal pencereyi kapatıyor. Fonksiyonun ilk satırına bir breakpoint koydun ve kod durakladı.

Bu fonksiyonun tam olarak **hangi bileşen veya fonksiyon tarafından** çağrıldığını (çağrı geçmişini) görmek için Sources panelinde nereye bakarsın?`,
  options: [
    {
      text: 'Call Stack (Çağrı Yığını)',
      correct: true,
      explanation:
        'Doğru. Call Stack, o an yürütülen fonksiyonun hangi üst fonksiyonlar ve olay yöneticileri tarafından tetiklendiğini yukarıdan aşağıya doğru bir zincir halinde gösterir.',
    },
    {
      text: 'Breakpoints sekmesi',
      explanation:
        'Breakpoints sekmesi yalnızca projedeki aktif kesme noktalarını listeler; fonksiyonların çağrılma geçmişini göstermez.',
    },
    {
      text: 'Console paneli ($0 değişkeni)',
      explanation:
        '$0 değişkeni Elements panelinde seçilen DOM düğümünü gösterir; JavaScript çağrı zincirini vermez.',
    },
    {
      text: 'Scope sekmesi (Global değişkenler)',
      explanation:
        'Scope o an erişilebilir değişkenleri listeler; fonksiyonu kimin çağırdığı bilgisini Call Stack taşır.',
    },
  ],
})
