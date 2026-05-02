import { StatusEtapa } from "../enums/StatusEtapa.js"
import { AcaoSistema, validarPermissao } from "../../permissoes/permissoes.js"
import { obterUsuarioLogado } from "../../permissoes/sessao.js"
import Funcionario from "./Funcionario.js"

export default class Etapa {
    public nome: string
    public prazo: string
    public status: StatusEtapa
    public funcionarios: Array<Funcionario>

    constructor(nome: string, prazo: string, status: StatusEtapa, funcionarios: Array<Funcionario> = []) {
        this.nome = nome
        this.prazo = prazo
        this.status = status
        this.funcionarios = funcionarios
    }

    public iniciar(): void {
        this.status = StatusEtapa.ANDAMENTO
    }

    public finalizar(): void {
        this.status = StatusEtapa.CONCLUIDA
    }

    public associarFuncionario(f: Funcionario): void {
        validarPermissao(AcaoSistema.ASSOCIAR_FUNCIONARIO_ETAPA, obterUsuarioLogado())

        if (this.funcionarios.some(funcionario => funcionario.id === f.id)) {
            return
        }

        this.funcionarios.push(f)
    }

    public listarFuncionarios(): Array<Funcionario> {
        return this.funcionarios
    }
}
