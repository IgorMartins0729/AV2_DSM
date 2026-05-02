import {
    carregarDadosFuncionarios,
    salvarDadosFuncionarios,
    type FuncionarioJson
} from "../../io/persistencia.js"
import { NivelPermissao } from "../enums/NivelPermissao.js"

export default class Funcionario {
    public id: number
    public nome: string
    public telefone: string
    public endereco: string
    public usuario: string
    public senha: string
    public nivelPermissao: NivelPermissao

    constructor(
        id: number,
        nome: string,
        telefone: string,
        endereco: string,
        usuario: string,
        senha: string,
        nivelPermissao: NivelPermissao
    ) {
        this.id = id
        this.nome = nome
        this.telefone = telefone
        this.endereco = endereco
        this.usuario = usuario
        this.senha = senha
        this.nivelPermissao = nivelPermissao
    }

    public autenticar(usuario: string, senha: string): boolean {
        return this.usuario === usuario && this.senha === senha
    }

    public salvar(): void {
        const dadosArquivo = carregarDadosFuncionarios()
        const indice = dadosArquivo.findIndex(dado => dado.id === this.id)
        const dadosAtualizados = this.paraJson()

        if (indice >= 0) {
            dadosArquivo[indice] = dadosAtualizados
        } else {
            dadosArquivo.push(dadosAtualizados)
        }

        salvarDadosFuncionarios(dadosArquivo)
    }

    public carregar(): void {
        const dadosArquivo = carregarDadosFuncionarios()
        const dado = dadosArquivo.find(item => item.id === this.id)

        if (!dado) {
            console.log(`Funcionário com id ${this.id} não foi encontrado no arquivo.`)
            return
        }

        this.carregarDoJson(dado)
    }

    public paraJson(): FuncionarioJson {
        return {
            id: this.id,
            nome: this.nome,
            telefone: this.telefone,
            endereco: this.endereco,
            usuario: this.usuario,
            senha: this.senha,
            nivelPermissao: this.nivelPermissao
        }
    }

    public static deJson(dado: FuncionarioJson): Funcionario {
        return new Funcionario(
            dado.id,
            dado.nome,
            dado.telefone,
            dado.endereco,
            dado.usuario,
            dado.senha,
            dado.nivelPermissao as NivelPermissao
        )
    }

    private carregarDoJson(dado: FuncionarioJson): void {
        this.id = dado.id
        this.nome = dado.nome
        this.telefone = dado.telefone
        this.endereco = dado.endereco
        this.usuario = dado.usuario
        this.senha = dado.senha
        this.nivelPermissao = dado.nivelPermissao as NivelPermissao
    }
}
