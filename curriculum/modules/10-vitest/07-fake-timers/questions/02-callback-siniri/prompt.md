Sinema’da bir işlemden sonra verilen geri bildirim 500 ms gecikmeyle çalışmalı. `schedule` fonksiyonu callback’i belirtilen süreden sonra çağırıyor; bu sınırı gerçek zamanda beklemeden test et.

## Gereksinimler

- Callback 499 ms ilerledikten sonra çağrılmamış olmalı.
- Toplam 500 ms ilerledikten sonra callback bir kez çağrılmış olmalı.
- Test sonunda gerçek saat geri yüklenmeli.

## Örnek

Zaman çizelgesi: 0 ms → 499 ms (çalışmadı) → 500 ms (çalıştı).

## Sözleşme

- Yazılacak dosya: `schedule.test.ts`
- Test edilecek modül: `@impl/schedule`
- Export: `schedule(callback: () => void, delay: number): ReturnType<typeof setTimeout>`
