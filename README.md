# React Mastering

Sektör standardında React öğrenmek için yerelde çalışan, LeetCode tarzı etkileşimli bir öğrenme platformu.

- **23 modül**, her biri ihtiyaçtan doğan bir **acı noktasıyla** açılır: önce bildiğin yöntemle çözersin, sorunu gözünle görürsün (test mesajı, canlı önizlemedeki istek sayacı…), sonra onu çözen aracı öğrenirsin.
- **Dersler başvuru kaynağı gibi yazılır:** her kavram önce bir zihinsel modelle (diyagramlı) kurulur, sonraki derslerde hatırlatılır ve yeni bağlama uygulanır.
- **Üç soru tipi:** quiz, platform içindeki editörde kod görevi (LeetCode gibi: görev ne istendiğini söyler, yöntem ipuçlarındadır; gerçek Vitest testleri + TypeScript kontrolü) ve VS Code'da **Sinema** projesinde proje görevi.
- **Web platformu da işin içinde:** tarayıcıda debug, HTTP/CORS/HTTP cache, güvenlik (XSS, CSP, CSRF, sırlar), Web Vitals, yayına alma ve hata izleme, i18n ve animasyon.
- **Stack:** React 19, TypeScript, Tailwind CSS 4, React Router 8, TanStack Query, React Hook Form, Zod, Redux Toolkit, Vitest, React Testing Library, MSW, Playwright, ESLint, Prettier, shadcn/ui (opsiyonel).

## Kurulum

Gereksinimler: Node.js 24+, pnpm 10+ (`corepack enable` pnpm'i açar). macOS ve Linux'ta çalışır; Windows'ta WSL kullan.

```bash
pnpm install
pnpm setup:projects               # projects/sinema'yı başlangıç iskeletinden oluşturur
pnpm install                      # yeni projenin bağımlılıklarını bağlar
npx playwright install chromium   # 21. modül (E2E testleri) için, bir kez
```

Kök dizindeki `.env` dosyasına TMDB token'ını ekle (Sinema projesi gerçek API'yi kullanır; platformdaki egzersizler ve önizleme sahte veriyle çalışır):

```bash
cp .env.example .env
# VITE_TMDB_TOKEN=<themoviedb.org → Ayarlar → API → "API Read Access Token">
```

## Kullanım

```bash
pnpm dev          # platform: http://127.0.0.1:5173
```

- Soruları platformda çöz; kod görevlerinde **⌘/Ctrl + Enter** testleri çalıştırır.
- Proje görevleri `projects/sinema` içinde, VS Code'da yapılır. Sinema'yı ayrı bir terminalde çalıştır:

```bash
cd projects/sinema
pnpm dev          # http://localhost:5174
```

- Testleri terminalden çalıştırmak (özellikle VS Code'da çalışırken):

```bash
pnpm check 7.2.3            # tek sefer
pnpm check 7.2.3 --watch    # dosya değiştikçe
pnpm check                  # son açtığın soru
```

- Bir modülde takılırsan ya da projen çok dağıldıysa, o modülün başındaki doğrulanmış hali ayrı bir klasöre açabilirsin:

```bash
pnpm checkpoint 12          # → projects/sinema@12
```

- Birçok modülün sonunda bir **Atölye** dersi var: daha az yönlendirmeyle teşhis, refactor ve "sadece gereksinim" görevleri. Mimari görevleri ayrı bir pratik projesinde yaparsın (ilk kez Modül 9'da):

```bash
pnpm setup:projects atolye   # projects/atolye'yi oluşturur (bir kez)
pnpm install
cd projects/atolye && pnpm dev   # http://localhost:5175
```

- Açık uçlu görevlerde **"AI review prompt'unu kopyala"** butonu, görevi, değerlendirme kriterlerini ve kodunu hazır bir prompt'a dönüştürür; istediğin AI aracına (Claude, ChatGPT…) yapıştırıp geri bildirim al.

İlerlemen `progress.json`'da, platformdaki çözümlerin `workspace/` altında durur (ikisi de git dışında).

## Proje yapısı

```
apps/platform      Öğrenme arayüzü (Vite + React + Monaco + canlı önizleme)
apps/server        Yerel API (Hono, yalnızca 127.0.0.1)
packages/runner    Testleri ayrı süreçte çalıştıran motor (Vitest + tsc, mutation testing)
packages/content   İçerik şemaları, yükleyici, Markdown motoru
packages/cli       pnpm check / checkpoint / validate:content
curriculum/        Modüller, dersler, sorular, sahte API'ler (MSW), Sinema checkpoint'leri
projects/sinema    Senin projen (modül modül büyür)
projects/atolye    Atölye mimari görevleri için pratik projen
docs/              Tasarım, müfredat planı, içerik yazım rehberi, araştırma notları
```

## Geliştirme (platformun kendisi)

```bash
pnpm test                    # motor + platform testleri
pnpm test:e2e                # uçtan uca duman testi
pnpm lint && pnpm typecheck
pnpm validate:content        # tüm içerik: şemalar, kod blokları, çözüm geçer / başlangıç kalır, checkpoint'ler
pnpm validate:content -m 5   # tek modül
pnpm preview:diagram curriculum/diagrams   # diyagram yerleşim denetimi + iki temada PNG (macOS)
```

İçerik yazmak için: `docs/authoring-guide.md` ve `docs/curriculum-plan.md`.
