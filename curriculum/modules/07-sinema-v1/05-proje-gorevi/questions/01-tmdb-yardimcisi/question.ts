import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'TMDB yardımcısını yaz',
  difficulty: 'orta',
  concepts: ['fetch.headers-auth', 'fetch.error-handling', 'fetch.query-params', 'ts.generics'],
  project: 'sinema',
  focusFiles: ['src/lib/tmdb.ts'],
  reviewFiles: ['src/lib/tmdb.ts'],
  rubric: [
    'Bearer token ve Türkçe dil tek merkezde',
    'HTTP hatası başarısız Promise olarak aktarılıyor',
  ],
  hints: [
    'Önceki derste yazdığın URL oluşturma mantığını bu dosyaya taşıyıp `fetch` çağrısı, yetki başlığı ve hata kontrolü ile birleştirmelisin.',
    '`new URL` ve `URLSearchParams` ile adresi oluşturup `fetch(url, { ...init, headers })` çağrısı yap. `headers` içine `Authorization: Bearer ${import.meta.env.VITE_TMDB_TOKEN}` ekle.',
    'İstek sonrası `if (!response.ok)` bloğunda sunucunun `{ status_message }` içeren JSON gövdesini okumayı dene; JSON değilse `response.status` ile hata oluşturup `throw new Error(...)` de. Başarıda `return (await response.json()) as T` döndür.',
    '`response.json()` gövdeyi tek bir kez okuyabilir; hem hata durumunda hem de başarı durumunda aynı yanıt nesnesinde iki kez `json()` çağırmamaya dikkat et.',
  ],
})
