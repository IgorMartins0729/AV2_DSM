import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import PageStub from '../../../components/PageStub'
import { useFuncionarios } from '../../../contexts/FuncionariosContext'
import styles from '../../../styles/forms.module.css'

const NIVEIS_PERMISSAO = ['ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR']

const valoresIniciais = {
  id: '',
  nome: '',
  telefone: '',
  endereco: '',
  usuario: '',
  senha: '',
  nivelPermissao: '',
}

function FuncionarioCadastrar() {
  const navigate = useNavigate()
  const { cadastrar } = useFuncionarios()
  const [valores, setValores] = useState(valoresIniciais)
  const [erros, setErros] = useState({})

  function atualizarCampo(evento) {
    const { name, value } = evento.target
    setValores((anterior) => ({ ...anterior, [name]: value }))
    if (erros[name]) {
      setErros((anterior) => ({ ...anterior, [name]: undefined }))
    }
  }

  function validar() {
    const novosErros = {}

    const id = Number(valores.id)
    if (!valores.id || Number.isNaN(id) || id <= 0) {
      novosErros.id = 'ID deve ser um número maior que zero.'
    }
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
      id: Number(valores.id),
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
      title="Cadastrar Funcionário"
      description="Preencha os dados para registrar um novo funcionário."
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
              min="1"
              className={styles.input}
              value={valores.id}
              onChange={atualizarCampo}
              placeholder="Ex: 1001"
            />
            {erros.id && <span className={styles.erro}>{erros.id}</span>}
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
              placeholder="Nome completo"
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
              placeholder="(11) 99999-9999"
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
              placeholder="Rua, número, cidade"
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
              placeholder="login.usuario"
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
              placeholder="••••••••"
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
            <Save size={16} /> Salvar
          </button>
        </div>
      </form>
    </PageStub>
  )
}

export default FuncionarioCadastrar
