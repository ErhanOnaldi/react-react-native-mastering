## Neden böyle?

Index key sıra konumunu temsil eder. Sıra tersine döndüğünde React aynı DOM input’unu başka film için yeniden kullanır; yazı “taşınır”. Film id’siyle key kullanınca DOM durumu aynı filme eşlenir. Input’u controlled yapmak da bir seçenek ama bu görev key hatasını doğrudan görmeni sağlar. `reverse()` öncesi kopya almak orijinal fixture dizisini korur.
