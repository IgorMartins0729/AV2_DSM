import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

export interface FuncionarioJson {
    id: number
    nome: string
    telefone: string
    endereco: string
    usuario: string
    senha: string
    nivelPermissao: string
}

export interface PecaJson {
    nome: string
    tipo: string
    fornecedor: string
    status: string
}

export interface EtapaJson {
    nome: string
    prazo: string
    status: string
    funcionariosIds: Array<number>
}

export interface TesteJson {
    tipo: string
    resultado: string
}

export interface RelatorioJson {
    caminhoArquivo: string | null
}

export interface AeronaveJson {
    codigo: string
    modelo: string
    tipo: string
    capacidade: number
    alcance: number
    pecas: Array<PecaJson>
    etapas: Array<EtapaJson>
    relatorio: RelatorioJson | null
    testes: Array<TesteJson>
}

const STORAGE_DIR = join(process.cwd(), "storage")
export const ARQUIVO_AERONAVES = join(STORAGE_DIR, "aeronaves.json")
export const ARQUIVO_FUNCIONARIOS = join(STORAGE_DIR, "funcionarios.json")

function garantirDiretorioStorage(): void {
    if (!existsSync(STORAGE_DIR)) {
        mkdirSync(STORAGE_DIR, { recursive: true })
    }
}

function lerArrayJson<T>(arquivo: string): Array<T> {
    try {
        if (!existsSync(arquivo)) {
            return []
        }

        const conteudo = readFileSync(arquivo, { encoding: "utf-8" }).trim()
        if (conteudo.length === 0) {
            return []
        }

        const dados: unknown = JSON.parse(conteudo)
        return Array.isArray(dados) ? (dados as Array<T>) : []
    } catch (erro) {
        console.log(`Falha ao ler o arquivo ${arquivo}. O sistema usará lista vazia.`)
        return []
    }
}

function salvarArrayJson<T>(arquivo: string, dados: Array<T>): void {
    garantirDiretorioStorage()
    writeFileSync(arquivo, JSON.stringify(dados, null, 2), { encoding: "utf-8" })
}

export function inicializarPersistencia(): void {
    garantirDiretorioStorage()

    if (!existsSync(ARQUIVO_AERONAVES)) {
        salvarArrayJson<AeronaveJson>(ARQUIVO_AERONAVES, [])
    }

    if (!existsSync(ARQUIVO_FUNCIONARIOS)) {
        salvarArrayJson<FuncionarioJson>(ARQUIVO_FUNCIONARIOS, [])
    }
}

export function carregarDadosAeronaves(): Array<AeronaveJson> {
    return lerArrayJson<AeronaveJson>(ARQUIVO_AERONAVES)
}

export function salvarDadosAeronaves(aeronaves: Array<AeronaveJson>): void {
    salvarArrayJson<AeronaveJson>(ARQUIVO_AERONAVES, aeronaves)
}

export function carregarDadosFuncionarios(): Array<FuncionarioJson> {
    return lerArrayJson<FuncionarioJson>(ARQUIVO_FUNCIONARIOS)
}

export function salvarDadosFuncionarios(funcionarios: Array<FuncionarioJson>): void {
    salvarArrayJson<FuncionarioJson>(ARQUIVO_FUNCIONARIOS, funcionarios)
}
