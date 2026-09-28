# Ortak zihinsel model diyagramları

Her satır: `diagram:<ad>` — ne gösterir — ilk kurulduğu ders.

- `diagram:ts-derleme-ve-calisma` — TypeScript tiplerinin derleme anında kalıp çalışma zamanında dış verinin ayrıca doğrulanması gerektiğini gösterir — 1.1
- `diagram:ts-narrowing-akisi` — kontrol akışının union tipi dallar içinde daraltmasını gösterir — 1.6
- `diagram:render-commit` — tetikleme, saf render, commit ve effect sırasını gösterir — 3.1
- `diagram:state-snapshot` — bir render'ın state fotoğrafını ve updater kuyruğunun farkını gösterir — 3.3
- `diagram:agac-ve-kimlik` — state'in ağaçtaki konum ve `key` ile korunmasını ya da sıfırlanmasını gösterir — 3.6
- `diagram:veri-akisi` — props'un aşağı, olayların yukarı aktığı ortak ebeveyn modelini gösterir — 3.8
- `diagram:test-anatomisi` — hazırla, çalıştır, doğrula düzenini ve mutant yakalamayı gösterir — 0.7
- `diagram:effect-yasam-dongusu` — setup, dependency değişiminde cleanup/setup ve unmount cleanup sırasını gösterir — 5.2
- `diagram:closure-bayat-deger` — callback'in oluştuğu render'ın değerlerini yakalayıp bayat okuyabilmesini gösterir — 5.3
- `diagram:yaris-kosulu` — yavaş eski cevabın hızlı yeni cevabı ezme riskini ve cleanup/abort çözümünü gösterir — 5.4
- `diagram:context-yayilimi` — Provider değeri değişince context tüketicilerinin render olmasını gösterir — 5.9
- `diagram:url-state` — URL'nin paylaşılabilir state kaynağı oluşunu ve nested route/Outlet ilişkisini gösterir — 6.3
- `diagram:http-istek-cevap` — HTTP istek/cevap parçalarını ve `fetch`'in 4xx/5xx'te resolve olmasını gösterir — 7.1
- `diagram:cors-preflight` — tarayıcı preflight OPTIONS isteği, izin başlıkları ve asıl istek sırasını gösterir — 7.2
- `diagram:http-onbellek-karari` — HTTP cache'in taze veri, ETag doğrulaması, 304 ve 200 karar akışını gösterir — 7.3
- `diagram:state-kategorileri` — server, client, URL ve form state sahiplerini ve tipik araçlarını gösterir — 9.1
- `diagram:test-katmanlari` — birim, entegrasyon ve uçtan uca test katmanlarını gösterir — 10.1
- `diagram:msw-perdesi` — uygulama `fetch` çağrısının MSW tarafından yakalanıp handler cevabına dönmesini gösterir — 11.5
- `diagram:query-onbellek-yasam-dongusu` — TanStack Query cache'inin fetching, fresh, stale, inactive ve gc aşamalarını gösterir — 12.5
- `diagram:mutation-ve-invalidation` — mutation, optimistic update, sunucu cevabı, invalidation/refetch ve rollback akışını gösterir — 13.2
- `diagram:form-state` — RHF'de kayıtlı alanlar, form deposu, abonelik ve submit akışını gösterir — 14.2
- `diagram:zod-sinir` — `unknown` dış verinin `parse` ile tipli veriye ya da hataya ayrılmasını gösterir — 15.1
- `diagram:redux-veri-akisi` — dispatch, middleware, reducer, store, selector ve UI döngüsünü gösterir — 16.3
- `diagram:token-yenileme` — 401 sonrası tek refresh uçuşu ve bekleyen isteklerin bir kez retry edilmesini gösterir — 17.5
- `diagram:xss-akisi` — güvenilmeyen girdinin güvenli React text çıkışı veya tehlikeli sink üzerinden XSS riskine dönüşmesini gösterir — 17.8
- `diagram:render-nedenleri` — state, üst render, context ve key kaynaklı render tetiklerini ve memo sınırını gösterir — 18.2
- `diagram:web-vitals` — LCP, INP ve CLS'in sayfa zaman çizelgesindeki yerini gösterir — 18.9
- `diagram:build-ve-yayin` — kaynak, Vite build çıktısı, hash'li dosyalar, host/CDN cache politikası ve tarayıcı akışını gösterir — 21.9
