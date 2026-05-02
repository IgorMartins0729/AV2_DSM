import Entrada from "../../io/entrada.js"
import Aeronave from "../../modelo/classes/Aeronave.js"
import { ResultadoTeste } from "../../modelo/enums/ResultadoTeste.js"
import { TipoTeste } from "../../modelo/enums/TipoTeste.js"
import { AcaoSistema, validarPermissao } from "../../permissoes/permissoes.js"
import { obterUsuarioLogado } from "../../permissoes/sessao.js"
import Cadastro from "../cadastro.js"

export default class CadastroTeste extends Cadastro {
	private aeronave: Aeronave
	private entrada: Entrada

	constructor(aeronave: Aeronave) {
		super()
		this.aeronave = aeronave
		this.entrada = new Entrada()
	}

	public cadastrar(): void {
		validarPermissao(AcaoSistema.REGISTRAR_TESTE, obterUsuarioLogado())

		console.log("\nInício do registro do teste")

		let tipo = ""
		while (true) {
			tipo = this.entrada
				.receberTexto("Por favor informe o tipo do teste (ELETRICO, HIDRAULICO ou AERODINAMICO): ")
				.trim()
				.toUpperCase()

			if (Object.values(TipoTeste).includes(tipo as TipoTeste)) {
				break
			}

			console.log("Tipo inválido. Por favor, tente novamente.")
		}

		let resultado = ""
		while (true) {
			resultado = this.entrada
				.receberTexto("Por favor informe o resultado do teste (APROVADO ou REPROVADO): ")
				.trim()
				.toUpperCase()

			if (Object.values(ResultadoTeste).includes(resultado as ResultadoTeste)) {
				break
			}

			console.log("Resultado inválido. Por favor, tente novamente.")
		}

		try {
			const operacao = this.aeronave.registrarTeste(tipo as TipoTeste, resultado as ResultadoTeste)
			console.log(operacao.mensagem)
		} catch (erro) {
			if (erro instanceof Error) {
				console.log(erro.message)
				return
			}

			console.log("Erro inesperado ao registrar teste.")
		}
	}
}