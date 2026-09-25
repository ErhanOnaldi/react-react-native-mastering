import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import type { AnswerResultDto, QuizQuestionDto } from '@rm/server/dto'
import { QuizView } from '@/features/question/quiz-view'
import { renderWithProviders } from './render'
import { server } from './server'

const progress = {
  status: 'not-started',
  attempts: 0,
  hintsUsed: 0,
  solutionViewed: false,
  updatedAt: '',
} as const

const question: QuizQuestionDto = {
  type: 'quiz',
  id: 'm/l/q',
  code: '0.1.1',
  title: 'Toplam',
  difficulty: 'kolay',
  concepts: [],
  module: { code: '0', title: 'M' },
  lesson: { code: '0.1', title: 'L' },
  next: { code: '0.1.2', title: 'Sonraki' },
  progress,
  hintCount: 0,
  questionHtml: '<p>1 + 1 kaçtır?</p>',
  mode: 'single',
  options: [
    { index: 0, html: '<p>2</p>' },
    { index: 1, html: '<p>11</p>' },
  ],
}

function answer(correct: boolean, selected: number): AnswerResultDto {
  return {
    correct,
    options: [
      {
        index: 0,
        correct: true,
        selected: selected === 0,
        explanationHtml: '<p>Doğru toplam.</p>',
      },
      {
        index: 1,
        correct: false,
        selected: selected === 1,
        explanationHtml: '<p>String birleştirme.</p>',
      },
    ],
    progress: { ...progress, status: correct ? 'passed' : 'in-progress', attempts: 1 },
  }
}

describe('QuizView', () => {
  it('seçim yapılmadan cevaplamaya izin vermez', () => {
    renderWithProviders(<QuizView question={question} />)
    expect(screen.getByRole('button', { name: 'Cevapla' })).toBeDisabled()
  })

  it('yanlış cevapta açıklamayı gösterir, tekrar denemeye izin verir', async () => {
    const user = userEvent.setup()
    server.use(http.post('/api/questions/0.1.1/answer', () => HttpResponse.json(answer(false, 1))))
    renderWithProviders(<QuizView question={question} />)

    await user.click(screen.getByLabelText('11'))
    await user.click(screen.getByRole('button', { name: 'Cevapla' }))

    expect(await screen.findByText(/Tam olarak değil/)).toBeInTheDocument()
    expect(screen.getByText('String birleştirme.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Tekrar dene/ }))
    expect(screen.getByRole('button', { name: 'Cevapla' })).toBeDisabled()
  })

  it('doğru cevapta tebrik eder ve sonraki soruya bağlantı verir', async () => {
    const user = userEvent.setup()
    server.use(http.post('/api/questions/0.1.1/answer', () => HttpResponse.json(answer(true, 0))))
    renderWithProviders(<QuizView question={question} />)

    await user.click(screen.getByLabelText('2'))
    await user.click(screen.getByRole('button', { name: 'Cevapla' }))

    expect(await screen.findByText('🎉 Doğru!')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Sonraki soru/ })).toHaveAttribute('href', '/q/0.1.2')
  })
})
