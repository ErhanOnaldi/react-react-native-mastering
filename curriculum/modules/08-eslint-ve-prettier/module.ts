import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'ESLint ve Prettier',
  phase: 2,
  summary:
    'Sinema v1’de gözden kaçan Hook hatalarını görünür kıl, ortak lint ve format kurallarını projeye bağla.',
  pain: `Sinema’da /movie/550’den /movie/155’e geçtin; adres değişti ama ekranda hâlâ Dövüş Kulübü var. Eksik useEffect bağımlılığı TypeScript’ten geçiyor. Üstelik kullanılmayan import’lar birikiyor, aynı dosya iki kişide farklı biçimde kaydediliyor. Bu modülde önce bu hataları elle görüp sonra ESLint ve Prettier ile tekrarlanabilir kontrol kuracağız.`,
  outcomes: [
    'ESLint’in bulduğu hataları gerçek lint çıktısından okuyabilirsin',
    'ESLint 10 flat config ve typescript-eslint kurallarını ayarlayabilirsin',
    'Hook bağımlılığı ve Hook çağrı sırası hatalarını düzeltebilirsin',
    'Prettier ile TypeScript ve Tailwind class biçimini tutarlı tutabilirsin',
    'Sinema’ya lint, format ve format:check script’leri ekleyebilirsin',
    'Oxlint ve Biome seçeneklerini ihtiyaçlarına göre değerlendirebilirsin',
  ],
})
