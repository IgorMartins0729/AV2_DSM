import Teste from "../../modelo/classes/Teste.js"
import Listagem from "../listagem.js"

export default class ListagemTeste extends Listagem {
    private testes: Array<Teste>

    constructor(testes: Array<Teste>) {
        super()
        this.testes = testes
    }

    public listar(): void {
        console.log(`\nInício da listagem dos testes`)

        if (this.testes.length === 0) {
            console.log(`\nNenhum teste cadastrado.\n`)
            return
        }

        console.log(`\n-------------------`)
        this.testes.forEach(teste => {
            console.log(`Tipo: ${teste.tipo}`)
            console.log(`Resultado: ${teste.resultado}`)
            console.log(`-------------------`)
        })
        console.log(`\nFim da listagem dos testes\n`)
    }
}
