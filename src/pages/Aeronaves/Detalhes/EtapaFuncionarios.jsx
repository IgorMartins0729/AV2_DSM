import React, { useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useAeronaves } from '../../../contexts/AeronavesContext'
import { useFuncionarios } from '../../../contexts/FuncionariosContext'
import formStyles from '../../../styles/forms.module.css'
import tabela from '../../../styles/tabela.module.css'
import styles from './styles.module.css'

function AeronaveEtapaFuncionarios() {
  const { aeronave } = useOutletContext()
  const { nomeEtapa } = useParams()
  const navigate = useNavigate()
  const { atualizarEtapa } = useAeronaves()
  const { funcionarios } = useFuncionarios()

  const etapa = aeronave.etapas.find((e) => e.nome === nomeEtapa)
  const [selecionados, setSelecionados] = useState(etapa?.funcionariosIds ?? [])

  if (!etapa) {
    return (
      <div>
        <Link to={`/aeronaves/${aeronave.codigo}/etapas`} className={formStyles.linkVoltar}>
          <ArrowLeft size={16} /> Voltar para etapas
        </Link>
        <p className={tabela.vazio}>
          Etapa <strong>{nomeEtapa}</strong> não encontrada.
        </p>
      </div>
    )
  }

  function alternar(id) {
    setSelecionados((anterior) =>
      anterior.includes(id)
        ? anterior.filter((i) => i !== id)
        : [...anterior, id]
    )
  }

  function aoSalvar() {
    atualizarEtapa(aeronave.codigo, nomeEtapa, { funcionariosIds: selecionados })
    navigate(`/aeronaves/${aeronave.codigo}/etapas`)
  }

  return (
    <div>
      <Link to={`/aeronaves/${aeronave.codigo}/etapas`} className={formStyles.linkVoltar}>
        <ArrowLeft size={16} /> Voltar para etapas
      </Link>

      <h2 className={styles.tituloTab}>
        Funcionários da etapa "{etapa.nome}"
      </h2>

      <div className={formStyles.form}>
        {funcionarios.length === 0 ? (
          <p className={formStyles.checkboxVazio}>
            Nenhum funcionário cadastrado.{' '}
            <Link to="/funcionarios/cadastrar">Cadastrar funcionário</Link>
          </p>
        ) : (
          <div className={formStyles.checkboxList}>
            {funcionarios.map((f) => (
              <label key={f.id} className={formStyles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={selecionados.includes(f.id)}
                  onChange={() => alternar(f.id)}
                />
                {f.nome} <small style={{ color: '#888' }}>(#{f.id} · {f.nivelPermissao})</small>
              </label>
            ))}
          </div>
        )}

        <div className={formStyles.acoes}>
          <button
            type="button"
            className={formStyles.botaoSecundario}
            onClick={() => navigate(`/aeronaves/${aeronave.codigo}/etapas`)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={formStyles.botaoPrimario}
            onClick={aoSalvar}
            disabled={funcionarios.length === 0}
          >
            <Save size={16} /> Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AeronaveEtapaFuncionarios
