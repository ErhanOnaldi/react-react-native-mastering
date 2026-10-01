---
title: "Paylaşılan UI ve form"
minutes: 5
kind: practice
---

# Paylaşılan UI ve form

Bu atölyede üç küçük bakım işinde aynı yolu izleyeceksin: önizlemede belirtiyi gör, beklenen davranışı tarif et, sonra değişikliği farklı kayıt ve sonuçlarla dene. İlk iş ortak onay penceresinin iki ekranda tutarlı kalması; sonraki işler düzenleme formunun kayıt değişimini izlemesi ve yorum formunun kurallarını uygulaması.

:::model[Compound component ve asChild]
19. modülde birlikte çalışan UI parçalarını ve `asChild` ile çocuk elemana davranış aktarmayı gördün. Ortak pencereyi düzenleme ve silme akışında kullanırken her ekranın kendi açılma ve onay davranışını koru. Dialog kapandığında focus, yani klavye odağı, onu açan kontrole dönmelidir.
:::

:::model[Form verisi ve doğrulama]
Form değerlerini React Hook Form (RHF) yönetir; Zod şeması girdinin kurallara uyup uymadığını söyler. Bir kayıt değişince yeni kaydın değerleri gösterilmeli, ama aynı kayıt yeniden çizildi diye kullanıcının yazısı silinmemeli. Yorum işinde ayrıca iki alanı birlikte değerlendiren bir kural var; buna alanlar arası kural denir.
:::

## Belirtiyi adım adım izle

Pencere Escape ile kapanınca odağın nereye gittiğini gör. Formu açık tutup başka kayda geç ve alanların güncellenip güncellenmediğine bak. Yorum gönderirken de önce doğrulama hatasını, sonra sunucu hatasını ve başarılı yeniden denemeyi ayrı ayrı gözle.

Bir adım çalıştı diye bitirme: aynı pencereyi farklı `Sil` düğmelerinden aç, aynı kaydı yeniden göster ve sunucu reddettikten sonra tekrar gönder. Böylece ortak davranışın ve kullanıcı verisinin geçişler boyunca korunduğunu anlarsın.

## Özet

- Belirtiyi üret ve beklenen kullanıcı davranışını önce kendin tarif et.
- Pencere davranışını, kayıt kimliğini ve form değerlerini ayrı ayrı izle.
- Doğrulama, sunucu hatası ve başarı durumlarını sırayla dene.

**Terimler:** `focus` — klavyeyle etkileşimin şu an yöneldiği kontrol; `alanlar arası kural` — birden fazla alanın değerini birlikte değerlendiren doğrulama.

**Kendini yokla:** Aynı kayıt yeniden gösterilince yazdığın metin siliniyorsa önce neyi karşılaştırırsın? Kayıt kimliğinin gerçekten değişip değişmediğini.
