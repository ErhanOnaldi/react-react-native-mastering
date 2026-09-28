---
title: "Önkoşulu hazır olunca sorgula"
minutes: 15
kind: concept
---

# Önkoşulu hazır olunca sorgula

:::pain[Problem]
Kullanıcının ekip profilini açıyorsun. İlk istek `accountId`’yi getirecek, ikinci istek o hesabın açık görevlerini yükleyecek. İlk render’da kimlik henüz yokken `/api/accounts/undefined/tasks` gidiyor ve sunucudan 404 geliyor.
:::

## Veri bağımlılığını key ve başlangıç koşulunda göster

Bazı sorgular bağımsızdır ve aynı anda başlayabilir. Örneğin hava durumu ile yakındaki feribot saatleri birbirini beklemiyorsa iki query’yi de render et; birinin cevabını diğerine bağlama. Bağımlı sorgu ise ancak önceki sonuçtan bir değer çıktıktan sonra anlam kazanır. Hesap kimliği olmadan görev isteği kurulamıyorsa bu bağımlılığı açıkça modelle.

:::model[Query key]
Key, hangi cevabın istendiğini kaydeder. Bu derste key’e ayrıca henüz bulunmayan bir değeri koyup isteği hemen çalıştırmayacağız: key eksik durumu tarif eder, query function’ın çalışıp çalışmayacağını ise başlangıç koşulu belirler.
:::

![İlk sorgudan id geldikten sonra ikinci sorgunun başlaması](diagrams/bagimli-sorgu.svg "İkinci sorgu gerekli kimlik gelene kadar bekler.")

React Hook kuralları gereği hook sırası render’lar arasında sabit kalmalıdır. Dolayısıyla `if (accountId) useQuery(...)` doğru çözüm değildir. Hook her render’da çağrılır; seçeneklerinde “henüz başlama” durumu verilir. Değer geldiğinde Query yeni key’i izler ve sorguyu başlatır.

İki genel seçenek vardır:

1. `enabled: Boolean(accountId)` query’yi koşula bağlar. `queryFn` tanımlı kalır; uygun olduğunda query çalışır. UI’da yalnızca `isPending`’e bakma: devre dışı sorgu ilk anda `status: 'pending'`, `fetchStatus: 'idle'` olabilir.
2. `skipToken` query function yerine geçer. Gerekli girdi yokken yanlışlıkla parametresiz fetch yapılamaz ve diğer daldaki TypeScript tipi daralır. Bu tercih fonksiyonsuz durumu tipe yansıtır. Böyle bir query’de `refetch()` çağırmak mümkün değildir; yeniden değerlendirme için id vermen gerekir.

`enabled` yararlıdır, eğer sorgu elle `refetch()` ile çalıştırılabilir olmalı veya fetch function her zaman geçerli biçimde tanımlanabiliyorsa. `skipToken` ise eksik parametre varken sorgu işlevi olmamasını açıkça ifade eder. Birini seçerken hangi durumun uygulama için doğru olduğunu belirle; ikisini de hook çağrısını koşullamak için kullanma.

Bağımlı query modelinin kuralları:

1. React hook’u component’in her render’ında aynı sırada çağrılır.
2. Eksik girdiyle query function çalıştırılmaz; endpoint’e `undefined` veya NaN gönderilmez.
3. Önkoşul sağlanınca key ve function aynı doğrulanmış değeri kullanır.
4. Devre dışı `pending` sonucu ile devam eden network işi ayrı durumlar olarak ele alınır.
5. Sadece gerçek veri bağımlılığı seri kurulur; bağımsız sorgular paralel başlayabilir.

Bu ayrım, Hook kurallarını korumak kadar hata ayıklamayı da kolaylaştırır. “Sorgu başlamadı” görünümü ile “sorgu başladı ve cevap bekliyor” aynı değildir. İlki formda henüz hesap seçilmemesi olabilir; ikincisi kullanıcıya progress göstermek için bir nedendir. İki durumda da yalnız `isPending` kontrolü yaparsan her zaman doğru mesajı seçemezsin. Parametrenin kendisi de anlamlı olabilir: id 0 geçerli ise `Boolean(id)` onu yanlışlıkla kapatır; `id !== undefined` açık kontrolü daha doğru olur.

## Akışı adım adım takip et

Önce URL’den `workspaceId` okunur. İlk render’da değer undefined ise `skipToken` seçilir. Query key `['workspaces', undefined, 'tasks']` gibi bu state’i tanımlar ama fetch function yoktur; `fetchStatus` idle’dır, ağ isteği çıkmaz. Kullanıcı workspace açınca id 42 olur. Yeni render yine aynı hook sırasıyla çalışır; key `['workspaces', 42, 'tasks']` olur ve geçerli query function seçilir. Promise çözülünce görev listesi success data olur.

| Render | `workspaceId` | Seçilen `queryFn` | Cache key | Ağ davranışı |
|---|---:|---|---|---|
| İlk açılış | `undefined` | `skipToken` | `['workspaces', undefined, 'tasks']` | İstek yok, `fetchStatus: idle` |
| Parametre çözüldü | `42` | `getTasks(42)` | `['workspaces', 42, 'tasks']` | GET başlar |
| Başarı | `42` | Aynı işlev | Aynı key | Sonuç 42’nin girdisine yazılır |
| Workspace değişti | `99` | `getTasks(99)` | Farklı key | Ayrı istek / cache girdisi |

İlk sorgu ve ikinci sorgu seri çalışırsa kullanıcı en az iki ağ gidiş-dönüşünü bekler. Bu bir **waterfall** maliyetidir. İş gereği görev endpoint’i sadece id ile bulunuyorsa bu sıralama doğrudur; fakat ilk istekten bağımsız ikinci veriyi boşuna bekletme. İkisi de kullanıcı girişi olmadan alınabiliyorsa ayrı query’lerle paralel çalıştır. Önkoşulun API tasarımından kaynaklanıyorsa backend’in ekran için birleşik endpoint sağlayıp sağlayamayacağını da ekiple konuş.

Waterfall’ı ölçerken yalnız istek sayısını değil toplam bekleme süresini de düşün. İki endpoint’in her biri 180 ms sürüyor ve seri ise yaklaşık 360 ms sonra ikinci data gelir; paralel bağımsız isteklerde ikisi de yaklaşık 180 ms’de sonuçlanabilir. Bu kaba toplam, render ve ağ gecikmelerini dışarıda bırakır ama akış kararının neden kullanıcıya dokunduğunu gösterir. Sırf paralel olsun diye endpoint’leri zorla birleştirme; gerçekten hangi data’nın diğerine ihtiyaç duyduğunu kaydet.

:::model[Effect yaşam döngüsü ve race condition]
Effect yaşam döngüsü dış bağlantıyı kurar, dependency değişince kapatıp yeniden kurar. `yaris-kosulu` modelinde eski cevabın yeniyi ezmemesi için cleanup veya abort gerekir. Query bu veri akışında aynı key’e ait Promise ve cache durumunu yönetir; bu, effect’in bütün kullanımını ortadan kaldırmaz, yalnız server data getirme işini elde yazma ihtiyacını azaltır.
:::

Birinci isteğin id’si değişirse Query yeni key’e geçer. Geç gelen eski cevap eski key’in cache girdisine aittir; ekrandaki observer yeni key’i izlediği için başka id’nin data’sı yeni profil diye gösterilmez. Bu, doğru key kullanmanın race condition savunmasına katkısıdır. Ancak iki farklı query key’inden alınan veriyi elle tek component state’ine karıştırırsan aynı korumayı kaybedebilirsin. Modelin yarısı key; diğer yarısı UI’da o an seçili olan key’i izlemektir.

### Kırık örnek: erken `fetch`

```ts
type Task = { id: number; title: string }

function getTasks(workspaceId: number | undefined): Promise<Task[]> {
  return fetch(`/api/workspaces/${workspaceId}/tasks`).then((response) => response.json())
}
```

Bu helper undefined değerini string’e çevirir ve geçersiz URL kurar. `workspaceId!` ile TypeScript’i susturmak runtime’da yeni bilgi sağlamaz; URL parametresi halen eksik olabilir.

### Doğru biçim: geçerli girdi geldiğinde fonksiyon seç

```ts check
import { skipToken, useQuery } from '@tanstack/react-query'

type Task = { id: number; title: string }
declare function getTasks(workspaceId: number): Promise<Task[]>

export function useWorkspaceTasks(workspaceId: number | undefined) {
  return useQuery({
    queryKey: ['workspaces', workspaceId, 'tasks'],
    queryFn: workspaceId === undefined ? skipToken : () => getTasks(workspaceId),
  })
}
```

Burada `workspaceId === undefined` ile sıfır değerine dair belirsizlik de kalmaz. Eğer kimlik yalnızca pozitif tamsayıysa bunu URL sınırında ayrıca doğrula. Sorgunun devrede olmadığı arayüz “seçili çalışma alanı yok” durumunu ifade etsin; kullanıcının gerçekten hiçbir görevi olmadığı success data `[]` durumundan ayrı kalsın.

## Sınır durumları ve sık hatalar

:::mistake[Hook’u koşullu çağırmak]
**Belirti:** İlk render’da hook hatası veya sonraki render’da Hook sırası uyarısı görünür. → **Neden:** Bir render’da `useQuery` atlanmış, sonraki render’da çağrılmıştır. → **Düzeltme:** Hook’u component’in üst seviyesinde her render’da çağır; önkoşulu `enabled` veya `skipToken` ile query seçeneklerine taşı.
:::

:::mistake[`undefined` id’yi `!` ile gizlemek]
**Belirti:** Sunucuya `/accounts/undefined` gider. → **Neden:** Non-null assertion yalnızca derleyiciyi susturur, değeri üretmez. → **Düzeltme:** Eksikliği açık kontrol et; yalnız geçerli dalda query function kur.
:::

:::mistake[Devre dışı sorguyu loading ekranı sanmak]
**Belirti:** Kullanıcı seçim yapmamışken spinner dönmeye devam eder. → **Neden:** `isPending` tek başına ağ işi olup olmadığını söylemez. → **Düzeltme:** `fetchStatus` ve gerekli parametrenin varlığını birlikte değerlendir; idle bekleyiş için anlaşılır seçim metni göster.
:::

:::mistake[Bağımsız sorguları seri yapmak]
**Belirti:** İki bağımsız panel arka arkaya yüklenir. → **Neden:** İkinci query’nin önkoşulu olmayan ilk query’ye bağlanmıştır. → **Düzeltme:** Gerçek bağımlılığı olmayan query’leri aynı render’da başlat.
:::

:::sector
Ekipler query function içinde gelen id’yi varsaymak yerine, route sınırında parse edilmiş parametreyi tipli olarak geçirir. Query’nin bekleme durumu da tasarımda yer alır: “kimlik seçilmedi” ile “istek sürüyor” farklı cümlelerdir.
:::

## Özet

- Bağımlı sorgu yalnızca önkoşul verisi hazır olduğunda anlamlıdır.
- Hook her render’da çağrılır; query’yi devre dışı bırakmak için `enabled` veya `skipToken` kullanılır.
- `skipToken` eksik id’de function sağlamaz; elle `refetch()` ihtiyacı varsa `enabled` seç.
- `pending` her zaman ağ isteği demek değildir; `fetchStatus: idle` bekleyişi gösterir.
- Bağımsız işleri paralel başlat; gerçek veri bağımlılığını waterfall olarak kabul et.

**Kendini yokla:** `skipToken` ile beklerken neden `refetch()` uygun değildir? İki panel aynı anda yüklenebiliyorsa sıraya koymanın bedeli nedir?

**Yanıt:** `skipToken` durumunda query function yoktur. Bağımsız sorguları sıraya koymak toplam beklemeyi artırır.
