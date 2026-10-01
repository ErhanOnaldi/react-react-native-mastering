import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'React + TypeScript',
  phase: 1,
  summary:
    'Tipli props ve event’lerden başlayıp state, listeler, koşullu görünüm ve bileşen composition kullanıyoruz. Sinema için statik filmlerde arama, favorileme ve kullanıcı odaklı test kuruyoruz.',
  pain: `Sinema’da bir filmi favoriye ekledin, ama karttaki işaret değişmedi. Film nesneleri dizide duruyor; asıl fark, güncellemenin React'e yeni bir dizi verip vermediğinde.`,
  outcomes: [
    'Props ve children için bileşen tipleri tanımlayabilirsin',
    'Düğme, input ve form event’lerini uygun handler’larla işleyebilirsin',
    'State snapshot’ını okuyup önceki değere bağlı updater yazabilirsin',
    'Dizi ve nesne state’ini immutable biçimde güncelleyebilirsin',
    'Film listelerini key ile gösterip duruma göre JSX seçebilirsin',
    'Controlled input ve ortak state ile arama ve favori akışı kurabilirsin',
    'Composition ile bileşenleri birleştirip kullanıcı davranışını test edebilirsin',
  ],
})
