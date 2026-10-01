import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Giriş isteğini gönder',
  difficulty: 'kolay',
  concepts: ['fetch.error-handling', 'js.async-await', 'ts.api-types'],
  files: ['login.ts'],
  hints: [
    'Yanıtın başarılı olup olmadığını `response.ok` ile kontrol et; isteğin JSON gövdesinde hangi iki alanı gönderdiğini belirle.',
    '`https://dummyjson.com/auth/login` adresine JSON gövdeli bir `POST` isteği gönder.',
    'Başarısız yanıtta sunucunun `message` alanıyla `Error` fırlat; başarılı yanıtta `accessToken` ve `refreshToken` alanlarını döndür.',
  ],
})
