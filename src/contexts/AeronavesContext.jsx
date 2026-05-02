import React, { createContext, useContext, useEffect, useState } from 'react'
import { lerLista, salvarLista } from '../utils/storage'

const CHAVE = 'aeronaves'
const AeronavesContext = createContext(null)

function atualizarAeronave(lista, codigo, fn) {
  return lista.map((a) => (a.codigo === codigo ? fn(a) : a))
}

export function AeronavesProvider({ children }) {
  const [aeronaves, setAeronaves] = useState(() => lerLista(CHAVE))

  useEffect(() => {
    salvarLista(CHAVE, aeronaves)
  }, [aeronaves])

  function cadastrar(dados) {
    setAeronaves((anterior) => {
      const indice = anterior.findIndex((a) => a.codigo === dados.codigo)
      const baseNova = {
        codigo: dados.codigo,
        modelo: dados.modelo,
        tipo: dados.tipo,
        capacidade: dados.capacidade,
        alcance: dados.alcance,
      }

      if (indice >= 0) {
        const existente = anterior[indice]
        const copia = [...anterior]
        copia[indice] = { ...existente, ...baseNova }
        return copia
      }

      return [
        ...anterior,
        {
          ...baseNova,
          pecas: [],
          etapas: [],
          testes: [],
          relatorio: null,
        },
      ]
    })
  }

  function remover(codigo) {
    setAeronaves((anterior) => anterior.filter((a) => a.codigo !== codigo))
  }

  function obter(codigo) {
    return aeronaves.find((a) => a.codigo === codigo)
  }

  function adicionarPeca(codigoAeronave, peca) {
    setAeronaves((anterior) =>
      atualizarAeronave(anterior, codigoAeronave, (a) => {
        const indice = a.pecas.findIndex((p) => p.nome === peca.nome)
        if (indice >= 0) {
          const novas = [...a.pecas]
          novas[indice] = peca
          return { ...a, pecas: novas }
        }
        return { ...a, pecas: [...a.pecas, peca] }
      })
    )
  }

  function removerPeca(codigoAeronave, nomePeca) {
    setAeronaves((anterior) =>
      atualizarAeronave(anterior, codigoAeronave, (a) => ({
        ...a,
        pecas: a.pecas.filter((p) => p.nome !== nomePeca),
      }))
    )
  }

  function atualizarPeca(codigoAeronave, nomePeca, dadosParciais) {
    setAeronaves((anterior) =>
      atualizarAeronave(anterior, codigoAeronave, (a) => ({
        ...a,
        pecas: a.pecas.map((p) =>
          p.nome === nomePeca ? { ...p, ...dadosParciais } : p
        ),
      }))
    )
  }

  function adicionarEtapa(codigoAeronave, etapa) {
    setAeronaves((anterior) =>
      atualizarAeronave(anterior, codigoAeronave, (a) => {
        const indice = a.etapas.findIndex((e) => e.nome === etapa.nome)
        if (indice >= 0) {
          const novas = [...a.etapas]
          novas[indice] = etapa
          return { ...a, etapas: novas }
        }
        return { ...a, etapas: [...a.etapas, etapa] }
      })
    )
  }

  function removerEtapa(codigoAeronave, nomeEtapa) {
    setAeronaves((anterior) =>
      atualizarAeronave(anterior, codigoAeronave, (a) => ({
        ...a,
        etapas: a.etapas.filter((e) => e.nome !== nomeEtapa),
      }))
    )
  }

  function atualizarEtapa(codigoAeronave, nomeEtapa, dadosParciais) {
    setAeronaves((anterior) =>
      atualizarAeronave(anterior, codigoAeronave, (a) => ({
        ...a,
        etapas: a.etapas.map((e) =>
          e.nome === nomeEtapa ? { ...e, ...dadosParciais } : e
        ),
      }))
    )
  }

  function adicionarTeste(codigoAeronave, teste) {
    setAeronaves((anterior) =>
      atualizarAeronave(anterior, codigoAeronave, (a) => {
        const indice = a.testes.findIndex((t) => t.tipo === teste.tipo)
        if (indice >= 0) {
          const novos = [...a.testes]
          novos[indice] = teste
          return { ...a, testes: novos }
        }
        return { ...a, testes: [...a.testes, teste] }
      })
    )
  }

  function removerTeste(codigoAeronave, tipoTeste) {
    setAeronaves((anterior) =>
      atualizarAeronave(anterior, codigoAeronave, (a) => ({
        ...a,
        testes: a.testes.filter((t) => t.tipo !== tipoTeste),
      }))
    )
  }

  function definirRelatorio(codigoAeronave, relatorio) {
    setAeronaves((anterior) =>
      atualizarAeronave(anterior, codigoAeronave, (a) => ({ ...a, relatorio }))
    )
  }

  function removerRelatorio(codigoAeronave) {
    setAeronaves((anterior) =>
      atualizarAeronave(anterior, codigoAeronave, (a) => ({
        ...a,
        relatorio: null,
      }))
    )
  }

  const valor = {
    aeronaves,
    cadastrar,
    remover,
    obter,
    adicionarPeca,
    removerPeca,
    atualizarPeca,
    adicionarEtapa,
    removerEtapa,
    atualizarEtapa,
    adicionarTeste,
    removerTeste,
    definirRelatorio,
    removerRelatorio,
  }

  return (
    <AeronavesContext.Provider value={valor}>
      {children}
    </AeronavesContext.Provider>
  )
}

export function useAeronaves() {
  const ctx = useContext(AeronavesContext)
  if (!ctx) {
    throw new Error('useAeronaves deve ser usado dentro de AeronavesProvider')
  }
  return ctx
}
