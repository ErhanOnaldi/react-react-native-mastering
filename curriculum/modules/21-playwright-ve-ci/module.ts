import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Playwright, CI ve yayına alma',
  phase: 5,
  summary:
    'Sinema’nın kritik akışlarını gerçek tarayıcıda test et, her push’ta CI ile doğrula ve statik SPA’yı güvenli cache, hata izleme ve derin bağlantı desteğiyle yayına hazırla.',
  pain: `Cuma akşamı yayına aldın. Vitest paketindeki testlerin **hepsi yeşil**: \`LoginPage\` testi geçiyor, \`ProtectedRoute\` testi geçiyor, izleme listesi formunun testi geçiyor.

Pazartesi sabahı mesaj geliyor: “Giriş yap’a basıyorum, sayfa bomboş. Listeye film ekleyemiyorum.” Bir temizlik commit’i \`router.tsx\`’te \`login\` route’unu korumalı grubun **içine** taşımış. Giriş sayfası artık girişi olmayanı girişe yönlendiriyor — kendine.

Parçaların her biri tek başına doğru; bozuk olan, parçaların **birleştiği yer**. Hiçbir testin uygulamayı gerçek tarayıcıda baştan sona açıp “giriş yap → listeye ekle” yolunu yürümediği için kimse görmedi. Tarayıcı testini ve CI’ı kurduktan sonra başka bir sorun daha çıkıyor: \`/movie/550\` adresi sayfa yenilenince 404 oluyor. Build çıktısını ve host ayarlarını da yayının parçası olarak ele alacağız.`,
  outcomes: [
    'Kritik kullanıcı yolları için Playwright E2E testi ve uygun locator’lar yazabilirsin',
    'Ağ yanıtlarını ve oturumu yöneterek tekrarlanabilir tarayıcı testleri kurabilirsin',
    'Başarısız testi trace ile inceleyip CI’da lint, tip, Vitest ve E2E adımlarını çalıştırabilirsin',
    'Vite build çıktısını ve preview sunucusunu inceleyip ortam değişkenlerinin ne zaman çözüldüğünü açıklayabilirsin',
    'SPA fallback, cache ve güvenlik başlıklarıyla statik yayını yapılandırabilirsin',
    'Yakalanan ve yakalanmayan tarayıcı hatalarını sürüm bağlamıyla raporlayabilirsin',
  ],
})
