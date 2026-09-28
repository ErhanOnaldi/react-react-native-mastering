import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Bağımlılık zinciri güvenliği',
  difficulty: 'orta',
  concepts: ['security.supply-chain'],
  question:
    'Ön yüz projelerinde üçüncü parti paket güvenliğini sağlamak ve tedarik zinciri saldırılarına karşı korunmak için hangi uygulama doğrudur?',
  options: [
    {
      text: 'Lockfile dosyasını versiyon kontrolüne eklemek, CI ortamında `--frozen-lockfile` kullanmak ve paket kurulum script’lerini varsayılan olarak çalıştırmamak.',
      correct: true,
      explanation:
        'Lockfile tam bağımlılık ağacını sabitler; dondurulmuş lockfile CI sırasında beklenmedik sürüm güncellemelerini engeller; pnpm 10 gibi modern araçlar kurulum anında keyfi script çalışmasını (postinstall) varsayılan olarak kısıtlar.',
    },
    {
      text: 'Her derlemede en güncel yamayı almak için `pnpm-lock.yaml` dosyasını `.gitignore` içine almak.',
      correct: false,
      explanation:
        'Lockfile versiyon kontrolünde olmazsa her kurulumda farklı alt bağımlılık sürümleri çekilebilir; bu durum hem hatalara hem de kötü amaçlı yeni sürümlerin anında projeye sızmasına yol açar.',
    },
    {
      text: 'Paket yöneticisinin güvenlik açıklarını tarayan `audit` komutunu çalıştırmaktan kaçınmak.',
      correct: false,
      explanation:
        '`pnpm audit` bilinen güvenlik açıklarını tespit etmek için düzenli olarak ve CI hatlarında çalıştırılmalıdır.',
    },
  ],
})
