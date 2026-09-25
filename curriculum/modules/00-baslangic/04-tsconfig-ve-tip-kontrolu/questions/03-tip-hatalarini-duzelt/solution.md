Üç hata, üç farklı ders:

1. **`import type`** — `Movie` sadece bir tip. `verbatimModuleSyntax` bunu açıkça söylememizi ister ki Vite satırı güvenle silebilsin.
2. **Tipsiz parametre** (`score`) — `strict` modda parametreler örtük (implicit) `any` olamaz. `any`, TypeScript'in seni korumayı bıraktığı yerdir.
3. **`'movie' is possibly 'undefined'`** — `find` bir şey bulamayabilir; dönüş tipi `Movie | undefined`'dır. Testler hep var olan id'lerle çağırdığı için yeşildi, ama gerçek kullanıcı olmayan bir id'ye tıkladığı gün uygulama `Cannot read properties of undefined` ile çökerdi. `movie?.title ?? 'Bilinmeyen film'` bu durumu açıkça ele alır.

Testler en başta da geçiyordu: **testler denediğin durumları**, **tipler tüm olası durumları** korur. İkisine birden ihtiyacın var.
