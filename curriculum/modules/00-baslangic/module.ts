import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Başlangıç ve araç zinciri',
  phase: 1,
  summary:
    'Bir React projesi aslında nelerden oluşur? pnpm, package.json, Vite, tsconfig, .env, Git, Vitest test çıktıları ve tarayıcı DevTools ile tanışıp sağlam bir temel kuruyoruz.',
  pain: `Bir React projesini ilk kez açtığında karşına onlarca dosya çıkar: \`package.json\`, \`vite.config.ts\`, \`tsconfig.app.json\`, \`index.html\`, \`.env\`… \`pnpm dev\` yazarsın, bir şeyler çalışır — ama **neden** çalıştığını bilmezsin.

Bir gün bir şey bozulduğunda (bir paket güncellenir, bir tip hatası build'i durdurur, testler kırmızıya döner, token GitHub'a sızar) bu dosyaların ve araçların ne işe yaradığını bilmeyen biri saatlerce kaybolur. Bu modülde her dosyanın **neden var olduğunu**, testleri nasıl okuyacağını ve tarayıcıda hataları nasıl ayıklayacağını öğreneceğiz.`,
  outcomes: [
    'Platformda quiz, kod ve proje görevlerini çözebilirsin',
    'package.json, script’ler, bağımlılık türleri ve semver’i okuyabilirsin',
    'Bir Vite projesinde index.html’den ekrandaki bileşene giden yolu anlatabilirsin',
    'Vite ile tsc’nin farkını bilir, tip hatalarını tsconfig kurallarıyla düzeltebilirsin',
    'API anahtarlarını .env ile güvenli yönetebilirsin',
    'Git ile küçük, anlamlı commit’ler atabilirsin',
    'Vitest test çıktılarını okuyabilir, tarayıcı DevTools ile adım adım hata ayıklayabilirsin',
  ],
})
