---
title: "Kurallar ve dönüşen değerler"
minutes: 4
kind: practice
---

# Kurallar ve dönüşen değerler

Atölyede iki form davranışını ele alacaksın. İzleme planında başlangıç ve bitiş tarihleri ayrı ayrı geçerli olsa bile aralarındaki sıra yanlış olabilir. Taslak düzenleyicideyse boş tarih alanı formda `''` olurken kayıt verisinde “tarih yok” anlamına gelmelidir.

:::model[Tip derlemede, veri çalışma anında]
Formdaki ham değer, şemaya giren **input** değeridir; parse işleminden çıkan doğrulanmış veya dönüştürülmüş değer **output** değeridir. Birden fazla alanı ilgilendiren ilişkiyi nesnenin tamamı üzerinden düşün; dönüştürme gereken alanda input ile output'ın farklı olabileceğini unutma.
:::

## Belirtiyi sözleşmeye çevir

İlk formda ters tarih aralığının hangi alanda hata göstermesi gerektiğini ve geçerli aralıkta callback'e ne gideceğini netleştir. İkinci formda üç durumu ayır: taslak tarihi alanda gösterilir, boş tarih kayıt sözleşmesine uygun değere dönüşür, dolu ama geçersiz metin ise kaydı durdurur.

Her görevde önce beklenen davranışı bir cümleyle yaz, sonra hangi alanların birlikte değerlendirilmesi gerektiğini bul. Son adımda hata mesajının alanla erişilebilir biçimde ilişkili kaldığını ve callback'in doğru değerleri aldığını kontrol et.

## Özet

- Alanlar tek tek geçerli olsa da aralarındaki kural bozulabilir.
- Formun ham değeri ile parse sonrası callback değeri farklı olabilir.
- Boş girdi ile biçimi geçersiz girdi için ayrı davranış belirle.

**Kendini yokla:** Başlangıç ve bitiş tarihleri ayrı ayrı geçerliyse neden hâlâ hata çıkabilir?

*Cevap:* Bitiş tarihi başlangıçtan önce olabilir; iki alanın ilişkisi ayrıca kontrol edilir.

**Yeni terimler:**
- Input — şemaya verilen ham değer.
- Output — şema parse edildikten sonra çıkan değer.
