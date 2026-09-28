---
title: "Git ile güvenli çalışma"
minutes: 13
kind: concept
---

# Git ile güvenli çalışma

:::pain[Problem]
Dün arama sayfası çalışıyordu. Bugün iki dosyayı değiştirdin, sonra README'yi de düzenledin; şimdi uygulama açılmıyor ve hangi değişikliğin bozduğunu hatırlamıyorsun. Git'e hiç kayıt almadığın için çalışan noktaya dönmek de kolay değil.
:::

## Git üç farklı alanı izler

Git, dosyaların her halini otomatik kaydeden bir bulut kopyası değildir. Depodaki geçmiş, çalışma klasöründeki değişiklikler ve bir sonraki commit için seçtiğin hazırlık alanı ayrı şeylerdir.

![Git çalışma klasörü, staging alanı ve commit geçmişi](diagrams/git-alanlari.svg)

1. **Çalışma klasörü (working tree)** bilgisayarındaki güncel dosyalardır. Burada yeni, değiştirilmiş veya silinmiş dosyalar olabilir.
2. **Hazırlık alanı (staging area)** bir sonraki commit'e girecek değişikliklerin seçkisidir. git add değişikliğin bu anlık halini hazırlar.
3. **Commit geçmişi** kayıt noktalarının zinciridir. git commit hazırlanan değişiklikleri, yazar ve mesajıyla birlikte yeni kayıt olarak ekler.
4. Commit sonrasında çalışma klasörü temizse mevcut dosyalar son kayıtla aynıdır. Sonraki düzenleme çalışma klasörünü tekrar değiştirir; eski commit'in içeriği değişmez.

Bu nedenle git add nokta sonrasında dosyayı yeniden düzenlersen, staging alanındaki kopya ile çalışma klasöründeki son kopya farklı olabilir. Commit'e hangi halin gideceğini git status ve git diff --staged ile görürsün.

## Bir düzeltmenin yolunu izleyelim

README.md ve src/SearchPanel.tsx dosyalarını değiştirdiğini düşün. Önce git status hangi dosyaların değiştiğini gösterir. git diff kayıtlı hal ile çalışma klasörünü karşılaştırır. Yalnızca README'yi commit'e dahil edeceksen git add README.md dersin; böylece bileşen değişikliği henüz seçkiye girmez. git diff --staged commit olacak farkı gösterir. Son olarak commit mesajı bu seçkiye ad verir.

| Komut | Neye bakar? | Neyi değiştirir? |
| --- | --- | --- |
| git status | çalışma klasörü ve staging | hiçbirini |
| git diff | son commit ↔ çalışma klasörü | hiçbirini |
| git add README.md | belirtilen dosyanın güncel hali | staging alanını |
| git diff --staged | staging ↔ son commit | hiçbirini |
| git commit -m "docs: kurulum adımlarını açıkla" | staging alanı | commit geçmişini |

git add “dosyayı depoya koy” değil, “bu değişikliği bir sonraki kayda seç” anlamına gelir. Bu ayrım yanlışlıkla yarım kalan veya ilgisiz değişiklikleri tek kayda almamaya yardım eder.

## Küçük commit, okunur geçmiş

Bir commit'in amacı, tek bir anlaşılır değişiklik için geri dönülebilir kayıt bırakmaktır. Film kartına puan rozeti eklemek ile arama boşken istek atmama hatasını düzeltmek ayrı işlerse ayrı commit'ler daha sonra incelemeyi kolaylaştırır. Commit'ler birlikte bir hikâye oluşturur; git log --oneline bu hikâyenin kısa görünümünü verir.

Birçok ekip Conventional Commits biçimini kullanır:

    <tür>(<kapsam>): <kısa açıklama>

| Tür | Kullanım |
| --- | --- |
| feat | kullanıcıya yeni bir özellik eklemek |
| fix | hatalı davranışı düzeltmek |
| docs | belge veya README düzenlemek |
| test | test eklemek ya da düzeltmek |
| refactor | davranışı değiştirmeden iç yapıyı iyileştirmek |
| chore | bağımlılık ve araç ayarı gibi bakım işi |

Örneğin fix(search): boş sorguda istek gönderme değişikliğin alanını ve kullanıcıya etkisini anlatır. güncellemeler neyin değiştiğini belli etmez. Dosya adını ve yaptığın her kod hareketini mesaja kopyalamak da faydasızdır; bu ayrıntı zaten diff'te görünür.

Commit mesajı için bir ayrıştırıcı yazdığını varsay. Önce ilk satırın tür(kapsam): açıklama yapısında olup olmadığını kontrol edersin. Opsiyonel kapsam yoksa sonuçta kapsam bulunmaz; ! varsa kırıcı değişiklik işaretlenir. Tür izin verilen listede değilse veya açıklama boşsa kayıt biçimi geçersizdir. Mesajın devamındaki gövde bu ilk satır sınıflandırmasının dışında kalır.

| Başlık | Tür | Kapsam | Kırıcı mı? | Açıklama |
| --- | --- | --- | --- | --- |
| feat(catalog): tür filtresi ekle | feat | catalog | hayır | tür filtresi ekle |
| fix!: arama parametresini değiştir | fix | yok | evet | arama parametresini değiştir |
| güncelleme | geçersiz | — | — | — |

## Dallar ve ekip akışı

Dal (branch), ana geçmişe dokunmadan bir iş üzerinde ilerlemenin yoludur. Dalın kendisi dosyaların ayrı klasörü değildir; belirli bir commit'i işaret eden hareketli bir addır. Dal üzerindeyken yaptığın yeni commit'ler o dalın ucunu ileri alır.

    git switch -c feat/katalog-filtresi
    # değişikliği yap, gözden geçir ve commit al
    git switch main

Ekipte değişiklik çoğunlukla pull request (PR) ile incelenir. Başkası diff'i okur, otomatik CI kontrolleri çalışır, sonra ekip değişikliği ana dala birleştirir. Küçük commit'ler, incelemeyi ve bir hata olduğunda hangi kayıtla geldiğini bulmayı kolaylaştırır.

## Bir dosyanın iki kopyasını izleyelim

Staging alanını, bir sonraki commit için seçtiğin değişikliklerin fotoğrafı gibi düşün. Git dosyayı seçmez; dosyanın belirli bir andaki farkını seçer. Bu yüzden aynı dosya hem staged hem unstaged değişiklik taşıyabilir.

| An | Working tree | Staging | Komutun göstereceği |
|---|---|---|---|
| t0 | başlık eski | temiz | çalışma klasörü temiz |
| t1 | başlık yeni | temiz | git diff başlık farkını gösterir |
| t2: git add README.md | başlık yeni | aynı yeni başlık | git diff boş, git diff --staged dolu |
| t3 | başlık daha da değişti | önceki yeni başlık | iki diff farklı içerik gösterir |
| t4: git add README.md | başlık daha da değişti | son hal | staged fark güncellenir |

Buradaki t3 kolay kaçırılır: ilk eklemeden sonra yaptığın yeni düzenleme otomatik olarak seçkiye girmez. Commit alınca yalnızca staging anlık görüntüsü kayda geçer; son working tree düzenlemesi commit sonrasında da bekler. git status dosya adlarını ve her iki alanda değişiklik olup olmadığını özetler, diff komutları içerik farkını gösterir.

Bir hata fark ettiğinde geçmişi incelemek için git log --oneline kayıtların kısa listesini verir. Commit küçük ve tek amaçlıysa değişikliği geri almak veya hangi aşamada bozulduğunu bulmak daha kolaydır. Branch ise commit'lerin hangi çizgide ilerlediğini gösteren addır; aynı working tree'yi otomatik olarak ikinci bir klasöre kopyalamaz. Yeni branch açmak, henüz commit edilmemiş değişiklikleri kendi başına kaydetmez.

Küçük bir çalışma döngüsü güvenli ilerler: önce status ile alanları gör, diff ile düzenlemeleri oku, yalnızca amaçla ilgili dosya veya farkı stage et, staged diff'i son kez incele ve ardından anlaşılır mesajla commit al. Bu döngü bir güvenlik bariyeri değil, yanlış dosyanın kayda girmesini erken gören bir inceleme alışkanlığıdır.

:::mistake[Stage ettikten sonra dosyayı düzenlemeyi unutmak]
**Belirti:** Commit tamamlandı ama son satır değişikliği çalışma klasöründe kaldı. **Neden:** git add sırasında staging'e alınan anlık kopya ile sonraki düzenleme farklı. **Düzeltme:** Commit öncesi status ve diff --staged çıktısını incele; gerekli son hali tekrar stage et.
:::

## Sık hatalar

:::mistake[Hazırlık alanında ne olduğunu bilmeden commit almak]
Belirti → README ile birlikte ilgisiz yarım bir bileşen değişikliği de kayda girmiş.  
Neden → git add . bütün görünür değişiklikleri seçmiş, staging farkı incelenmemiş.  
Düzeltme → Dosyaları tek tek ekle veya tümünü ekledikten sonra git diff --staged çıktısını gözden geçir.
:::

:::mistake[Commit mesajının değişikliği anlatmaması]
Belirti → Geçmişte son, fix, güncelleme gibi kayıtlar arasında arama yapamıyorsun.  
Neden → Mesaj amaç veya etkiyi söylemiyor.  
Düzeltme → fix(search): boş sorguda istek gönderme gibi kısa bir neden/sonuç yaz.
:::

:::mistake[Env veya üretilmiş dosyayı geçmişe eklemek]
Belirti → Gizli token GitHub'a gönderilmiş ya da node_modules değişiklikleri diff'i dolduruyor.  
Neden → Commit öncesi seçki incelenmemiş veya ignore kuralları eksik.  
Düzeltme → Sırrı ifşa ettiysen iptal edip yenisini al; dosya desenlerini .gitignore içinde tut ve staging farkını tekrar kontrol et.
:::

:::sector
Takımlar küçük commit'leri code review, otomatik testler ve yayın notlarıyla birleştirir. CI, dalın beklenen kontrollerden geçtiğini doğrular; commit mesajı ve diff ise bir değişikliğin neden yapıldığını ekip arkadaşına aktarır. Bu yüzden mesaj biçimi çoğu depoda otomatik denetlenebilir.
:::

## Özet

- Çalışma klasörü, staging alanı ve commit geçmişi birbirinden ayrı üç alandır.
- git add bir sonraki commit için değişiklik seçer; git diff --staged seçimi gösterir.
- Küçük, tek amaçlı commit ve açık mesaj geçmişi anlaşılır kılar.
- Dallar işi ana geçmişten ayırır; PR ve CI değişikliği ekipçe gözden geçirir.

**Kendini yokla:** git diff boş ama git diff --staged doluysa ne anlama gelir?  
*Cevap:* Çalışma klasöründe son commit'ten sonra ek fark yok; staging alanında commit edilmeyi bekleyen değişiklik var.

**Kendini yokla:** README dosyasını güncelledin ama bileşen değişikliğini bu commit'e almak istemiyorsun. Nasıl seçersin?  
*Cevap:* Yalnızca README'yi git add README.md ile staging'e al ve git diff --staged ile seçimi doğrula.
