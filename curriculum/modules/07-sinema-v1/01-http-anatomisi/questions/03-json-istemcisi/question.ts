import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'JSON cevabını ve HTTP hatasını ayır',
  difficulty: 'orta',
  concepts: ['web.http-anatomy', 'fetch.error-handling'],
  files: ['fetchJson.ts'],
  hints: [
    'Ağ hatası ile sunucudan gelen başarısız HTTP cevabı farklıdır. HTTP cevabını aldıktan sonra durumunu ayrıca denetle.',
    'Başarısız HTTP cevabında durum kodunu mesajla taşı; başarılı cevabın gövdesini yalnızca bir kez oku.',
    'İstek seçeneklerini `fetch` çağrısına aktar. 204 durumunda JSON okuma adımını atla; diğer başarılı durumlarda gövdeyi JSON olarak döndür.',
  ],
})
