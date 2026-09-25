export interface LoginValues {
  username: string
  password: string
}
export function LoginForm({
  onLogin,
}: {
  onLogin: (values: LoginValues) => Promise<unknown> | unknown
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
