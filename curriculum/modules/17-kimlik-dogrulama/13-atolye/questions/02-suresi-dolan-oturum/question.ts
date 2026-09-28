import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Süresi dolan oturum',
  difficulty: 'zor',
  concepts: ['auth.refresh', 'fetch.error-handling', 'test.fake-timers'],
  files: ['SessionPanel.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    "Profil yenileme fonksiyonunda 401 hatası yakalandığında sessizce durmak yerine yenileme uç noktasına başvur ve yeni girişe başlarken hata state'ini sıfırla.",
    '401 durumunda `POST /auth/refresh` ile eldeki `refreshToken` değerini yolla; dönen yeni token ile profil isteğini bir kez daha dene.',
    '`handleSubmit` başında `setFormError(null)` çağır; profil alma fonksiyonunda `if (!res.ok) { const fresh = await refreshTokens(); return fetchMe(fresh.accessToken); }` akışı kur.',
    'Yenileme isteğinin (`refresh`) de başarısız olabileceğini hesaba kat; `catch` bloğunda `status` değerini `"signed-out"` yaparak kullanıcıyı yüklenme kilitlenmesinden kurtar.',
  ],
})
