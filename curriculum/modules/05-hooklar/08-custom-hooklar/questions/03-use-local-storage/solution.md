İlk okumayı lazy initializer’a koymak her render’da storage okumayı önler. Bu egzersiz basit setter imzasını kullanır; projede istersen React `SetStateAction<T>` biçimini destekle. Storage erişiminin tarayıcı dışı ortamda farklı olduğunu ileride mimari bölümünde ele alacağız.

## Alternatif ve tuzak

Saklı JSON bozuk olabilir; doğrudan `JSON.parse` render’ı çökertir. Updater fonksiyonu iki hızlı favori tıklamasında eski snapshot’a takılmayı önler.

## Sektörde ve sonra

Context provider favori listesini bu hook ile kalıcı tutacak.
