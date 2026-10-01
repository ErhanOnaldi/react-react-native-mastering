---
title: "CORS ve Same-Origin Policy"
minutes: 18
kind: concept
---

# CORS ve Same-Origin Policy

Vite ile Sinema'yı `http://localhost:5173` adresinde açtığını düşün. API de `http://localhost:5000` adresinde çalışıyor. İki adres de senin bilgisayarında olsa da tarayıcı bunları ayrı **origin** (kaynak adres) sayar. Origin; protokol, host (alan adı) ve porttan oluşur. Tarayıcıda çalışan JavaScript'in başka bir origin'deki cevabı okuyup okuyamayacağını **Same-Origin Policy** (aynı kaynak politikası) belirler.

En basit karşılaştırma aynı adrese yapılan iki istektir:

| Sayfanın adresi | İsteğin adresi | Sonuç |
| --- | --- | --- |
| `http://localhost:5173` | `http://localhost:5173/api/films` | Aynı origin |

Yol (`/api/films`) değişebilir; origin'i oluşturan üç parça aynı kaldığı için tarayıcı isteği aynı origin kabul eder. Bu ayrım, bir sitenin açık olan başka bir sitedeki özel verilere sessizce erişmesini önler.

## Tek alan değişince ne olur?

Şimdi yalnızca portu değiştirelim:

| Sayfanın adresi | İsteğin adresi | Sonuç |
| --- | --- | --- |
| `http://localhost:5173` | `http://localhost:5000/api/films` | Farklı origin |

Port `5173` yerine `5000` olduğu için tarayıcı bu isteği cross-origin, yani başka bir origin'e istek sayar. Protokol `http` yerine `https` olsaydı veya host `localhost` yerine `127.0.0.1` olsaydı yine farklı origin olurdu. İsimleri benzer görünse bile bu alanlar eşleşmelidir.

**CORS** (Cross-Origin Resource Sharing), sunucunun tarayıcıya belirli cross-origin istekleri paylaşma izni verdiği kurallar bütünüdür. CORS, Postman veya `curl` gibi araçların önüne geçen bir ağ duvarı değildir; tarayıcının JavaScript'e cevap verip vermemesini kontrol eder. Postman'de çalışan bir adresin tarayıcıda hata vermesi bu yüzden mümkündür.

## Tarayıcı cevabı ne zaman gösterir?

Basit bir `GET` isteği tarayıcıdan API'ye gidebilir. API isteği işler, cevabı gönderir; sonra tarayıcı cevabın CORS iznini kontrol eder. İzin yoksa sunucu cevap vermiş olsa bile tarayıcı cevabı JavaScript'e açmaz. Uygulamada `fetch()` genel bir `TypeError` ile reddedilebilir; CORS ayrıntısını tarayıcının Console panelindeki mesajda görürsün.

Örneğin tarayıcı isteğinde kaynak adresini bildiren `Origin: http://localhost:5173` başlığı bulunur. Sunucu da izin veriyorsa cevabına `Access-Control-Allow-Origin: http://localhost:5173` ekler. Tarayıcı bu izin başlığını görüp cevabı React koduna teslim eder. Sunucu izin başlığını eklememişse `catch` içinden sunucu gövdesini okumaya çalışamazsın; tarayıcı onu güvenlik nedeniyle saklar.

Bu nedenle CORS sorununu çözerken `catch` içinde özel bir CORS hatası aramak işe yaramaz. Belirti `Failed to fetch` olabilir; nedeni ve eksik izin başlığını Console'da bulursun. Kalıcı çözüm API sunucusunda doğru origin'e izin vermektir.

## Bazı isteklerde önce izin sorulur

Şimdi `GET` isteğine `Authorization` başlığı ekleyelim. `Authorization`, isteğin kimlik bilgisini taşır ve tarayıcının doğrudan gönderdiği temel istek türlerinden biri değildir. Böyle bir istekte tarayıcı önce **preflight** (ön kontrol) adı verilen `OPTIONS` isteğiyle sunucuya izin sorar. Asıl istek, sunucu izin verirse gönderilir.

Akışı adım adım izleyelim:

| Sıra | Tarayıcının yaptığı | Sunucunun cevabı | Sonraki adım |
| --- | --- | --- | --- |
| 1 | `OPTIONS /api/films` gönderir; `Origin` ve istenen başlıkları bildirir | Henüz cevap yok | Asıl istek bekler |
| 2 | İzin cevabını alır | `Access-Control-Allow-Origin`, izin verilen method ve başlıklar | İzin uygunsa devam eder |
| 3 | `GET /api/films` ve `Authorization` başlığını yollar | Film verisi ve CORS izni | Tarayıcı cevabı JavaScript'e açar |

Buradaki sıra önemlidir. `OPTIONS` film listesini getirmez; yalnızca “bu origin bu method ve başlıklarla istekte bulunabilir mi?” sorusunu yanıtlar. Preflight reddedilirse tarayıcı asıl `GET` isteğini göndermez. Network panelinde `OPTIONS` ve ardından `GET` satırlarını görebilirsin.

![CORS preflight karar akışı ve izin başlıkları](diagram:cors-preflight)

### Örnek 3: JSON ile POST

Sinema'da bir değerlendirme kaydettiğini düşün. `POST` metoduna `Content-Type: application/json` eklemek de tarayıcının ön kontrolden geçirmesine neden olabilir. `Content-Type`, gövdedeki verinin türünü belirten başlıktır; `application/json` değeri JSON gövdeyi işaret eder.

```ts
fetch('http://localhost:5000/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ filmId: '42', rating: 5 }),
})
```

Tarayıcı önce izin sorgusu yollar; API uygun origin, `POST` ve `Content-Type` için izin verirse değerlendirme isteği gider. Bu kontrol, sunucunun yalnızca beklediği web sayfalarının hassas başlıklarla istek atmasına izin vermesini sağlar. Basit isteklerde de CORS cevabı kontrol edilir; preflight her cross-origin istek için yapılmaz.

## Geliştirmede adresleri nasıl konuşturursun?

Sinema'yı geliştirme sırasında aynı `localhost:5173` adresinde tutup Vite'ın **proxy** (vekil) özelliğiyle `/api` isteklerini API'ye aktarmak mümkün. Tarayıcı `/api/films` yolunu kendi origin'ine gönderir, Vite ise isteği arka tarafta `localhost:5000` adresine iletir. Böylece tarayıcı açısından istek aynı origin'dedir. Canlı ortamda da frontend ve API'yi aynı alan adı arkasında sunan bir **reverse proxy** (ters vekil), tarayıcı ile farklı sunucular arasındaki aktarımı yapabilir.

Backend tarafında ASP.NET Core kullanırken de CORS politikası tanımlanır: politika izin verilen frontend origin'ini, method'ları ve başlıkları listeler; uygulama bu politikayı API cevaplarına uygular. Buradaki fikir, kod ayrıntısından daha önemlidir: izin API cevabında açıkça yer almalı ve kullandığın origin ile eşleşmelidir.

:::info[Derinlemesine (isteğe bağlı)]
Tarayıcının doğrudan gönderebildiği bazı başlık ve içerik türlerine “CORS-safelisted” denir. Örneğin `Accept` ve sınırlı bazı `Content-Type` değerleri bu gruptadır; `Authorization` ve `application/json` değildir. Çerezle oturum kullanırken `credentials: 'include'` seçeneği gerekir; bu durumda sunucu `Access-Control-Allow-Origin: *` jokerini kullanamaz ve açık origin ile `Access-Control-Allow-Credentials: true` döndürmelidir. Bu ayrıntılar, temel origin karşılaştırması ve preflight sırasını değiştirmez.
:::

## Özet

- Origin; protokol, host ve portun birlikte oluşturduğu kaynak adresidir.
- Same-Origin Policy, tarayıcıda çalışan JavaScript'in başka origin'den gelen cevabı okumasını sınırlar.
- CORS, sunucunun tarayıcıya verdiği paylaşım iznidir; Postman bu tarayıcı kuralını uygulamaz.
- Preflight gerekiyorsa tarayıcı önce `OPTIONS` gönderir; izin gelirse asıl isteği yollar.
- CORS hatasında ayrıntıyı Console'da ara; izin sunucu veya geliştirme proxy'si üzerinden çözülür.

**Yeni terimler:** Origin: protokol, host ve porttan oluşan kaynak adresi. Same-Origin Policy: tarayıcıdaki JavaScript'in farklı origin cevabını okumasını kısıtlayan kural. CORS: sunucunun cross-origin cevabına tarayıcı için izin vermesi. Preflight: asıl istekten önce gönderilen `OPTIONS` izin sorgusu. Proxy: isteği istemci adına başka bir sunucuya aktaran aracı.

**Kendini yokla:** `http://localhost:5173` ile `http://localhost:5000` aynı origin midir?

*Cevap:* Hayır. Portlar farklıdır.

**Kendini yokla:** `Authorization` başlıklı cross-origin `GET` öncesinde hangi istek gider?

*Cevap:* Tarayıcı önce `OPTIONS` preflight gönderir; izin verilirse ardından `GET` gider.
