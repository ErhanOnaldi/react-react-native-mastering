export interface WatchlistRecord {
  id: string
  name: string
  description: string
  movieTitle: string
}

export const watchlists: WatchlistRecord[] = [
  {
    id: 'aksiyon-gecesi',
    name: 'Aksiyon Gecesi',
    description: 'Cuma akşamı için seçtiklerim',
    movieTitle: 'Dövüş Kulübü',
  },
  {
    id: 'bilim-kurgu-maratonu',
    name: 'Bilim Kurgu Maratonu',
    description: 'Uzun hafta sonu listesi',
    movieTitle: 'Başlangıç',
  },
]
