## Neden böyle?

`vi.fn` ağ cevabını belirler ve çağrı argümanlarını kaydeder. `new URL` parametre sırasına bağımlı olmaz; `new Headers` büyük/küçük harf farkını normalize eder. `vi.mock` burada gereksiz geniş bir modül taklidi olurdu. Vitest 5’in `clearMocks: true` varsayılanı çağrı geçmişini temizler; `vi.unstubAllGlobals()` ise değiştirdiğin global fetch’i geri yükler. Sonraki modülde MSW ile isteği HTTP seviyesinde sınayacaksın.
