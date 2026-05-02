import React, { createContext, useContext, useEffect, useState } from 'react'
import { lerLista, salvarLista } from '../utils/storage'

const CHAVE = 'funcionarios'
const FuncionariosContext = createContext(null)

export function FuncionariosProvider({ children }) {
  const [funcionarios, setFuncionarios] = useState(() => lerLista(CHAVE))

  useEffect(() => {
    salvarLista(CHAVE, funcionarios)
  }, [funcionarios])

  function cadastrar(dados) {
    setFuncionarios((anterior) => {
      const indice = anterior.findIndex((f) => f.id === dados.id)
      if (indice >= 0) {
        const copia = [...anterior]
        copia[indice] = { ...anterior[indice], ...dados }
        return copia
      }
      return [...anterior, { ...dados }]
    })
  }

  function remover(id) {
    setFuncionarios((anterior) => anterior.filter((f) => f.id !== id))
  }

  function obter(id) {
    return funcionarios.find((f) => f.id === id)
  }

  const valor = { funcionarios, cadastrar, remover, obter }

  return (
    <FuncionariosContext.Provider value={valor}>
      {children}
    </FuncionariosContext.Provider>
  )
}

export function useFuncionarios() {
  const ctx = useContext(FuncionariosContext)
  if (!ctx) {
    throw new Error('useFuncionarios deve ser usado dentro de FuncionariosProvider')
  }
  return ctx
}
