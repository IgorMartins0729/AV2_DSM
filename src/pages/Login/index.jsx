import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Lock } from 'lucide-react'
import styles from './styles.module.css'
import background from '../../assets/background.png'
import logo from '../../assets/gemini-generated.png'

function Login() {
  const navigate = useNavigate()

  function aoEntrar(e) {
    e.preventDefault()
    navigate('/aeronaves')
  }

  return (
    <div
      className={styles.tela}
      style={{ backgroundImage: `url(${background})` }}
    >
      <form className={styles.card} onSubmit={aoEntrar}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt="AeroCode" className={styles.logo} />
        </div>

        <h1 className={styles.titulo}>Realizar Login</h1>
        <p className={styles.subtitulo}>
          Seja bem-vindo novamente! Por favor realize seu login abaixo.
        </p>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="login-usuario">Usuário:</label>
          <div className={styles.inputWrapper}>
            <User size={16} className={styles.inputIcone} />
            <input
              id="login-usuario"
              type="text"
              className={styles.input}
              defaultValue="admin"
            />
          </div>
        </div>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="login-senha">Senha:</label>
          <div className={styles.inputWrapper}>
            <Lock size={16} className={styles.inputIcone} />
            <input
              id="login-senha"
              type="password"
              className={styles.input}
              defaultValue="123456"
            />
          </div>
        </div>

        <button type="submit" className={styles.botao}>
          Login
        </button>

        <p className={styles.linkRodape}>
          Caso não esteja registrado, por favor{' '}
          <Link to="/register">clique aqui</Link>.
        </p>
      </form>
    </div>
  )
}

export default Login
