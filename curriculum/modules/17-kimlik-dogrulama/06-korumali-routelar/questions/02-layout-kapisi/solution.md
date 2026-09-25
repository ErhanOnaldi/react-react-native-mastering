## Neden böyle?

`Outlet` parent route’a bağlı çocukları gösterir; böylece iki özel sayfada aynı koşulu kopyalamazsın. `replace`, başarısız özel URL’nin history’ye eklenip geri butonuyla döngü yaratmasını engeller. `state.from` girişten sonra niyet edilen sayfaya dönmeyi sağlar.

Alternatif olarak loader içinde `redirect` kullanılabilir; özellikle sunucuda oturum kontrolü yapılabiliyorsa uygundur. Bu örnekte client store’daki auth durumunu bileşenle okuyoruz. Sonraki modülde route lazy yüklemelerini görsen de kapı aynı parent yapıda kalır.
