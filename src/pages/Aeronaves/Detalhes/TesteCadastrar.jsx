import React, { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useAeronaves } from '../../../contexts/AeronavesContext'
import styles from '../../../styles/forms.module.css'

const TIPOS_TESTE = ['ELETRICO', 'HIDRAULICO', 'AERODINAMICO']
const RESULTADOS_TESTE = ['APROVADO', 'REPROVADO']

const valoresIniciais = {
  tipo: '',
  resultado: '',
}

function AeronaveTesteCadastrar() {
  const { aeronave } = useOutletContext()
  const navigate = useNavigate()
  const { adicionarTeste } = useAeronaves()
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
    if (!valores.tipo) novosErros.tipo = 'Selecione o tipo de teste.'
    if (!valores.resultado) novosErros.resultado = 'Selecione o resultado.'
    return novosErros
  }

  function aoSubmeter(evento) {
    evento.preventDefault()
    const novosErros = validar()
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    adicionarTeste(aeronave.codigo, {
      tipo: valores.tipo,
      resultado: valores.resultado,
    })
    navigate('../testes')
  }

  return (
    <div>
      <Link to="../testes" className={styles.linkVoltar}>
        <ArrowLeft size={16} /> Voltar para testes
      </Link>

      <form className={styles.form} onSubmit={aoSubmeter} noValidate>
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
              {TIPOS_TESTE.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {erros.tipo && <span className={styles.erro}>{erros.tipo}</span>}
          </div>

          <div className={styles.campo}>
            <label htmlFor="resultado" className={styles.label}>Resultado</label>
            <select
              id="resultado"
              name="resultado"
              className={styles.input}
              value={valores.resultado}
              onChange={atualizarCampo}
            >
              <option value="">Selecione...</option>
              {RESULTADOS_TESTE.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {erros.resultado && (
              <span className={styles.erro}>{erros.resultado}</span>
            )}
          </div>
        </div>

        <div className={styles.acoes}>
          <button
            type="button"
            className={styles.botaoSecundario}
            onClick={() => navigate('../testes')}
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

export default AeronaveTesteCadastrar
