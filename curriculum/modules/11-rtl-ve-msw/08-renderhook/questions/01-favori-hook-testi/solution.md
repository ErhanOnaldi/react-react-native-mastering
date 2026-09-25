## Neden böyle?
`renderHook` hook’u React yaşam döngüsünde çalıştırır. `act`, state güncellemesinin assertion’dan önce tamamlanmasını sağlar. Bu, 10. modüldeki debounce testinden farklıdır: burada timer değil immutable Set benzeri üyelik davranışı sınanır.
