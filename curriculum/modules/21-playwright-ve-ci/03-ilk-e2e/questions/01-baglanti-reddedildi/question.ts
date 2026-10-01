import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'CI’da bağlantı reddedildi',
  difficulty: 'kolay',
  concepts: ['test.playwright-config', 'test.e2e', 'tooling.scripts'],
  question: `Yerelde, ikinci terminalde \`pnpm dev\` açıkken E2E testlerin geçiyor. CI’da ise ilk test şöyle kalıyor:

\`\`\`
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5174/
\`\`\`

Config’te \`use.baseURL: 'http://localhost:5174'\` var. Eksik olan ne?`,
  options: [
    {
      text: '`webServer`: testlerden önce `pnpm dev`’i başlatacak `command` ve hazır olmasını bekleyeceği `url`',
      correct: true,
      explanation:
        'Doğru. “Connection refused” = o portta dinleyen kimse yok. Yerelde sunucuyu sen elle açıyordun; CI’da açan yok. `webServer` bu işi Playwright’a verir: başlatır, adres cevap verene kadar bekler, testler bitince kapatır.',
    },
    {
      text: '`use.baseURL` yanlış; adres `http://localhost:5174/` diye sonunda `/` ile yazılmalı',
      explanation:
        'Adres doğru çözülmüş; hata mesajında tam URL görünüyor. `baseURL` eksik olsaydı hata “Cannot navigate to invalid URL” olurdu. Sorun adres değil, adreste bekleyen sunucunun olmaması.',
    },
    {
      text: 'Tarayıcı kurulu değil: CI’da `playwright install chromium` çalıştırılmalı',
      explanation:
        'Tarayıcı eksik olsaydı test hiç başlamaz, “Executable doesn’t exist at …” hatası alırdın. Buradaki hatayı veren **tarayıcının kendisi**: açılmış ve bağlanmaya çalışmış. (Kurulum adımı CI’da yine de gerekli; 8. derste.)',
    },
    {
      text: 'Test süresi kısa; `timeout` 60 saniyeye çıkarılmalı',
      explanation:
        'Bağlantı reddi anında gelir; beklemek bir şey değiştirmez, çünkü hiçbir süreç o portu dinlemiyor. Süre, yalnızca “sunucu var ama yavaş” durumunda işe yarar.',
    },
    {
      text: '`reuseExistingServer: true` eklenmeli',
      explanation:
        '`reuseExistingServer` yalnızca `webServer` tanımlıyken anlamlıdır ve “zaten çalışan bir sunucu varsa onu kullan” der. CI’da çalışan bir sunucu yok; kullanılacak bir şey de yok.',
    },
  ],
})
