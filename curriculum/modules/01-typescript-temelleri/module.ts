import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'TypeScript temelleri',
  phase: 1,
  summary:
    'TMDB verisindeki boş tarih, null poster ve yazım hatalarını tiplerle görünür kılıp güvenli biçimlendirme yardımcıları yazıyoruz.',
  pain: `:::pain[Sinema'da sessiz hata]
Trend listesindeki bir filmin \`release_date\` alanı boş. \`relese_date\` yazım hatası JavaScript'te sessizce \`undefined\` döner; \`poster_path\` null geldiğinde \`.startsWith()\` sayfayı çökertir. Bunu testte görecek, sonra TypeScript ile olası durumları kodun içinde görünür kılacaksın.
:::`,
  outcomes: [
    'İlkel tipleri ve tip çıkarımını doğru yerde kullanabilirsin',
    'TMDB liste verisini nesne ve dizi tipleriyle modelleyebilirsin',
    'Union ve narrowing ile null poster ve boş tarihi güvenle işleyebilirsin',
    'Fonksiyonların parametre ve dönüş tiplerini yazabilirsin',
    'unknown veriyi kontrol edip any ve as kullanımının sınırlarını açıklayabilirsin',
    'Sinema projesine Movie, MovieListResponse ve biçimlendirme yardımcılarını ekleyebilirsin',
  ],
})
