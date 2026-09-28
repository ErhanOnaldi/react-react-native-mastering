import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Seçici API seçimi',
  difficulty: 'orta',
  concepts: ['arch.component-api', 'pattern.compound', 'a11y.keyboard'],
  files: ['ChoiceControl.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Seçenekleri tek bir yapılandırma listesinden mi üreteceksin, yoksa her seçeneği ayrı, birlikte kullanılan küçük bir parça mı yapacaksın? İkisi de aynı klavye ve hata sözleşmesini sağlayabilir.',
    'Hangi tasarımı seçersen seç, dışarıdan görünen şey aynı olmalı: adlandırılmış bir seçim kontrolü ve ona bağlı okunur bir hata alanı.',
    'Seçim yapılmadan gönderilirse `aria-describedby` ile bağlı bir hata göster; seçim yapılınca hata kaybolsun.',
  ],
  rubric: [
    'Kod yorumunda hangi API biçiminin (tek yapılandırma / küçük parçalar) seçildiği ve nedeni somut biçimde açıklanır.',
    'Seçim kontrolü ok tuşlarıyla ve erişilebilir rol/isimle kullanılabilir.',
    'Hata mesajı seçim kontrolüne `aria-describedby` ile bağlıdır ve geçerli seçimde kaybolur.',
    'Yeni bir seçenek eklemenin hangi dosyada, ne kadar değişiklikle yapılacağı nettir (genişleme maliyeti).',
  ],
})
