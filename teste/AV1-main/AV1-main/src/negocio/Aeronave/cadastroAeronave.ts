import Entrada from "../../io/entrada.js";
import Aeronave from "../../modelo/classes/Aeronave.js";
import { TipoAeronave } from "../../modelo/enums/TipoAeronave.js";
import { AcaoSistema, validarPermissao } from "../../permissoes/permissoes.js"
import { obterUsuarioLogado } from "../../permissoes/sessao.js"
import Cadastro from "../cadastro.js";

export default class CadastroAeronave extends Cadastro {
    private aeronaves: Array<Aeronave>
    private entrada: Entrada
    constructor(aeronaves: Array<Aeronave>) {
        super()
        this.aeronaves = aeronaves
        this.entrada = new Entrada()
    }
    public cadastrar(): void {
        validarPermissao(AcaoSistema.CADASTRAR_AERONAVE, obterUsuarioLogado())

        console.log(`\nInício do cadastro da aeronave`);

        let codigo = '';
        while (true) { 
            codigo = this.entrada.receberTexto('Por favor informe o código da Aeronave: ')
            if (!this.aeronaves.some(aeronave => aeronave.codigo === codigo)) {
                break
            }
            console.log('Esse Código já existe. Por favor, tente novamente.')
        }

        let modelo = this.entrada.receberTexto('Por favor informe o modelo da Aeronave: ')

        let tipo = '';
        while (true) {
            tipo = this.entrada
                .receberTexto('Por favor informe o tipo da Aeronave (Comercial ou Militar): ')
                .trim()
                .toUpperCase()
            
            if (Object.values(TipoAeronave).includes(tipo as TipoAeronave)) {
                break
            }
            console.log('Tipo inválido. Por favor, tente novamente.')
        }

        let capacidade = this.entrada.receberNumero('Por favor informe a capacidade da Aeronave: ')
        let alcance = this.entrada.receberNumero('Por favor informe o alcance da Aeronave: ')

        let aeronave = new Aeronave(codigo, modelo, tipo as TipoAeronave, capacidade, alcance);
        this.aeronaves.push(aeronave)
        console.log(`\nCadastro concluído :)\n`);
    }
}