import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Görünüm tercihi karışıyor',
  difficulty: 'orta',
  concepts: ['arch.state-categories', 'react.derived-state'],
  files: ['MovieWorkspace.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Görünüm tercihi (liste/kart) ile sunucudan gelen film listesi aynı güncellemeyle mi değişiyor, ayrı mı?',
    'Favori işaretinin hangi bilgiye göre saklandığına bak: filmin kimliğine mi, yoksa listedeki sırasına mı?',
    'Görünüm ve favoriler yalnız bu ekranda kullanılıyor. Redux gerekli mi karar ver; favorileri film ID’sine göre sakla ve yeni veri geldiğinde sıfırlama.',
  ],
  rubric: [
    'Görünüm tercihi film listesini veya veri isteğini sıfırlamaz.',
    'Favori seçimi film ID’sine bağlıdır ve tür değişiminden sonra korunur.',
    'State sahipliği ihtiyaca göre seçilir; bu tek ekrandaki değerler için gereksiz Redux store kurulmaz.',
    'Yükleme ve hata görünümü film listesi güncellenirken anlaşılır kalır.',
  ],
})
