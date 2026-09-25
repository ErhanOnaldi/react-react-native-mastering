`src/lib/remote-data.ts` oluştur ve aşağıdakileri **export** et:

```ts
export type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
```

Dört generic type guard yaz: `isIdle<T>(state: RemoteData<T>): state is { status: 'idle' }`, `isLoading<T>(...): state is { status: 'loading' }`, `isSuccess<T>(...): state is { status: 'success'; data: T }`, `isError<T>(...): state is { status: 'error'; error: string }`. Her biri yalnız kendi durumunda `true` dönsün. Başarıda `data`, hatada `error` güvenle okunabilsin; `idle` ve `loading` durumlarına eski data sızmasın. Bu dosya ağ isteği yapmaz; sonraki modüllerde `useFetch` ve koşullu render bu tipi kullanacak.
