import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Paralel istekler için tek uçuş',
  difficulty: 'zor',
  concepts: ['auth.refresh', 'arch.api-client', 'js.async-await'],
  files: ['authClient.ts'],
  hints: [
    'Paralel 401 alan isteklerin aynı anda birden çok yenileme tetiklemesini engellemek için paylaşılan bir Promise değişkeni kullan.',
    "Closure içinde `let inFlight: Promise<Tokens> | null = null;` referansı tut; 401 durumunda eğer `inFlight` yoksa `refreshSession(storage)` çağır ve Promise'ı bu değişkene ata.",
    '`inFlight.finally(() => { inFlight = null; })` ekleyerek işlem bittiğinde değişkeni temizle; ardından dönen yeni token ile orijinal isteği bir kez tekrarla (`retry`).',
    "İkinci 401 yanıtı ilk yenileme tamamlandıktan hemen sonra gelebilir; `storage.getTokens()?.accessToken` değeri istekte kullanılan token'dan farklıysa yeni refresh başlatma, doğrudan eldeki güncel token ile retry yap.",
  ],
})
