---
title: "Formdaki iki kural listesini birleştir"
minutes: 14
kind: concept
---

# Formdaki iki kural listesini birleştir

:::pain[Problem]
İzleme listesi formunda boş ad hem RHF register kuralında hem başka bir yerde kontrol ediliyor. Biri trimliyor, diğeri yalnızca boş string arıyor; aynı değer bir akışta geçip diğerinde kalıyor.
:::

## Form durumu ile veri sözleşmesi

React Hook Form alanların ekrandaki değerini, touched/dirty bilgisini ve submit akışını yönetir. Zod ise bir değerin geçerli olup olmadığını ve parse sonrasında hangi biçimde olacağını tanımlar. İki aracın işi farklıdır. Kuralları hem register seçeneklerinde hem Zod şemasında tutarsan iki kaynak zamanla ayrışır; zodResolver şema sonucunu RHF'nin alan hatalarına ve submit değerine bağlar.

:::model[Tip derlemede, veri çalışma anında]
Bir form değeri kullanıcı tarafından üretildiği için parse edilene kadar dış girdidir. Zod şeması onu çalışma anında denetler; başarılı sonuç form callback'ine tipli değer verir. RHF input state'ini yönetir, ama dış değerin sözleşmeye uyduğunu tek başına kanıtlamaz.
:::

![Bilinmeyen dış verinin doğrulamayla tipli veriye ya da hataya ayrıldığını gösteren akış](diagram:zod-sinir)

Form bağlantısında şu kuralları uygula:

1. Her alan için iş kuralını tek bir Zod şemasında tanımla; register içine aynı required/min/max kuralını tekrar yazma.
2. useForm içindeki resolver seçeneğine zodResolver(schema) ver. RHF, submit öncesinde şemayı çalıştırır.
3. Şema başarısızsa RHF'nin errors nesnesinde alan issue'ları bulunur. Arayüz mesajı, label ilişkisi ve erişilebilir duyuru hâlâ bileşenin sorumluluğundadır.
4. Şema dönüşüm yapmıyorsa form girdi tipi ve submit tipi çoğunlukla aynıdır. Coercion/transform varsa useForm'un input, context ve output generic'lerini ayır.
5. Submit callback'inde kullanacağın veriyi şemanın output tipinden üret; ham inputu assertion ile outputmuş gibi gösterme.

Bu ayrım, aynı doğrulama kuralının form dışındaki API client'ta veya testte de kullanılabilmesini sağlar. RHF, hata mesajlarını otomatik olarak erişilebilir tasarıma dönüştürmez. Bir input için label sunmalı; geçersiz durumda aria-invalid belirtmeli; hata metnini input'a açıklama olarak bağlamalı ve mesajı uygun role ile duyurmalısın.

## İki tipli bir formu izleyelim

Bir yayın yılı input'u HTML'den string gelir; başarılı submit'te number gerekir. Şema girişte metni alıp çıktı olarak sayıyı verir:

Kırık formda kural yalnız input niteliğine bırakılmış, submit callback'i de gelen ham stringi sayı gibi kullanıyor:

```tsx
function BrokenYearForm() {
  const { register, handleSubmit } = useForm()
  return <form onSubmit={handleSubmit((values) => console.log(values.year + 1))}>
    <input type="number" {...register('year')} />
    <button>Kaydet</button>
  </form>
}
```

Burada aralık denetimi yoktur ve input metniyle sayı işlemi birbirine karışır. Şemaya bağlanan doğru akış bir sonraki örnekteki gibi parse edilmiş output kullanır.

```tsx check
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const yearSchema = z.object({
  year: z.coerce.number().int().min(1888).max(2100),
})

export function YearForm() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<z.input<typeof yearSchema>, unknown, z.output<typeof yearSchema>>({
      resolver: zodResolver(yearSchema),
    })
  return <form onSubmit={handleSubmit((value) => console.log(value.year))}>
    <label>Yayın yılı<input type="number" {...register('year')} /></label>
    {errors.year && <p role="alert">{errors.year.message}</p>}
    <button>Kaydet</button>
  </form>
}
```

| Zaman | Tür | Değer | Kim kullanır? |
| --- | --- | --- | --- |
| Input okunur | input | "2001" | RHF alan state'i |
| Resolver başlar | input | "2001" | Zod coercion ve kurallar |
| Başarılı sonuç | output | 2001 | handleSubmit callback'i |
| Sınır dışı değer | hata | issue | formState.errors ve arayüz |

Sıra nettir: kullanıcı yazar, RHF ham alan değerini tutar, submit olayı resolver'ı çalıştırır, şema coercion ve aralık kontrolü yapar. Başarılıysa callback'e output geçer; başarısızsa callback çağrılmaz ve field error gösterilir. Input'un HTML type'ı number olsa da form kütüphanesinin tuttuğu değer kendiliğinden TypeScript number olmaz. Native input event'i yine metin değeri taşır.

Bu formda useForm'un ilk generic'i input şeklidir, üçüncü generic'i resolver'ın ürettiği output şeklidir. Ortadaki context generic'i burada ek bağlam olmadığından unknown bırakılır. Her üç generic'i aynı tipe yazmak, dönüşüm yokken çalışabilir; dönüşüm eklenince iki gerçeği tek tipe zorlar ve yanlış callback tipi üretir.

## Hata arayüzüne ulaşmalı

Alan hatası şemada üretilir, fakat kullanıcıya ulaşması için bileşenin onu render etmesi gerekir. Şema mesajı "Yayın yılı aralık dışında" diyebilir; input'a aria-invalid niteliği verilebilir ve hata metni role=alert ile gösterilebilir. Daha büyük formda error element'inin id'sini input'un aria-describedby niteliğine bağlamak, ilişkiyi ekran okuyucuya da taşır.

Hatanın ne zaman görünmesi gerektiği de ürün davranışıdır. Kullanıcı henüz input'a dokunmadan boş alanları kırmızı yapmak çoğu formda gereksiz gürültü üretir. İlk submit denemesinden sonra alan hatasını göstermek, kullanıcının tamamlayıp gönderme akışıyla uyumludur. Blur sonrasında doğrulama ise yanlış formatı erken düzeltebilir; ama her tuş vuruşunda hata metni titreşiyorsa erişilebilirlik ve odak deneyimi zarar görebilir.

Resolver'a verilen şema alan isimlerini formdaki register adlarıyla aynı tutmalıdır. Eğer input name=year ama şemada publishYear varsa parse kuralı beklenen değeri bulamaz. Bu bir Zod bug'ı değil; iki form sözleşmesinin aynı isimde buluşmadığı anlamına gelir. Alan adlarını, label metnini ve hata nesnesindeki key'i birlikte izlemek problemi bulmayı kolaylaştırır.

Bir alanlar arası refine kuralı hata yolu belirlediyse resolver onu doğru errors alanına yerleştirebilir. Yol yoksa hata form kökünde kalabilir. Dolayısıyla Zod şemasının path kararı ile React markup'ının label, invalid state ve açıklama bağı beraber tasarlanır. Bunlardan biri eksikse hata teknik olarak vardır ama kullanıcı doğru alanı bulamayabilir.

RHF'nin register API'si alanı form state'ine bağlar; placeholder label yerine geçmez. Native required nitelikleri gibi tarayıcı davranışları da varsa, bunların iş kuralını ikinci kez tanımlayıp tanımlamadığını düşün. Aynı mesajı farklı biçimde üreten iki validator, kullanıcının hangi kuralın geçerli olduğunu anlamasını zorlaştırır. Şema tek kaynaksa ekip kuralı değiştiğinde bir yeri günceller.

Alan bazlı doğrulama kullanıcı yazarken veya submit anında çalışabilir; bu ayar form deneyimini belirler. Bir kural çok pahalı değilse anlık hata düzeltme rahat olabilir. Fakat alanlar arası ilişki, kullanıcının diğer alanı doldurmadan önce hata gösterebilir. Hata zamanlaması şemanın içeriği kadar formun mode tercihidir. Mesajı erken göstermek kullanıcının dikkatini dağıtıyorsa submit sonrasına bırak.

Başarılı submit'te callback'e gelen output, yalnızca UI için değil kayıt isteği için de doğru sözleşmedir. Örneğin boşlukları temizlenmiş liste adı doğrudan API payload'ına gider. Callback içinde tekrar trim yapmak ikinci bir normalizasyon noktası oluşturur. Form, şemanın başarılı çıktısını kullanmalı; API client da response tarafında benzer biçimde doğrulanmış data döndürmelidir.

Erişilebilir hata ilişkisini kurarken tek bir alanı invalid ilan etmek yeterli olmayabilir. Input'un aria-invalid niteliği hata durumunu belirtir. aria-describedby ile hata elementinin id'si bağlanır; role=alert form submitinden sonra yeni mesajı duyurabilir. Her form aynı anda her mekanizmayı kullanmak zorunda değil, fakat label ve anlaşılır alan mesajı mutlaka bulunmalıdır. Görsel kırmızı kenar tek başına hata açıklaması değildir.

## Sık yanılgılar

:::mistake[Kuralları register'da çoğaltmak]
Belirti → Şema boşlukları trimleyip reddederken input boş olmayan boşlukları kabul eder veya farklı mesaj çıkar. Neden → RHF ve Zod'da iki kural listesi oluştu. Düzeltme → İş kurallarını şemada tut; resolver'ı bağla ve register'ı alan bağlantısı için kullan.
:::

:::mistake[HTML number input'u number sanmak]
Belirti → Callback string alıyor veya sayı işlemi beklenmedik sonuç veriyor. Neden → Input değeri ham form biçiminde kaldı. Düzeltme → Şemada coercion yap ve input/output generic'lerini ayır.
:::

:::mistake[Hata mesajını ekrana taşımamak]
Belirti → Submit olmuyor ama kullanıcı nedenini göremiyor. Neden → formState.errors render edilmedi veya yalnız görsel renk kullanıldı. Düzeltme → İlgili alan mesajını görünür ve erişilebilir şekilde ilişkilendir.
:::

:::sector
Ürün formlarında Zod şeması veri sözleşmesinin sahibi, RHF etkileşim durumunun sahibidir. Takım, alan kuralını şemada tutar; form bileşeninde her input için label, invalid durumu ve hata ilişkisini inceler. Aynı şema API'ye gidecek submit değerini hazırlarken form akışının dışındaki parse işlemlerinde de tekrar kullanılabilir.
:::

## Özet

- RHF alan ve submit akışını, Zod veri kurallarını yönetir.
- zodResolver şema doğrulamasını RHF'ye bağlar; register iş kuralı kopyası değildir.
- Dönüşümde input ham değer, output callback'e giden değerdir.
- Hata metnini erişilebilir biçimde input'a bağlamak bileşenin işidir.

**Kendini yokla:** Resolver başarısız olduğunda submit callback'i hangi veriyle çağrılır?  
*Cevap:* Çağrılmaz; hata alanı form state'inde gösterilir.

**Kendini yokla:** Number input'u neden tek başına callback değerini number yapmaz?  
*Cevap:* HTML alanının ham form değeri string olabilir; dönüşümü açıkça yapmalısın.
