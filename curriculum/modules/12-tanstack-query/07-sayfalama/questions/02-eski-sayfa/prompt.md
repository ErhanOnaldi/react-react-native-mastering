`?page=2` gelince eski liste bir anda kayboluyor. Yeni cevap gelene dek sayfa 1’i göster.

## İstenen

`MoviePages({ page })` `/movie/popular?page=...` için `useQuery` kullansın. Key’e page girsin. `placeholderData: keepPreviousData` ile geçişte eski liste kalsın ve `isPlaceholderData` sırasında `Yeni sayfa yükleniyor` görünsün. `data.page` değeri ve film başlıklarını göster; Bearer ve `language=tr-TR` unutma.
