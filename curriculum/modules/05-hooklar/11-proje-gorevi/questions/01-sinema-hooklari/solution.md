Bu hook’ların dosya yolları sonraki modüllerin import sözleşmesidir. `RemoteData<T>` tipini projede yeniden tanımlama; önceki modülün tipini kullan. `useFetch` yalın kalır; cache ihtiyacı sonraki modüllerde doğacak.

## Alternatif ve tuzak

Hook dosyalarını bileşen içine gömmek ilerideki sayfaların import sözleşmesini bozar. `RemoteData` için mevcut proje tipini kullan.

## Sektörde ve sonra

Router sayfaları aynı hook’ları çağıracak; daha sonra fetch tekrarları cache ihtiyacını görünür kılacak.
