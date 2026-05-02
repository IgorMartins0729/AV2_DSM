import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import styles from '../Login/styles.module.css'
import background from '../../assets/background.png'
import logo from '../../assets/gemini-generated.png'

function Register() {
  const navigate = useNavigate()

  function aoRegistrar(e) {
    e.preventDefault()
    navigate('/aeronaves')
  }

  return (
    <div
      className={styles.tela}
      style={{ backgroundImage: `url(${background})` }}
    >
      <form className={styles.card} onSubmit={aoRegistrar}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt="AeroCode" className={styles.logo} />
        </div>

        <h1 className={styles.titulo}>Criar Conta</h1>
        <p className={styles.subtitulo}>
          Preencha os dados abaixo para criar sua conta.
        </p>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="register-nome">Nome:</label>
          <div className={styles.inputWrapper}>
            <User size={16} className={styles.inputIcone} />
            <input
              id="register-nome"
              type="text"
              className={styles.input}
              defaultValue="João da Silva"
            />
          </div>
        </div>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="register-email">E-mail:</label>
          <div className={styles.inputWrapper}>
            <Mail size={16} className={styles.inputIcone} />
            <input
              id="register-email"
              type="email"
              className={styles.input}
              defaultValue="joao@aerocode.com"
            />
          </div>
        </div>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="register-senha">Senha:</label>
          <div className={styles.inputWrapper}>
            <Lock size={16} className={styles.inputIcone} />
            <input
              id="register-senha"
              type="password"
              className={styles.input}
              defaultValue="123456"
            />
          </div>
        </div>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="register-senha-confirmar">
            Confirmar senha:
          </label>
          <div className={styles.inputWrapper}>
            <Lock size={16} className={styles.inputIcone} />
            <input
              id="register-senha-confirmar"
              type="password"
              className={styles.input}
              defaultValue="123456"
            />
          </div>
        </div>

        <button type="submit" className={styles.botao}>
          Cadastrar
        </button>

        <p className={styles.linkRodape}>
          Já tem uma conta? <Link to="/login">Faça login aqui</Link>.
        </p>
      </form>
    </div>
  )
}

export default Register
