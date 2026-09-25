## Neden böyle?

`act` React state güncellemelerinin tamamlanmasını sağlar. İki değişim arasındaki 200 ms, cleanup hatasını görünür kılar; yalnızca tek değişimi bekleyen test bunu yakalayamaz. Fake timer’lar süreyi gerçek bekleme olmadan yönetir. Sonraki modülde kullanıcı etkileşimi eklendiğinde `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` gerekir.
