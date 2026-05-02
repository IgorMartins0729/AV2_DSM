import React from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import styles from './styles.module.css'

function BotaoCadastrar({ to, children, icon: Icon = Plus, disabled = false, tituloDesabilitado }) {
  if (disabled) {
    return (
      <button
        type="button"
        className={`${styles.botao} ${styles.desabilitado}`}
        disabled
        title={tituloDesabilitado}
      >
        <Icon size={16} /> {children}
      </button>
    )
  }

  return (
    <Link to={to} className={styles.botao}>
      <Icon size={16} /> {children}
    </Link>
  )
}

export default BotaoCadastrar
