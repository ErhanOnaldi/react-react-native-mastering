export function LoginPanel() {
  return (
    <form>
      <label>
        Kullanıcı adı
        <input />
      </label>
      <label>
        Şifre
        <input type="password" />
      </label>
      <button type="submit">Giriş yap</button>
    </form>
  )
}
