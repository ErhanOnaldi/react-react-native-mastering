import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Zod',
  phase: 4,
  summary:
    'Sinema formları, TMDB yanıtları, URL parametreleri ve env değerleri için çalışma zamanı doğrulaması kurarsın.',
  pain: `:::pain[Problem]
TMDB bir filmin başlığını null döndürdü. getJson<MovieDetails> tipine güvenen detay sayfası çöktü; form kuralları da tiplerden kopup sürükleniyor.
:::`,
  outcomes: [
    'Zod 4 ile çalışma zamanı şeması kurabilirsin',
    'Şemadan input ve output tiplerini çıkarabilirsin',
    'Alanlar arası kuralları refine ile doğrulayabilirsin',
    'URL ve env stringlerini güvenli değerlere çevirebilirsin',
    'RHF formunu zodResolver ile bağlayabilirsin',
    'TMDB cevabını API client sınırında doğrulayabilirsin',
  ],
})
