import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Bitirme: sıfırdan proje',
  phase: 6,
  summary:
    'Kimse sana checkpoint vermiyor: Open Library ile Kitaplık uygulamasını gereksinimden CI’a kadar tek başına tasarlayıp kuruyorsun.',
  pain: `Sinema’yı 21 modül boyunca büyüttün. Ama dürüst olalım: her adımda görev metni sana hangi dosyayı açacağını, hangi export’u yazacağını söyledi. Bir şey bozulduğunda checkpoint seni kurtardı.

İşteki ilk gününde kimse checkpoint vermez. Gelen mesaj şuna benzer: *“Kitap takip edebileceğim sade bir uygulama lazım. Open Library diye bir şey var, anahtar da istemiyormuş. Cuma demo yapabilir miyiz?”* Önünde **boş bir klasör** var. Hangi araç, hangi sırayla? Okuma listesi \`useState\`’te mi, Context’te mi, Redux’ta mı? Testleri ne zaman yazacaksın?

Sinema’da bu soruların cevabını **acı çekerek** öğrendin: URL’de olmayan filtre yenileyince kayboldu, favoriler üç kez taşındı, testsiz refactor iki gün sonra patladı. Bu modülde aynı kararları **baştan ve bilerek** vereceksin; Kitaplık’ı gereksinimden CI’a kadar tek başına kuracaksın.`,
  outcomes: [
    'Belirsiz bir ürün isteğini ölçülebilir kabul kriterleri olan bir gereksinim belgesine çevirebilirsin',
    'State haritası çıkarıp mimari kararlarını ADR ile gerekçelendirebilirsin',
    'Vite + React + TypeScript projesini Tailwind, ESLint, Prettier, Vitest ve Playwright ile sıfırdan kurabilirsin',
    'Gerçek ve kirli bir API’ye URL state, TanStack Query ve Zod ile arama, sayfalama ve detay özelliği yazabilirsin',
    'RHF + Zod formu ve doğrulanmış yerel kalıcılıkla bir kullanıcı özelliğini uçtan uca geliştirebilirsin',
    'Kendi test stratejini kurup her push’ta çalışan bir CI hattı yazabilirsin',
    'Next.js, Server Components ve React Native arasında sonraki adımını bilinçli seçebilirsin',
  ],
})
