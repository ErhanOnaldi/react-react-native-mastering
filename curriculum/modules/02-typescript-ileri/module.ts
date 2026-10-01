import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'TypeScript ileri',
  phase: 1,
  summary:
    'Tekrarlanan film tiplerinden güvenilir ve yeniden kullanılabilir tipler çıkarıp Sinema’nın liste, detay ve istek durumlarını modelleyeceksin.',
  pain: `Sinema’da aynı \`Movie\` tipi beş dosyada farklı yazılmış. Trend listesinin öğesinde \`genre_ids\` var; \`/movie/550\` detayında \`genres\`, \`runtime\` ve bazen \`credits\` var. Üstelik arama, keşfet ve popüler liste cevapları aynı sayfalama kabuğunu tekrar ediyor. Bir alanı düzeltince öbür dört kopya eski kalıyor. Bu modülde bu dağınıklığı tipleri türeterek gidereceksin.`,
  outcomes: [
    'Generic fonksiyon ve Paginated<T> ile tekrar eden cevap tiplerini birleştirebilirsin',
    'Pick, Omit, Partial, Record ve Readonly ile var olan tiplerden yeni tipler türetebilirsin',
    'Discriminated union ile geçerli istek durumlarını tanımlayıp her dalı ele alabilirsin',
    'Type guard ile unknown verinin alanlarını çalışma anında kontrol edebilirsin',
    'keyof, typeof ve as const ile anahtarları ve literal değerleri güvenle kullanabilirsin',
    'Promise<T> ve Awaited<T> ile asenkron sonuç tiplerini açıklayabilirsin',
    'Sinema’nın TMDB tiplerini, görsel URL yardımcısını ve uzak veri durumlarını oluşturabilirsin',
  ],
})
