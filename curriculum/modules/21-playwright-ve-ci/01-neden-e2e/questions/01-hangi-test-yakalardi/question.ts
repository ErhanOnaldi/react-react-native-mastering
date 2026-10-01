import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi test yakalardı?',
  difficulty: 'orta',
  concepts: ['test.e2e', 'test.what-to-test', 'test.custom-render', 'router.protected-routes'],
  mode: 'multiple',
  question: `Sinema’da giriş sayfası kendi başına doğru çalışıyor, korumalı sayfa da giriş yapmamış kişiyi girişe gönderiyor. Ancak bu parçalar gerçek uygulama akışında yanlış sırada bağlandığı için giriş formu hiç görünmüyor.

Aşağıdaki testlerden **hangileri** bu sorunu görebilir? (Birden fazla doğru var.)`,
  options: [
    {
      text: 'Gerçek uygulama adresini açıp boş oturumdan giriş formuna ulaşmayı deneyen tarayıcı testi',
      correct: true,
      explanation:
        'Bu test gerçek uygulamanın route bağlantılarını kullanır. Giriş sayfasına ulaşamıyorsa kullanıcı yolundaki sorun görünür olur.',
    },
    {
      text: 'Uygulamanın gerçek route listesini kurup korumalı sayfadan giriş ekranına giden yolu çalıştıran entegrasyon testi',
      correct: true,
      explanation:
        'Test gerçek route listesini kullandığı için parçaların yanlış bağlanmasını görebilir; tarayıcı açmak şart değildir.',
    },
    {
      text: 'Giriş formunu tek başına render edip alanlara yazılan değerleri kontrol eden bileşen testi',
      explanation:
        'Bu test formun kendi davranışını korur, fakat formu uygulamadaki hangi route’un açtığını kurmuyorsa bağlantı sorununu göremez.',
    },
    {
      text: 'Korumalı sayfanın giriş yapmamış kişiyi yönlendirdiğini tek başına kontrol eden test',
      explanation:
        'Yönlendirme kuralı tek başına doğru olabilir. Hatanın kaynağı, giriş route’unun bu kuralla nasıl birleştirildiğidir.',
    },
    {
      text: 'TypeScript derlemesinin başarılı olduğunu kontrol eden adım',
      explanation:
        'Route’lar tip olarak geçerli olsa bile hangi ekranın kullanıcıya açılacağını derleyici bilmez.',
    },
  ],
  explanation:
    'Birleşim hatasını gören test gerçek route bağlantılarını kurup kullanıcının yolunu yürütür. Bu kanıtı entegrasyon testi de tarayıcı testi de sağlayabilir.',
})
