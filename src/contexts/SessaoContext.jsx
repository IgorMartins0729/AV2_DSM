import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { NivelPermissao, NIVEIS_DISPONIVEIS, pode as podeAcao } from '../utils/permissoes'

const CHAVE = 'aerocode:sessao'
const PADRAO = NivelPermissao.ENGENHEIRO

const SessaoContext = createContext(null)

function lerPapelInicial() {
  try {
    const guardado = localStorage.getItem(CHAVE)
    if (guardado && NIVEIS_DISPONIVEIS.includes(guardado)) {
      return guardado
    }
  } catch {
    // ignore
  }
  return PADRAO
}

export function SessaoProvider({ children }) {
  const [papelAtual, definirPapel] = useState(lerPapelInicial)

  useEffect(() => {
    localStorage.setItem(CHAVE, papelAtual)
  }, [papelAtual])

  const setPapelAtual = useCallback((novo) => {
    if (NIVEIS_DISPONIVEIS.includes(novo)) {
      definirPapel(novo)
    }
  }, [])

  const pode = useCallback((acao) => podeAcao(papelAtual, acao), [papelAtual])

  const valor = { papelAtual, setPapelAtual, pode }

  return <SessaoContext.Provider value={valor}>{children}</SessaoContext.Provider>
}

export function useSessao() {
  const ctx = useContext(SessaoContext)
  if (!ctx) {
    throw new Error('useSessao deve ser usado dentro de SessaoProvider')
  }
  return ctx
}
