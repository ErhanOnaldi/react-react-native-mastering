import { defineModule } from '@rm/content/define'
export default defineModule({
  title: 'Redux Toolkit',
  phase: 4,
  summary:
    'Sinema’daki ortak client state’i ölçerek store ve slice’lara taşı; TMDB verisini Query’de bırak.',
  pain: `:::pain[Sinema’da sorun]\nSinema’da favoriler, izleme listeleri, tema ve son bakılanlar beş iç içe Context provider’ında yaşıyor. Bir favoriye dokununca alakasız tema ve liste bileşenleri de render oluyor. Render sayacı 1 yerine 2, 3, 4 diye artıyor. Hangi state’in kime ait olduğunu ayırıp güncellemeleri daraltacağız.\n:::`,
  outcomes: [
    'Server, URL, form ve client state için doğru sahibi seçebilirsin',
    'configureStore ve createSlice ile tipli store kurabilirsin',
    'withTypes hook’larıyla yalnızca gereken state’i seçebilirsin',
    'Immer ve memoized selector davranışını test edebilirsin',
    'Listener middleware ile client state’i localStorage’a yazabilirsin',
    'Redux bileşenlerini gerçek store ile test edebilirsin',
  ],
})
