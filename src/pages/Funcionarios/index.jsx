import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import PageStub from '../../components/PageStub'
import BotaoCadastrar from '../../components/BotaoCadastrar'
import { useFuncionarios } from '../../contexts/FuncionariosContext'
import { useSessao } from '../../contexts/SessaoContext'
import { AcaoSistema, nivelMinimo } from '../../utils/permissoes'
import styles from '../../styles/tabela.module.css'

function Funcionarios() {
  const { funcionarios, remover } = useFuncionarios()
  const { pode } = useSessao()
  const podeCadastrar = pode(AcaoSistema.CADASTRAR_FUNCIONARIO)
  const tituloSemPermissao = `Requer ${nivelMinimo(AcaoSistema.CADASTRAR_FUNCIONARIO)} ou superior`

  function aoRemover(id, nome) {
    if (window.confirm(`Remover o funcionário ${nome}?`)) {
      remover(id)
    }
  }

  return (
    <PageStub
      title="Funcionários"
      description="Listagem de funcionários cadastrados no sistema."
      actions={
        <BotaoCadastrar
          to="/funcionarios/cadastrar"
          disabled={!podeCadastrar}
          tituloDesabilitado={tituloSemPermissao}
        >
          Cadastrar Funcionário
        </BotaoCadastrar>
      }
    >
      {funcionarios.length === 0 ? (
        <p className={styles.vazio}>Nenhum funcionário cadastrado ainda.</p>
      ) : (
        <div className={styles.containerTabela}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Usuário</th>
                <th>Nível</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>{funcionario.id}</td>
                  <td>{funcionario.nome}</td>
                  <td>{funcionario.usuario}</td>
                  <td>
                    <span className={styles.badge}>
                      {funcionario.nivelPermissao}
                    </span>
                  </td>
                  <td>{funcionario.telefone}</td>
                  <td>
                    <div className={styles.acoes}>
                      {podeCadastrar ? (
                        <Link
                          to={`/funcionarios/${funcionario.id}/editar`}
                          className={styles.botaoVer}
                        >
                          <Pencil size={14} /> Editar
                        </Link>
                      ) : (
                        <span
                          className={styles.linkEditarDesabilitado}
                          title={tituloSemPermissao}
                        >
                          <Pencil size={14} /> Editar
                        </span>
                      )}
                      <button
                        type="button"
                        className={styles.botaoRemover}
                        onClick={() => aoRemover(funcionario.id, funcionario.nome)}
                        disabled={!podeCadastrar}
                        title={!podeCadastrar ? tituloSemPermissao : undefined}
                      >
                        <Trash2 size={14} /> Remover
                      </button>
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

export default Funcionarios
