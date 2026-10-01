export interface LoginValues {
  username: string
  password: string
}
export function LoginForm({
  onLogin,
}: {
  onLogin: (credentials: { username: string; password: string }) => Promise<void> | void
}) {
  return (
    <form>
      <label>
        Kullanıcı adı
        <input />
      </label>
      <label>
        Parola
        <input type="password" />
      </label>
      <button>Giriş yap</button>
    </form>
  )
}
