import React from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageStub from '../../../components/PageStub'
import { useAeronaves } from '../../../contexts/AeronavesContext'
import styles from './styles.module.css'

function ItemInfo({ rotulo, valor }) {
  return (
    <div className={styles.itemInfo}>
      <span className={styles.rotuloItem}>{rotulo}</span>
      <p className={styles.valorItem}>{valor}</p>
    </div>
  )
}

function tabClassName({ isActive }) {
  return isActive ? `${styles.tabItem} ${styles.tabAtivo}` : styles.tabItem
}

function AeronaveDetalhes() {
  const { codigo } = useParams()
  const { obter } = useAeronaves()
  const aeronave = obter(codigo)

  if (!aeronave) {
    return (
      <PageStub title="Aeronave não encontrada">
        <Link to="/aeronaves" className={styles.linkVoltar}>
          <ArrowLeft size={16} /> Voltar para listagem
        </Link>
        <p className={styles.naoEncontrada}>
          Nenhuma aeronave com o código <strong>{codigo}</strong> foi encontrada.
        </p>
      </PageStub>
    )
  }

  const titulo = (
    <span className={styles.tituloComBadge}>
      Aeronave {aeronave.codigo}
      <span className={styles.tituloBadge}>{aeronave.tipo}</span>
    </span>
  )

  return (
    <PageStub
      title={titulo}
      description="Detalhes, peças, etapas, testes e relatório da aeronave."
    >
      <Link to="/aeronaves" className={styles.linkVoltar}>
        <ArrowLeft size={16} /> Voltar para listagem
      </Link>

      <div className={styles.cardInfo}>
        <dl className={styles.gridInfo}>
          <ItemInfo rotulo="Código" valor={aeronave.codigo} />
          <ItemInfo rotulo="Modelo" valor={aeronave.modelo} />
          <ItemInfo rotulo="Tipo" valor={aeronave.tipo} />
          <ItemInfo rotulo="Capacidade" valor={`${aeronave.capacidade} passageiros`} />
          <ItemInfo rotulo="Alcance" valor={`${aeronave.alcance} km`} />
        </dl>
      </div>

      <nav className={styles.tabsNav}>
        <NavLink to="pecas" className={tabClassName}>
          Peças ({aeronave.pecas.length})
        </NavLink>
        <NavLink to="etapas" className={tabClassName}>
          Etapas ({aeronave.etapas.length})
        </NavLink>
        <NavLink to="testes" className={tabClassName}>
          Testes ({aeronave.testes.length})
        </NavLink>
        <NavLink to="relatorio" className={tabClassName}>
          Relatório
        </NavLink>
      </nav>

      <Outlet context={{ aeronave }} />
    </PageStub>
  )
}

export default AeronaveDetalhes
