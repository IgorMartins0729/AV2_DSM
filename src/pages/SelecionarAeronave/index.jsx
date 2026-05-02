import React from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import PageStub from '../../components/PageStub'
import { useAeronaves } from '../../contexts/AeronavesContext'
import tabelaStyles from '../../styles/tabela.module.css'

const ROTULOS = {
  pecas: 'peças',
  etapas: 'etapas',
  testes: 'testes',
  relatorio: 'relatório',
}

function SelecionarAeronave({ destino, titulo, descricao }) {
  const { aeronaves } = useAeronaves()
  const rotulo = ROTULOS[destino] ?? destino

  return (
    <PageStub title={titulo} description={descricao}>
      {aeronaves.length === 0 ? (
        <p className={tabelaStyles.vazio}>
          Nenhuma aeronave cadastrada ainda. Cadastre uma para acessar {rotulo}.
        </p>
      ) : (
        <div className={tabelaStyles.containerTabela}>
          <table className={tabelaStyles.tabela}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Modelo</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {aeronaves.map((a) => (
                <tr key={a.codigo}>
                  <td>{a.codigo}</td>
                  <td>{a.modelo}</td>
                  <td>
                    <span className={tabelaStyles.badge}>{a.tipo}</span>
                  </td>
                  <td>
                    <div className={tabelaStyles.acoes}>
                      <Link
                        to={`/aeronaves/${a.codigo}/${destino}`}
                        className={tabelaStyles.botaoVer}
                      >
                        <Eye size={14} /> Ver {rotulo}
                      </Link>
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

export default SelecionarAeronave
