import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema’ya typecheck script’i ekle',
  difficulty: 'kolay',
  concepts: ['tooling.scripts', 'tooling.package-json', 'tooling.type-check'],
  project: 'sinema',
  focusFiles: ['package.json'],
  hints: [
    'VS Code üzerinden `projects/sinema/package.json` dosyasını aç ve `scripts` bloğunu incele.',
    'Yeni bir script satırı tanımla: anahtar `"typecheck"`, değer ise TypeScript derleyicisini tetikleyen komut olmalı.',
    'İskelet: `"typecheck": "tsc -b"`. Kaydettikten sonra terminalde `pnpm typecheck` çalıştırarak doğrula.',
  ],
})
