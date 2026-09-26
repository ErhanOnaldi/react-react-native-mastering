// Gerçek Open Library cevaplarından kısaltılmış örnekler (testler gerçek ağa çıkmaz).
export interface SearchDocFixture {
  key: string
  title: string
  author_name?: string[]
  author_key?: string[]
  first_publish_year?: number
  cover_i?: number
}

export const duneDoc: SearchDocFixture = {
  key: '/works/OL893414W',
  title: 'Dune',
  author_name: ['Frank Herbert'],
  author_key: ['OL79034A'],
  first_publish_year: 1965,
  cover_i: 11481354,
}

export const messiahDoc: SearchDocFixture = {
  key: '/works/OL893461W',
  title: 'Dune Messiah',
  author_name: ['Frank Herbert'],
  author_key: ['OL79034A'],
  first_publish_year: 1969,
  cover_i: 980253,
}

/** Gerçek veri kirliliği: kapak, yazar ve yıl yok. */
export const bareDoc: SearchDocFixture = {
  key: '/works/OL12943962W',
  title: 'Suc ve ceza',
}

export const searchDocs = [duneDoc, messiahDoc, bareDoc]

export const duneWork = {
  key: '/works/OL893414W',
  title: 'Dune',
  description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.',
  covers: [11481354, -1],
  subjects: ['Science fiction', 'Ecology'],
  authors: [{ author: { key: '/authors/OL79034A' }, type: { key: '/type/author_role' } }],
}

/** description bu kez `{ type, value }` nesnesi; yazarı da bulunamayacak. */
export const sucWork = {
  key: '/works/OL24252290W',
  title: 'Suç ve Ceza',
  description: { type: '/type/text', value: 'Raskolnikov’un hikâyesi.' },
  covers: [-1],
  authors: [{ author: { key: '/authors/OL22242A' } }],
}

export const herbert = { key: '/authors/OL79034A', name: 'Frank Herbert' }
