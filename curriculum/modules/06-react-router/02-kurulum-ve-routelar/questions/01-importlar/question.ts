import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Router 8 importları',
  difficulty: 'kolay',
  concepts: ['router.setup', 'js.modules'],
  question: 'Data mode kurulumunda doğru import çifti hangisi?',
  options: [
    {
      text: '`createBrowserRouter` → `react-router`, `RouterProvider` → `react-router/dom`.',
      correct: true,
      explanation: 'Doğru. RouterProvider DOM girişinden, rota API’si ana paketten gelir.',
    },
    {
      text: 'İkisi de `react-router-dom` paketinden.',
      explanation: 'React Router 8 bu aynalama paketini kaldırdı.',
    },
    {
      text: '`createBrowserRouter` → `react-router/dom`, `RouterProvider` → `react`.',
      explanation: '`react` router sağlamaz; DOM sağlayıcı ayrı giriştedir.',
    },
  ],
})
