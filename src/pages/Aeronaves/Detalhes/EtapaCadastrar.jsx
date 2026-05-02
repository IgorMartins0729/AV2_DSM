import React, { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useAeronaves } from '../../../contexts/AeronavesContext'
import { useFuncionarios } from '../../../contexts/FuncionariosContext'
import styles from '../../../styles/forms.module.css'

const STATUS_ETAPA = ['PENDENTE', 'ANDAMENTO', 'CONCLUIDA']

const valoresIniciais = {
  nome: '',
  prazo: '',
  status: '',
  funcionariosIds: [],
}

function AeronaveEtapaCadastrar() {
  const { aeronave } = useOutletContext()
  const navigate = useNavigate()
  const { adicionarEtapa } = useAeronaves()
  const { funcionarios } = useFuncionarios()
  const [valores, setValores] = useState(valoresIniciais)
  const [erros, setErros] = useState({})

  function atualizarCampo(evento) {
    const { name, value } = evento.target
    setValores((anterior) => ({ ...anterior, [name]: value }))
    if (erros[name]) {
      setErros((anterior) => ({ ...anterior, [name]: undefined }))
    }
  }

  function alternarFuncionario(id) {
    setValores((anterior) => {
      const tem = anterior.funcionariosIds.includes(id)
      return {
        ...anterior,
        funcionariosIds: tem
          ? anterior.funcionariosIds.filter((i) => i !== id)
          : [...anterior.funcionariosIds, id],
      }
    })
  }

  function validar() {
    const novosErros = {}
    if (!valores.nome.trim()) novosErros.nome = 'Informe o nome da etapa.'
    if (!valores.prazo) novosErros.prazo = 'Informe o prazo.'
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

    adicionarEtapa(aeronave.codigo, {
      nome: valores.nome.trim(),
      prazo: valores.prazo,
      status: valores.status,
      funcionariosIds: valores.funcionariosIds,
    })
    navigate('../etapas')
  }

  return (
    <div>
      <Link to="../etapas" className={styles.linkVoltar}>
        <ArrowLeft size={16} /> Voltar para etapas
      </Link>

      <form className={styles.form} onSubmit={aoSubmeter} noValidate>
        <div className={styles.campo}>
          <label htmlFor="nome" className={styles.label}>Nome</label>
          <input
            id="nome"
            name="nome"
            type="text"
            className={styles.input}
            value={valores.nome}
            onChange={atualizarCampo}
            placeholder="Ex: Montagem da fuselagem"
          />
          {erros.nome && <span className={styles.erro}>{erros.nome}</span>}
        </div>

        <div className={styles.linha}>
          <div className={styles.campo}>
            <label htmlFor="prazo" className={styles.label}>Prazo</label>
            <input
              id="prazo"
              name="prazo"
              type="date"
              className={styles.input}
              value={valores.prazo}
              onChange={atualizarCampo}
            />
            {erros.prazo && <span className={styles.erro}>{erros.prazo}</span>}
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
              {STATUS_ETAPA.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {erros.status && <span className={styles.erro}>{erros.status}</span>}
          </div>
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Funcionários associados</label>
          {funcionarios.length === 0 ? (
            <p className={styles.checkboxVazio}>
              Nenhum funcionário cadastrado.{' '}
              <Link to="/funcionarios/cadastrar">Cadastrar funcionário</Link>
            </p>
          ) : (
            <div className={styles.checkboxList}>
              {funcionarios.map((f) => (
                <label key={f.id} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={valores.funcionariosIds.includes(f.id)}
                    onChange={() => alternarFuncionario(f.id)}
                  />
                  {f.nome} <small style={{ color: '#888' }}>(#{f.id} · {f.nivelPermissao})</small>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className={styles.acoes}>
          <button
            type="button"
            className={styles.botaoSecundario}
            onClick={() => navigate('../etapas')}
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

export default AeronaveEtapaCadastrar
