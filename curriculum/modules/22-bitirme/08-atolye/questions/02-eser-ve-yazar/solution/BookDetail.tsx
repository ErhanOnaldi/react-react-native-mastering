import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

interface Work {
  title: string
  authors?: { author: { key: string } }[]
  covers?: number[]
}

interface Author {
  name: string
}

async function fetchWork(workId: string): Promise<Work> {
  const response = await fetch(`https://openlibrary.org/works/${workId}`)
  if (!response.ok) throw new Error('Eser yüklenemedi')
  return response.json()
}

async function fetchAuthor(authorKey: string): Promise<Author | null> {
  const response = await fetch(`https://openlibrary.org${authorKey}`)
  if (response.status === 404) return null
  if (!response.ok) throw new Error('Yazar yüklenemedi')
  return response.json()
}

export function BookDetail() {
  const { workId = '' } = useParams()

  const work = useQuery({
    queryKey: ['work', workId],
    queryFn: () => fetchWork(workId),
  })

  const authorKey = work.data?.authors?.[0]?.author.key

  // Fix: bu sorgunun kimliği artık esere (workId) bağlı; eser değişince önbellek
  // eskisini döndürmek yerine yeni yazar/kapak için yeniden çalışır.
  const details = useQuery({
    queryKey: ['book-detail-extra', workId],
    queryFn: async () => ({
      author: authorKey ? await fetchAuthor(authorKey) : null,
      cover: work.data?.covers?.[0] ?? null,
    }),
    enabled: Boolean(work.data),
  })

  return (
    <section>
      {work.isPending && <p>Yükleniyor</p>}
      {work.isError && <p role="alert">Eser yüklenemedi</p>}
      {work.isSuccess && (
        <>
          <h2>{work.data.title}</h2>
          <p>Yazar: {details.data?.author ? details.data.author.name : 'Yazar bulunamadı'}</p>
          <p>Kapak kodu: {details.data?.cover ?? 'yok'}</p>
        </>
      )}
    </section>
  )
}
