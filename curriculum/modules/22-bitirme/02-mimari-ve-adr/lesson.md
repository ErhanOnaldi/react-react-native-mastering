---
title: "Mimari kararlar: state haritası ve ADR"
minutes: 8
kind: project
---

# Mimari kararlar: state haritası ve ADR

Bir ekranda görünen her bilgi aynı yerde yaşamaz. Kitaplık’ta arama sözü adres çubuğunda, arama sonucu sunucu önbelleğinde, okuma listesi tarayıcıda; form taslağı ise kullanıcı kaydedene kadar formun içindedir. **State haritası**, bu bilgileri ve sahiplerini bir tabloda görünür kılar.

:::model[State kategorileri]
URL state paylaşılabilir ve geri tuşuyla değişir; sunucu state API’den gelir; istemci state uygulamanın yerel tercihidir; form state gönderilene kadar taslaktır. Türetilmiş state ise başka bir değerden hesaplanır. Her bilgi için tek bir kaynak seç; aynı verinin kopyaları zamanla birbirinden ayrılabilir.
:::

## Önce sahibi, sonra araç

Üç Kitaplık bilgisini haritaya yerleştirelim:

| Bilgi | Sahibi | Neden |
| --- | --- | --- |
| `q` arama metni | URL | Link paylaşılınca arama korunur. |
| Arama sonuçları | Sunucu önbelleği | API yanıtını ve tekrar kullanımını yönetir. |
| Menüdeki liste adedi | Türetilmiş | Okuma listesi uzunluğundan hesaplanır. |

Bir sonraki adımda haritaya açık eser kimliği, durum filtresi, yükleniyor/hata halleri ve form alanlarını da ekle. `pageCount` veya menü sayısı gibi sonuçları ayrıca saklama; kaynak değişince hesaplamak daha güvenlidir.

![Kitaplık state haritası URL, server, client, form ve türetilmiş bilgilerin sahipliğini ayırır](diagrams/state-haritasi.svg "State haritası ve sahiplik ayrımı")

API cevabı ya da `localStorage` içeriği uygulamanın dış sınırından gelir. **Sınır doğrulaması**, bu veriyi kullanmadan önce beklenen biçimde olup olmadığını kontrol etmektir. Örneğin saklanan değer bozuk JSON olabilir; önce `try/catch` ile parse hatasını yakala, sonra biçimi Zod şemasıyla doğrula. Böylece güvenmediğin veri uygulama içine sessizce sızmaz.

## Kararı kayda geçir

**ADR** (*Architecture Decision Record*), önemli bir mimari kararın nedenini, değerlendirilen seçenekleri ve kabul edilen bedeli saklayan kısa belgedir. Sadece “TanStack Query kullanıyoruz” yazmak yetmez; hangi ihtiyaç yüzünden seçtiğini ve hangi koşulda kararını tekrar ele alacağını da belirt.

Örneğin okuma listesi için “Context + `useReducer`” ve harici bir store gerçek seçeneklerdir. ADR’de uygulamanın küçük ölçeğini, listenin nerede okunduğunu ve ek bağımlılığın maliyetini tart. Sonuç bölümünde hem kazanımı hem de Context değiştiğinde tüketicilerin yeniden render olabileceği bedelini yaz. Yeni karar eskisini geçersiz kılarsa eskisini silme; yeni ADR ekle ve ilişkiyi belirt.

:::info[Derinlemesine (isteğe bağlı)]
Context tüketicilerinin sayısı ve render maliyeti gerçekten sorun olduğunda `useSyncExternalStore` ya da Zustand gibi seçenekler tekrar değerlendirilebilir. Küçük bir uygulamada bu araçları şimdiden seçmek gerekmiyor.
:::

:::mistake[Araç adını gerekçe sanmak]
Belirti: ADR’de karar var ama yeni geliştirici “neden?” sorusunun yanıtını bulamıyor. Neden: kütüphane adı, gereksinim ve alternatif kıyasının yerini tutmaz. Düzeltme: bağlamı, en az iki seçeneği ve kabul edilen maliyeti yaz.
:::

## Çalışma sırası

`REQUIREMENTS.md` içindeki her bilgi parçasını tabloya al, kategorisini ve tek sahibini seç. Ardından sunucu verisi ve yerel okuma listesi için ayrı karar kayıtları oluştur. Karar başlıklarını kısa tut; “ne seçildi?” kadar “hangi ölçekte bu seçim doğru?” sorusunu da cevapla.

## Özet

- State haritası verinin türünü ve tek sahibini gösterir.
- Türetilmiş değerleri kaynak state’ten hesapla.
- Dış veriyi uygulamaya almadan önce biçimini doğrula.
- ADR kararın bağlamını, alternatiflerini ve bedelini saklar.

**Yeni terimler:** State haritası: uygulama bilgilerinin kategorisini ve sahibini gösteren tablo. ADR: bir mimari kararın gerekçesini ve sonuçlarını kaydeden belge. Sınır doğrulaması: dışarıdan gelen verinin beklenen biçimde olduğunu kullanmadan önce denetleme.

### Kendini yokla

1. Menüdeki liste sayısı neden ayrı state olmamalı? **Cevap:** Okuma listesinden hesaplanabilir; iki değer ayrı tutulursa uyuşmayabilir.
2. ADR’de neden elenen seçenekler de yazılır? **Cevap:** Kararın hangi ihtiyaç ve ödünleşimle alındığını gelecekteki okuyucu anlayabilsin diye.
