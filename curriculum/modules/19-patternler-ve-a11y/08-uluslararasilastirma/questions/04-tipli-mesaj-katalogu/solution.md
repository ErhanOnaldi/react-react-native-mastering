## Neden böyle?

Mesaj anahtarları `keyof typeof messages.tr` ile katalogdan türetilir; `MessageParams<K>` de seçilen anahtarın formatter parametresini bulur. Böylece `movieCount` için ad, `welcome` için sayı göndermek derleme hatası olur.

İki dilin aynı anahtarları taşıması katalog şeklinden görünür. İngilizce çoğul, `Intl.PluralRules` ile seçilir; Türkçe iki sayıda da “film” der. Gerçek bir uygulamada dil seçimi Context ya da bir i18n kütüphanesiyle sağlanabilir; bu küçük katalog yalnızca tipli sınırı gösterir.
