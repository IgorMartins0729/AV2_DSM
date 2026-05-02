import Aeronave from "../../modelo/classes/Aeronave.js";
import Listagem from "../listagem.js";

export default class ListagemAeronave extends Listagem {
    private aeronaves: Array<Aeronave>
    constructor(aeronaves: Array<Aeronave>) {
        super()
        this.aeronaves = aeronaves
    }
    public listar(): void {
        console.log(`\nInício da listagem das aeronaves`);

        if (this.aeronaves.length === 0) {
            console.log(`\nNenhuma aeronave cadastrada.\n`);
            return;
        }

        console.log(`\n-------------------`)
        this.aeronaves.forEach(aeronave => { aeronave.detalhes(); console.log(`-------------------`) });
        console.log(`\nFim da listagem das aeronaves\n`);
    }
}