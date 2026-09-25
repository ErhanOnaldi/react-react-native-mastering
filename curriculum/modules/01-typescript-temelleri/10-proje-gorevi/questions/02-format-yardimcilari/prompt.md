Sinema'nın kartı ve detay sayfası puanı/tarihi aynı biçimde göstermeli. `projects/sinema/src/lib/format.ts` dosyasını oluştur ve **üç named export** yaz:

| Fonksiyon | Girdi | Çıktı |
| --- | --- | --- |
| `formatVote(n: number): string` | `7.456`, `8`, `0` | `"7.5"`, `"8.0"`, `"Henüz oy yok"` |
| `releaseYear(date: string): string` | `"1999-10-15"`, `""` | `"1999"`, `""` |
| `formatDate(date: string): string` | `"1999-10-15"`, `""` | `"15 Ekim 1999"`, `"Tarih yok"` |

TMDB tarihi `YYYY-MM-DD` metni olarak gönderir. `formatDate` için Türkçe **uzun ay adını** kullan; farklı saat dilimlerinde gün kaymaması için UTC'yi belirt. Boş tarih görünür metne yalnızca `formatDate` içinde dönüşür; `releaseYear` boş string bırakır ki kart kendi kararını versin.
