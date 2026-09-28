import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Bearer ile profili oku',
  difficulty: 'kolay',
  concepts: ['fetch.headers-auth', 'fetch.error-handling', 'arch.api-client', 'auth.jwt'],
  files: ['profile.ts'],
  hints: [
    'İstek başlığında RFC 6750 Bearer standardını kullan ve yanıtın `ok` durumunu incele.',
    '`fetch` çağrısına `{ headers: { Authorization: `Bearer ${accessToken}` } }` başlığını ekle ve `https://dummyjson.com/auth/me` adresine GET isteği at.',
    '`if (!response.ok) throw new Error(`Profil isteği başarısız: ${response.status}`);` kontrolü yap; başarılı ise `await response.json()` ile `{ id, username }` döndür.',
    '`fetch` 401 yanıtında kendiliğinden hata fırlatmaz; `response.ok` kontrolünü atlayıp doğrudan JSON parse etmeye çalışırsan testler 401 hatasını yakalayamaz.',
  ],
})
