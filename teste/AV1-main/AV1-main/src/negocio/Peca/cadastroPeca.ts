import Entrada from "../../io/entrada.js"
import Aeronave from "../../modelo/classes/Aeronave.js"
import Peca from "../../modelo/classes/Peca.js"
import { StatusPeca } from "../../modelo/enums/StatusPeca.js"
import { TipoPeca } from "../../modelo/enums/TipoPeca.js"
import { AcaoSistema, validarPermissao } from "../../permissoes/permissoes.js"
import { obterUsuarioLogado } from "../../permissoes/sessao.js"
import Cadastro from "../cadastro.js"

export default class CadastroPeca extends Cadastro {
    private aeronave: Aeronave
    private entrada: Entrada

    constructor(aeronave: Aeronave) {
        super()
        this.aeronave = aeronave
        this.entrada = new Entrada()
    }

    public cadastrar(): void {
        validarPermissao(AcaoSistema.CADASTRAR_PECA, obterUsuarioLogado())

        console.log(`\nInício do cadastro da peça`)

        let nome = ""
        while (true) {
            nome = this.entrada.receberTexto("Por favor informe o nome da Peça: ")
            if (!this.aeronave.getPecas().some(peca => peca.nome === nome)) {
                break
            }
            console.log("Essa peça já existe. Por favor, tente novamente.")
        }

        let tipo = ""
        while (true) {
            tipo = this.entrada
                .receberTexto("Por favor informe o tipo da Peça (NACIONAL ou IMPORTADA): ")
                .trim()
                .toUpperCase()
            if (Object.values(TipoPeca).includes(tipo as TipoPeca)) {
                break
            }
            console.log("Tipo inválido. Por favor, tente novamente.")
        }

        let fornecedor = this.entrada.receberTexto("Por favor informe o fornecedor da Peça: ")

        let status = ""
        while (true) {
            status = this.entrada
                .receberTexto("Por favor informe o status da Peça (EM_PRODUCAO, EM_TRANSPORTE ou PRONTA): ")
                .trim()
                .toUpperCase()
            if (Object.values(StatusPeca).includes(status as StatusPeca)) {
                break
            }
            console.log("Status inválido. Por favor, tente novamente.")
        }

        let peca = new Peca(nome, tipo as TipoPeca, fornecedor, status as StatusPeca)
        this.aeronave.adicionarPeca(peca)

        console.log(`\nCadastro concluído :)\n`)
    }
}
