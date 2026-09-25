## Neden böyle?

`fetch` yalnız ağ hatasında reject olur; 404 için `ok` kontrolü şart. `ApiError` HTTP ve TMDB kodunu ayırır: kullanıcıya mesaj, izleme sistemine durum kodu verilebilir. Generic `T`, çağıranın beklediği türü derleyicide taşır; gelen JSON’u doğrulamaz. Modül 15’te Zod ile çalışma zamanı doğrulaması eklenir. Buradaki token yerel eğitim uygulamasının Vite env değeridir; üretimde proxy düşünülebilir.
