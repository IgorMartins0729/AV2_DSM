import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { isAbsolute, join, relative } from "node:path"
import type { RelatorioJson } from "../../io/persistencia.js"
import Aeronave from "./Aeronave.js"

export default class Relatorio {
    private conteudo: string
    private codigoAeronave: string
    private caminhoArquivo: string | null

    constructor() {
        this.conteudo = ""
        this.codigoAeronave = ""
        this.caminhoArquivo = null
    }

    public static deJson(dado: unknown): Relatorio {
        const relatorio = new Relatorio()

        if (!dado || typeof dado !== "object") {
            return relatorio
        }

        const dadoRelatorio = dado as { caminhoArquivo?: unknown }
        if (typeof dadoRelatorio.caminhoArquivo === "string" && dadoRelatorio.caminhoArquivo.trim().length > 0) {
            relatorio.caminhoArquivo = dadoRelatorio.caminhoArquivo
            relatorio.carregarConteudoDoArquivo()
        }

        return relatorio
    }

    public paraJson(): RelatorioJson {
        return {
            caminhoArquivo: this.caminhoArquivo
        }
    }

    public gerarRelatorio(aeronave: Aeronave, nomeCliente: string, dataEntrega: string): void {
        const linhas: Array<string> = []

        linhas.push("===== RELATÓRIO DA AERONAVE =====")
        linhas.push("")
        linhas.push("Informações Gerais")
        linhas.push(`- Código: ${aeronave.codigo}`)
        linhas.push(`- Modelo: ${aeronave.modelo}`)
        linhas.push(`- Tipo: ${aeronave.tipo}`)
        linhas.push(`- Capacidade: ${aeronave.capacidade}`)
        linhas.push(`- Alcance: ${aeronave.alcance}`)
        linhas.push(`- Gerado em: ${new Date().toLocaleString()}`)
        linhas.push(`- Cliente: ${nomeCliente}`)
        linhas.push(`- Data de Entrega: ${dataEntrega}`)
        linhas.push("")

        linhas.push("Etapas Realizadas")
        if (aeronave.getEtapas().length === 0) {
            linhas.push("- Nenhuma etapa registrada")
        } else {
            aeronave.getEtapas().forEach((etapa, indice) => {
                linhas.push(`- [${indice + 1}] ${etapa.nome} | Prazo: ${etapa.prazo} | Status: ${etapa.status}`)

                const funcionarios = etapa.listarFuncionarios()
                if (funcionarios.length === 0) {
                    linhas.push("  Funcionários associados: nenhum")
                } else {
                    linhas.push("  Funcionários associados:")
                    funcionarios.forEach(funcionario => {
                        linhas.push(`  - ${funcionario.nome} (ID: ${funcionario.id})`)
                    })
                }
            })
        }

        linhas.push("")
        linhas.push("Peças Utilizadas")
        if (aeronave.getPecas().length === 0) {
            linhas.push("- Nenhuma peça registrada")
        } else {
            aeronave.getPecas().forEach(peca => {
                linhas.push(
                    `- ${peca.nome} | Tipo: ${peca.tipo} | Fornecedor: ${peca.fornecedor} | Status: ${peca.status}`
                )
            })
        }

        linhas.push("")
        linhas.push("Resultados dos Testes")
        if (aeronave.getTestes().length === 0) {
            linhas.push("- Nenhum teste registrado")
        } else {
            aeronave.getTestes().forEach(teste => {
                linhas.push(`- Tipo: ${teste.tipo} | Resultado: ${teste.resultado}`)
            })
        }

        this.codigoAeronave = aeronave.codigo
        this.conteudo = linhas.join("\n")

        console.log("\nConteúdo do relatório:")
        console.log("-------------------")
        console.log(this.conteudo)
        console.log("-------------------")
    }

    public salvarEmArquivo(): void {
        if (this.conteudo.trim().length === 0 || this.codigoAeronave.trim().length === 0) {
            console.log("Nenhum relatório foi gerado para salvar.")
            return
        }

        const pastaRelatorios = join(process.cwd(), "storage", "relatorios")
        if (!existsSync(pastaRelatorios)) {
            mkdirSync(pastaRelatorios, { recursive: true })
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const nomeArquivo = `relatorio_${this.codigoAeronave}_${timestamp}.txt`
        const caminhoArquivo = join(pastaRelatorios, nomeArquivo)

        writeFileSync(caminhoArquivo, this.conteudo, { encoding: "utf-8" })
        this.caminhoArquivo = relative(process.cwd(), caminhoArquivo).split("\\").join("/")
        console.log(`Arquivo salvo em: ${caminhoArquivo}`)
    }

    public exibir(): void {
        if (this.conteudo.trim().length === 0 && this.caminhoArquivo) {
            this.carregarConteudoDoArquivo()
        }

        if (this.conteudo.trim().length === 0) {
            if (this.caminhoArquivo) {
                console.log(`Relatório existente, mas não foi possível ler o arquivo em: ${this.caminhoArquivo}`)
                return
            }

            console.log("Relatório existente, mas sem conteúdo carregado nesta sessão.")
            return
        }

        console.log("-------------------")
        console.log(this.conteudo)
        console.log("-------------------")
    }

    private carregarConteudoDoArquivo(): void {
        if (!this.caminhoArquivo) {
            return
        }

        const caminhoAbsoluto = isAbsolute(this.caminhoArquivo)
            ? this.caminhoArquivo
            : join(process.cwd(), this.caminhoArquivo)

        if (!existsSync(caminhoAbsoluto)) {
            return
        }

        this.conteudo = readFileSync(caminhoAbsoluto, { encoding: "utf-8" })
    }
}
