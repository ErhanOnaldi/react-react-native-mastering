import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Playwright ve CI',
  phase: 5,
  summary:
    'Sinema’yı gerçek bir tarayıcıda, kullanıcı gibi uçtan uca test et; ağı page.route ile taklit et, oturumu storageState ile taşı ve her push’ta GitHub Actions’ta çalıştır.',
  pain: `Cuma akşamı yayına aldın. Vitest paketindeki testlerin **hepsi yeşil**: \`LoginPage\` testi geçiyor, \`ProtectedRoute\` testi geçiyor, izleme listesi formunun testi geçiyor.

Pazartesi sabahı mesaj geliyor: “Giriş yap’a basıyorum, sayfa bomboş. Listeye film ekleyemiyorum.” Bir temizlik commit’i \`router.tsx\`’te \`login\` route’unu korumalı grubun **içine** taşımış. Giriş sayfası artık girişi olmayanı girişe yönlendiriyor — kendine.

Parçaların her biri tek başına doğru; bozuk olan, parçaların **birleştiği yer**. Hiçbir testin uygulamayı gerçek tarayıcıda baştan sona açıp “giriş yap → listeye ekle” yolunu yürümediği için kimse görmedi. Bu modülde o yolu Playwright ile yürüyecek ve her push’ta otomatik çalıştıracağız.`,
  outcomes: [
    'Hangi davranışın E2E, hangisinin birim ya da entegrasyon testiyle korunacağına gerekçeli karar verebilirsin',
    'playwright.config’i webServer, baseURL ve sahte env ile kurup ilk E2E testini çalıştırabilirsin',
    'Rol tabanlı locator’lar ve web-first assertion’larla beklemesiz, kırılmaz testler yazabilirsin',
    'Tekrarlanan adımları page object ve fixture’larla toplayabilirsin',
    'page.route ile TMDB ve DummyJSON’u taklit edip hata senaryolarını tarayıcıda deneyebilirsin',
    'storageState ile oturumu testler arasında taşıyabilir, kalan testi trace viewer ile inceleyebilirsin',
    'Lint, tip kontrolü, Vitest ve Playwright’ı GitHub Actions’ta çalıştıran bir workflow yazabilirsin',
  ],
})
