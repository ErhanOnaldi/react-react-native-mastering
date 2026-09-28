import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi istekler same-origin sayılır?',
  difficulty: 'kolay',
  concepts: ['web.cors'],
  question:
    'React uygulaman `http://localhost:5173` adresinde çalışıyor. Aşağıdaki API adreslerinden hangisine yapılan `fetch` çağrısı tarayıcı tarafından **aynı origin (same-origin)** kabul edilir?',
  options: [
    {
      text: '`http://localhost:5173/api/movies`',
      correct: true,
      explanation:
        'Doğru. Protokol (http), host (localhost) ve port (5173) birebir aynıdır; yalnızca yol farklıdır.',
    },
    {
      text: '`http://localhost:5000/api/movies`',
      explanation:
        'Port numarası farklıdır (5173 yerine 5000). Farklı port, farklı bir origin demektir ve CORS kurallarına tabidir.',
    },
    {
      text: '`https://localhost:5173/api/movies`',
      explanation:
        'Protokol farklıdır (http yerine https). Şema uyuşmadığı için farklı origin sayılır.',
    },
    {
      text: '`http://127.0.0.1:5173/api/movies`',
      explanation:
        '`localhost` ile `127.0.0.1` teknik olarak aynı makineyi işaret etse de string olarak host isimleri farklı olduğu için tarayıcı bunları farklı origin kabul eder.',
    },
  ],
})
