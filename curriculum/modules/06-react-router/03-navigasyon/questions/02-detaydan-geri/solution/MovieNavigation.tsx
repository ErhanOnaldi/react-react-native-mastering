import { Link, useNavigate } from 'react-router'

export function MovieNavigation() {
  const navigate = useNavigate()
  return (
    <>
      <Link to="/search">Ara</Link>
      <button type="button" onClick={() => navigate(-1)}>
        Aramaya dön
      </button>
    </>
  )
}
