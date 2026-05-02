import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  Plane,
  Users,
  UserCog,
  ChevronDown,
  ChevronRight,
  List,
  Wrench,
  ListChecks,
  FlaskConical,
  FileText,
  LogOut,
} from 'lucide-react'
import styles from './styles.module.css'
import logo from '../../assets/gemini-generated.png'
import { useSessao } from '../../contexts/SessaoContext'
import { NIVEIS_DISPONIVEIS } from '../../utils/permissoes'

const QUERY_MOBILE = '(max-width: 599px)'

const aeronavesSubItems = [
  { to: '/aeronaves', label: 'Todas as aeronaves', icon: List, slug: 'todas' },
  { to: '/pecas', label: 'Peças', icon: Wrench, slug: 'pecas' },
  { to: '/etapas', label: 'Etapas', icon: ListChecks, slug: 'etapas' },
  { to: '/testes', label: 'Testes', icon: FlaskConical, slug: 'testes' },
  { to: '/relatorio', label: 'Relatório', icon: FileText, slug: 'relatorio' },
]

function getAeronaveAreaAtiva(pathname) {
  for (const slug of ['pecas', 'etapas', 'testes', 'relatorio']) {
    if (pathname === `/${slug}`) return slug
    if (new RegExp(`^/aeronaves/[^/]+/${slug}`).test(pathname)) return slug
  }
  if (/^\/aeronaves($|\/)/.test(pathname)) return 'todas'
  return null
}

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aeronavesAberto, setAeronavesAberto] = useState(true)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY_MOBILE).matches : false
  )
  const { papelAtual, setPapelAtual } = useSessao()
  const location = useLocation()
  const navigate = useNavigate()

  function aoSair() {
    navigate('/login')
  }

  const slugAtivo = useMemo(
    () => getAeronaveAreaAtiva(location.pathname),
    [location.pathname]
  )
  const aeronavesAreaAtiva = slugAtivo !== null

  useEffect(() => {
    const mq = window.matchMedia(QUERY_MOBILE)
    const ouvinte = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', ouvinte)
    return () => mq.removeEventListener('change', ouvinte)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (aeronavesAreaAtiva) setAeronavesAberto(true)
  }, [aeronavesAreaAtiva])

  function aoClicarHamburguer() {
    if (isMobile) {
      setMobileOpen((v) => !v)
    } else {
      setCollapsed((v) => !v)
    }
  }

  const expandido = !collapsed || isMobile

  const sidebarClasses = [
    styles.sidebar,
    !isMobile && collapsed ? styles.collapsed : '',
    isMobile ? styles.mobile : '',
    isMobile && mobileOpen ? styles.mobileAberto : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {isMobile && !mobileOpen && (
        <button
          type="button"
          className={styles.hamburguerFlutuante}
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      )}

      {isMobile && mobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={sidebarClasses}>
        <div className={styles.header}>
          {expandido && (
            <div className={styles.logoWrapper}>
              <img src={logo} alt="Logo" className={styles.logo} />
            </div>
          )}

          <button
            type="button"
            className={styles.hamburger}
            onClick={aoClicarHamburguer}
            aria-label={
              isMobile
                ? mobileOpen ? 'Fechar menu' : 'Abrir menu'
                : collapsed ? 'Expandir menu' : 'Recolher menu'
            }
          >
            {isMobile
              ? <X size={24} />
              : collapsed ? <Menu size={24} /> : <X size={24} />}
          </button>
        </div>

        <nav className={styles.nav}>
          {expandido ? (
            <>
              <button
                type="button"
                className={`${styles.navItem} ${styles.navParent} ${aeronavesAreaAtiva ? styles.activeParent : ''}`}
                onClick={() => setAeronavesAberto((v) => !v)}
                aria-expanded={aeronavesAberto}
              >
                <Plane size={20} />
                <span>Aeronaves</span>
                <span className={styles.chevron}>
                  {aeronavesAberto
                    ? <ChevronDown size={16} />
                    : <ChevronRight size={16} />}
                </span>
              </button>

              {aeronavesAberto && (
                <div className={styles.subNav}>
                  {aeronavesSubItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={() =>
                        `${styles.navItem} ${styles.subItem} ${slugAtivo === item.slug ? styles.active : ''}`
                      }
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </>
          ) : (
            <NavLink
              to="/aeronaves"
              className={`${styles.navItem} ${aeronavesAreaAtiva ? styles.active : ''}`}
              title="Aeronaves"
            >
              <Plane size={20} />
            </NavLink>
          )}

          <NavLink
            to="/funcionarios"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            title={!expandido ? 'Funcionários' : undefined}
          >
            <Users size={20} />
            {expandido && <span>Funcionários</span>}
          </NavLink>
        </nav>

        <div
          className={styles.sessao}
          title={!expandido ? `Atuando como ${papelAtual}` : undefined}
        >
          {!expandido ? (
            <>
              <div className={styles.sessaoColapsada}>
                <UserCog size={20} />
              </div>
              <button
                type="button"
                className={styles.botaoSair}
                onClick={aoSair}
                title="Sair"
                aria-label="Sair"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <label className={styles.sessaoLabel} htmlFor="seletor-papel">
                <UserCog size={14} /> Atuando como
              </label>
              <div className={styles.sessaoLinha}>
                <select
                  id="seletor-papel"
                  className={styles.sessaoSelect}
                  value={papelAtual}
                  onChange={(e) => setPapelAtual(e.target.value)}
                >
                  {NIVEIS_DISPONIVEIS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.botaoSair}
                  onClick={aoSair}
                  title="Sair"
                  aria-label="Sair"
                >
                  <LogOut size={16} />
                  <span>Sair</span>
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
