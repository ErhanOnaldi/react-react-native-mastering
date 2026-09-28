Sinema'nın farklı ekranları aynı adrese istek atarken başarı verisini ve HTTP hatasını aynı biçimde ele almalı. JSON cevaplarını okuyan küçük bir istemci yaz.

## Gereksinimler

- 2xx cevapta JSON gövdesini bir kez okuyup verilen türde döndür.
- 204 cevapta gövde okumadan `null` döndür.
- 4xx/5xx cevapta durum kodunu taşıyan `HttpError` fırlat. Hata gövdesinin geçerli JSON olmasına güvenme.
- Verilen `init` seçeneklerini isteğe ilet; ağ hatasını değiştirmeden aktar.

## Örnek

| Cevap | Sonuç |
| --- | --- |
| 200 ve `{ "title": "Matrix" }` | `{ title: "Matrix" }` |
| 204 | `null` |
| 404 | `HttpError`, `status: 404` |

## Sözleşme

- `fetchJson.ts` → `HttpError` sınıfı; `status: number` alanı bulunur.
- `fetchJson.ts` → `fetchJson<T>(url: string, init?: RequestInit): Promise<T | null>`.
