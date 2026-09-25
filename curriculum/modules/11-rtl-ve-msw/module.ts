import { defineModule } from '@rm/content/define'
export default defineModule({
  title: 'React Testing Library + MSW',
  phase: 3,
  summary:
    'Bileşenleri kullanıcı gibi sınar, API cevaplarını MSW ile yönetir ve Sinema sayfalarına test yazarsın.',
  pain: 'Sinema arama testinde fetch için elle mock kurdun. Her test 20 satır hazırlık istiyor; istek sırası değişince yanlış cevap dönüyor. Kullanıcıysa yalnızca sonucun ekrana gelip gelmediğini görüyor.',
  outcomes: [
    'Bileşenleri erişilebilir rol ve adlarla sorgulayabilirsin',
    'Tıklama ve yazmayı user-event ile sınayabilirsin',
    'Yüklenme, boş sonuç ve hata durumlarını test edebilirsin',
    'MSW handler’larıyla API senaryolarını değiştirebilirsin',
    'Router kullanan bileşenlere render helper yazabilirsin',
    'Sinema arama ve detay sayfalarına bileşen testi kurabilirsin',
  ],
})
