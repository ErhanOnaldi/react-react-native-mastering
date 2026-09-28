import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi panel: Yerel veri ve tercihler',
  difficulty: 'kolay',
  concepts: ['tooling.browser-devtools'],
  question: `Kullanıcı film izleme listesine bir film eklediğinde bu bilginin tarayıcı kapatılsa bile kaybolmaması için \`localStorage\` içine yazıldığı iddia ediliyor.

Bu verinin tarayıcının yerel deposuna gerçekten yazılıp yazılmadığını hangi DevTools panelinden kontrol edersin?`,
  options: [
    {
      text: 'Application paneli (Storage > Local Storage)',
      correct: true,
      explanation:
        'Doğru. Application paneli `localStorage`, `sessionStorage`, çerezler ve IndexedDB gibi tarayıcıda saklanan kalıcı verileri inceleme ve düzenleme yeridir.',
    },
    {
      text: 'Sources paneli (Watch sekmesi)',
      explanation:
        'Watch sekmesi sadece kod breakpoint ile durdurulduğunda anlık ifadeleri hesaplar; yerel depolama tablolarını göstermez.',
    },
    {
      text: 'Console paneli (Errors sekmesi)',
      explanation:
        'Konsol sadece log ve hata mesajlarını listeler; depolama anahtarlarını ağaç yapısında göstermez.',
    },
    {
      text: 'Elements paneli (Accessibility sekmesi)',
      explanation:
        'Elements paneli DOM ve erişilebilirlik ağacını gösterir; istemci tarafı depolamayla ilgisi yoktur.',
    },
  ],
})
