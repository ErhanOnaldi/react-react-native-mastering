Favori film kartlarının bulunduğu bir panelde, ilgisiz bir sayaç butonu güncellendiğinde tüm kartların yeniden render edilmesini engellemek ve seçilen favoriyi göstermek istiyorsun.

## Gereksinimler
- Her film başlığı için tıklanabilir bir kart düğmesi göster. Bir karta tıklandığında seçilen başlığı "Favori: {başlık}" olarak göster.
- Kartların render edilmesini izleyen `onCardRender` callback'i, yalnızca ilgili kart gerçekten render edildiğinde çağrılmalıdır.
- "Sayaç {count}" düğmesine tıklandığında sayaç artmalı; ancak bu artış kartların render sayısını (`onCardRender` çağrı sayısını) artırmamalıdır.
- Kartlara iletilen tıklama fonksiyonu referansı kararlı kalmalıdır; böylece ebeveyn render olduğunda kartların props eşitliği bozulmamalıdır.

## Örnek
Sayaç butonuna 5 kez basıldığında sayaç 5 olur; ancak kartlar bu süre boyunca sıfır kez yeniden render edilir.

## Sözleşme
- Dosya ve export: `FavoriteCards.tsx` → `FavoriteCards({ titles, onCardRender }: { titles: string[], onCardRender: (title: string) => void })`
- Arayüz: "Sayaç {count}" adlı buton, "Favori: {seçilen}" metni, kart butonları (`screen.getByRole('button', { name: title })`).
