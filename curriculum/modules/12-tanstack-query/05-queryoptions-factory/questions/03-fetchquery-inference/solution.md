## Neden böyle?

`fetchQuery` seçeneklerdeki `queryFn` dönüş tipini bilir; `movie.title` için ayrıca generic gerekmez. `fetchQuery` taze cache’i kullanır; stale olduğunda fetch edebilir. Hover’da sonucu kullanmayacaksan `prefetchQuery` yeterlidir; bir sonraki derste bunu kullanacağız.
