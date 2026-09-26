import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi testte storageState?',
  difficulty: 'orta',
  concepts: ['test.playwright-auth', 'test.e2e', 'router.protected-routes'],
  question:
    'Router yanlışlıkla `/login` sayfasını korumalı gruba taşıdı. Hangi yaklaşım bu hatayı yakalar?',
  options: [
    {
      text: 'Boş oturumla `/watchlists` açıp giriş formunu doldurarak listeyi kaydeden akış',
      correct: true,
      explanation: 'Evet. Korumalı yönlendirme ve giriş sayfası gerçekten yürünür.',
    },
    {
      text: 'Tüm testlerde hazır storageState kullanıp doğrudan `/watchlists` açmak',
      correct: false,
      explanation: 'Hazır oturum `/login` yolunu atlar; bu router hatası gizli kalabilir.',
    },
    {
      text: 'Yalnızca authSlice reducer testini çalıştırmak',
      correct: false,
      explanation: 'Reducer doğru olsa bile route ağacı yanlış bağlanmış olabilir.',
    },
  ],
  explanation: '',
})
