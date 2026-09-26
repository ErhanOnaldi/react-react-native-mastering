import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'İleri pattern’ler ve erişilebilirlik',
  phase: 5,
  summary:
    'Sinema modalını ve film sekmelerini klavye, focus ve ekran okuyucu için çalışır hale getirirken yeniden kullanılabilir component API’leri kuruyoruz.',
  pain: `Sinema'daki kendi modalın fareyle açılıyor. Ama Escape'e basınca kapanmıyor; açıldığında focus arka sayfada kalıyor ve ekran okuyucu başlığını okuyamıyor. Filmin Özet/Oyuncular/Videolar sekmelerinde de hangi sekmenin seçili olduğu belli değil. Bu modülde bu sorunları önce canlı önizleme ve davranış testleriyle görecek, sonra düzelteceksin.`,
  outcomes: [
    'Anlamsal roller ve erişilebilir adlarla arayüzü test edebilirsin',
    'Escape, Tab, yön tuşları ve focus geri dönüşünü uygulayabilirsin',
    'Portal ile dialog içeriğini DOM’da doğru yere taşıyabilirsin',
    'Context ile Tabs ve Modal compound API’leri kurabilirsin',
    'useDisclosure ile görünümden bağımsız açılma mantığı yazabilirsin',
    'React 19 ref prop’uyla asChild/Slot davranışını birleştirebilirsin',
    'Eski render props ve HOC kodlarını okuyup modern karşılıklarını seçebilirsin',
  ],
})
