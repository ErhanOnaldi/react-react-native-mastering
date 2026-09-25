## Neden böyle?

Form submit’i Enter tuşuyla da çalışır; yalnız düğmenin `onClick` olayına bağlanmak bu yolu kaçırır. `preventDefault` sayfa yenilenmesini, `trim` boşluklardan oluşan sahte aramayı engeller. Controlled input yazıyı anlık gösterir; submit eylemi son sorguyu bildirir. API araması daha sonra geldiğinde aynı form sözleşmesi korunabilir.
