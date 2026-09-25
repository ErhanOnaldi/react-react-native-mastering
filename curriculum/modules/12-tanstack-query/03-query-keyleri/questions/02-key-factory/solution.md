## Neden böyle?

Key’ler veri kimliğidir; `queryFn` içindeki parametreler mutlaka key’e yansımalı. Arama metnindeki baş/son boşluğu normalize etmek gereksiz cache parçalanmasını azaltır. Bu factory sonraki derste `queryOptions` ile birleşir; mutation bölümünde de invalidation hedefi olur.
