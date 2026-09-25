import { queryOptions } from '@tanstack/react-query'
import type { CurriculumDto, LessonDto, ModuleDto } from '@rm/server/dto'
import { api } from '@/lib/api'

export const curriculumQueries = {
  all: () => ['curriculum'] as const,
  tree: () =>
    queryOptions({
      queryKey: [...curriculumQueries.all(), 'tree'],
      queryFn: () => api.get<CurriculumDto>('/curriculum'),
    }),
  module: (code: string) =>
    queryOptions({
      queryKey: [...curriculumQueries.all(), 'module', code],
      queryFn: () => api.get<ModuleDto>(`/modules/${code}`),
    }),
  lesson: (code: string) =>
    queryOptions({
      queryKey: [...curriculumQueries.all(), 'lesson', code],
      queryFn: () => api.get<LessonDto>(`/lessons/${code}`),
    }),
}
