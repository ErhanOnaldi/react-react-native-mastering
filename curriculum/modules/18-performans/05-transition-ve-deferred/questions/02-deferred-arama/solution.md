## Neden böyle?
`useDeferredValue` liste render'ını daha düşük önceliğe taşır; input state'ini ertelemeyiz. Bu bir ağ debounce'u değildir. TMDB sorgularında Modül 5'teki debounce hâlâ gerekir. Testler sonucun doğruluğunu ölçer; gerçek scheduling farkını önizlemede 500 satırla gözle.
