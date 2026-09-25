import { describe, expect, it, vi } from 'vitest'
import { makeClient } from '@exercise/makeClient'
it('başarısız mutation için genel bildirimi bir kez yollar', async () => {
  const notify = vi.fn()
  const client = makeClient(notify)
  await expect(
    client
      .getMutationCache()
      .build(client, {
        mutationFn: async () => {
          throw new Error('500')
        },
      })
      .execute(undefined),
  ).rejects.toThrow('500')
  expect(notify).toHaveBeenCalledWith('İşlem kaydedilemedi')
  expect(notify).toHaveBeenCalledTimes(1)
})
