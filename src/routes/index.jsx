import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import RotaProtegida from '../components/RotaProtegida'
import { AcaoSistema } from '../utils/permissoes'
import Aeronaves from '../pages/Aeronaves'
import AeronaveCadastrar from '../pages/Aeronaves/Cadastrar'
import AeronaveDetalhes from '../pages/Aeronaves/Detalhes'
import AeronavePecas from '../pages/Aeronaves/Detalhes/Pecas'
import AeronavePecaCadastrar from '../pages/Aeronaves/Detalhes/PecaCadastrar'
import AeronaveEtapas from '../pages/Aeronaves/Detalhes/Etapas'
import AeronaveEtapaCadastrar from '../pages/Aeronaves/Detalhes/EtapaCadastrar'
import AeronaveEtapaFuncionarios from '../pages/Aeronaves/Detalhes/EtapaFuncionarios'
import AeronaveTestes from '../pages/Aeronaves/Detalhes/Testes'
import AeronaveTesteCadastrar from '../pages/Aeronaves/Detalhes/TesteCadastrar'
import AeronaveRelatorio from '../pages/Aeronaves/Detalhes/Relatorio'
import AeronaveRelatorioGerar from '../pages/Aeronaves/Detalhes/RelatorioGerar'
import SelecionarAeronave from '../pages/SelecionarAeronave'
import Funcionarios from '../pages/Funcionarios'
import FuncionarioCadastrar from '../pages/Funcionarios/Cadastrar'
import FuncionarioEditar from '../pages/Funcionarios/Editar'
import Login from '../pages/Login'
import Register from '../pages/Register'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/aeronaves" element={<Aeronaves />} />
        <Route
          path="/aeronaves/cadastrar"
          element={
            <RotaProtegida acao={AcaoSistema.CADASTRAR_AERONAVE}>
              <AeronaveCadastrar />
            </RotaProtegida>
          }
        />

        <Route path="/aeronaves/:codigo" element={<AeronaveDetalhes />}>
          <Route index element={<Navigate to="pecas" replace />} />
          <Route path="pecas" element={<AeronavePecas />} />
          <Route
            path="pecas/cadastrar"
            element={
              <RotaProtegida acao={AcaoSistema.CADASTRAR_PECA}>
                <AeronavePecaCadastrar />
              </RotaProtegida>
            }
          />
          <Route path="etapas" element={<AeronaveEtapas />} />
          <Route
            path="etapas/cadastrar"
            element={
              <RotaProtegida acao={AcaoSistema.CADASTRAR_ETAPA}>
                <AeronaveEtapaCadastrar />
              </RotaProtegida>
            }
          />
          <Route
            path="etapas/:nomeEtapa/funcionarios"
            element={
              <RotaProtegida acao={AcaoSistema.ASSOCIAR_FUNCIONARIO_ETAPA} redirecionarPara="../..">
                <AeronaveEtapaFuncionarios />
              </RotaProtegida>
            }
          />
          <Route path="testes" element={<AeronaveTestes />} />
          <Route
            path="testes/cadastrar"
            element={
              <RotaProtegida acao={AcaoSistema.REGISTRAR_TESTE}>
                <AeronaveTesteCadastrar />
              </RotaProtegida>
            }
          />
          <Route path="relatorio" element={<AeronaveRelatorio />} />
          <Route
            path="relatorio/gerar"
            element={
              <RotaProtegida acao={AcaoSistema.GERAR_RELATORIO_FINAL}>
                <AeronaveRelatorioGerar />
              </RotaProtegida>
            }
          />
        </Route>

        <Route
          path="/pecas"
          element={
            <SelecionarAeronave
              destino="pecas"
              titulo="Peças"
              descricao="Selecione uma aeronave para ver suas peças."
            />
          }
        />
        <Route
          path="/etapas"
          element={
            <SelecionarAeronave
              destino="etapas"
              titulo="Etapas"
              descricao="Selecione uma aeronave para ver suas etapas de produção."
            />
          }
        />
        <Route
          path="/testes"
          element={
            <SelecionarAeronave
              destino="testes"
              titulo="Testes"
              descricao="Selecione uma aeronave para ver seus testes."
            />
          }
        />
        <Route
          path="/relatorio"
          element={
            <SelecionarAeronave
              destino="relatorio"
              titulo="Relatório"
              descricao="Selecione uma aeronave para ver seu relatório final."
            />
          }
        />

        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route
          path="/funcionarios/cadastrar"
          element={
            <RotaProtegida acao={AcaoSistema.CADASTRAR_FUNCIONARIO}>
              <FuncionarioCadastrar />
            </RotaProtegida>
          }
        />
        <Route
          path="/funcionarios/:id/editar"
          element={
            <RotaProtegida acao={AcaoSistema.CADASTRAR_FUNCIONARIO}>
              <FuncionarioEditar />
            </RotaProtegida>
          }
        />

        <Route path="*" element={<Navigate to="/aeronaves" replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
