Detay sayfasında `/movie/550` → `/movie/603` gezinince eski film kısa süreliğine yeni başlık altında görünüyor. İsteği ve durum geçişini bir hook’a taşı.

## İstenen

`useMovieDetails(id, load)` şu union durumlarından birini döndürsün: `loading`, `success` (`movie` ile), `error` (`message` ile).

- `load(id, signal)` asenkron film yükleyicisidir; `id` değişince yeniden çağır.
- Yeni istek başlarken `loading` göster.
- Önceki isteği `AbortController` ile iptal et; geç gelen sonucu gösterme.
- Aktif isteğin hatasında `error` göster.

`load` parametresi ağ erişimini hook’tan ayırır; testte gecikmeyi kontrol edebiliriz.
