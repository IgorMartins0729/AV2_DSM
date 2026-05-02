import Peca from "../../modelo/classes/Peca.js"
import Listagem from "../listagem.js"

export default class ListagemPeca extends Listagem {
    private pecas: Array<Peca>

    constructor(pecas: Array<Peca>) {
        super()
        this.pecas = pecas
    }

    public listar(): void {
        console.log(`\nInício da listagem das peças`)

        if (this.pecas.length === 0) {
            console.log(`\nNenhuma peça cadastrada.\n`)
            return
        }

        console.log(`\n-------------------`)
        this.pecas.forEach(peca => {
            console.log(`Nome: ${peca.nome}`)
            console.log(`Tipo: ${peca.tipo}`)
            console.log(`Fornecedor: ${peca.fornecedor}`)
            console.log(`Status: ${peca.status}`)
            console.log(`-------------------`)
        })
        console.log(`\nFim da listagem das peças\n`)
    }
}
