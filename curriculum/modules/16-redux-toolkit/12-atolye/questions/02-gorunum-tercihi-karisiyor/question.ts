import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Görünüm tercihi karışıyor',
  difficulty: 'orta',
  concepts: ['arch.state-categories', 'redux.selectors', 'react.derived-state'],
  files: ['MovieWorkspace.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Görünüm tercihi (liste/kart) ile sunucudan gelen film listesi aynı güncellemeyle mi değişiyor, ayrı mı?',
    'Favori işaretinin hangi bilgiye göre saklandığına bak: filmin kimliğine mi, yoksa listedeki sırasına mı?',
    'Görünümü ayrı bir state’te tut ve veri isteğini tetiklemesin; favorileri film id’sine göre bir `Set` ile sakla, yeni veri geldiğinde bu kümeyi sıfırlama.',
  ],
})
