import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Clickjacking ve frame-ancestors',
  difficulty: 'orta',
  concepts: ['security.csp'],
  question:
    'Saldırganın uygulamanı görünmez bir `<iframe>` içine gömüp kullanıcıyı kandırarak butonlara tıklatmasını (clickjacking) engellemek için modern CSP başlığında hangi yönerge kullanılır?',
  options: [
    {
      text: "`frame-ancestors 'none'`",
      correct: true,
      explanation:
        "`frame-ancestors 'none'` sayfanın hiçbir sitede (kendi dahil) `<iframe>`, `<frame>`, `<object>` veya `<embed>` içine gömülemeyeceğini bildirir; modern CSP standardında eski `X-Frame-Options: DENY` başlığının yerini alır.",
    },
    {
      text: "`frame-src 'none'`",
      correct: false,
      explanation:
        '`frame-src`, senin sayfanın içine gömebileceği iframe kaynaklarını denetler; senin sayfanın başkası tarafından gömülmesini denetleyen ise `frame-ancestors` yönergesidir.',
    },
    {
      text: "`script-src 'unsafe-inline'`",
      correct: false,
      explanation:
        'Bu ayar satır içi betiklere izin vererek XSS riskini artırır; clickjacking korumasıyla ilişkisi yoktur.',
    },
  ],
})
