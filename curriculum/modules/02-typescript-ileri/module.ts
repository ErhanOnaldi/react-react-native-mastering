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
    'keyof, typeof ve as const ile anahtarları ve literal değerleri güvenle kullanabilirsin',
    'RemoteData<T> ile istek durumlarını exhaustive olarak işleyebilirsin',
    'unknown veriye type guard uygulayıp getJson<T> iddiasının sınırını açıklayabilirsin',
    'Sinema’nın TMDB tiplerini, görsel URL yardımcısını ve uzak veri durumlarını oluşturabilirsin',
  ],
})
