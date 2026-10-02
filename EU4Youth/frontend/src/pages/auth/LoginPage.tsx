import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../../api/client'
import { useAuth } from '../../auth/AuthProvider'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.token, data.user)
      toast.success('Session ouverte')
      navigate('/dashboard')
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status === 429) toast.error('Trop de tentatives. Réessayez dans une minute.')
      else if (status === 401) toast.error('Identifiants incorrects.')
      else toast.error('API indisponible (port 8040).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <section className="login__brand">
        <div>
          <p className="login__mark">EU4YOUTH</p>
          <p className="login__sub">CMS Live Editor</p>
        </div>
        <div>
          <span className="login__pill">Programme Union européenne</span>
          <h1 className="login__headline">
            Contenu du site
            <br />
            <span>structure réelle des pages</span>
          </h1>
          <p className="login__desc">
            Back-office : pages, textes, images, catalogues et Live Editor FR / EN / AR,
            branché sur le site public.
          </p>
        </div>
        <p className="login__copy">EU4Youth Tunisie — accès Super Admin</p>
      </section>
      <section className="login__panel">
        <form className="login__form" onSubmit={submit}>
          <h1>Connexion</h1>
          <p>Authentification requise. Compte Super Admin uniquement au démarrage.</p>
          <label className="field">
            <span>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="field">
            <span>Mot de passe</span>
            <div className="pass-wrap">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label="Afficher">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : null}
            Entrer dans le CMS
          </button>
        </form>
      </section>
    </div>
  )
}
