## Neden böyle?

Bu görevde kutu yalnızca girdi arayüzüdür. Üst bileşen değer sahibi olduğu için props değiştiğinde input da güncellenir. Yerel kopya state, listeyle kutuyu senkron tutma yükü yaratır. Önceki event görevindeki tipli handler burada daha kısa inline biçimde yazılabilir; TypeScript tipi JSX bağlamından çıkarır.
