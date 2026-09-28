import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yayında engellenen API isteği',
  difficulty: 'orta',
  concepts: ['security.csp', 'deploy.spa-fallback'],
  question:
    "Yayındaki CSP `default-src 'self'; connect-src 'self'` diyor. Uygulama `https://api.themoviedb.org` adresine istek atınca tarayıcı engelliyor. Hangi değişiklik gerekir?",
  options: [
    {
      text: 'Host’un CSP başlığındaki `connect-src` listesine bu API origin’ini eklemek.',
      correct: true,
      explanation:
        '`fetch` için `connect-src` geçerlidir. CSP başlığı gerçek HTML yanıtında host tarafından gönderilmelidir.',
    },
    {
      text: 'Yalnızca `img-src` içine API origin’ini eklemek.',
      correct: false,
      explanation:
        '`img-src` görselleri denetler; JavaScript ağ isteklerini `connect-src` denetler.',
    },
    {
      text: 'React bileşeninde URL’yi `http:` yapmak.',
      correct: false,
      explanation:
        'Protokolü düşürmek CSP izni vermez; güvenli HTTPS isteği için origin izin listesinde olmalıdır.',
    },
  ],
})
