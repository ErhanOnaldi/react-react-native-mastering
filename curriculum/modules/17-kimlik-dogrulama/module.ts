import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Kimlik doğrulama ve güvenlik',
  phase: 5,
  summary:
    'Sinema’da oturum akışını kur; kullanıcı girdisini, dönüş adreslerini, çerezleri ve istemciye yayımlanan kodu güvenlik sınırlarıyla değerlendir.',
  pain: `:::pain[Sinema’da sorun]
İzleme listesini yalnız kendine ayırdığını sanıyorsun; URL’yi bilen herkes açabiliyor. Giriş yaptıktan sonra sayfayı yenileyince oturum düşüyor. Bir saat sonra access token süresi dolduğunda profil ve listeler sessizce 401 dönüyor. Üstelik bir yorum HTML olarak işlendiğinde beklenmeyen kod çalışabiliyor; giriş bağlantısındaki dönüş adresi de dış bir siteye çıkabiliyor. Oturum akışını kurup bu güvenlik sınırlarını denetleyeceğiz.
:::`,
  outcomes: [
    'JWT payload’ını çözümleyip exp zamanını yorumlayabilirsin',
    'RHF ve Zod ile giriş formu kurup API hatasını gösterebilirsin',
    'Token saklama seçeneklerinin XSS ve CSRF ödünleşimlerini açıklayabilirsin',
    'Bearer başlığıyla /auth/me isteği atabilirsin',
    'Eşzamanlı 401 yanıtlarında tek refresh yapıp isteği tekrarlayabilirsin',
    'Layout route ile özel sayfaları koruyabilirsin',
    'Çıkışta auth state ve query cache’i temizleyebilirsin',
    'Güvenilmeyen metni ve URL’yi güvenli çıkış noktalarında gösterebilirsin',
    'CSP, çerez ve CSRF savunmalarının görevlerini açıklayabilirsin',
    'İstemci bundle’ındaki sır riskini ve bağımlılık zincirindeki önlemleri değerlendirebilirsin',
  ],
})
