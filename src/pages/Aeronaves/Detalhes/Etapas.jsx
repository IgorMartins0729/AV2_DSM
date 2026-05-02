import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Trash2, Play, CheckCircle2, Users } from 'lucide-react'
import BotaoCadastrar from '../../../components/BotaoCadastrar'
import { useAeronaves } from '../../../contexts/AeronavesContext'
import { useSessao } from '../../../contexts/SessaoContext'
import { AcaoSistema, nivelMinimo } from '../../../utils/permissoes'
import tabela from '../../../styles/tabela.module.css'
import styles from './styles.module.css'

function AeronaveEtapas() {
  const { aeronave } = useOutletContext()
  const { removerEtapa, atualizarEtapa } = useAeronaves()
  const { pode } = useSessao()
  const podeCadastrar = pode(AcaoSistema.CADASTRAR_ETAPA)
  const podeIniciar = pode(AcaoSistema.INICIAR_ETAPA)
  const podeFinalizar = pode(AcaoSistema.FINALIZAR_ETAPA)
  const podeAssociar = pode(AcaoSistema.ASSOCIAR_FUNCIONARIO_ETAPA)
  const tituloCadastro = `Requer ${nivelMinimo(AcaoSistema.CADASTRAR_ETAPA)} ou superior`
  const tituloIniciar = `Requer ${nivelMinimo(AcaoSistema.INICIAR_ETAPA)} ou superior`
  const tituloFinalizar = `Requer ${nivelMinimo(AcaoSistema.FINALIZAR_ETAPA)} ou superior`
  const tituloAssociar = `Requer ${nivelMinimo(AcaoSistema.ASSOCIAR_FUNCIONARIO_ETAPA)} ou superior`

  function aoRemover(nome) {
    if (window.confirm(`Remover a etapa ${nome}?`)) {
      removerEtapa(aeronave.codigo, nome)
    }
  }

  function aoIniciar(nome) {
    atualizarEtapa(aeronave.codigo, nome, { status: 'ANDAMENTO' })
  }

  function aoFinalizar(nome) {
    atualizarEtapa(aeronave.codigo, nome, { status: 'CONCLUIDA' })
  }

  return (
    <div>
      <div className={styles.cabecalhoTab}>
        <h2 className={styles.tituloTab}>Etapas desta aeronave</h2>
        <BotaoCadastrar to="cadastrar" disabled={!podeCadastrar} tituloDesabilitado={tituloCadastro}>
          Cadastrar Etapa
        </BotaoCadastrar>
      </div>

      {aeronave.etapas.length === 0 ? (
        <p className={tabela.vazio}>Nenhuma etapa cadastrada ainda.</p>
      ) : (
        <div className={tabela.containerTabela}>
          <table className={tabela.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Prazo</th>
                <th>Status</th>
                <th>Funcionários</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {aeronave.etapas.map((etapa) => {
                const totalFuncionarios = etapa.funcionariosIds?.length ?? 0
                return (
                  <tr key={etapa.nome}>
                    <td>{etapa.nome}</td>
                    <td>{etapa.prazo}</td>
                    <td>
                      <div className={tabela.statusComBotao}>
                        <span className={tabela.badge}>{etapa.status}</span>
                        {etapa.status === 'PENDENTE' && (
                          <button
                            type="button"
                            className={tabela.botaoAcao}
                            onClick={() => aoIniciar(etapa.nome)}
                            disabled={!podeIniciar}
                            title={!podeIniciar ? tituloIniciar : undefined}
                          >
                            <Play size={12} /> Iniciar
                          </button>
                        )}
                        {etapa.status === 'ANDAMENTO' && (
                          <button
                            type="button"
                            className={tabela.botaoAcao}
                            onClick={() => aoFinalizar(etapa.nome)}
                            disabled={!podeFinalizar}
                            title={!podeFinalizar ? tituloFinalizar : undefined}
                          >
                            <CheckCircle2 size={12} /> Finalizar
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={tabela.celulaContagem}>
                        <span>{totalFuncionarios} associado{totalFuncionarios === 1 ? '' : 's'}</span>
                        {podeAssociar ? (
                          <Link
                            to={`${encodeURIComponent(etapa.nome)}/funcionarios`}
                            className={tabela.linkEditar}
                          >
                            <Users size={12} /> Editar
                          </Link>
                        ) : (
                          <span className={tabela.linkEditarDesabilitado} title={tituloAssociar}>
                            <Users size={12} /> Editar
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={tabela.acoes}>
                        <button
                          type="button"
                          className={tabela.botaoRemover}
                          onClick={() => aoRemover(etapa.nome)}
                          disabled={!podeCadastrar}
                          title={!podeCadastrar ? tituloCadastro : undefined}
                        >
                          <Trash2 size={14} /> Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AeronaveEtapas
