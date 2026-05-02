import Entrada from "../../io/entrada.js"
import Funcionario from "../../modelo/classes/Funcionario.js"
import { NivelPermissao } from "../../modelo/enums/NivelPermissao.js"
import { AcaoSistema, validarPermissao } from "../../permissoes/permissoes.js"
import { obterUsuarioLogado } from "../../permissoes/sessao.js"
import Cadastro from "../cadastro.js"

export default class CadastroFuncionario extends Cadastro {
    private funcionarios: Array<Funcionario>
    private entrada: Entrada

    constructor(funcionarios: Array<Funcionario>) {
        super()
        this.funcionarios = funcionarios
        this.entrada = new Entrada()
    }

    public cadastrar(): void {
        validarPermissao(AcaoSistema.CADASTRAR_FUNCIONARIO, obterUsuarioLogado())

        console.log(`\nInício do cadastro do funcionário`)

        const id = this.gerarProximoId()
        console.log(`ID gerado automaticamente: ${id}`)

        const nome = this.entrada.receberTexto("Por favor informe o nome do Funcionário: ")
        const telefone = this.entrada.receberTexto("Por favor informe o telefone do Funcionário: ")
        const endereco = this.entrada.receberTexto("Por favor informe o endereço do Funcionário: ")

        let usuario = ""
        while (true) {
            usuario = this.entrada.receberTexto("Por favor informe o usuário do Funcionário: ")
            if (!this.funcionarios.some(funcionario => funcionario.usuario === usuario)) {
                break
            }
            console.log("Esse usuário já existe. Por favor, tente novamente.")
        }

        const senha = this.entrada.receberTexto("Por favor informe a senha do Funcionário: ")

        let nivelPermissao = ""
        while (true) {
            nivelPermissao = this.entrada
                .receberTexto("Por favor informe o nível de permissão (ADMINISTRADOR, ENGENHEIRO ou OPERADOR): ")
                .trim()
                .toUpperCase()

            if (Object.values(NivelPermissao).includes(nivelPermissao as NivelPermissao)) {
                break
            }
            console.log("Nível de permissão inválido. Por favor, tente novamente.")
        }

        const funcionario = new Funcionario(
            id,
            nome,
            telefone,
            endereco,
            usuario,
            senha,
            nivelPermissao as NivelPermissao
        )
        this.funcionarios.push(funcionario)

        console.log(`\nCadastro concluído :)\n`)
    }

    private gerarProximoId(): number {
        let maiorNumero = 0

        for (const funcionario of this.funcionarios) {
            if (funcionario.id > maiorNumero) {
                maiorNumero = funcionario.id
            }
        }

        let id = maiorNumero + 1

        while (this.funcionarios.some(funcionario => funcionario.id === id)) {
            id += 1
        }

        return id
    }
}