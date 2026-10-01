## Neden böyle?

Fake timer’lar süreyi gerçek bekleme olmadan yönetir. 499 ms kontrolü callback’in erken çalışmadığını; bir sonraki 1 ms’lik ilerleme ise tam 500 ms’de çalıştığını doğrular. `afterEach` temizliği, sanal saatin başka testlere sızmasını engeller.
