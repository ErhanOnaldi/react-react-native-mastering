import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Giriş yap ve JWT payload’ını oku',
  difficulty: 'orta',
  concepts: ['auth.jwt', 'fetch.error-handling', 'js.async-await', 'ts.api-types'],
  files: ['login.ts'],
  hints: [
    'Ağ isteğinde `response.ok` değerini incele; belirteç çözümlemesinde ise ikinci parçaya odaklan.',
    '`fetch` ile `https://dummyjson.com/auth/login` adresine POST isteği at; başarısız yanıtta `(await response.json()).message` mesajını `Error` olarak fırlat.',
    'JWT çözümlemesi için: `token.split(".")[1]` parçasında `-` yerine `+`, `_` yerine `/` koy; uzunluğu 4ün katı yapacak şekilde `=` padding ekle; `atob` ve `JSON.parse` ile nesneye çevir.',
    '`decodeJwtPayload` içinde `try/catch` kullan; dönen nesnede `typeof record.username === "string"` ve `typeof record.exp === "number"` kontrollerini yapmadan doğrudan dönme.',
  ],
})
