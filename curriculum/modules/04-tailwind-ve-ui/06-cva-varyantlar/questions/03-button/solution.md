## Neden böyle?

`VariantProps<typeof buttonVariants>` izin verilen seçimleri tablodan çıkarır. `ComponentProps<'button'>` doğal HTML davranışını korur; `Omit` ile olası `size` çakışmasını ayırmak iyi alışkanlıktır. `disabled` görünüm class'ı gerçek niteliğin yerini tutmaz. `className` son girdidir, böylece `px-2` üzerine `px-8` verilebilir. Projede aynı API `src/components/ui/button.tsx` yoluna taşınacak.
