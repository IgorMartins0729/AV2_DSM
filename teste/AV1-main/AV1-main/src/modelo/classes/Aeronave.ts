import {
    carregarDadosAeronaves,
    salvarDadosAeronaves,
    type AeronaveJson
} from "../../io/persistencia.js"
import { ResultadoTeste } from "../enums/ResultadoTeste.js"
import { StatusEtapa } from "../enums/StatusEtapa.js"
import { StatusPeca } from "../enums/StatusPeca.js"
import { TipoAeronave } from "../enums/TipoAeronave.js"
import { TipoPeca } from "../enums/TipoPeca.js"
import { TipoTeste } from "../enums/TipoTeste.js"
import { AcaoSistema, validarPermissao } from "../../permissoes/permissoes.js"
import { obterUsuarioLogado } from "../../permissoes/sessao.js"
import Etapa from "./Etapa.js"
import Funcionario from "./Funcionario.js"
import Peca from "./Peca.js"
import Relatorio from "./Relatorio.js"
import Teste from "./Teste.js"

type ResultadoOperacao = {
    sucesso: boolean
    mensagem: string
}

type ResultadoVerificacaoRelatorio = {
    sucesso: boolean
    pendencias: Array<string>
}

const MENSAGEM_AERONAVE_FINALIZADA = "Não é possível modificar uma aeronave que já possui relatório final emitido."

export default class Aeronave {
    public codigo: string
    public modelo: string
    public tipo: TipoAeronave
    public capacidade: number
    public alcance: number
    private pecas: Array<Peca>
    private etapas: Array<Etapa>
    private relatorio: Relatorio | null
    private testes: Array<Teste>

    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
        this.codigo = codigo
        this.modelo = modelo
        this.tipo = tipo
        this.capacidade = capacidade
        this.alcance = alcance
        this.pecas = []
        this.etapas = []
        this.relatorio = null
        this.testes = []
    }

    public detalhes(): void {
        console.log(`Código: ${this.codigo}`)
        console.log(`Modelo: ${this.modelo}`)
        console.log(`Tipo: ${this.tipo}`)
        console.log(`Capacidade: ${this.capacidade}`)
        console.log(`Alcance: ${this.alcance}`)

        console.log(`Peças (${this.pecas.length}):`)
        if (this.pecas.length === 0) {
            console.log("- Nenhuma peça cadastrada")
        } else {
            this.pecas.forEach(peca => {
                console.log(`- ${peca.nome} | Status: ${peca.status}`)
            })
        }

        console.log(`Etapas (${this.etapas.length}):`)
        if (this.etapas.length === 0) {
            console.log("- Nenhuma etapa cadastrada")
        } else {
            this.etapas.forEach(etapa => {
                console.log(`- ${etapa.nome} | Status: ${etapa.status}`)
            })
        }

        console.log(`Testes (${this.testes.length}):`)
        if (this.testes.length === 0) {
            console.log("- Nenhum teste registrado")
        } else {
            this.testes.forEach(teste => {
                console.log(`- ${teste.tipo} | Resultado: ${teste.resultado}`)
            })
        }

        console.log(`Relatório foi gerado: ${this.relatorio ? "SIM" : "NAO"}`)
    }

    public salvar(): void {
        const dadosArquivo = carregarDadosAeronaves()
        const indice = dadosArquivo.findIndex(dado => dado.codigo === this.codigo)
        const dadosAtualizados = this.paraJson()

        if (indice >= 0) {
            dadosArquivo[indice] = dadosAtualizados
        } else {
            dadosArquivo.push(dadosAtualizados)
        }

        salvarDadosAeronaves(dadosArquivo)
    }

    public carregar(): void {
        const dadosArquivo = carregarDadosAeronaves()
        const dado = dadosArquivo.find(item => item.codigo === this.codigo)

        if (!dado) {
            console.log(`Aeronave com código ${this.codigo} não foi encontrada no arquivo.`)
            return
        }

        this.carregarDoJson(dado)
    }

    public paraJson(): AeronaveJson {
        return {
            codigo: this.codigo,
            modelo: this.modelo,
            tipo: this.tipo,
            capacidade: this.capacidade,
            alcance: this.alcance,
            pecas: this.pecas.map(peca => ({
                nome: peca.nome,
                tipo: peca.tipo,
                fornecedor: peca.fornecedor,
                status: peca.status
            })),
            etapas: this.etapas.map(etapa => ({
                nome: etapa.nome,
                prazo: etapa.prazo,
                status: etapa.status,
                funcionariosIds: etapa.funcionarios.map(funcionario => funcionario.id)
            })),
            relatorio: this.relatorio ? this.relatorio.paraJson() : null,
            testes: this.testes.map(teste => ({
                tipo: teste.tipo,
                resultado: teste.resultado
            }))
        }
    }

    public static deJson(
        dado: AeronaveJson,
        funcionariosDisponiveis: Array<Funcionario> = []
    ): Aeronave {
        const aeronave = new Aeronave("", "", TipoAeronave.COMERCIAL, 0, 0)
        aeronave.carregarDoJson(dado, funcionariosDisponiveis)
        return aeronave
    }

    public getPecas(): Array<Peca> {
        return this.pecas
    }

    public getEtapas(): Array<Etapa> {
        return this.etapas
    }

    public getRelatorio(): Relatorio | null {
        return this.relatorio
    }

    public getTestes(): Array<Teste> {
        return this.testes
    }

    public adicionarPeca(peca: Peca): void {
        this.pecas.push(peca)
    }

    public adicionarEtapa(etapa: Etapa): void {
        this.etapas.push(etapa)
    }

    public adicionarRelatorio(relatorio: Relatorio): void {
        validarPermissao(AcaoSistema.GERAR_RELATORIO_FINAL, obterUsuarioLogado())
        if (this.relatorio) {
            throw new Error("A aeronave já possui relatório gerado.")
        }

        this.relatorio = relatorio
    }

    public verificarRequisitosRelatorioFinal(): ResultadoVerificacaoRelatorio {
        const pendencias: Array<string> = []

        if (this.relatorio) {
            pendencias.push("Já existe relatório final gerado para esta aeronave. Apenas um relatório final por aeronave é permitido.")
        }

        if (this.etapas.length === 0) {
            pendencias.push("Cadastrar etapas de produção para esta aeronave.")
        }

        const etapasNaoConcluidas = this.etapas
            .filter(etapa => etapa.status !== StatusEtapa.CONCLUIDA)
            .map(etapa => etapa.nome)

        if (etapasNaoConcluidas.length > 0) {
            pendencias.push(
                `Concluir todas as etapas de produção. Pendentes: ${etapasNaoConcluidas.join(", ")}.`
            )
        }

        if (this.existeQuebraOrdemLogicaEtapas()) {
            pendencias.push(
                "Corrigir a ordem lógica das etapas (não pode haver avanço em etapa posterior antes da anterior ser concluída)."
            )
        }

        if (this.pecas.length === 0) {
            pendencias.push("Associar ao menos uma peça à aeronave.")
        }

        const tiposObrigatorios = Object.values(TipoTeste)
        const tiposRegistrados = this.testes.map(teste => teste.tipo)
        const tiposUnicosRegistrados = new Set(tiposRegistrados)

        if (tiposRegistrados.length !== tiposUnicosRegistrados.size) {
            pendencias.push("Manter apenas um registro por tipo de teste (ELETRICO, HIDRAULICO e AERODINAMICO).")
        }

        const tiposFaltantes = tiposObrigatorios.filter(tipo => !tiposUnicosRegistrados.has(tipo))
        if (tiposFaltantes.length > 0) {
            pendencias.push(
                `Registrar os 3 tipos de teste (ELETRICO, HIDRAULICO e AERODINAMICO). Faltantes: ${tiposFaltantes.join(", ")}.`
            )
        }

        return {
            sucesso: pendencias.length === 0,
            pendencias
        }
    }

    public registrarTeste(tipo: TipoTeste, resultado: ResultadoTeste): ResultadoOperacao {
        validarPermissao(AcaoSistema.REGISTRAR_TESTE, obterUsuarioLogado())
        this.validarAeronaveNaoFinalizada()

        const indiceTesteMesmoTipo = this.testes.findIndex(teste => teste.tipo === tipo)

        if (indiceTesteMesmoTipo >= 0) {
            this.testes[indiceTesteMesmoTipo] = new Teste(tipo, resultado)
            return {
                sucesso: true,
                mensagem: "Teste registrado com sucesso. O registro anterior desse tipo foi sobrescrito."
            }
        }

        this.testes.push(new Teste(tipo, resultado))
        return {
            sucesso: true,
            mensagem: "Teste registrado com sucesso."
        }
    }

    public atualizarStatusPeca(nomePeca: string, novoStatus: StatusPeca): ResultadoOperacao {
        validarPermissao(AcaoSistema.ATUALIZAR_STATUS_PECA, obterUsuarioLogado())
        this.validarAeronaveNaoFinalizada()

        const peca = this.pecas.find(item => item.nome === nomePeca)

        if (!peca) {
            return {
                sucesso: false,
                mensagem: "Peça não encontrada."
            }
        }

        if (peca.status === novoStatus) {
            return {
                sucesso: false,
                mensagem: "A peça já está com esse status."
            }
        }

        peca.atualizarStatus(novoStatus)
        return {
            sucesso: true,
            mensagem: "Status da peça atualizado com sucesso."
        }
    }

    public iniciarEtapa(nomeEtapa: string): ResultadoOperacao {
        validarPermissao(AcaoSistema.INICIAR_ETAPA, obterUsuarioLogado())
        this.validarAeronaveNaoFinalizada()

        const nomeNormalizado = nomeEtapa.trim().toLowerCase()
        const indice = this.etapas.findIndex(etapa => etapa.nome.trim().toLowerCase() === nomeNormalizado)

        if (indice < 0) {
            return {
                sucesso: false,
                mensagem: "Etapa não encontrada."
            }
        }

        const etapa = this.etapas[indice]
        if (!etapa) {
            return {
                sucesso: false,
                mensagem: "Etapa não encontrada."
            }
        }

        if (etapa.status === StatusEtapa.CONCLUIDA) {
            return {
                sucesso: false,
                mensagem: "A etapa já foi concluída."
            }
        }

        if (etapa.status === StatusEtapa.ANDAMENTO) {
            return {
                sucesso: false,
                mensagem: "A etapa já está em andamento."
            }
        }

        const etapaAnterior = indice > 0 ? this.etapas[indice - 1] : undefined
        if (etapaAnterior && etapaAnterior.status !== StatusEtapa.CONCLUIDA) {
            return {
                sucesso: false,
                mensagem: "Não é possível iniciar esta etapa antes da anterior ser concluída. A ordem segue o cadastro: etapas registradas primeiro devem avançar antes das próximas."
            }
        }

        etapa.iniciar()
        return {
            sucesso: true,
            mensagem: "Etapa iniciada com sucesso."
        }
    }

    public finalizarEtapa(nomeEtapa: string): ResultadoOperacao {
        validarPermissao(AcaoSistema.FINALIZAR_ETAPA, obterUsuarioLogado())
        this.validarAeronaveNaoFinalizada()

        const nomeNormalizado = nomeEtapa.trim().toLowerCase()
        const indice = this.etapas.findIndex(etapa => etapa.nome.trim().toLowerCase() === nomeNormalizado)

        if (indice < 0) {
            return {
                sucesso: false,
                mensagem: "Etapa não encontrada."
            }
        }

        const etapa = this.etapas[indice]
        if (!etapa) {
            return {
                sucesso: false,
                mensagem: "Etapa não encontrada."
            }
        }

        if (etapa.status === StatusEtapa.CONCLUIDA) {
            return {
                sucesso: false,
                mensagem: "A etapa já está concluída."
            }
        }

        if (etapa.status === StatusEtapa.PENDENTE) {
            return {
                sucesso: false,
                mensagem: "A etapa precisa ser iniciada antes de ser concluída. A ordem segue o cadastro: etapas registradas primeiro devem avançar antes das próximas."
            }
        }

        const etapaAnterior = indice > 0 ? this.etapas[indice - 1] : undefined
        if (etapaAnterior && etapaAnterior.status !== StatusEtapa.CONCLUIDA) {
            return {
                sucesso: false,
                mensagem: "Não é possível concluir esta etapa antes da anterior ser concluída. A ordem segue o cadastro: etapas registradas primeiro devem avançar antes das próximas."
            }
        }

        etapa.finalizar()
        return {
            sucesso: true,
            mensagem: "Etapa concluída com sucesso."
        }
    }

    private existeQuebraOrdemLogicaEtapas(): boolean {
        for (let indice = 1; indice < this.etapas.length; indice++) {
            const etapaAnterior = this.etapas[indice - 1]
            const etapaAtual = this.etapas[indice]

            if (!etapaAnterior || !etapaAtual) {
                continue
            }

            if (
                etapaAnterior.status !== StatusEtapa.CONCLUIDA
                && etapaAtual.status !== StatusEtapa.PENDENTE
            ) {
                return true
            }
        }

        return false
    }

    private validarAeronaveNaoFinalizada(): void {
        if (this.relatorio) {
            throw new Error(MENSAGEM_AERONAVE_FINALIZADA)
        }
    }

    private carregarDoJson(
        dado: AeronaveJson,
        funcionariosDisponiveis: Array<Funcionario> = []
    ): void {
        const dadoLegado = dado as AeronaveJson & { relatorios?: Array<Record<string, never>> }
        const funcionarioPorId = new Map(funcionariosDisponiveis.map(funcionario => [funcionario.id, funcionario]))

        this.codigo = dado.codigo
        this.modelo = dado.modelo
        this.tipo = dado.tipo as TipoAeronave
        this.capacidade = dado.capacidade
        this.alcance = dado.alcance

        this.pecas = dado.pecas.map(peca => new Peca(
            peca.nome,
            peca.tipo as TipoPeca,
            peca.fornecedor,
            peca.status as StatusPeca
        ))

        this.etapas = dado.etapas.map(etapa => {
            const funcionariosAssociados = etapa.funcionariosIds
                .map(id => funcionarioPorId.get(id))
                .filter((funcionario): funcionario is Funcionario => funcionario !== undefined)

            return new Etapa(
                etapa.nome,
                etapa.prazo,
                etapa.status as StatusEtapa,
                funcionariosAssociados
            )
        })

        const possuiRelatorioLegado = Array.isArray(dadoLegado.relatorios) && dadoLegado.relatorios.length > 0
        if (dado.relatorio) {
            this.relatorio = Relatorio.deJson(dado.relatorio)
        } else if (possuiRelatorioLegado) {
            this.relatorio = new Relatorio()
        } else {
            this.relatorio = null
        }

        this.testes = dado.testes.map(teste => new Teste(
            teste.tipo as TipoTeste,
            teste.resultado as ResultadoTeste
        ))
    }
}