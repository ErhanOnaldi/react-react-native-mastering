import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Playwright, CI ve yayına alma',
  phase: 5,
  summary:
    'Önce erişilebilir locator ve bekleyen assertion’larla tarayıcı adımlarını yaz, sonra Playwright config’iyle Sinema’nın kritik akışlarını çalıştır. CI, build ve host ayarlarıyla uygulamayı yayına hazırla.',
  pain: `Cuma akşamı yayına aldın. Vitest paketindeki testlerin **hepsi yeşil**: \`LoginPage\` testi geçiyor, \`ProtectedRoute\` testi geçiyor, izleme listesi formunun testi geçiyor.

Pazartesi sabahı mesaj geliyor: “Giriş yap’a basıyorum, sayfa bomboş. Listeye film ekleyemiyorum.” Bir temizlik commit’i \`router.tsx\`’te \`login\` route’unu korumalı grubun **içine** taşımış. Giriş sayfası artık girişi olmayanı girişe yönlendiriyor — kendine.

Parçaların her biri tek başına doğru; bozuk olan, parçaların **birleştiği yer**. Hiçbir testin uygulamayı gerçek tarayıcıda baştan sona açıp “giriş yap → listeye ekle” yolunu yürümediği için kimse görmedi. Tarayıcı testini ve CI’ı kurduktan sonra başka bir sorun daha çıkıyor: \`/movie/550\` adresi sayfa yenilenince 404 oluyor. Build çıktısını ve host ayarlarını da yayının parçası olarak ele alacağız.`,
  outcomes: [
    'Kullanıcıya görünen roller ve adlarla locator, web-first assertion ve kritik kullanıcı akışları yazabilirsin',
    'Playwright config, ağ yanıtı ve oturum ayarlarıyla tekrarlanabilir tarayıcı testleri kurabilirsin',
    'Başarısız testi trace ile inceleyip CI’da lint, tip, Vitest ve E2E adımlarını çalıştırabilirsin',
    'Vite build çıktısını ve preview sunucusunu inceleyip ortam değişkenlerinin ne zaman çözüldüğünü açıklayabilirsin',
    'SPA fallback, cache ve güvenlik başlıklarıyla statik yayını yapılandırabilirsin',
    'Yakalanan ve yakalanmayan tarayıcı hatalarını sürüm bağlamıyla raporlayabilirsin',
  ],
})
