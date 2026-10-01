import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Filtreyi parça parça güncelle',
  difficulty: 'orta',
  concepts: ['ts.omit', 'ts.partial', 'ts.optional-nullable', 'js.spread'],
  files: ['task.ts'],
  hints: [
    'Kullanıcı panelde tek bir filtreyi değiştirir; değişiklik nesnesinde hangi alanlar bulunabilir, hangisi asla bulunmamalı? Sayfa numarası panelden değişmiyor.',
    "`Omit` ile `page`'i çıkar, `Partial` ile kalan alanları isteğe bağlı yap. Gövdede mevcut filtreleri ve değişikliği spread ile birleştir.",
    "`export type FilterChange = Partial<Omit<DiscoverFilters, 'page'>>` ve `return { ...current, ...change, page: 1 }`.",
    "`page: 1`'i spread'lerden önce yazarsan `...current` onu eski sayfa numarasıyla ezer.",
  ],
})
