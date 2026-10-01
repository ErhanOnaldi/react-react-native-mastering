Kullanıcı oturumu sonlandırıldığında kişisel verilerin ekranda veya bellekte kalmaması, sonraki oturum açılışlarında önceki kullanıcıya ait bilgilerin sızmaması için çok katmanlı bir çıkış temizliği fonksiyonu oluştur.

## Gereksinimler

- İstemci depolama alanındaki oturum kaydı (`'sinema-auth'`) silinmeye çalışılmalıdır. Depolama hata verse bile diğer temizlik adımları tamamlanmalıdır.
- Kullanıcıya ve kimlik durumuna ait global durum sıfırlama eylemi tam bir kez tetiklenmelidir.
- Önbellekteki tüm sorgu ve mutasyon verileri tamamen temizlenmeli, eski kullanıcıya ait hiçbir profil veya liste verisi bellekte bırakılmamalıdır.

## Örnek

| Eylem | Beklenen Sonuç |
| --- | --- |
| `logout({ queryClient, storage, resetStore })` | Depodaki `'sinema-auth'` anahtarı silinir. |
| Depo silme işlemi hata verir | Store sıfırlanır ve query cache temizlenir. |
| Store durumu | `resetStore` bir kez çağrılarak başlangıç durumuna döner. |
| Önbellekteki `['profile']` sorgusu | Çıkış sonrasında `undefined` değerine döner, tamamen silinir. |

## Sözleşme

- `logout.ts` dosyasından `logout(deps: LogoutDeps): void` fonksiyonunu named export et.
- Sözleşme tipleri:
  - `LogoutDeps`: `{ queryClient: QueryClient; storage: { removeItem: (key: string) => void }; resetStore: () => void }`
