import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Film notunu kimlikle sıfırla',
  difficulty: 'orta',
  concepts: ['react.lists-keys', 'react.state', 'react.derived-state'],
  files: ['MovieNotes.tsx'],
  hints: [
    'Önce not değerini kendi state’inde yöneten, erişilebilir bir textbox oluştur.',
    'Not alanının sahibi film kimliğine göre yeniden kurulmalı; React ağaçtaki bileşen kimliğini nasıl belirliyor?',
    'Not girişi ayrı bir `Notes` bileşeni olsun; film id’sini o bileşenin `key` değerine de ver.',
  ],
})
