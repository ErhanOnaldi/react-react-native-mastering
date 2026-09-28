import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi panel: Ağ hatası',
  difficulty: 'kolay',
  concepts: ['tooling.browser-devtools'],
  question: `Uygulamada filmler listelenmiyor; ekranda genel bir "Veriler alınamadı" uyarısı görünüyor. Sunucuya giden HTTP isteğinin durum kodunu (401, 404, 500 vb.) ve sunucudan dönen ham cevabı incelemek için Chrome DevTools'un hangi paneline bakarsın?`,
  options: [
    {
      text: 'Network paneli',
      correct: true,
      explanation:
        'Doğru. Network paneli tarayıcı ile sunucu arasındaki tüm HTTP isteklerini, durum kodlarını, istek başlıklarını ve sunucu cevaplarını ayrıntılı listeler.',
    },
    {
      text: 'Elements paneli',
      explanation:
        'Elements paneli sayfanın o anki HTML DOM ağacını ve CSS stillerini gösterir; ağ isteklerini içermez.',
    },
    {
      text: 'Application paneli',
      explanation:
        'Application paneli localStorage, çerezler ve önbellek depolarını yönetir; anlık giden ağ çağrılarını göstermez.',
    },
    {
      text: 'Performance paneli',
      explanation:
        'Performance paneli sayfanın boyama sürelerini, FPS değerini ve CPU profilini ölçer.',
    },
  ],
})
