import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import PageStub from '../../../components/PageStub'
import { useAeronaves } from '../../../contexts/AeronavesContext'
import styles from '../../../styles/forms.module.css'

const TIPOS_AERONAVE = ['COMERCIAL', 'MILITAR']

const valoresIniciais = {
  codigo: '',
  modelo: '',
  tipo: '',
  capacidade: '',
  alcance: '',
}

function AeronaveCadastrar() {
  const navigate = useNavigate()
  const { cadastrar } = useAeronaves()
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

    if (!valores.codigo.trim()) {
      novosErros.codigo = 'Informe o código da aeronave.'
    }
    if (!valores.modelo.trim()) {
      novosErros.modelo = 'Informe o modelo.'
    }
    if (!valores.tipo) {
      novosErros.tipo = 'Selecione o tipo.'
    }

    const capacidade = Number(valores.capacidade)
    if (!valores.capacidade || Number.isNaN(capacidade) || capacidade <= 0) {
      novosErros.capacidade = 'Capacidade deve ser maior que zero.'
    }

    const alcance = Number(valores.alcance)
    if (!valores.alcance || Number.isNaN(alcance) || alcance <= 0) {
      novosErros.alcance = 'Alcance deve ser maior que zero.'
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

    cadastrar({
      codigo: valores.codigo.trim(),
      modelo: valores.modelo.trim(),
      tipo: valores.tipo,
      capacidade: Number(valores.capacidade),
      alcance: Number(valores.alcance),
    })
    navigate('/aeronaves')
  }

  return (
    <PageStub
      title="Cadastrar Aeronave"
      description="Preencha os dados para registrar uma nova aeronave."
    >
      <Link to="/aeronaves" className={styles.linkVoltar}>
        <ArrowLeft size={16} /> Voltar para listagem
      </Link>

      <form className={styles.form} onSubmit={aoSubmeter} noValidate>
        <div className={styles.linha}>
          <div className={styles.campo}>
            <label htmlFor="codigo" className={styles.label}>
              Código
            </label>
            <input
              id="codigo"
              name="codigo"
              type="text"
              className={styles.input}
              value={valores.codigo}
              onChange={atualizarCampo}
              placeholder="Ex: A320-001"
            />
            {erros.codigo && <span className={styles.erro}>{erros.codigo}</span>}
          </div>

          <div className={styles.campo}>
            <label htmlFor="modelo" className={styles.label}>
              Modelo
            </label>
            <input
              id="modelo"
              name="modelo"
              type="text"
              className={styles.input}
              value={valores.modelo}
              onChange={atualizarCampo}
              placeholder="Ex: Airbus A320"
            />
            {erros.modelo && <span className={styles.erro}>{erros.modelo}</span>}
          </div>
        </div>

        <div className={styles.campo}>
          <label htmlFor="tipo" className={styles.label}>
            Tipo
          </label>
          <select
            id="tipo"
            name="tipo"
            className={styles.input}
            value={valores.tipo}
            onChange={atualizarCampo}
          >
            <option value="">Selecione...</option>
            {TIPOS_AERONAVE.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {erros.tipo && <span className={styles.erro}>{erros.tipo}</span>}
        </div>

        <div className={styles.linha}>
          <div className={styles.campo}>
            <label htmlFor="capacidade" className={styles.label}>
              Capacidade (passageiros)
            </label>
            <input
              id="capacidade"
              name="capacidade"
              type="number"
              min="1"
              className={styles.input}
              value={valores.capacidade}
              onChange={atualizarCampo}
              placeholder="Ex: 180"
            />
            {erros.capacidade && (
              <span className={styles.erro}>{erros.capacidade}</span>
            )}
          </div>

          <div className={styles.campo}>
            <label htmlFor="alcance" className={styles.label}>
              Alcance (km)
            </label>
            <input
              id="alcance"
              name="alcance"
              type="number"
              min="1"
              className={styles.input}
              value={valores.alcance}
              onChange={atualizarCampo}
              placeholder="Ex: 6100"
            />
            {erros.alcance && <span className={styles.erro}>{erros.alcance}</span>}
          </div>
        </div>

        <div className={styles.acoes}>
          <button
            type="button"
            className={styles.botaoSecundario}
            onClick={() => navigate('/aeronaves')}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.botaoPrimario}>
            <Save size={16} /> Salvar
          </button>
        </div>
      </form>
    </PageStub>
  )
}

export default AeronaveCadastrar
