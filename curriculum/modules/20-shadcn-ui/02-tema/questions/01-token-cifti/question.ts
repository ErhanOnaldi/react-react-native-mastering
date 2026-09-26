import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Birincil renk neden çift?',
  difficulty: 'kolay',
  concepts: ['shadcn.theming', 'tailwind.theme', 'a11y.basics'],
  question: 'Koyu temada `--primary` rengini açtın; düğme yazısı okunmuyor. Ne yaparsın?',
  options: [
    { text: '`--primary-foreground` değerini de o arka planda okunacak biçimde ayarlarım.', correct: true, explanation: 'Doğru. Arka plan ve üstündeki metin birlikte kontrast oluşturur.' },
    { text: 'Her butona `text-white` eklerim.', explanation: 'Sabit beyaz yazı açık ve koyu temanın ikisine de uymayabilir; anlamsal foreground token’ını kullan.' },
    { text: '`components.json` dosyasını silerim.', explanation: 'Bu dosya CLI yol ve tema tercihini tutar; renk kontrastını CSS token değerleri çözer.' },
  ],
})
