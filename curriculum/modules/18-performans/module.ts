import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Performans ve modern React',
  phase: 5,
  summary:
    'Yavaş aramayı ve gerçek kullanıcı deneyimini ölç, gereksiz işi azalt, büyük listeyi sanallaştır ve yüklenen varlıkları doğru sıraya koy.',
  pain: `Sinema'da 500 filmlik arama sonucuna her harf eklediğinde input gecikiyor. Bir tuş, yüzlerce satırın tekrar render edilmesine ve pahalı sıralamanın yeniden çalışmasına yol açıyor. Önce kaç render, kaç hesaplama ve kaç DOM satırı olduğunu ölçeceksin; sonra darboğazı yerinde çözeceksin.`,
  outcomes: [
    'Profiler ile commit sayısını ölçüp render nedenini ayırabilirsin',
    'Gereken yerde memo, useMemo ve useCallback kullanıp React Compiler sınırını açıklayabilirsin',
    'Arama inputunu useDeferredValue veya useTransition ile akıcı tutabilirsin',
    '500 filmlik listede görünen satırları sanallaştırabilirsin',
    'Route ve bileşenleri gerektiğinde yükleyebilirsin',
    'React 19 Action ve optimistic UI akışını kurabilirsin',
    'LCP, INP ve CLS ölçümlerini yorumlayıp görsel, font ve bundle kaynaklı darboğazları iyileştirebilirsin',
  ],
})
