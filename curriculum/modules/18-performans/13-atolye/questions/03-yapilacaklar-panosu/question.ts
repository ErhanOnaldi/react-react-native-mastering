import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  project: 'atolye',
  title: 'Yapılacaklar panosu',
  difficulty: 'zor',
  concepts: ['arch.state-categories', 'arch.feature-folders', 'perf.rerender'],
  reviewFiles: ['src/yapilacaklar-panosu/**'],
  hints: [
    'Önce işleri listeleme ile "kime ait" ve "tamamlandı mı" filtrelerini birbirinden ayır.',
    'Kullanıcı seçimi ve tamamlanma filtresi paylaşılabilir olmalı; ikisini de aynı yerde tutabilirsin.',
    'DummyJSON /users ile kullanıcı listesini, /todos/user/:userId ile o kullanıcının işlerini iste; tamamlanma filtresini istemci tarafında uygula.',
  ],
  rubric: [
    'Seçilen kullanıcının gerçek DummyJSON işleri listelenir.',
    'Kullanıcı filtresi (kim) ile tamamlanma filtresi (durum) birbirinden bağımsız çalışır.',
    'Tamamlanmış/tamamlanmamış işler anlaşılır biçimde ayırt edilir.',
    'Seçili kullanıcı ve filtre URL üzerinden paylaşılabilir; sayfa yenilenince korunur.',
    'Kullanıcı veya iş listesi yüklenemediğinde ve sonuç boş olduğunda anlaşılır bir durum gösterilir.',
    'Veri çekme sorumluluğu (API çağrıları) ile liste/filtre görünümü ayrı dosyalarda tutulur.',
  ],
})
