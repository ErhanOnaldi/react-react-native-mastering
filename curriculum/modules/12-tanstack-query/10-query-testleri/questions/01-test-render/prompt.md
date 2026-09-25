Paylaşılan QueryClient yüzünden bir testin cache’i ötekine sızıyor. Test yardımcısını izole et.

## İstenen

`renderWithQuery(ui)` her çağrıda **yeni** `QueryClient` oluştursun; `defaultOptions.queries.retry` false olsun. UI’yi `QueryClientProvider` ile render et ve `{ client, ...render sonucu }` döndür. Böylece hata testinde üç otomatik tekrar istek sayısını bozmaz.
