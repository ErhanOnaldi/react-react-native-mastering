import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'HOC render içinde',
  difficulty: 'orta',
  concepts: ['pattern.render-props-hoc', 'react.render-cycle', 'react.state'],
  question: `\`TrailerPlayer\` içinde ses seviyesi \`useState\` ile tutuluyor. Kullanıcı sesi açtıktan sonra favori düğmesine basınca \`MovieDetails\` yeniden render oluyor. Ne olur?

\`\`\`tsx
function MovieDetails() {
  const [favorite, setFavorite] = useState(false)
  const SafePlayer = withAuth(TrailerPlayer)
  return (
    <>
      <button onClick={() => setFavorite((f) => !f)}>Favori</button>
      <SafePlayer videoKey="_8WFzt_tKAA" />
    </>
  )
}
\`\`\``,
  options: [
    {
      text: 'Oynatıcı unmount edilip yeniden mount olur; ses seviyesi başlangıç değerine döner.',
      correct: true,
      explanation:
        'Doğru. `withAuth(...)` her render’da yeni bir bileşen fonksiyonu döndürür. React tip değişti sanıp eski ağacı atar, state kaybolur. HOC’u modül seviyesinde bir kez çağır.',
    },
    {
      text: 'Oynatıcı yalnızca yeniden render olur; ses seviyesi korunur.',
      explanation:
        'Bu, `SafePlayer` her render’da aynı referans olsaydı doğru olurdu. Render içinde oluşturulan bileşen tipi her seferinde farklıdır.',
    },
    {
      text: 'React hata fırlatır: HOC’lar bileşen içinde çağrılamaz.',
      explanation:
        'Hata yok; kod çalışır ama sessizce state kaybettirir. Bu yüzden sinsi bir hatadır.',
    },
    {
      text: '`withAuth` bir hook olduğu için Hook kurallarını bozar.',
      explanation:
        'HOC hook değildir, sıradan bir fonksiyondur. Sorun Hook kuralı değil, bileşen kimliğinin her render’da değişmesi.',
    },
  ],
})
