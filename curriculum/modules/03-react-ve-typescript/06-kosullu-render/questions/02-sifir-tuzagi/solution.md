## Neden böyle?

React boolean false’u göstermez; sayı 0’ı metin olarak gösterir. Bu yüzden `{count && ...}` tek başına boş durum için güvenli değildir. Ternary iki durumu açıkça adlandırır. Aynı yaklaşım arama sonucunun boş olması için de uygulanır.
