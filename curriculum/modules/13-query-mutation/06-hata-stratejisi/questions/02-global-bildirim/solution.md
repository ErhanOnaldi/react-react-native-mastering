## Neden böyle?

MutationCache callback’i uygulama genelindeki log veya bildirim içindir; yerel `onError` rollback’i yapmaya devam eder. `mutateAsync` kullanan event handler yine `try/catch` gerektirir. Sonraki modülde 400 alan hatasını form yanında göstereceksin.
