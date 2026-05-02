import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import BotaoCadastrar from '../../../components/BotaoCadastrar'
import { useAeronaves } from '../../../contexts/AeronavesContext'
import { useSessao } from '../../../contexts/SessaoContext'
import { AcaoSistema, nivelMinimo } from '../../../utils/permissoes'
import tabela from '../../../styles/tabela.module.css'
import styles from './styles.module.css'

function AeronaveTestes() {
  const { aeronave } = useOutletContext()
  const { removerTeste } = useAeronaves()
  const { pode } = useSessao()
  const podeRegistrar = pode(AcaoSistema.REGISTRAR_TESTE)
  const tituloSemPermissao = `Requer ${nivelMinimo(AcaoSistema.REGISTRAR_TESTE)} ou superior`

  function aoRemover(tipo) {
    if (window.confirm(`Remover o teste ${tipo}?`)) {
      removerTeste(aeronave.codigo, tipo)
    }
  }

  return (
    <div>
      <div className={styles.cabecalhoTab}>
        <h2 className={styles.tituloTab}>Testes desta aeronave</h2>
        <BotaoCadastrar to="cadastrar" disabled={!podeRegistrar} tituloDesabilitado={tituloSemPermissao}>
          Registrar Teste
        </BotaoCadastrar>
      </div>

      {aeronave.testes.length === 0 ? (
        <p className={tabela.vazio}>Nenhum teste registrado ainda.</p>
      ) : (
        <div className={tabela.containerTabela}>
          <table className={tabela.tabela}>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Resultado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {aeronave.testes.map((teste) => (
                <tr key={teste.tipo}>
                  <td>{teste.tipo}</td>
                  <td><span className={tabela.badge}>{teste.resultado}</span></td>
                  <td>
                    <div className={tabela.acoes}>
                      <button
                        type="button"
                        className={tabela.botaoRemover}
                        onClick={() => aoRemover(teste.tipo)}
                        disabled={!podeRegistrar}
                        title={!podeRegistrar ? tituloSemPermissao : undefined}
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

export default AeronaveTestes
