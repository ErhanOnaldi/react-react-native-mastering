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
    'Başarılı ve başarısız girişte kullanıcıya ne görünmeli? Yenilemeden sonra hangi bilgi geri gelmeli?',
    'DummyJSON yanıtındaki iki token’ı oku; authSlice içinde user ve token’ları yönet. Formda RHF + Zod ile boş alanları engelle.',
    'RHF formunda zodResolver kullan; başarılı girişte setCredentials dispatch et, kaydı yaz ve /profile yoluna git.',
  ],
})
