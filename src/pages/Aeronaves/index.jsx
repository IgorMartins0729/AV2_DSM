import React from 'react'
import { Link } from 'react-router-dom'
import { Eye, Trash2 } from 'lucide-react'
import PageStub from '../../components/PageStub'
import BotaoCadastrar from '../../components/BotaoCadastrar'
import { useAeronaves } from '../../contexts/AeronavesContext'
import { useSessao } from '../../contexts/SessaoContext'
import { AcaoSistema, nivelMinimo } from '../../utils/permissoes'
import styles from '../../styles/tabela.module.css'

function Aeronaves() {
  const { aeronaves, remover } = useAeronaves()
  const { pode } = useSessao()
  const podeCadastrar = pode(AcaoSistema.CADASTRAR_AERONAVE)
  const tituloSemPermissao = `Requer ${nivelMinimo(AcaoSistema.CADASTRAR_AERONAVE)} ou superior`

  function aoRemover(codigo) {
    if (window.confirm(`Remover a aeronave ${codigo}?`)) {
      remover(codigo)
    }
  }

  return (
    <PageStub
      title="Aeronaves"
      description="Listagem de aeronaves cadastradas no sistema."
      actions={
        <BotaoCadastrar
          to="/aeronaves/cadastrar"
          disabled={!podeCadastrar}
          tituloDesabilitado={tituloSemPermissao}
        >
          Cadastrar Aeronave
        </BotaoCadastrar>
      }
    >
      {aeronaves.length === 0 ? (
        <p className={styles.vazio}>Nenhuma aeronave cadastrada ainda.</p>
      ) : (
        <div className={styles.containerTabela}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Modelo</th>
                <th>Tipo</th>
                <th>Capacidade</th>
                <th>Alcance (km)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {aeronaves.map((aeronave) => (
                <tr key={aeronave.codigo}>
                  <td>{aeronave.codigo}</td>
                  <td>{aeronave.modelo}</td>
                  <td>
                    <span className={styles.badge}>{aeronave.tipo}</span>
                  </td>
                  <td>{aeronave.capacidade}</td>
                  <td>{aeronave.alcance}</td>
                  <td>
                    <div className={styles.acoes}>
                      <Link
                        to={`/aeronaves/${aeronave.codigo}`}
                        className={styles.botaoVer}
                      >
                        <Eye size={14} /> Ver
                      </Link>
                      <button
                        type="button"
                        className={styles.botaoRemover}
                        onClick={() => aoRemover(aeronave.codigo)}
                        disabled={!podeCadastrar}
                        title={!podeCadastrar ? tituloSemPermissao : undefined}
                      >
                        <Trash2 size={14} /> Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageStub>
  )
}

export default Aeronaves
