## Neden böyle?

URL state sayfayı ve aramayı linkle paylaşır; query key aynı parametreleri cache kimliğine taşır. Parse işlemini tek yerde tutmak `?page=abc` yüzünden TMDB’ye 400 göndermeyi engeller. Gerçek sayfada bunu `useSearchParams` sonucuyla çağırırsın.
