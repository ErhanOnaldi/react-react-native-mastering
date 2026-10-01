import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Aktif menüyü göster',
  difficulty: 'orta',
  concepts: ['router.navigation', 'a11y.basics'],
  files: ['Menu.tsx'],
  hints: [
    'Menü öğesinin etkin olup olmadığını ayrıca state tutmadan hangi bilgiyle belirleyebilirsin?',
    '`NavLink` eşleşme durumunu verir; kök adresin child yollarla eşleşmesini sınırlamak için prop desteğine bak.',
    'Ana sayfa linkinde `end` kullan; Ara bağlantısının etkin adres bilgisini Router’dan al.',
  ],
})
