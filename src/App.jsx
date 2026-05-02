import React from 'react'
import AppRoutes from './routes'
import { AeronavesProvider } from './contexts/AeronavesContext'
import { FuncionariosProvider } from './contexts/FuncionariosContext'
import { SessaoProvider } from './contexts/SessaoContext'

function App() {
  return (
    <SessaoProvider>
      <AeronavesProvider>
        <FuncionariosProvider>
          <AppRoutes />
        </FuncionariosProvider>
      </AeronavesProvider>
    </SessaoProvider>
  )
}

export default App
