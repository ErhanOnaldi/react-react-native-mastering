---
title: Node, pnpm ve package.json
minutes: 9
---

# Node, pnpm ve package.json

:::pain[Problem]
Bir projeyi ilk kez açtın. `pnpm install` yazdın; yüzlerce klasör indi. `pnpm dev` yazdın; bir sunucu açıldı. Peki hangi paketlerin indirileceğini, `dev` komutunun ne çalıştıracağını **kim, nereden biliyor?**
:::

Cevap tek bir dosyada: **`package.json`**. Ama önce iki aktörü tanıyalım.

## Node.js ve paket yöneticisi

- **Node.js**, JavaScript'i tarayıcı dışında çalıştıran ortamdır. Vite, TypeScript derleyicisi, testler… geliştirme araçlarının hepsi Node üzerinde çalışır. Uygulaman ise sonunda **tarayıcıda** çalışır.
- **Paket yöneticisi** (npm, pnpm, yarn), başkalarının yazdığı kodları (paketleri) indirir ve sürümlerini yönetir. Biz **pnpm** kullanıyoruz: paketleri diskte tek bir yerde saklayıp projelere bağlar (hızlı ve yer kazandırır), ayrıca `package.json`'da yazmayan bir paketi import etmene izin vermez (katıdır — bu iyi bir şey).

## package.json'ı okumak

Sinema projesinin `package.json`'ı (kısaltılmış):

```json title="projects/sinema/package.json"
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
    "react": "^19.3.0",
    "react-dom": "^19.3.0"
  },
  "devDependencies": {
    "typescript": "~6.0.3",
    "vite": "^8.3.1"
  }
}
```

| Alan | Anlamı |
| --- | --- |
| `scripts` | Kısayol komutlar. `pnpm dev` → `vite` komutunu çalıştırır. `pnpm build` önce `tsc -b` (tip kontrolü), **başarılıysa** (`&&`) `vite build`. |
| `dependencies` | Uygulamanın **çalışırken** ihtiyaç duyduğu paketler: son kullanıcının tarayıcısına giden kodun parçası (React gibi). |
| `devDependencies` | Yalnızca **geliştirirken** gereken araçlar: derleyici, bundler, test, lint (Vite, TypeScript gibi). |
| `"type": "module"` | Dosyalar modern ES modülü (`import/export`) olarak yorumlanır. |

## Sürüm aralıkları (semver)

Sürümler `MAJOR.MINOR.PATCH` biçimindedir: `19.3.0`.

- **PATCH** (19.3.**1**): hata düzeltmesi, geriye uyumlu.
- **MINOR** (19.**4**.0): yeni özellik, geriye uyumlu.
- **MAJOR** (**20**.0.0): kırıcı değişiklik (breaking change) — kodunu değiştirmen gerekebilir.

| Yazım | Kabul ettiği | Örnek |
| --- | --- | --- |
| `^19.3.0` | Aynı MAJOR içinde ≥ 19.3.0 | 19.3.5 ✅ 19.9.0 ✅ 20.0.0 ❌ |
| `~6.0.3` | Aynı MINOR içinde ≥ 6.0.3 | 6.0.9 ✅ 6.1.0 ❌ |
| `19.3.0` | Yalnızca tam o sürüm | — |

:::tip[Neden TypeScript `~` ile?]
TypeScript minor sürümlerde bile yeni tip hataları yakalayabilir. Takımlar bu yüzden onu daha sıkı (`~`) sabitler: kimse "dün derleniyordu, bugün derlenmiyor" sürpriziyle karşılaşmasın.
:::

## Lockfile: aynı kod, aynı paketler

Aralıklar esnek olduğu için iki farklı günde yapılan kurulum farklı sürümler indirebilir. **`pnpm-lock.yaml`** gerçekte kurulan **tam** sürümleri kaydeder. Takımdaki herkes (ve CI sunucusu) aynı sürümlerle çalışır.

- `pnpm-lock.yaml` → **commit'lenir**.
- `node_modules/` → **asla commit'lenmez** (`.gitignore`'da); lockfile'dan her zaman yeniden kurulabilir.

## Sık kullanacağın komutlar

```bash
pnpm install              # package.json + lockfile'a göre kur
pnpm add zod              # dependency ekle
pnpm add -D vitest        # devDependency ekle
pnpm remove zod           # kaldır
pnpm dev                  # "dev" script'ini çalıştır (pnpm run dev ile aynı)
```

:::mistake
Tarayıcıda çalışan kodun import ettiği bir paketi `devDependencies`'e koymak. Geliştirirken çalışır, ama bazı kurulum senaryolarında (örn. `pnpm install --prod`) paket gelmez. Kural: **import ettiği kod son kullanıcıya gidiyorsa → `dependencies`**.
:::

:::sector
Bu repo bir **pnpm workspace** (monorepo): kökte bir `package.json`, `apps/*`, `packages/*` ve `projects/*` altında ayrı paketler var. `projects/sinema` da bunlardan biri. Büyük şirketlerde birden çok uygulama ve paylaşılan paket böyle tek repoda tutulur.
:::
