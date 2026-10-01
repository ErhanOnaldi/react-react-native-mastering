## Neden böyle?

`Omit<ComponentProps<'button'>, 'type'>`, önceki modüldeki `Omit` bilgisini bir DOM bileşeni API’sine taşır. `type="button"` form içindeki yanlış submit’i önler. Spread edilen doğal props, `disabled`, `onClick` ve `aria-pressed` gibi alanları korur. `type` alanını props’tan çıkarmazsan çağıran `submit` vererek güvenlik kararını bozabilir.
