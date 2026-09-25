import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'README yaz ve commit’le',
  difficulty: 'kolay',
  concepts: ['tooling.git', 'tooling.conventional-commits', 'tooling.scripts', 'tooling.env'],
  project: 'sinema',
  focusFiles: ['README.md'],
  reviewFiles: ['README.md', 'package.json'],
  rubric: [
    'Projenin ne olduğu bir-iki cümleyle anlatılmış mı?',
    'Kurulum adımları (pnpm install, .env ayarı) sırayla ve eksiksiz mi?',
    'package.json’daki script’ler (dev, build, preview, typecheck) ne işe yaradıklarıyla listelenmiş mi?',
    'Gerekli ortam değişkenleri (VITE_TMDB_TOKEN, VITE_APP_TITLE) ve token’ın nereden alınacağı açıklanmış mı? Gizli değer içeriyor mu (içermemeli)?',
    'Markdown başlıkları ve kod blokları doğru ve okunur kullanılmış mı?',
  ],
  hints: [
    'Başlıklar önerisi: `# Sinema`, `## Kurulum`, `## Komutlar`, `## Ortam değişkenleri`.',
    'Komutları ```bash kod bloğunda yaz.',
  ],
})
