---
title: "Node, pnpm ve package.json"
minutes: 15
kind: concept
---

# Node, pnpm ve package.json

:::pain[Problem]
Ekip arkadaşının yazdığı projeyi bilgisayarına klonladın ve `npm install` çalıştırdın. Kendi bilgisayarında kod derlenirken hata verip duruyor; arkadaşına sorduğunda ise *"Ama benim bilgisayarımda sorunsuz çalışıyor"* yanıtını alıyorsun. Projeyi ayağa kaldırmak için saatlerce bozuk paket sürümleriyle ve çakışan bağımlılıklarla boğuşuyorsun.
:::

## İki aktör: Çalışma ortamı ve paket yöneticisi

Modern bir web uygulaması geliştirirken iki farklı çalışma düzlemi vardır:
1. **Node.js (Geliştirme ortamı):** JavaScript'i tarayıcının dışına çıkarıp işletim sisteminde (terminalde) çalıştıran motordur. Vite geliştirme sunucusu, TypeScript derleyicisi, test çalıştırıcıları ve kod denetleyicileri Node.js üzerinde koşar.
2. **Paket Yöneticisi (pnpm):** Başka mühendisler tarafından yazılmış açık kaynak kütüphaneleri indirir, bunların sürümlerini takip eder ve projenin çalıştırılabilir komutlarını organize eder.

Bu platformda ve profesyonel ekiplerde **pnpm** kullanmamızın iki hayati nedeni vardır:
- **İçerik adresli küresel depo (Global Store):** Aynı paketin aynı sürümü bilgisayarında 10 farklı projede kullanılsa bile sabit diskte yalnızca **tek bir kez** saklanır. Diğer projeler bu pakete hard link (sabit bağlantı) ile bağlanır. Böylece gigabaytlarca disk alanı kazanılır ve kurulumlar saniyeler sürer.
- **Hayalet bağımlılıkları (Phantom Dependencies) engeller:** Klasik npm ve yarn araçları, bir paketin alt bağımlılıklarını projenin kök `node_modules` klasörüne düzensizce yayar. Bu durum, `package.json` dosyasında yazmadığın bir paketi yanlışlıkla import etmene ve kodun canlı sunucuda patlamasına yol açar. pnpm son derece katıdır: `package.json`'a açıkça eklemediğin hiçbir paketi projende import edemezsin.

## Paket çözümleme ve lockfile zihinsel modeli

Bir projede bağımlılıkların nasıl yönetildiğini anlamak, sürpriz kırılmaları önlemenin temel şartıdır:

![pnpm paket çözümleme ve lockfile zihinsel modeli](diagrams/paket-yonetimi.svg "package.json, lockfile, pnpm store ve node_modules ilişkisi")

Bu mekanizmayı şu temel kurallarla zihninde sabitle:

1. **`package.json` niyet beyanıdır:** Projenin hangi kütüphanelere ve hangi sürüm aralıklarına ihtiyaç duyduğunu genel kurallarla tanımlar (örneğin `"react": "^19.3.0"`).
2. **`pnpm-lock.yaml` kesin sözleşmedir:** O an indirilen paketlerin ve onların tüm alt bağımlılıklarının **tam ve değişmez** sürüm numaralarını ve şifrelenmiş bütünlük özetlerini (hash) kaydeder.
3. **Lockfile daima commit'lenir:** Git deposuna `package.json` ile birlikte `pnpm-lock.yaml` da gönderilir. Böylece CI sunucusu ve ekibe yeni katılan bir geliştirici tamı tamına aynı baytları indirir; "bende çalışıyordu" mazereti ortadan kalkar.
4. **`node_modules/` asla commit'lenmez:** Bu klasör üretilen geçici bir çıktıdır; `.gitignore` içerisinde yer alır ve ihtiyaç duyulduğunda lockfile referans alınarak saniyeler içinde baştan oluşturulabilir.

:::model[Sözleşme ve sipariş listesi]
`package.json` bir restorandaki sipariş fişidir ("Bana 19 serisinden taze bir React verin"). `pnpm-lock.yaml` ise o gün mutfaktan çıkan yemeğin gramajına kadar tam faturasıdır ("React 19.3.2 teslim edildi"). Ekipteki herkesin aynı yemeği yemesi bu fatura sayesinde garanti altına alınır.
:::

## package.json dosyasının anatomisi

Gerçek bir projede karşılaşacağın tipik bir `package.json` dosyasını inceleyelim:

```json title="package.json"
{
  "name": "sinema",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "react": "^19.3.0",
    "react-dom": "^19.3.0"
  },
  "devDependencies": {
    "typescript": "~6.0.3",
    "vite": "^8.3.1",
    "vitest": "^5.0.0"
  }
}
```

Bu dosyadaki alanların üstlendiği roller kesindir:

- `"type": "module"`: Projedeki tüm JavaScript dosyalarının varsayılan olarak modern ECMAScript modülü (`import` ve `export`) olduğunu beyan eder.
- `scripts`: Terminal kısayollarıdır. `pnpm dev` yazdığında Node arka planda `vite` çalıştırır. `pnpm build` ise `&&` operatörü sayesinde önce `tsc -b` ile tip kontrolü yapar; tipler kusursuzsa (`0` çıkış kodu) ardından `vite build` paketleyicisini devreye sokar.
- `dependencies` vs `devDependencies`: Kodun çalışma yeri bu ayrımı belirler.

| Bağımlılık Grubu | Nereye Gider? | Ne Zaman İndirilir? | Tipik Örnekler |
| --- | --- | --- | --- |
| `dependencies` | Son kullanıcının tarayıcısına giden bundle içine dahil edilir. | Geliştirmede ve canlı yayın (production) kurulumunda. | `react`, `react-dom`, `clsx`, `zod` |
| `devDependencies` | Yalnızca geliştiricinin makinesinde veya derleme hattında kalır. | Yalnızca geliştirme sırasında (`pnpm install --prod` bunu atlar). | `typescript`, `vite`, `vitest`, `eslint` |

## Semantik sürümleme (Semver) kuralları

Bir paketin sürüm numarası üç basamaktan oluşur: **`MAJOR.MINOR.PATCH`** (örneğin `19.3.1`).

```text
  19   .   3   .   1
   │       │       │
   │       │       └─ PATCH: Geriye uyumlu hata düzeltmesi (bugfix)
   │       └───────── MINOR: Geriye uyumlu yeni özellik (feature)
   └───────────────── MAJOR: Kırıcı değişiklik (breaking change - API değişti)
```

Sürümün önüne koyduğun semboller paket yöneticisine ne kadar esneklik tanıdığını belirler:

- **`^19.3.0` (Şapka - Caret):** MAJOR sürüm aynı kalmak şartıyla en güncel MINOR ve PATCH sürümlerini kabul eder. `19.3.5` veya `19.9.0` kurulabilir; ancak API'yi kırabilecek `20.0.0` asla kurulmaz.
- **`~6.0.3` (Tilde):** Hem MAJOR hem MINOR aynı kalmak şartıyla yalnızca en güncel PATCH sürümünü kabul eder. `6.0.9` kurulabilir; `6.1.0` kurulmaz. TypeScript gibi minör sürümlerde bile tip denetimini sıkılaştırabilen araçlar sektörde çoğunlukla tilde (`~`) ile sabitlenir.
- **`19.3.0` (Tam Sürüm):** Hiçbir güncellemeyi kabul etmez; tam olarak o sürümü şart koşar.

## `pnpm install` çalıştırıldığında adım adım ne olur?

Terminalde kurulum komutunu verdiğinde arka planda şu işlemler yürütülür:

| Adım | İşlem | Açıklama |
| --- | --- | --- |
| 1. Okuma | `package.json` ve `pnpm-lock.yaml` taranır. | İstenen aralıklar ile kilitli sürümler karşılaştırılır. |
| 2. Çözümleme | Bağımlılık ağacı hesaplanır. | Eksik bir paket varsa npm kayıt defterinden en uygun sürüm belirlenir. |
| 3. İndirme | Paketler küresel depoya (`~/.local/share/pnpm/store`) indirilir. | Paket diskte zaten varsa internetten tekrar indirilmez. |
| 4. Bağlama (Linking) | Proje içindeki `node_modules` oluşturulur. | Küresel depodan projenin klasörüne hard link'ler çekilir. |
| 5. Güncelleme | `pnpm-lock.yaml` güncellenir. | Yapılan tüm sürüm kararları bir sonraki kurulum için mühürlenir. |

## Kırık örnek

Aşağıdaki `package.json` parçasında sık yapılan iki ölümcül hata yer almaktadır:

```json
{
  "dependencies": {
    "react": "^19.3.0",
    "vitest": "^5.0.0"
  },
  "devDependencies": {
    "clsx": "^2.1.1"
  }
}
```

Bu projeyi yerel bilgisayarında `pnpm dev` ile çalıştırdığında her şey yolunda görünebilir. Ancak canlıya çıkış için bulut sunucusunda `pnpm install --prod` komutu koşulduğunda:
1. `clsx` paketi kurulmayacaktır çünkü yanlışlıkla `devDependencies` altına konmuştur; kullanıcı tarayıcısında `Cannot find module 'clsx'` hatasıyla karşılaşır.
2. `vitest` ise test motorudur; son kullanıcının tarayıcısına asla gitmemelidir ama `dependencies` altında olduğu için gereksiz yere sunucuya kurulur.

## Doğru örnek

Bağımlılıkların kullanım yerine göre doğru gruplandırıldığı yapı:

```json check
{
  "dependencies": {
    "clsx": "^2.1.1",
    "react": "^19.3.0"
  },
  "devDependencies": {
    "vitest": "^5.0.0"
  }
}
```

Sürüm uyumunu kod tarafında denetlemek istersen, iki sürüm arasındaki değişimin güvenli bir patch güncellemesi olup olmadığını kontrol eden saf bir yardımcı fonksiyonu şöyle düşünebilirsin:

```ts check
interface SimpleVersion {
  major: number
  minor: number
  patch: number
}

export function isSafePatch(current: SimpleVersion, incoming: SimpleVersion): boolean {
  // Sadece aynı MAJOR ve MINOR içinde daha yüksek veya eşit bir PATCH güvenlidir
  if (current.major !== incoming.major || current.minor !== incoming.minor) {
    return false
  }
  return incoming.patch >= current.patch
}
```

## Sık kullanılan pnpm komutları

Geliştirme rutini boyunca terminalde en sık kullanacağın komutlar şunlardır:

```bash
pnpm install              # package.json ve lockfile'a göre tüm projeyi kurar
pnpm add clsx             # clsx paketini dependencies alanına ekler
pnpm add -D vitest        # vitest paketini devDependencies alanına (-D) ekler
pnpm remove clsx          # clsx paketini ve bağlantılarını projeden kaldırır
pnpm <script-adı>         # package.json içindeki bir script'i doğrudan çalıştırır
```

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: Lockfile'ı .gitignore içine koymak]
Belirti → Ekipteki herkesin makinesinde farklı bir sürüm çalışıyor; CI derlemesi rastgele patlıyor.  
Neden → `pnpm-lock.yaml` dosyasının versiyon kontrolüne eklenmemesi (ignore edilmesi).  
Düzeltme → Lockfile dosyasını mutlaka Git'e commit'le. Yalnızca `node_modules/` klasörünü `.gitignore` içine koy.
:::

:::mistake[Sık hata: Sürüm aralıklarındaki şapkayı unutup her şeyi kilitlemek]
Belirti → Güvenlik yamaları veya kritik bugfix güncellemeleri projeye otomatik olarak gelemiyor.  
Neden → `"react": "19.3.0"` şeklinde sembolsüz tam sürüm sabitlemek.  
Düzeltme → Düzenli geriye uyumlu güncellemeleri alabilmek için kütüphanelerde `^` (caret) kullanımını tercih et.
:::

:::sector
Kurumsal şirketlerde bağımlılık güvenliği kritik bir denetim konusudur. CI/CD boru hatlarında `pnpm audit` komutu otomatik olarak koşturulur ve bilinen güvenlik açığı (vulnerability) barındıran paketlerin projeye sızması engellenir. Ayrıca `pnpm install --frozen-lockfile` bayrağı kullanılarak, geliştiricinin haberi olmadan lockfile'ın sunucuda değişmesi kesin olarak yasaklanır.
:::

## Özet

- Node.js geliştirme araçlarının koştuğu çalışma motorudur; pnpm ise paketleri ve sürümleri yönetir.
- `package.json` esnek istekleri tanımlar; `pnpm-lock.yaml` kurulan tam sürümleri mühürler ve mutlaka commit'lenmelidir.
- Tarayıcıda çalışacak kodlar `dependencies`, yalnızca derleme ve testte gereken araçlar `devDependencies` içine eklenir.
- Semver standardında `^` minör ve yama güncellemelerine izin verirken, `~` sadece yama güncellemelerini kabul eder.
- pnpm'in katı yapısı sayesinde `package.json` içinde tanımlanmayan paketler projede import edilemez.

**Kendini yokla:** Tarayıcıda formları doğrulamak için kullanacağın bir kütüphaneyi (`zod`) hangi komutla projeye eklersin?  
*Cevap:* Kod tarayıcıya gideceği için `dependencies` altına girmelidir; `pnpm add zod` komutuyla eklenir (`-D` kullanılmaz).

**Kendini yokla:** `package.json` dosyasında `"vite": "^8.3.0"` yazıyorsa, paket yöneticisi `8.4.1` ve `9.0.0` sürümlerinden hangisini otomatik kurabilir?  
*Cevap:* `8.4.1` sürümünü kurabilir (aynı MAJOR içinde MINOR ve PATCH güncellemesidir); ancak kırıcı değişiklik getiren `9.0.0` MAJOR sürümünü kurmaz.
