---
title: "Sinema’ya hook’ları taşı"
minutes: 6
kind: project
---

# Sinema’ya hook’ları taşı

Şimdi Modül 5'teki tekrar kullanılabilir davranışları Sinema'nın içine yerleştireceksin. Proje, arama alanının yazmayı kısa süre beklemesini, ortak fetch durumlarını ve favorilerin birden fazla ekranda aynı değeri görmesini hazırlar. Buradaki dosya yolları ve export adları, sonraki modüllerin kullanacağı public contract'tır: başka kodun güvenerek import edeceği adlar ve konumlar.

## Önce hook'ların sorumluluğunu ayır

`useDebounce` değişen değerin son halini kısa bir beklemeden sonra verir; bekleyen timer değişiklikte temizlenmelidir. `useLocalStorage` state benzeri bir değeri tarayıcı depolamasına yazar; böylece favori id'leri yenileme sonrasında da okunabilir. `useFetch` verilen URL'den cevap alır ve istek durumunu mevcut `RemoteData<T>` biçiminde sunar.

:::model[Effect yaşam döngüsü]
Bir Effect dış sistemle bağlantı kurar: örneğin timer başlatır veya ağ isteği gönderir. Bağımlılığı değişince eski çalışmanın cleanup'ı yapılır, sonra yeni çalışma başlar. Unmount sırasında da cleanup çalışır; eski timer ya da istek ekranı güncelleyemez.
:::

:::mistake[Farklı bir `RemoteData` tanımlamak]
Belirti → Bir hook'un döndürdüğü sonuç, projenin diğer parçalarının beklediği alanlarla uyuşmaz. Neden → Aynı istek durumunu anlatan ikinci bir tip oluşturulmuştur. Düzeltme → Projedeki `src/lib/remote-data.ts` tipini kullan.
:::

## Sonra favori durumunu paylaş

`FavoritesProvider`, altındaki bileşenlere ortak favori durumunu verir. Provider bu paylaşım sınırıdır; `useFavorites()` ise içindeki bileşenlerin bu durumu okuduğu custom hook'tur. Böylece her kartın kendi favori listesi olmaz ve aynı film için kartlar aynı sonucu görür.

:::model[Context yayılımı]
Provider'ın paylaştığı değer değişince onu okuyan bileşenler yeni değeri görür. Favori id listesinin tek sahibi provider olduğunda kartlar aynı kaynakla çalışır; aradaki her bileşenin favori prop'u taşımasına gerek kalmaz.
:::

## Uygulama sırası

Önce hook dosyalarını kendi sorumluluklarına göre kur. `useFetch` için `null` URL'nin istek başlatmaması ve başarı/hata durumlarının ayırt edilmesi gerektiğini hatırla. Ardından mevcut arama alanını gecikmiş değere bağla. Sonra favorileri provider içinde tek kaynak yap, uygulamanın en üstünde provider'ı yerleştir ve kartların ortak hook'u kullandığını kontrol et.

| Belirti | Önce bakılacak yer |
| --- | --- |
| Arama her tuşta hemen değişiyor | Arama alanı gecikmiş değeri kullanıyor mu? |
| URL yokken istek oluşuyor | `null` URL için `idle` dalı var mı? |
| Favori yalnız bir kartta değişiyor | Kartlar aynı provider değerini okuyor mu? |
| Yenilemede favori kayboluyor | Id listesi kalıcı depolamadan geri okunuyor mu? |

Bu projede gerçek TMDB sayfalarını kurmuyorsun; mevcut statik film listesi ve arayüz kalırken ileride kullanılacak hook sınırlarını hazırlıyorsun. Dosya adlarını değiştirmeden ilerlemek, sonraki sayfaların aynı import'ları kullanabilmesini sağlar.

## Özet

- Her custom hook tek bir tekrar kullanılabilir davranışa sahip olur.
- `RemoteData<T>` istek durumları için projede ortak dildir.
- Cleanup, değişen timer'ı ve artık güncel olmayan isteği etkisiz kılar.
- Provider, favorilerin tek kaynağını kartlarla paylaşır.

**Yeni terimler**

- `Public contract`: Başka kodun import edebilmesi için korunan dosya yolu ve export adları.
- `Provider`: Context değerini alt bileşenlere sunan bileşen.

**Kendini yokla:** Favori id'lerini her kartta ayrı tutmak neden sorun çıkarır?

**Cevap:** Kartlar birbirinden bağımsız listeler görür; provider altındaki ortak kaynak hepsinin aynı favori durumunu kullanmasını sağlar.
