Sinema'da fragman dialogu, mobil filtre çekmecesi ve "Daha fazla" menüsü aynı aç/kapat kodunu tekrar ediyor. Görünüm üretmeyen, her yerde kullanılabilecek bir `useDisclosure` hook'u yaz.

## Gereksinimler
- `useDisclosure(initial = false)` → `{ isOpen, open, close, toggle }` döndürsün.
- Başlangıç değeri verilebilsin.
- `open` art arda çağrılsa da açık, `close` art arda çağrılsa da kapalı kalsın.
- `toggle` aynı olayda iki kez çağrılırsa durum **başa dönsün** (her çağrı en güncel değeri tersine çevirir).
- `open`, `close` ve `toggle` render'lar arasında **aynı fonksiyon** kalsın: bu fonksiyonlar başka bileşenlerin effect bağımlılıklarına girecek.

Hook DOM, rol ya da focus kararı vermez; onları kullanan bileşen seçer.
