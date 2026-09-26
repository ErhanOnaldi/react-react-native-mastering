import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Süresi dolan oturum',
  difficulty: 'zor',
  concepts: ['auth.refresh', 'fetch.error-handling', 'test.fake-timers'],
  files: ['SessionPanel.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Profil isteği reddedilince ekranın "Yükleniyor"da takılı kalmaması için bir kurtarma yolu gerekiyor; DummyJSON’un buna özel bir uç noktası var.',
    'Reddedilen profil isteğinden sonra sakladığın ikinci jetonla yeni bir jeton çifti al, sonra profil isteğini o yeni jetonla bir kez daha dene.',
    'Yeni bir girişe başlarken önceki hatayı ve durumu sıfırla; `/auth/refresh`’ten dönen jetonlarla profili tekrar iste, hâlâ başarısızsa hata göster.',
  ],
})
