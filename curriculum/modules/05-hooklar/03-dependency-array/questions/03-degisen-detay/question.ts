import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'id değişince filmi yenile',
  difficulty: 'orta',
  concepts: ['react.useEffect.deps', 'react.props', 'fetch.headers-auth'],
  files: ['MovieDetails.tsx'],
  hints: [
    'İlk film geliyor; sorun aynı bileşen açıkken prop değiştiğinde ortaya çıkıyor.',
    'Effect bu bileşende henüz kurulmamış. Önce veri isteğini effect içine taşı, sonra hangi girdinin belirlenen filmi değiştirdiğini düşün.',
    'Bu effect `id` değerini okuduğu için dependency dizisini `[id]` yap; yeni istek başlarken eski başlığı bekleme metniyle değiştir.',
  ],
})
