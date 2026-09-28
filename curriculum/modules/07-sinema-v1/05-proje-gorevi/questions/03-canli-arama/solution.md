## Neden böyle?

`q` URL'de kalır; bağlantıyı paylaşınca aynı arama yeniden kurulur. `useDebounce` her tuş için ağ isteğini azaltır, ama eski başarılı cevabı cache'lemez. Yeni sorguda `page` silinmezse önceki aramanın 5. sayfası boş gelebilir.

`useSearchParams` güncellemesinde `new URLSearchParams(current)` diğer filtreleri korur. `useEffect` cleanup'ı eski sorgu cevabının yenisinin üstüne yazılmasını önler; sonraki modüllerde veri araçları bu yaşam döngüsünü daha az elle yazdıracak.
