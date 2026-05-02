import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import BotaoCadastrar from '../../../components/BotaoCadastrar'
import { useAeronaves } from '../../../contexts/AeronavesContext'
import { useSessao } from '../../../contexts/SessaoContext'
import { AcaoSistema, nivelMinimo } from '../../../utils/permissoes'
import tabela from '../../../styles/tabela.module.css'
import styles from './styles.module.css'

function ItemInfo({ rotulo, valor }) {
  return (
    <div className={styles.itemInfo}>
      <span className={styles.rotuloItem}>{rotulo}</span>
      <p className={styles.valorItem}>{valor}</p>
    </div>
  )
}

function AeronaveRelatorio() {
  const { aeronave } = useOutletContext()
  const { removerRelatorio } = useAeronaves()
  const { pode } = useSessao()
  const podeGerar = pode(AcaoSistema.GERAR_RELATORIO_FINAL)
  const tituloSemPermissao = `Requer ${nivelMinimo(AcaoSistema.GERAR_RELATORIO_FINAL)} ou superior`

  function aoRemover() {
    if (window.confirm('Remover o relatório desta aeronave?')) {
      removerRelatorio(aeronave.codigo)
    }
  }

  if (!aeronave.relatorio) {
    return (
      <div>
        <div className={styles.cabecalhoTab}>
          <h2 className={styles.tituloTab}>Relatório final</h2>
          <BotaoCadastrar to="gerar" disabled={!podeGerar} tituloDesabilitado={tituloSemPermissao}>
            Gerar Relatório
          </BotaoCadastrar>
        </div>
        <p className={tabela.vazio}>Relatório ainda não gerado.</p>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.cabecalhoTab}>
        <h2 className={styles.tituloTab}>Relatório final</h2>
        <button
          type="button"
          className={tabela.botaoRemover}
          onClick={aoRemover}
          disabled={!podeGerar}
          title={!podeGerar ? tituloSemPermissao : undefined}
        >
          <Trash2 size={14} /> Remover relatório
        </button>
      </div>

      <div className={styles.cardInfo}>
        <dl className={styles.gridInfo}>
          <ItemInfo rotulo="Cliente" valor={aeronave.relatorio.nomeCliente ?? '—'} />
          <ItemInfo rotulo="Data de Entrega" valor={aeronave.relatorio.dataEntrega ?? '—'} />
          <ItemInfo
            rotulo="Gerado em"
            valor={
              aeronave.relatorio.geradoEm
                ? new Date(aeronave.relatorio.geradoEm).toLocaleString('pt-BR')
                : '—'
            }
          />
        </dl>
      </div>
    </div>
  )
}

export default AeronaveRelatorio
