import { useNavigate } from 'react-router'

export function MovieNavigation() {
  const navigate = useNavigate()
  return (
    <>
      <button type="button" onClick={() => navigate('/')}>
        Ara
      </button>
      <button type="button" onClick={() => navigate('/')}>
        Aramaya dön
      </button>
    </>
  )
}
