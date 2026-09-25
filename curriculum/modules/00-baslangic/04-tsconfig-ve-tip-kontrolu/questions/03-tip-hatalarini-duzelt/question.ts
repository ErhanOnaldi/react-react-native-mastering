import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Bug’ı bul: testler yeşil ama…',
  difficulty: 'orta',
  concepts: ['tooling.type-check', 'ts.import-type', 'ts.optional-nullable'],
  files: ['movie-utils.ts'],
  hints: [
    'Önce bir kez Çalıştır: testlerin hepsi geçiyor ama sonuç panelinde "Tip hataları" var. Her hatanın satır numarasına bak.',
    '`Movie` sadece bir tip → `import type`. `score` parametresinin tipi yazılmamış → `number`.',
    '`find` bir şey bulamayabilir: sonucu `Movie | undefined`. Görev metnindeki kurala göre bulunamazsa ne döneceğini yaz (`?.` ve `??` işine yarar).',
  ],
})
