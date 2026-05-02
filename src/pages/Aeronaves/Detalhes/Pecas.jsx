import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import BotaoCadastrar from '../../../components/BotaoCadastrar'
import { useAeronaves } from '../../../contexts/AeronavesContext'
import { useSessao } from '../../../contexts/SessaoContext'
import { AcaoSistema, nivelMinimo } from '../../../utils/permissoes'
import tabela from '../../../styles/tabela.module.css'
import styles from './styles.module.css'

const STATUS_PECA = ['EM_PRODUCAO', 'EM_TRANSPORTE', 'PRONTA']

function AeronavePecas() {
  const { aeronave } = useOutletContext()
  const { removerPeca, atualizarPeca } = useAeronaves()
  const { pode } = useSessao()
  const podeCadastrar = pode(AcaoSistema.CADASTRAR_PECA)
  const podeAtualizarStatus = pode(AcaoSistema.ATUALIZAR_STATUS_PECA)
  const tituloCadastro = `Requer ${nivelMinimo(AcaoSistema.CADASTRAR_PECA)} ou superior`
  const tituloStatus = `Requer ${nivelMinimo(AcaoSistema.ATUALIZAR_STATUS_PECA)} ou superior`

  function aoRemover(nome) {
    if (window.confirm(`Remover a peça ${nome}?`)) {
      removerPeca(aeronave.codigo, nome)
    }
  }

  function aoMudarStatus(nome, novoStatus) {
    atualizarPeca(aeronave.codigo, nome, { status: novoStatus })
  }

  return (
    <div>
      <div className={styles.cabecalhoTab}>
        <h2 className={styles.tituloTab}>Peças desta aeronave</h2>
        <BotaoCadastrar to="cadastrar" disabled={!podeCadastrar} tituloDesabilitado={tituloCadastro}>
          Cadastrar Peça
        </BotaoCadastrar>
      </div>

      {aeronave.pecas.length === 0 ? (
        <p className={tabela.vazio}>Nenhuma peça cadastrada ainda.</p>
      ) : (
        <div className={tabela.containerTabela}>
          <table className={tabela.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Fornecedor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {aeronave.pecas.map((peca) => (
                <tr key={peca.nome}>
                  <td>{peca.nome}</td>
                  <td><span className={tabela.badge}>{peca.tipo}</span></td>
                  <td>{peca.fornecedor}</td>
                  <td>
                    <select
                      className={tabela.statusSelect}
                      value={peca.status}
                      onChange={(e) => aoMudarStatus(peca.nome, e.target.value)}
                      aria-label={`Status da peça ${peca.nome}`}
                      disabled={!podeAtualizarStatus}
                      title={!podeAtualizarStatus ? tituloStatus : undefined}
                    >
                      {STATUS_PECA.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className={tabela.acoes}>
                      <button
                        type="button"
                        className={tabela.botaoRemover}
                        onClick={() => aoRemover(peca.nome)}
                        disabled={!podeCadastrar}
                        title={!podeCadastrar ? tituloCadastro : undefined}
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
    </div>
  )
}

export default AeronavePecas
