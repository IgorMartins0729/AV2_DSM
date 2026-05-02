import Etapa from "../../modelo/classes/Etapa.js"
import Listagem from "../listagem.js"

export default class ListagemEtapa extends Listagem {
    private etapas: Array<Etapa>

    constructor(etapas: Array<Etapa>) {
        super()
        this.etapas = etapas
    }

    public listar(): void {
        console.log(`\nInício da listagem das etapas`)
        console.log("Ordem de execução: segue a ordem de cadastro (da primeira etapa cadastrada para as próximas).")

        if (this.etapas.length === 0) {
            console.log(`\nNenhuma etapa cadastrada.\n`)
            return
        }

        console.log(`\n-------------------`)
        this.etapas.forEach((etapa, indice) => {
            console.log(`Ordem de cadastro: ${indice + 1}`)
            console.log(`Nome: ${etapa.nome}`)
            console.log(`Prazo: ${etapa.prazo}`)
            console.log(`Status: ${etapa.status}`)

            if (etapa.funcionarios.length === 0) {
                console.log("Funcionários associados: nenhum")
            } else {
                let nomes = etapa.funcionarios.map(funcionario => `${funcionario.nome} (${funcionario.id})`)
                console.log(`Funcionários associados: ${nomes.join(", ")}`)
            }

            console.log(`-------------------`)
        })
        console.log(`\nFim da listagem das etapas\n`)
    }
}
