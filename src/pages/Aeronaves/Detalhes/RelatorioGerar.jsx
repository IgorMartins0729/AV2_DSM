import React, { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useAeronaves } from '../../../contexts/AeronavesContext'
import styles from '../../../styles/forms.module.css'

const valoresIniciais = {
  nomeCliente: '',
  dataEntrega: '',
}

function AeronaveRelatorioGerar() {
  const { aeronave } = useOutletContext()
  const navigate = useNavigate()
  const { definirRelatorio } = useAeronaves()
  const [valores, setValores] = useState(valoresIniciais)
  const [erros, setErros] = useState({})

  function atualizarCampo(evento) {
    const { name, value } = evento.target
    setValores((anterior) => ({ ...anterior, [name]: value }))
    if (erros[name]) {
      setErros((anterior) => ({ ...anterior, [name]: undefined }))
    }
  }

  function validar() {
    const novosErros = {}
    if (!valores.nomeCliente.trim()) {
      novosErros.nomeCliente = 'Informe o nome do cliente.'
    }
    if (!valores.dataEntrega) {
      novosErros.dataEntrega = 'Informe a data de entrega.'
    }
    return novosErros
  }

  function aoSubmeter(evento) {
    evento.preventDefault()
    const novosErros = validar()
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    definirRelatorio(aeronave.codigo, {
      nomeCliente: valores.nomeCliente.trim(),
      dataEntrega: valores.dataEntrega,
      geradoEm: new Date().toISOString(),
    })
    navigate('../relatorio')
  }

  return (
    <div>
      <Link to="../relatorio" className={styles.linkVoltar}>
        <ArrowLeft size={16} /> Voltar para relatório
      </Link>

      <form className={styles.form} onSubmit={aoSubmeter} noValidate>
        <div className={styles.linha}>
          <div className={styles.campo}>
            <label htmlFor="nomeCliente" className={styles.label}>Nome do Cliente</label>
            <input
              id="nomeCliente"
              name="nomeCliente"
              type="text"
              className={styles.input}
              value={valores.nomeCliente}
              onChange={atualizarCampo}
              placeholder="Ex: LATAM Airlines"
            />
            {erros.nomeCliente && (
              <span className={styles.erro}>{erros.nomeCliente}</span>
            )}
          </div>

          <div className={styles.campo}>
            <label htmlFor="dataEntrega" className={styles.label}>Data de Entrega</label>
            <input
              id="dataEntrega"
              name="dataEntrega"
              type="date"
              className={styles.input}
              value={valores.dataEntrega}
              onChange={atualizarCampo}
            />
            {erros.dataEntrega && (
              <span className={styles.erro}>{erros.dataEntrega}</span>
            )}
          </div>
        </div>

        <div className={styles.acoes}>
          <button
            type="button"
            className={styles.botaoSecundario}
            onClick={() => navigate('../relatorio')}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.botaoPrimario}>
            <Save size={16} /> Gerar
          </button>
        </div>
      </form>
    </div>
  )
}

export default AeronaveRelatorioGerar
