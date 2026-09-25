import { createBrowserRouter } from 'react-router'
import { DashboardPage } from '@/features/curriculum/dashboard-page'
import { LessonPage } from '@/features/curriculum/lesson-page'
import { ModulePage } from '@/features/curriculum/module-page'
import { QuestionPage } from '@/features/question/question-page'
import { AppLayout } from './layout'
import { RouteError } from './route-error'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'm/:code', element: <ModulePage /> },
      { path: 'l/:code', element: <LessonPage /> },
      { path: 'q/:code', element: <QuestionPage /> },
      { path: '*', element: <RouteError notFound /> },
    ],
  },
])
