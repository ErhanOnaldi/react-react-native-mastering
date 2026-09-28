## Neden böyle?

Bu görevde Vitest ile ilk kez birim testi yazdın. Birim testlerinin gücü, bir fonksiyonun sınır durumlarını ve sözleşmesini somut beklentilerle sabitlemesidir:

1. **Hazırla (Arrange) — Çalıştır (Act) — Doğrula (Assert):** Her test senaryosunda girdiyi belirledin, fonksiyonu çağırdın ve `expect(sonuc).toBe(beklenen)` ile kontrol ettin.
2. **Sınır durumları:** `null`, `0`, negatif sayılar ve tam saat (`120` dakika) gibi uç durumlar tek tek test edildi.
3. **Mutant yakalama:** Yazdığın testler yalnızca "kod çalışıyor mu" sorusunu sormaz; kalan dakikayı unutan veya geçersiz sürede boş string dönen hatalı sürümleri (mutantları) tek tek kırmızıya düşürerek yakalar.

## Sektörde

Sektörde kod yazmadan önce veya hemen sonra yazılan bu tür küçük birim testleri, daha sonra yapılacak güvenli refactor'ların en sağlam güvenlik ağıdır.
