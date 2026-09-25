# Koşullu Hook’u düzelt

Seçili film yoksa `MovieNotice` erken döner. Şu anda `useEffect` bu dönüşün altında; bazı render’larda çalışıyor, bazılarında çalışmıyor.

- `useEffect` her render’da aynı sırada çağrılsın.
- `id` yoksa `Film seç` mesajı kalsın.
- `id` varsa `document.title` ve `Film {id}` kalsın.
- `react-hooks/rules-of-hooks` hatası **0** olsun.

Düzenlediğin `hookSource` gerçek TSX kaynak metni olarak lint edilir.
