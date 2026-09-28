import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Geri dönüşte kaç arama isteği?',
  difficulty: 'orta',
  concepts: ['react.useEffect.deps', 'router.navigation', 'fetch.basics'],
  question:
    'Production benzeri ortamda `StrictMode` çift effect çalıştırması yok. `/search?q=Matrix` açılıyor; sonuç geldikten sonra detaya gidip tarayıcının geri tuşuyla aramaya dönüyorsun. SearchPage her mount olduğunda `useEffect` ile arıyor, cache yok. `requests("/3/search/movie")` toplam kaç GET kaydeder?',
  options: [
    {
      text: '2',
      correct: true,
      explanation:
        'İlk açılışta bir, detaya gidip geri dönünce SearchPage yeniden mount olduğu için bir istek daha gider.',
    },
    {
      text: '1',
      explanation:
        'URL aynı olsa da Router önceki SearchPage bileşenini ve onun verisini cache’lemez; geri dönüş yeni mount ve yeni effect demektir.',
    },
    {
      text: '0',
      explanation:
        'Arama sonucu yerel statik diziden değil TMDB’den geliyor; ilk açılışta bile GET vardır.',
    },
    {
      text: 'Her render için bir tane, sayı sınırsız',
      explanation:
        'İstek render gövdesinde değil effect içindedir. Sabit sorguda her render yeni GET üretmez; yeniden mount üretir.',
    },
  ],
})
