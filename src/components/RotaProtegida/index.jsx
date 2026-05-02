import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSessao } from '../../contexts/SessaoContext'

function RotaProtegida({ acao, redirecionarPara = '..', children }) {
  const { pode } = useSessao()

  if (!pode(acao)) {
    return <Navigate to={redirecionarPara} replace />
  }

  return children
}

export default RotaProtegida
