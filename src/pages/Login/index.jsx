import React from 'react'
import styles from './styles.module.css'

function index() {
  return (
    <section>
      <div className={containerCard}>
        <div className={card}>
          <img src="" alt="" />
          <h1>Realizar Login</h1>
          <p>Seja bem vindo novamente! Por favor realize seu login abaixo</p>
          <input type="text" />
          <input type="text" />
          <button>Login</button>
          <p>Caso nao esteja registrado, por favor clicar aqui</p>
        </div>
      </div>
    </section>
  )
}

export default index