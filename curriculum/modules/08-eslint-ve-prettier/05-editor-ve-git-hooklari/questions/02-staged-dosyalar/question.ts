import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Staged dosyalar',
  difficulty: 'kolay',
  concepts: ['tooling.git-hooks', 'tooling.git'],
  question:
    'Bir commit’te yalnızca hazırlanan TSX dosyalarını lint etmek istiyorsun. `husky` ve `lint-staged` rollerini nasıl ayırırsın?',
  options: [
    {
      text: 'husky hook’u başlatır; lint-staged staged dosyalara komut uygular.',
      correct: true,
      explanation: 'Hook tetikleyici, lint-staged dosya seçimidir.',
    },
    {
      text: 'husky tüm React bileşenlerini formatlar; lint-staged API isteği yapar.',
      explanation: 'Bu paketler uygulama davranışını veya TMDB isteğini yönetmez.',
    },
    {
      text: 'lint-staged hook’u kurar; husky yalnızca staged dosyaları seçer.',
      explanation: 'Roller ters çevrildi: husky Git hook’unu bağlar.',
    },
    {
      text: 'İkisi de CI’nın yerine geçer.',
      explanation: 'Yerel hook atlanabilir; CI ortak son denetimdir.',
    },
  ],
  explanation: '',
})
