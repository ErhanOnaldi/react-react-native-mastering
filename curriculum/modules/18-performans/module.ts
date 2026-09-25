import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Performans ve modern React',
  phase: 5,
  summary:
    'Yavaş aramayı ölç, gereksiz işi azalt, büyük listeyi sanallaştır ve React 19 araçlarını gerçek ihtiyaçlarında kullan.',
  pain: `Sinema'da 500 filmlik arama sonucuna her harf eklediğinde input gecikiyor. Bir tuş, yüzlerce satırın tekrar render edilmesine ve pahalı sıralamanın yeniden çalışmasına yol açıyor. Önce kaç render, kaç hesaplama ve kaç DOM satırı olduğunu ölçeceksin; sonra darboğazı yerinde çözeceksin.`,
  outcomes: [
    'Profiler ile commit sayısını ölçüp render nedenini ayırabilirsin',
    'Gereken yerde memo, useMemo ve useCallback kullanabilirsin',
    'React Compiler ile el yazısı memo arasındaki sınırı açıklayabilirsin',
    'Arama inputunu useDeferredValue veya useTransition ile akıcı tutabilirsin',
    '500 filmlik listede görünen satırları sanallaştırabilirsin',
    'Route ve bileşenleri gerektiğinde yükleyebilirsin',
    'React 19 Action ve optimistic UI akışını kurabilirsin',
  ],
})
