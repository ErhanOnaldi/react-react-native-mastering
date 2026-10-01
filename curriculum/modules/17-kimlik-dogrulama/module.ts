import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Kimlik doğrulama ve güvenlik',
  phase: 5,
  summary:
    'JWT’yi tanı, Sinema’da girişten oturum saklamaya, korumalı sayfalara, yetkili isteklere, çıkışa ve token yenilemeye ilerle; ardından istemci güvenliği katmanlarını değerlendir.',
  pain: `:::pain[Sinema’da sorun]
İzleme listesini yalnız kendine ayırdığını sanıyorsun; URL’yi bilen herkes açabiliyor. Giriş yaptıktan sonra sayfayı yenileyince oturum düşüyor. Bir saat sonra access token süresi dolduğunda profil ve listeler sessizce 401 dönüyor. Üstelik bir yorum HTML olarak işlendiğinde beklenmeyen kod çalışabiliyor; giriş bağlantısındaki dönüş adresi de dış bir siteye çıkabiliyor. Oturum akışını kurup bu güvenlik sınırlarını denetleyeceğiz.
:::`,
  outcomes: [
    'JWT payload’ını çözümleyip exp zamanını yorumlayabilirsin',
    'RHF ve Zod ile giriş formu kurup API hatasını gösterebilirsin',
    'Token saklama seçeneklerinin XSS ve CSRF ödünleşimlerini açıklayabilirsin',
    'Bearer başlığıyla profil isteği atıp eşzamanlı 401 yanıtlarında tek refresh yapabilirsin',
    'Layout route ile özel sayfaları koruyup güvenli bir iç dönüş adresi seçebilirsin',
    'Çıkışta auth state, kalıcı oturum ve query cache’i temizleyebilirsin',
    'Güvenilmeyen metin, URL, CSP, çerez ve istemci kodunun güvenlik sınırlarını değerlendirebilirsin',
  ],
})
