## Neden böyle?

Dosyanın yeri kullanımından çıkar. `users.length` yerine benzersiz kullanıcı saymak gerekir; aynı feature iki yerden import edebilir. `shared/` için ikinci gerçek kullanım beklemek gereksiz soyutlamayı azaltır. Gerçek projede sınır her zaman bu kadar mekanik değildir; bağımlılık yönüne de bak. Sonraki görevde `shared/api` ile `features/movies/api` ayrımını kullanacaksın.
