import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Kimlik doğrulama',
  phase: 5,
  summary:
    'Sinema’ya giriş, yenilemeden sonra oturum, yetkili istek, refresh, korumalı sayfa ve güvenli çıkış akışı ekle.',
  pain: `:::pain[Sinema’da sorun]
İzleme listesini yalnız kendine ayırdığını sanıyorsun; URL’yi bilen herkes açabiliyor. Giriş yaptıktan sonra sayfayı yenileyince oturum düşüyor. Bir saat sonra access token süresi dolduğunda profil ve listeler sessizce 401 dönüyor. Bu üç görünür arızayı sırayla onaracağız.
:::`,
  outcomes: [
    'JWT payload’ını çözümleyip exp zamanını yorumlayabilirsin',
    'RHF ve Zod ile giriş formu kurup API hatasını gösterebilirsin',
    'Token saklama seçeneklerinin XSS ve CSRF ödünleşimlerini açıklayabilirsin',
    'Bearer başlığıyla /auth/me isteği atabilirsin',
    'Eşzamanlı 401 yanıtlarında tek refresh yapıp isteği tekrarlayabilirsin',
    'Layout route ile özel sayfaları koruyabilirsin',
    'Çıkışta auth state ve query cache’i temizleyebilirsin',
  ],
})
