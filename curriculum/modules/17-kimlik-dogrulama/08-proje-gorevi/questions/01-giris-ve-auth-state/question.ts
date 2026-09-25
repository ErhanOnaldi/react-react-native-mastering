import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'project',
  title: 'Sinema’ya gerçek giriş ekle',
  difficulty: 'orta',
  project: 'sinema',
  concepts: ['auth.jwt', 'auth.token-storage', 'form.rhf-register', 'zod.resolver', 'redux.slice'],
  focusFiles: [
    'src/features/auth/auth-api.ts',
    'src/features/auth/authSlice.ts',
    'src/pages/LoginPage.tsx',
    'src/pages/ProfilePage.tsx',
  ],
  hints: [
    'Önce DummyJSON login yanıtını iki token olarak oku; 400 mesajını formda göster.',
    'authSlice için user, accessToken, refreshToken ve clearAuth action’ı kur.',
    'Login formunda RHF + zodResolver kullan; başarılı girişte setCredentials dispatch et ve /profile yoluna git.',
  ],
})
