import { queryOptions, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import type {
  AnswerResultDto,
  CodeQuestionDto,
  HintsDto,
  QuestionDto,
  QuestionProgress,
  ReviewPromptDto,
  RunResponseDto,
  SolutionDto,
} from '@rm/server/dto'
import { curriculumQueries } from '@/features/curriculum/api'
import { api } from '@/lib/api'
import { waitForPendingSaves } from './use-autosave'

export const questionQueries = {
  all: () => ['question'] as const,
  detail: (code: string) =>
    queryOptions({
      queryKey: [...questionQueries.all(), code],
      queryFn: async () => {
        // Bu soruda hâlâ yazılmakta olan kayıt varsa bitmesini bekle: diskten eski içerik okumayalım
        await waitForPendingSaves(code)
        return api.get<QuestionDto>(`/questions/${code}`)
      },
      // Soru her açılışta diskten taze okunur (VS Code'daki değişiklikler, son kayıtlar);
      // açıkken arka planda tazelenmez ki editördeki çalışma ezilmesin.
      staleTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    }),
  hints: (code: string, count: number) =>
    queryOptions({
      queryKey: [...questionQueries.all(), code, 'hints', count],
      queryFn: () => api.get<HintsDto>(`/questions/${code}/hints?count=${count}`),
      staleTime: Infinity,
    }),
  solution: (code: string) =>
    queryOptions({
      queryKey: [...questionQueries.all(), code, 'solution'],
      queryFn: () => api.get<SolutionDto>(`/questions/${code}/solution`),
      staleTime: Infinity,
    }),
}

/** Önbellekteki soruyu tipini koruyarak günceller. */
export function updateQuestion(
  queryClient: QueryClient,
  code: string,
  update: (question: QuestionDto) => QuestionDto,
) {
  queryClient.setQueryData<QuestionDto>(questionQueries.detail(code).queryKey, (old) =>
    old ? update(old) : old,
  )
}

export const withProgress = <T extends QuestionDto>(
  question: T,
  progress: QuestionProgress,
): T => ({
  ...question,
  progress,
})

/** İlerleme değişince müfredat ağacındaki durum rozetleri tazelenir. */
function useInvalidateProgress() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: curriculumQueries.all() })
}

export function useAnswerQuiz(code: string) {
  const invalidate = useInvalidateProgress()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (selected: number[]) =>
      api.post<AnswerResultDto>(`/questions/${code}/answer`, { selected }),
    onSuccess: (result) => {
      updateQuestion(queryClient, code, (q) => withProgress(q, result.progress))
      return invalidate()
    },
  })
}

export function useRunQuestion(code: string) {
  const invalidate = useInvalidateProgress()
  return useMutation({
    mutationFn: () => api.post<RunResponseDto>(`/questions/${code}/run`),
    onSuccess: invalidate,
  })
}

export function useSaveFile(code: string) {
  return useMutation({
    mutationFn: (file: { name: string; content: string }) =>
      api.put<{ ok: true }>(`/questions/${code}/files`, file),
  })
}

export function useResetQuestion(code: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.post<{ files: CodeQuestionDto['files'] }>(`/questions/${code}/reset`),
    onSuccess: ({ files }) => {
      updateQuestion(queryClient, code, (q) =>
        q.type === 'code' ? { ...q, files, lastResult: undefined } : q,
      )
    },
  })
}

export function useMarkDone(code: string) {
  const invalidate = useInvalidateProgress()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (done: boolean) => api.post(`/questions/${code}/done`, { done }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: questionQueries.detail(code).queryKey })
      await invalidate()
    },
  })
}

export function fetchReviewPrompt(code: string) {
  return api.get<ReviewPromptDto>(`/questions/${code}/review-prompt`)
}
