import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import PageStub from '../../../components/PageStub'
import { useFuncionarios } from '../../../contexts/FuncionariosContext'
import styles from '../../../styles/forms.module.css'

const NIVEIS_PERMISSAO = ['ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR']

function FuncionarioEditar() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { obter, cadastrar } = useFuncionarios()
  const funcionario = obter(Number(id))

  const [valores, setValores] = useState(() =>
    funcionario
      ? {
          nome: funcionario.nome ?? '',
          telefone: funcionario.telefone ?? '',
          endereco: funcionario.endereco ?? '',
          usuario: funcionario.usuario ?? '',
          senha: funcionario.senha ?? '',
          nivelPermissao: funcionario.nivelPermissao ?? '',
        }
      : null
  )
  const [erros, setErros] = useState({})

  if (!funcionario || !valores) {
    return (
      <PageStub title="Funcionário não encontrado">
        <Link to="/funcionarios" className={styles.linkVoltar}>
          <ArrowLeft size={16} /> Voltar para listagem
        </Link>
        <p>Nenhum funcionário com o ID <strong>{id}</strong> foi encontrado.</p>
      </PageStub>
    )
  }

  function atualizarCampo(evento) {
    const { name, value } = evento.target
    setValores((anterior) => ({ ...anterior, [name]: value }))
    if (erros[name]) {
      setErros((anterior) => ({ ...anterior, [name]: undefined }))
    }
  }

  function validar() {
    const novosErros = {}
    if (!valores.nome.trim()) novosErros.nome = 'Informe o nome.'
    if (!valores.telefone.trim()) novosErros.telefone = 'Informe o telefone.'
    if (!valores.endereco.trim()) novosErros.endereco = 'Informe o endereço.'
    if (!valores.usuario.trim()) novosErros.usuario = 'Informe o usuário.'
    if (!valores.senha) novosErros.senha = 'Informe a senha.'
    if (!valores.nivelPermissao) novosErros.nivelPermissao = 'Selecione o nível de permissão.'
    return novosErros
  }

  function aoSubmeter(evento) {
    evento.preventDefault()
    const novosErros = validar()
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    cadastrar({
      id: funcionario.id,
      nome: valores.nome.trim(),
      telefone: valores.telefone.trim(),
      endereco: valores.endereco.trim(),
      usuario: valores.usuario.trim(),
      senha: valores.senha,
      nivelPermissao: valores.nivelPermissao,
    })
    navigate('/funcionarios')
  }

  return (
    <PageStub
      title="Editar Funcionário"
      description={`Atualizando dados do funcionário ${funcionario.nome} (ID ${funcionario.id}).`}
    >
      <Link to="/funcionarios" className={styles.linkVoltar}>
        <ArrowLeft size={16} /> Voltar para listagem
      </Link>

      <form className={styles.form} onSubmit={aoSubmeter} noValidate>
        <div className={styles.linha}>
          <div className={styles.campo}>
            <label htmlFor="id" className={styles.label}>ID</label>
            <input
              id="id"
              name="id"
              type="number"
              className={styles.input}
              value={funcionario.id}
              readOnly
              disabled
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="nome" className={styles.label}>Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              className={styles.input}
              value={valores.nome}
              onChange={atualizarCampo}
            />
            {erros.nome && <span className={styles.erro}>{erros.nome}</span>}
          </div>
        </div>

        <div className={styles.linha}>
          <div className={styles.campo}>
            <label htmlFor="telefone" className={styles.label}>Telefone</label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              className={styles.input}
              value={valores.telefone}
              onChange={atualizarCampo}
            />
            {erros.telefone && <span className={styles.erro}>{erros.telefone}</span>}
          </div>

          <div className={styles.campo}>
            <label htmlFor="endereco" className={styles.label}>Endereço</label>
            <input
              id="endereco"
              name="endereco"
              type="text"
              className={styles.input}
              value={valores.endereco}
              onChange={atualizarCampo}
            />
            {erros.endereco && <span className={styles.erro}>{erros.endereco}</span>}
          </div>
        </div>

        <div className={styles.linha}>
          <div className={styles.campo}>
            <label htmlFor="usuario" className={styles.label}>Usuário</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              className={styles.input}
              value={valores.usuario}
              onChange={atualizarCampo}
            />
            {erros.usuario && <span className={styles.erro}>{erros.usuario}</span>}
          </div>

          <div className={styles.campo}>
            <label htmlFor="senha" className={styles.label}>Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              className={styles.input}
              value={valores.senha}
              onChange={atualizarCampo}
            />
            {erros.senha && <span className={styles.erro}>{erros.senha}</span>}
          </div>
        </div>

        <div className={styles.campo}>
          <label htmlFor="nivelPermissao" className={styles.label}>Nível de Permissão</label>
          <select
            id="nivelPermissao"
            name="nivelPermissao"
            className={styles.input}
            value={valores.nivelPermissao}
            onChange={atualizarCampo}
          >
            <option value="">Selecione...</option>
            {NIVEIS_PERMISSAO.map((nivel) => (
              <option key={nivel} value={nivel}>{nivel}</option>
            ))}
          </select>
          {erros.nivelPermissao && (
            <span className={styles.erro}>{erros.nivelPermissao}</span>
          )}
        </div>

        <div className={styles.acoes}>
          <button
            type="button"
            className={styles.botaoSecundario}
            onClick={() => navigate('/funcionarios')}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.botaoPrimario}>
            <Save size={16} /> Salvar alterações
          </button>
        </div>
      </form>
    </PageStub>
  )
}

export default FuncionarioEditar
