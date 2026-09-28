## Neden böyle?

Seçimi film id’siyle tutmak, sıralama değişince aynı filmi seçili bırakır. Index üzerinden seçim saklamak sıra ile anlam değiştirir. `reverse()` öncesi kopya, ortak örnek diziyi mutasyondan korur. Key sabit id olmalı; ileride not input’u eklendiğinde DOM durumunun filme bağlı kalmasını sağlar.
