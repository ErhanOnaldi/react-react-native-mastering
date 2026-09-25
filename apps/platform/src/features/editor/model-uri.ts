/** Monaco model URI'si: dosyalar arası import'ların çözülmesi için sanal dosya sistemi yolu. */
export function modelUri(root: string, name: string) {
  return `file:///${root}/${name}`
}
