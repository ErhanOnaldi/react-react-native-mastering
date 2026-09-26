import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Giriş hatası ve düzeltme',
  difficulty: 'orta',
  concepts: ['form.rhf-errors', 'auth.jwt', 'a11y.basics'],
  files: ['LoginPanel.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Hatalı girişte alan değerlerini sıfırlamana gerek yok; kontrollü input zaten yazdığını korur. Asıl iş: hatayı ekran okuyucunun da yakalayacağı biçimde göstermek.',
    'İstek sürerken düğmeyi devre dışı bırakmak, kullanıcı tekrar tıklasa bile ikinci bir isteğin gitmesini önler.',
    'Gönderim başında hem eski hatayı temizle hem "gönderiliyor" bayrağını aç; `finally` bloğunda bayrağı kapat. 400 cevabındaki mesajı `role="alert"` ile göster.',
  ],
})
