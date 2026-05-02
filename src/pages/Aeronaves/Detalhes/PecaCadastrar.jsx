import React, { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useAeronaves } from '../../../contexts/AeronavesContext'
import styles from '../../../styles/forms.module.css'

const TIPOS_PECA = ['NACIONAL', 'IMPORTADA']
const STATUS_PECA = ['EM_PRODUCAO', 'EM_TRANSPORTE', 'PRONTA']

const valoresIniciais = {
  nome: '',
  tipo: '',
  fornecedor: '',
  status: '',
}

function AeronavePecaCadastrar() {
  const { aeronave } = useOutletContext()
  const navigate = useNavigate()
  const { adicionarPeca } = useAeronaves()
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
    if (!valores.nome.trim()) novosErros.nome = 'Informe o nome da peça.'
    if (!valores.tipo) novosErros.tipo = 'Selecione o tipo.'
    if (!valores.fornecedor.trim()) novosErros.fornecedor = 'Informe o fornecedor.'
    if (!valores.status) novosErros.status = 'Selecione o status.'
    return novosErros
  }

  function aoSubmeter(evento) {
    evento.preventDefault()
    const novosErros = validar()
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    adicionarPeca(aeronave.codigo, {
      nome: valores.nome.trim(),
      tipo: valores.tipo,
      fornecedor: valores.fornecedor.trim(),
      status: valores.status,
    })
    navigate('../pecas')
  }

  return (
    <div>
      <Link to="../pecas" className={styles.linkVoltar}>
        <ArrowLeft size={16} /> Voltar para peças
      </Link>

      <form className={styles.form} onSubmit={aoSubmeter} noValidate>
        <div className={styles.linha}>
          <div className={styles.campo}>
            <label htmlFor="nome" className={styles.label}>Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              className={styles.input}
              value={valores.nome}
              onChange={atualizarCampo}
              placeholder="Ex: Turbina V2500"
            />
            {erros.nome && <span className={styles.erro}>{erros.nome}</span>}
          </div>

          <div className={styles.campo}>
            <label htmlFor="fornecedor" className={styles.label}>Fornecedor</label>
            <input
              id="fornecedor"
              name="fornecedor"
              type="text"
              className={styles.input}
              value={valores.fornecedor}
              onChange={atualizarCampo}
              placeholder="Ex: Pratt & Whitney"
            />
            {erros.fornecedor && (
              <span className={styles.erro}>{erros.fornecedor}</span>
            )}
          </div>
        </div>

        <div className={styles.linha}>
          <div className={styles.campo}>
            <label htmlFor="tipo" className={styles.label}>Tipo</label>
            <select
              id="tipo"
              name="tipo"
              className={styles.input}
              value={valores.tipo}
              onChange={atualizarCampo}
            >
              <option value="">Selecione...</option>
              {TIPOS_PECA.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {erros.tipo && <span className={styles.erro}>{erros.tipo}</span>}
          </div>

          <div className={styles.campo}>
            <label htmlFor="status" className={styles.label}>Status</label>
            <select
              id="status"
              name="status"
              className={styles.input}
              value={valores.status}
              onChange={atualizarCampo}
            >
              <option value="">Selecione...</option>
              {STATUS_PECA.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
            {erros.status && <span className={styles.erro}>{erros.status}</span>}
          </div>
        </div>

        <div className={styles.acoes}>
          <button
            type="button"
            className={styles.botaoSecundario}
            onClick={() => navigate('../pecas')}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.botaoPrimario}>
            <Save size={16} /> Salvar
          </button>
        </div>
      </form>
    </div>
  )
}

export default AeronavePecaCadastrar
