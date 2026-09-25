## Neden böyle?
`onRender` commit sonrasında çalışır. Bileşenin render fonksiyonuna sayaç state'i koymak sonsuz döngü yaratabilir. Burada sayaç Profiler dışında tutulur. `actualDuration` faydalı bir ipucudur ama otomatik testte sabit milisaniye sınırı kullanmak cihazlar arasında kırılgandır.

Sonraki derste commit'e hangi state güncellemesinin yol açtığını ayıracağız.
