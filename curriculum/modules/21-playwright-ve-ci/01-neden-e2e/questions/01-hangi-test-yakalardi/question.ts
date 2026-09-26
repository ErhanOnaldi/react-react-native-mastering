import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi test yakalardı?',
  difficulty: 'orta',
  concepts: ['test.e2e', 'test.what-to-test', 'test.custom-render', 'router.protected-routes'],
  mode: 'multiple',
  question: `Dersteki hata: \`login\` route’u \`routes\` dizisinde korumalı grubun içine taşındı; giriş sayfası kendi kendine yönleniyor ve form hiç görünmüyor.

Aşağıdaki testlerden **hangileri** bu hatada kırmızıya döner? (Birden fazla doğru var.)`,
  options: [
    {
      text: "`LoginPage`’i `createMemoryRouter([{ path: '/login', element: <LoginPage /> }])` ile render edip formu dolduran test",
      explanation:
        'Yeşil kalır. Bu test kendi mini router’ını kurar; gerçek `routes` dizisini hiç görmez. Bileşen doğru olduğu için form render edilir. İzole test, bileşenin **kendisini** korur, bağlandığı yeri değil.',
    },
    {
      text: '`<ProtectedRoute isAuthenticated={false} />`’in `/login`’e yönlendirdiğini doğrulayan test',
      explanation:
        'Yeşil kalır. Kapı gerçekten doğru çalışıyor: girişi olmayanı `/login`’e yolluyor. Sorun kapının kendisi değil, `/login`’in yanlışlıkla kapının **arkasına** konması.',
    },
    {
      text: "Gerçek `routes` dizisini `createMemoryRouter(routes, { initialEntries: ['/watchlists'] })` ile render edip girişten liste eklemeye kadar yürüyen entegrasyon testi",
      correct: true,
      explanation:
        'Kırmızı olur. Bu test hatanın yaşadığı yeri, yani gerçek `routes` dizisini kullanır ve akışı baştan sona yürür: `/login`’e yönlenir, form bulunamaz. Ders bunu dürüstçe söylüyor: eksik olan araç değil, **senaryoydu**.',
    },
    {
      text: 'Playwright ile `/watchlists`’i açıp giriş yapan ve liste ekleyen E2E testi',
      correct: true,
      explanation:
        "Kırmızı olur. Uygulama gerçek `main.tsx`, gerçek router ve gerçek tarayıcıyla açılır; `getByLabel('Kullanıcı adı')` hiçbir şey bulamaz ve test zaman aşımıyla kalır. Üstelik provider sırası, lazy chunk’lar gibi entegrasyon testinin taklit ettiği parçaları da kapsar.",
    },
    {
      text: '`tsc -b` (tip kontrolü)',
      explanation:
        'Geçer. Route nesnesi tip olarak kusursuz: `path` bir string, `lazy` doğru imzada. Tip sistemi “bu route hangi grupta olmalı?” gibi bir **davranış** kuralını bilemez.',
    },
  ],
  explanation:
    'Hatayı yakalayan testlerin ortak noktası: parçaları **birleştiği yerde** çalıştırıp kullanıcının yolunu baştan sona yürümeleri. E2E, bunu uygulamanın gerçekten çalıştığı ortamda yapar.',
})
