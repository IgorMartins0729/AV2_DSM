import { ResultadoTeste } from "../enums/ResultadoTeste.js"
import { TipoTeste } from "../enums/TipoTeste.js"

export default class Teste {
    public tipo: TipoTeste
    public resultado: ResultadoTeste

    constructor(tipo: TipoTeste, resultado: ResultadoTeste) {
        this.tipo = tipo
        this.resultado = resultado
    }

    public salvar(): void {}

    public carregar(): void {}
}
