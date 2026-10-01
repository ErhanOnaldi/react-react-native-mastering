import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Vitest',
  phase: 3,
  summary:
    'Sinema refactor’unda sessiz kalan hataları davranış testleriyle görünür kılacağız; bu kez testleri sen yazacaksın.',
  pain: `Arama sayfasında ikinci sayfaya geçildiğinde yine ilk sayfa geldi. Tip kontrolü ve build yeşildi; hata iki gün sonra fark edildi. Her değişiklikten sonra bütün sayfaları elle gezmek güvenilir değil. Bu modülde sayfalama, API client ve debounce için çalışan testler yazıp aynı hatanın bir daha sessiz kalmasını önleyeceksin.`,
  outcomes: [
    'Vitest ile okunur davranış testleri yazabilirsin',
    'AAA düzenini ve doğru matcher’ı seçebilirsin',
    'it.each ile bir kuralın farklı sınırlarını sınayabilirsin',
    'fetch sınırını vi.fn ile kontrol edip hata akışını sınayabilirsin',
    'Fake timer ile debounce davranışını beklemeden test edebilirsin',
    'Sinema projesine test script’i ve kalıcı test dosyaları ekleyebilirsin',
  ],
})
