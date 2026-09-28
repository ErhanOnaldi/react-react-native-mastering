import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film kartı rozeti',
  difficulty: 'kolay',
  concepts: ['ts.primitives', 'js.string-formatting'],
  files: ['movieBadge.ts'],
  hints: [
    'Kitle metnini boolean değere göre belirleyip puanı tek ondalık basamakla metne çevirmeyi düşün.',
    '`adult ? "18+" : "Genel"` ifadesini ve sayıları tek basamağa sabitleyen `.toFixed(1)` metodunu kullanabilirsin.',
    'İskelet: `const tag = adult ? "18+" : "Genel"; return `${tag} · ${vote.toFixed(1)}`;`',
    'Tam sayılarda `.toFixed(1)` sondaki `.0` ekini korur; `Math.round` kullanmak tam sayılarda ondalık biçimini kaybettirir.',
  ],
})
