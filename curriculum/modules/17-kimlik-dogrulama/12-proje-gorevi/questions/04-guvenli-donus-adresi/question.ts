import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Güvenli dönüş adresi',
  difficulty: 'orta',
  project: 'sinema',
  concepts: ['security.open-redirect'],
  focusFiles: ['src/features/auth/safe-redirect.ts', 'src/pages/LoginPage.tsx'],
  hints: [
    'Dönüş adresinin harici bir etki alanına yönlenmesini engellemek için yolun başlangıç karakterlerini ve biçimini denetle.',
    'Uygulama içi yollar tek `/` ile başlar; `//` ile başlayanlar tarayıcıda protokolü devralan harici adrese (ör. `//evil.example`) dönüşebilir. Ters eğik çizgi ve kontrol karakterlerini de ayıkla.',
    'Değer bir dizgi değilse, `/` ile başlamıyorsa veya `//` ya da ters eğik çizgi içeriyorsa varsayılan `fallback` adresini döndür.',
    '`LoginPage` içinde giriş başarılı olduktan sonra hem `location.state.from` hem de `?redirect=` arama parametresini bu fonksiyondan geçirerek hedef yolu belirle.',
  ],
})
