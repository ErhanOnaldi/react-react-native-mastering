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
    'Kimlik servisiyle iletişim için API fonksiyonunu kur; ardından Redux toolkit `createSlice` ile oturum dilimini ve eylemlerini oluştur.',
    '`https://dummyjson.com/auth/login` adresine POST ile `{ username, password }` gönder; başarılı yanıttaki `{ accessToken, refreshToken, id, username }` alanlarını döndür.',
    '`authSlice` içinde `setCredentials(state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>)` ile alanları doldur; `clearAuth` içinde hepsini `null` yap.',
    '`LoginPage` bileşeninde başarılı girişten sonra hem `dispatch(setCredentials(...))` yapmayı hem de F5 sonrası kalıcılık için `localStorage.setItem("sinema-auth", JSON.stringify(...))` kaydetmeyi unutma.',
  ],
})
