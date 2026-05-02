import Funcionario from "../../modelo/classes/Funcionario.js"
import Listagem from "../listagem.js"

export default class ListagemFuncionario extends Listagem {
    private funcionarios: Array<Funcionario>

    constructor(funcionarios: Array<Funcionario>) {
        super()
        this.funcionarios = funcionarios
    }

    public listar(): void {
        console.log(`\nInício da listagem dos funcionários`)

        if (this.funcionarios.length === 0) {
            console.log(`\nNenhum funcionário cadastrado.\n`)
            return
        }

        console.log(`\n-------------------`)
        this.funcionarios.forEach(funcionario => {
            console.log(`ID: ${funcionario.id}`)
            console.log(`Nome: ${funcionario.nome}`)
            console.log(`Telefone: ${funcionario.telefone}`)
            console.log(`Endereço: ${funcionario.endereco}`)
            console.log(`Usuário: ${funcionario.usuario}`)
            console.log(`Nível de permissão: ${funcionario.nivelPermissao}`)
            console.log(`-------------------`)
        })
        console.log(`\nFim da listagem dos funcionários\n`)
    }
}
