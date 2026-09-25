## Neden böyle?

Bu test tek davranış akışında önceki basamakları birleştirir: `vi.fn` sınırı kontrol eder, `URL` parametreleri davranışı okur, `toMatchObject` sonucu gereksiz alanlara bağlamaz. Boş sorgu testi hem gereksiz ağı önler hem de çağrı sayısını anlamlı kılar. Sonraki modülde aynı akışı kullanıcı etkileşimi ve MSW üzerinden test edeceksin.
