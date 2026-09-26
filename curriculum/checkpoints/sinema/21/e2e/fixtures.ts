/**
 * E2E'lerin `page.route` ile döndürdüğü sabit TMDB/DummyJSON yanıtları.
 * Biçim `curriculum/fixtures/tmdb/movie-550.json` örneğini izler.
 */

export const genreListResponse = {
  genres: [
    { id: 18, name: 'Dram' },
    { id: 53, name: 'Gerilim' },
  ],
}

export const movie550Details = {
  id: 550,
  title: 'Dövüş Kulübü',
  original_title: 'Fight Club',
  overview:
    'Saatli bomba gibi patlamaya hazır, uykusuzluk çeken bir adam ile tekinsiz bir sabun satıcısı; ilkel erkek saldırganlığını şok edici yeni bir terapi yöntemine dönüştürür.',
  poster_path: '/yjMuqAyJUoQZGWsZ0vZuYj5inAR.jpg',
  backdrop_path: '/c6OLXfKAk5BKeR6broC8pYiCquX.jpg',
  release_date: '1999-10-15',
  vote_average: 8.437,
  vote_count: 32910,
  popularity: 48.3804,
  adult: false,
  original_language: 'en',
  video: false,
  runtime: 139,
  genres: [
    { id: 18, name: 'Dram' },
    { id: 53, name: 'Gerilim' },
  ],
  tagline: '',
  status: 'Released',
  budget: 63_000_000,
  revenue: 100_853_753,
  credits: {
    cast: [
      {
        id: 819,
        name: 'Edward Norton',
        character: 'Anlatıcı',
        profile_path: null,
        order: 0,
      },
      {
        id: 287,
        name: 'Brad Pitt',
        character: 'Tyler Durden',
        profile_path: null,
        order: 1,
      },
    ],
    crew: [],
  },
  videos: { results: [] },
}

export const movie550Summary = {
  id: movie550Details.id,
  title: movie550Details.title,
  original_title: movie550Details.original_title,
  overview: movie550Details.overview,
  poster_path: movie550Details.poster_path,
  backdrop_path: movie550Details.backdrop_path,
  release_date: movie550Details.release_date,
  genre_ids: movie550Details.genres.map((genre) => genre.id),
  vote_average: movie550Details.vote_average,
  vote_count: movie550Details.vote_count,
  popularity: movie550Details.popularity,
  adult: movie550Details.adult,
  original_language: movie550Details.original_language,
  video: movie550Details.video,
}

export const loginSuccessResponse = {
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@x.dummyjson.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  accessToken: 'e2e-access-token',
  refreshToken: 'e2e-refresh-token',
}

export function tmdbList(results: unknown[]) {
  return { page: 1, results, total_pages: 1, total_results: results.length }
}
