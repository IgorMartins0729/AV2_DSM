import type Funcionario from "../modelo/classes/Funcionario.js"
import { NivelPermissao } from "../modelo/enums/NivelPermissao.js"

export enum AcaoSistema {
    CADASTRAR_AERONAVE = "CADASTRAR_AERONAVE",
    CADASTRAR_PECA = "CADASTRAR_PECA",
    CADASTRAR_ETAPA = "CADASTRAR_ETAPA",
    ASSOCIAR_FUNCIONARIO_ETAPA = "ASSOCIAR_FUNCIONARIO_ETAPA",
    REGISTRAR_TESTE = "REGISTRAR_TESTE",
    GERAR_RELATORIO_FINAL = "GERAR_RELATORIO_FINAL",
    CADASTRAR_FUNCIONARIO = "CADASTRAR_FUNCIONARIO",
    LISTAR_FUNCIONARIOS = "LISTAR_FUNCIONARIOS",
    ATUALIZAR_STATUS_PECA = "ATUALIZAR_STATUS_PECA",
    INICIAR_ETAPA = "INICIAR_ETAPA",
    FINALIZAR_ETAPA = "FINALIZAR_ETAPA"
}

const HIERARQUIA_NIVEL: Record<NivelPermissao, number> = {
    [NivelPermissao.OPERADOR]: 1,
    [NivelPermissao.ENGENHEIRO]: 2,
    [NivelPermissao.ADMINISTRADOR]: 3
}

const NIVEL_MINIMO_POR_ACAO: Record<AcaoSistema, NivelPermissao> = {
    [AcaoSistema.CADASTRAR_AERONAVE]: NivelPermissao.ENGENHEIRO,
    [AcaoSistema.CADASTRAR_PECA]: NivelPermissao.ENGENHEIRO,
    [AcaoSistema.CADASTRAR_ETAPA]: NivelPermissao.ENGENHEIRO,
    [AcaoSistema.ASSOCIAR_FUNCIONARIO_ETAPA]: NivelPermissao.ENGENHEIRO,
    [AcaoSistema.REGISTRAR_TESTE]: NivelPermissao.ENGENHEIRO,
    [AcaoSistema.GERAR_RELATORIO_FINAL]: NivelPermissao.ENGENHEIRO,
    [AcaoSistema.CADASTRAR_FUNCIONARIO]: NivelPermissao.ADMINISTRADOR,
    [AcaoSistema.LISTAR_FUNCIONARIOS]: NivelPermissao.ENGENHEIRO,
    [AcaoSistema.ATUALIZAR_STATUS_PECA]: NivelPermissao.OPERADOR,
    [AcaoSistema.INICIAR_ETAPA]: NivelPermissao.OPERADOR,
    [AcaoSistema.FINALIZAR_ETAPA]: NivelPermissao.OPERADOR
}

const DESCRICAO_ACAO: Record<AcaoSistema, string> = {
    [AcaoSistema.CADASTRAR_AERONAVE]: "cadastrar aeronave",
    [AcaoSistema.CADASTRAR_PECA]: "cadastrar peça",
    [AcaoSistema.CADASTRAR_ETAPA]: "cadastrar etapa",
    [AcaoSistema.ASSOCIAR_FUNCIONARIO_ETAPA]: "associar funcionário à etapa",
    [AcaoSistema.REGISTRAR_TESTE]: "registrar teste",
    [AcaoSistema.GERAR_RELATORIO_FINAL]: "gerar relatório final",
    [AcaoSistema.CADASTRAR_FUNCIONARIO]: "cadastrar funcionário",
    [AcaoSistema.LISTAR_FUNCIONARIOS]: "listar funcionários",
    [AcaoSistema.ATUALIZAR_STATUS_PECA]: "atualizar status de peça",
    [AcaoSistema.INICIAR_ETAPA]: "iniciar etapa",
    [AcaoSistema.FINALIZAR_ETAPA]: "finalizar etapa"
}

export class ErroPermissao extends Error {
    public readonly acao: AcaoSistema
    public readonly nivelNecessario: NivelPermissao
    public readonly nivelAtual: NivelPermissao | null

    constructor(acao: AcaoSistema, nivelNecessario: NivelPermissao, nivelAtual: NivelPermissao | null) {
        const descricaoAcao = DESCRICAO_ACAO[acao]
        const descricaoNivelAtual = nivelAtual ?? "NAO_AUTENTICADO"
        super(`Acesso negado para ${descricaoAcao}. Nível necessário: ${nivelNecessario}. Nível atual: ${descricaoNivelAtual}.`)
        this.name = "ErroPermissao"
        this.acao = acao
        this.nivelNecessario = nivelNecessario
        this.nivelAtual = nivelAtual
    }
}

function temNivelSuficiente(nivelAtual: NivelPermissao, nivelNecessario: NivelPermissao): boolean {
    return HIERARQUIA_NIVEL[nivelAtual] >= HIERARQUIA_NIVEL[nivelNecessario]
}

export function validarPermissao(acao: AcaoSistema, usuario: Funcionario | null): void {
    const nivelNecessario = NIVEL_MINIMO_POR_ACAO[acao]

    if (!usuario) {
        throw new ErroPermissao(acao, nivelNecessario, null)
    }

    if (!temNivelSuficiente(usuario.nivelPermissao, nivelNecessario)) {
        throw new ErroPermissao(acao, nivelNecessario, usuario.nivelPermissao)
    }
}
