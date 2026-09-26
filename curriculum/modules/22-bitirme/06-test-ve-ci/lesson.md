---
title: "Test stratejisi ve CI: güveni otomatikleştir"
minutes: 9
kind: project
---

# Test stratejisi ve CI: güveni otomatikleştir

:::pain[Problem]
Sinema'da birim testleri yeşilken “giriş yap → izleme listesine ekle” akışının router yüzünden kırıldığını 21. modülde gördün. Kitaplık'ta benzer bir boşluk var: arama şeması doğru, form şeması doğru, fakat kullanıcı Dune'u ekledikten sonra sayfayı yenileyince liste boşalıyor. Tek dosya testleri bu yolu görmez.

Bir başka geliştirici yarın arama ekranını düzenlediğinde bu hatanın yeniden gelmesini nasıl önleyeceksin? El ile her seferinde tüm yolları gezmek sürdürülemez.
:::

Bu derste önce **hangi riski hangi test katmanının yakaladığını** yaz, sonra testleri ve CI hattını kur. `REQUIREMENTS.md` içindeki K-n kriterleri test adlarına dönüşsün.

## Riskten teste

| Risk | En uygun ilk test | Neden? |
| --- | --- | --- |
| `description` iki biçimde, `covers: [-1]` | Saf şema/fonksiyon testi | DOM olmadan birçok kenar durumu hızlı denenir. |
| “Okudum” seçilince puan hatası | RTL + user-event | Gerçek alan etkileşimi ve görünür hata kontrol edilir. |
| Eser 500, “Tekrar dene” | RTL + MSW `server.use` | Ağ cevabı yalnız bu testte değiştirilir; UI'ın tepkisi görülür. |
| Arama → detay → liste → yenileme | Playwright | Router, tarayıcı depolaması ve sayfalar arası akış birlikte sınanır. |

Aynı senaryoyu üç katmana kopyalama. Her katman başka bir soruya cevap versin: dönüşüm doğru mu, kullanıcı ne görüyor, gerçek tarayıcıda akış tamamlanıyor mu?

## MSW: hatayı bilinçli üret

Vitest ortamında testler gerçek Open Library'ye çıkmamalı. `setup.ts` içinde MSW sunucusunu başlat, tanımsız isteği hata say, test sonunda handler'ları ve DOM'u temizle. Normal handler'lar arama, eser ve yazar adreslerini taklit etsin. Bir testte 500 gerektiğinde `server.use(http.get(...))` ile yalnız o testin cevabını değiştir.

Bu, Sinema'da TMDB için kullandığın tekniğin yeni bağlamı. Yeni kıvrım: API anahtarı yok, eser ve yazar iki ayrı kaynaktan geliyor; 404'ün biri sayfayı bitirir, diğeri bitirmez.

## E2E: ağ da testin kontrolünde olsun

Playwright'ta `page.route` ile Open Library cevaplarını sabitle. Böylece test, gönüllülerin işlettiği servisin o anki hızına veya verisinin değişmesine bağlı olmaz. `getByRole` ve `getByLabel` gibi erişilebilir locator'lar kullan; sabit süreli `waitForTimeout` yerine görünür sonuç bekle.

İki küçük senaryo yeterli bir başlangıçtır: ana sayfa açılır; arama → detay → listeye ekleme → yenileme akışı tamamlanır. Başarısız E2E'de trace/rapor saklamak, CI'da hatayı tekrar üretmeyi kolaylaştırır.

## CI: kendi bilgisayarının dışındaki kanıt

`pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm build` ve `pnpm test:e2e` kendi bilgisayarında yeşil olabilir. Başka bir makinede Node sürümü, eksik tarayıcı veya kurulmamış bağımlılık yüzünden kırılabilir. GitHub Actions workflow'u her `push` ve `pull_request` için aynı komutları **temiz ortamda** çalıştırır.

Sırayı basit tut: checkout → pnpm/Node → install → kalite komutları → Playwright Chromium kurulumu → E2E. Playwright başarısız olduğunda raporu artifact olarak saklayabilirsin. Workflow'un kendisi de projedeki bir dosyadır; gözden geçirilmeli ve sürümlenmelidir.

:::sector[Sektörde]
CI'ın yeşil olması “hata yok” kanıtı değil; tanımladığın risklerin kontrol edildiğinin kanıtı. Test stratejisi ADR'ne kapsam dışında bıraktığın riskleri de yaz. Örneğin gerçek Open Library'nin erişilebilirliği ve cihazlar arası liste senkronu bu yerel uygulamanın testleriyle garanti edilemez.
:::

Şimdi **Test ve CI** görevini yap. Son adımda bir testi yerelde bilerek kır, beklediğin nedenle kırmızı olduğunu gör ve düzelt. CI aynı komutları temiz ortamda tekrar çalıştıracak.
