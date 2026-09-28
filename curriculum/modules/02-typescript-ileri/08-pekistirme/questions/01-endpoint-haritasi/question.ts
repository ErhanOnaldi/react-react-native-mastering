import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Endpoint yolunu cevaba bağla',
  difficulty: 'zor',
  concepts: ['ts.generics', 'ts.keyof-typeof', 'ts.api-types', 'ts.indexed-access'],
  files: ['task.ts'],
  hints: [
    'İzinli yolları ve her yolun cevap şeklini eşleştiren bir tip haritası çıkar.',
    '`K extends keyof EndpointMap` ile yolu sınırla ve dönüşü `EndpointMap[K]` yap.',
    'Fonksiyon gövdesinde `responses[path]` seçilen cevabı verir.',
  ],
})
