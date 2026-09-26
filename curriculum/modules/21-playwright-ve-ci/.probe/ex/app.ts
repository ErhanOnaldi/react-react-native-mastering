interface Opts {
  title: string
}
export function main(opts: Opts): void {
  const el = document.getElementById('root') as HTMLElement
  const render = (text: string) => {
    el.innerHTML = `<h1>${text}</h1>`
  }
  async function later(): Promise<void> {
    await new Promise((r) => setTimeout(r, 10))
    render(opts.title + '!')
  }
  class Store {
    value = 1
  }
  render(opts.title + new Store().value)
  void later()
}
