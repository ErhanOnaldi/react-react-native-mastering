import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Hangi optimistic yol?',
  difficulty: 'kolay',
  concepts: ['query.optimistic', 'query.useMutation'],
  question:
    'Kod tıklandığında bekleyen puan hangi yerde görünür?\n\n```tsx\nconst save = useMutation({ mutationFn: rate })\nreturn <>{save.isPending && <span>{save.variables.value} gönderiliyor</span>}<button onClick={() => save.mutate({ movieId: 550, value: 8.5 })}>Kaydet</button></>\n```',
  options: [
    {
      text: 'Yalnız bu bileşendeki `span` içinde 8,5 görünür; query cache’i değişmez.',
      correct: true,
      explanation: '`variables` son `mutate` çağrısının girdisini verir; kod cache’e yazmıyor.',
    },
    {
      text: 'Bütün puan listeleri 8,5 olarak güncellenir.',
      explanation: 'Mutation state bileşene aittir; ortak query cache’i burada değişmiyor.',
    },
    {
      text: 'Başarıdan sonra span ilk kez görünür.',
      explanation: '`isPending` yalnız Promise beklerken doğrudur; başarıda false olur.',
    },
  ],
  explanation:
    'Mutation variables ile geçici bilgiyi mutation’ı başlatan bileşende gösterebilirsin.',
})
