import Entrada from "../../io/entrada.js"
import Aeronave from "../../modelo/classes/Aeronave.js"
import Etapa from "../../modelo/classes/Etapa.js"
import Funcionario from "../../modelo/classes/Funcionario.js"
import { StatusEtapa } from "../../modelo/enums/StatusEtapa.js"
import { AcaoSistema, validarPermissao } from "../../permissoes/permissoes.js"
import { obterUsuarioLogado } from "../../permissoes/sessao.js"
import Cadastro from "../cadastro.js"

export default class CadastroEtapa extends Cadastro {
    private aeronave: Aeronave
    private funcionarios: Array<Funcionario>
    private entrada: Entrada

    constructor(aeronave: Aeronave, funcionarios: Array<Funcionario>) {
        super()
        this.aeronave = aeronave
        this.funcionarios = funcionarios
        this.entrada = new Entrada()
    }

    public cadastrar(): void {
        validarPermissao(AcaoSistema.CADASTRAR_ETAPA, obterUsuarioLogado())

        console.log(`\nInício do cadastro da etapa`)
        console.log("As etapas seguem a ordem de cadastro: as primeiras registradas devem avançar antes das próximas.")

        let nome = ""
        while (true) {
            nome = this.entrada.receberTexto("Por favor informe o nome da Etapa: ")
            if (!this.aeronave.getEtapas().some(etapa => etapa.nome === nome)) {
                break
            }
            console.log("Essa etapa já existe. Por favor, tente novamente.")
        }

        let prazo = this.entrada.receberTexto("Por favor informe o prazo da Etapa: ")

        const status = StatusEtapa.PENDENTE
        console.log("Status inicial da etapa definido automaticamente como PENDENTE.")

        let funcionariosAssociados: Array<Funcionario> = []
        if (this.funcionarios.length > 0) {
            while (true) {
                let resposta = this.entrada.receberTexto("Deseja associar um funcionário à etapa? (s/n): ").toLowerCase()

                if (resposta === "n") {
                    break
                }

                if (resposta !== "s") {
                    console.log("Opção inválida. Responda com s ou n.")
                    continue
                }

                validarPermissao(AcaoSistema.ASSOCIAR_FUNCIONARIO_ETAPA, obterUsuarioLogado())

                let idFuncionario = this.entrada.receberNumero("Informe o ID do Funcionário: ")
                let funcionario = this.funcionarios.find(item => item.id === idFuncionario)

                if (!funcionario) {
                    console.log("Funcionário não encontrado.")
                    continue
                }

                if (funcionariosAssociados.some(item => item.id === funcionario.id)) {
                    console.log("Funcionário já associado a esta etapa.")
                    continue
                }

                funcionariosAssociados.push(funcionario)
                console.log("Funcionário associado com sucesso.")
            }
        }

        let etapa = new Etapa(nome, prazo, status, funcionariosAssociados)
        this.aeronave.adicionarEtapa(etapa)

        const ordemCadastro = this.aeronave.getEtapas().length
        console.log(`Etapa cadastrada na posição ${ordemCadastro} da ordem de cadastro.`)

        console.log(`\nCadastro concluído :)\n`)
    }
}
