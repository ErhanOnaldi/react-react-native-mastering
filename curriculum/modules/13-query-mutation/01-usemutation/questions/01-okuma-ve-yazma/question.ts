import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Hangi işlem yazma?',
  difficulty: 'kolay',
  concepts: ['query.useMutation', 'query.useQuery'],
  question:
    'Bu kodda `rate` hangi anda çağrılır?\n\n```tsx\nconst save = useMutation({ mutationFn: rate })\nreturn <button onClick={() => save.mutate({ movieId: 550, value: 8.5 })}>Kaydet</button>\n```',
  options: [
    {
      text: 'Düğmeye tıklanınca, `mutate` çağrısıyla.',
      correct: true,
      explanation: '`useMutation` işlemi hazırlar; `mutate` event handler içinde işi başlatır.',
    },
    {
      text: 'Bileşen render olur olmaz, hook kurulurken.',
      explanation: 'Hook çağrısı isteği başlatmaz; aksi halde her render yazma isteği atardı.',
    },
    {
      text: 'Sunucu cevap verince, mutation başarıya geçerken.',
      explanation: 'Cevap mutation başladıktan sonra gelir; başlangıç noktası `mutate` çağrısıdır.',
    },
  ],
  explanation: 'Mutation tanımı işi hazırlar. Kullanıcı olayı içinden `mutate` çağrısı gönderir.',
})
