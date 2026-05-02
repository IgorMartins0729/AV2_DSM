import { StatusPeca } from "../enums/StatusPeca.js"
import { TipoPeca } from "../enums/TipoPeca.js"

export default class Peca {
    public nome: string
    public tipo: TipoPeca
    public fornecedor: string
    public status: StatusPeca

    constructor(nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca) {
        this.nome = nome
        this.tipo = tipo
        this.fornecedor = fornecedor
        this.status = status
    }

    public atualizarStatus(novoStatus: StatusPeca): void {
        this.status = novoStatus
    }

    public salvar(): void {}

    public carregar(): void {}
}
