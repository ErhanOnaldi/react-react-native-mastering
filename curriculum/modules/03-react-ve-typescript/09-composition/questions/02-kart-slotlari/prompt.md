Kartın çerçevesi içerikten ayrı olsun. `MoviePanel({ children, actions })` yaz; `children: ReactNode`, `actions?: ReactNode`. İçerik `<article>` içinde gösterilsin; actions verilirse `<footer>` içinde gösterilsin, verilmezse boş footer oluşturma. Bir projede actions favori düğmesi, başka yerde puan düğmesi olabilir.

**Örnek:** `actions={<button>Favori</button>}` → düğme footer’da; actions verilmezse footer yok.
