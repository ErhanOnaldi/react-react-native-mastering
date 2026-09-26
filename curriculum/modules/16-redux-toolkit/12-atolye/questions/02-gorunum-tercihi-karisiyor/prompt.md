Bir filmi favori işaretle, sonra `Kart görünümü` düğmesine bas: film listesi bomboş kalıyor, sanki hiç veri gelmemiş gibi.

Ayrı bir denemede: "Aksiyon" türünde bir filmi favori işaretle, türü "Komedi"ye çevir, sonra tekrar "Aksiyon"a dön — az önce işaretlediğin favori artık işaretli görünmüyor.

`MovieWorkspace.tsx` içindeki `MovieWorkspace` bileşeni bu iki belirtiden kurtulmalı: görünüm değişimi film sonucunu etkilememeli, favori işareti tür değişse de doğru filmde kalmalı.
