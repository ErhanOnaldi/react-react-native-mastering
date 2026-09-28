import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İsteğin preflight gerektirip gerektirmediğini tespit et',
  difficulty: 'orta',
  concepts: ['web.cors', 'ts.functions', 'ts.object-types'],
  files: ['needsPreflight.ts'],
  hints: [
    'Basit bir isteğin preflight gerektirmemesi için hem yönteminin hem de tüm başlıklarının güvenli listede (CORS-safelisted) olması gerekir.',
    'Yöntem yalnızca GET, HEAD veya POST olabilir. İzin verilen başlık adları ise (büyük/küçük harf duyarsız) accept, accept-language, content-language ve content-type’tır.',
    'Content-Type değeri yalnızca application/x-www-form-urlencoded, multipart/form-data veya text/plain olabilir (varsa ; charset sonrasını kırp). Diğer tüm durumlarda (ör. application/json veya Authorization başlığı) fonksiyon true dönmelidir.',
  ],
})
