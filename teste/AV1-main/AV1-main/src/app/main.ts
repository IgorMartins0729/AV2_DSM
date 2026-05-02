import Entrada from "../io/entrada.js"
import {
    carregarDadosAeronaves,
    carregarDadosFuncionarios,
    inicializarPersistencia,
    salvarDadosAeronaves,
    salvarDadosFuncionarios
} from "../io/persistencia.js"
import Aeronave from "../modelo/classes/Aeronave.js"
import Etapa from "../modelo/classes/Etapa.js"
import Funcionario from "../modelo/classes/Funcionario.js"
import Relatorio from "../modelo/classes/Relatorio.js"
import { StatusPeca } from "../modelo/enums/StatusPeca.js"
import CadastroAeronave from "../negocio/Aeronave/cadastroAeronave.js"
import ListagemAeronave from "../negocio/Aeronave/listagemAeronave.js"
import CadastroEtapa from "../negocio/Etapa/cadastroEtapa.js"
import ListagemEtapa from "../negocio/Etapa/listagemEtapa.js"
import CadastroFuncionario from "../negocio/Funcionario/cadastroFuncionario.js"
import ListagemFuncionario from "../negocio/Funcionario/listagemFuncionario.js"
import CadastroPeca from "../negocio/Peca/cadastroPeca.js"
import ListagemPeca from "../negocio/Peca/listagemPeca.js"
import CadastroTeste from "../negocio/Teste/cadastroTeste.js"
import ListagemTeste from "../negocio/Teste/listagemTeste.js"
import { AcaoSistema, ErroPermissao, validarPermissao } from "../permissoes/permissoes.js"
import { definirUsuarioLogado, limparUsuarioLogado, obterUsuarioLogado } from "../permissoes/sessao.js"

console.log("Bem-vindo ao sistema de gerenciamento da AeroCode")

const entrada = new Entrada()
const DIVISORIA = "-------------------"

inicializarPersistencia()

const funcionarios: Array<Funcionario> = carregarDadosFuncionarios().map(dado => Funcionario.deJson(dado))
const aeronaves: Array<Aeronave> = carregarDadosAeronaves().map(dado => Aeronave.deJson(dado, funcionarios))

function sincronizarAeronavesComArquivo(): void {
    const aeronavesDoArquivo = carregarDadosAeronaves().map(dado => Aeronave.deJson(dado, funcionarios))
    const aeronavesPorCodigo = new Map<string, Aeronave>()

    for (const aeronave of aeronavesDoArquivo) {
        aeronavesPorCodigo.set(aeronave.codigo, aeronave)
    }

    for (const aeronave of aeronaves) {
        aeronavesPorCodigo.set(aeronave.codigo, aeronave)
    }

    const aeronavesMescladas = Array.from(aeronavesPorCodigo.values())
    aeronaves.splice(0, aeronaves.length, ...aeronavesMescladas)
}

function exibirSecao(titulo: string): void {
    console.log(`\n${DIVISORIA}`)
    console.log(titulo)
    console.log(DIVISORIA)
}

function autenticarFuncionario(): Funcionario {
    exibirSecao("Login do Sistema")

    while (true) {
        const usuario = entrada.receberTexto("Usuário: ").trim()
        const senha = entrada.receberTexto("Senha: ")

        const funcionarioAutenticado = funcionarios.find(funcionario => funcionario.autenticar(usuario, senha))

        if (funcionarioAutenticado) {
            console.log(`\nAcesso autorizado para ${funcionarioAutenticado.nome}.`)
            console.log(`Nível de permissão: ${funcionarioAutenticado.nivelPermissao}`)
            return funcionarioAutenticado
        }

        console.log("Usuário ou senha inválidos. Tente novamente.")
    }
}

const usuarioLogado = autenticarFuncionario()
definirUsuarioLogado(usuarioLogado)

function possuiPermissao(acao: AcaoSistema): boolean {
    try {
        validarPermissao(acao, obterUsuarioLogado())
        return true
    } catch (erro) {
        if (erro instanceof ErroPermissao) {
            console.log(erro.message)
            return false
        }

        throw erro
    }
}

function salvarFuncionariosEmArquivo(): void {
    salvarDadosFuncionarios(funcionarios.map(funcionario => funcionario.paraJson()))
}

function salvarAeronavesEmArquivo(): void {
    sincronizarAeronavesComArquivo()
    salvarDadosAeronaves(aeronaves.map(aeronave => aeronave.paraJson()))
}

function menuAeronaves(): void {
    while (true) {
        sincronizarAeronavesComArquivo()
        exibirSecao("Aeronaves")
        console.log("1 - Listar Aeronaves")
        console.log("2 - Cadastrar Aeronave")
        console.log("3 - Gerenciar Aeronaves")
        console.log("0 - Voltar\n")

        const opcao = entrada.receberNumero("Por favor, escolha uma opção: ")

        if (opcao === 0) {
            return
        }

        if (opcao === 1) {
            sincronizarAeronavesComArquivo()
            const listagemAeronave = new ListagemAeronave(aeronaves)
            listagemAeronave.listar()
            continue
        }

        if (opcao === 2) {
            if (!possuiPermissao(AcaoSistema.CADASTRAR_AERONAVE)) {
                continue
            }

            const cadastroAeronave = new CadastroAeronave(aeronaves)
            cadastroAeronave.cadastrar()
            salvarAeronavesEmArquivo()
            continue
        }

        if (opcao === 3) {
            gerenciarAeronaves()
            continue
        }

        console.log("Operação não entendida :(")
    }
}

function gerenciarAeronaves(): void {
    sincronizarAeronavesComArquivo()

    if (aeronaves.length === 0) {
        exibirSecao("Gerenciar Aeronaves")
        console.log("Não há aeronaves cadastradas, deseja cadastrar uma?")
        console.log("1 - Cadastrar Aeronave")
        console.log("0 - Voltar\n")

        const opcao = entrada.receberNumero("Por favor, escolha uma opção: ")

        if (opcao === 1) {
            if (!possuiPermissao(AcaoSistema.CADASTRAR_AERONAVE)) {
                return
            }

            const cadastroAeronave = new CadastroAeronave(aeronaves)
            cadastroAeronave.cadastrar()
            salvarAeronavesEmArquivo()
            return
        }

        if (opcao === 0) {
            return
        }

        console.log("Operação não entendida :(")
        return
    }

    const codigo = entrada.receberTexto("Digite o código de uma Aeronave: ")
    const aeronaveEncontrada = aeronaves.find(aeronave => aeronave.codigo === codigo)

    if (!aeronaveEncontrada) {
        console.log("Aeronave não encontrada.")
        return
    }

    while (true) {
        exibirSecao("Gerenciar Aeronave")
        console.log("1 - Listar Detalhes da Aeronave")
        console.log("2 - Gerenciar Peças")
        console.log("3 - Gerenciar Etapas")
        console.log("4 - Gerenciar Testes")
        console.log("5 - Gerar Relatório Final")
        console.log("6 - Ver Relatório")
        console.log("0 - Voltar")

        const opcao = entrada.receberNumero("Por favor, escolha uma opção: ")

        if (opcao === 1) {
            exibirSecao("Dados da Aeronave")
            aeronaveEncontrada.detalhes()
            console.log(DIVISORIA)
            continue
        }

        if (opcao === 2) {
            menuPecasAeronave(aeronaveEncontrada)
            continue
        }

        if (opcao === 3) {
            menuEtapasAeronave(aeronaveEncontrada)
            continue
        }

        if (opcao === 4) {
            menuTestesAeronave(aeronaveEncontrada)
            continue
        }

        if (opcao === 5) {
            gerarRelatorioFinalAeronave(aeronaveEncontrada)
            continue
        }

        if (opcao === 6) {
            verRelatorioAeronave(aeronaveEncontrada)
            continue
        }

        if (opcao === 0) {
            return
        }

        console.log("Operação não entendida :(")
    }
}

function menuPecasAeronave(aeronave: Aeronave): void {
    while (true) {
        exibirSecao("Gerenciar Peças")
        console.log("1 - Listar Peças")
        console.log("2 - Cadastrar Peça")
        console.log("3 - Atualizar Status da Peça")
        console.log("0 - Voltar")

        const opcao = entrada.receberNumero("Por favor, escolha uma opção: ")

        if (opcao === 0) {
            return
        }

        if (opcao === 1) {
            const listagemPeca = new ListagemPeca(aeronave.getPecas())
            listagemPeca.listar()
            continue
        }

        if (opcao === 2) {
            if (!possuiPermissao(AcaoSistema.CADASTRAR_PECA)) {
                continue
            }

            const cadastroPeca = new CadastroPeca(aeronave)
            cadastroPeca.cadastrar()
            salvarAeronavesEmArquivo()
            continue
        }

        if (opcao === 3) {
            if (!possuiPermissao(AcaoSistema.ATUALIZAR_STATUS_PECA)) {
                continue
            }

            atualizarStatusPeca(aeronave)
            continue
        }

        console.log("Operação não entendida :(")
    }
}

function menuEtapasAeronave(aeronave: Aeronave): void {
    while (true) {
        exibirSecao("Gerenciar Etapas")
        console.log("1 - Listar Etapas")
        console.log("2 - Cadastrar Etapa")
        console.log("3 - Iniciar ou Finalizar Etapa")
        console.log("4 - Listar Funcionários Associados")
        console.log("0 - Voltar")

        const opcao = entrada.receberNumero("Por favor, escolha uma opção: ")

        if (opcao === 0) {
            return
        }

        if (opcao === 1) {
            const listagemEtapa = new ListagemEtapa(aeronave.getEtapas())
            listagemEtapa.listar()
            continue
        }

        if (opcao === 2) {
            if (!possuiPermissao(AcaoSistema.CADASTRAR_ETAPA)) {
                continue
            }

            const cadastroEtapa = new CadastroEtapa(aeronave, funcionarios)
            cadastroEtapa.cadastrar()
            salvarAeronavesEmArquivo()
            continue
        }

        if (opcao === 3) {
            if (!possuiPermissao(AcaoSistema.INICIAR_ETAPA)) {
                continue
            }

            atualizarStatusEtapa(aeronave)
            continue
        }

        if (opcao === 4) {
            listarFuncionariosAssociadosDaEtapa(aeronave)
            continue
        }

        console.log("Operação não entendida :(")
    }
}

function menuTestesAeronave(aeronave: Aeronave): void {
    while (true) {
        exibirSecao("Gerenciar Testes")
        console.log("1 - Listar Testes")
        console.log("2 - Registrar Testes")
        console.log("0 - Voltar")

        const opcao = entrada.receberNumero("Por favor, escolha uma opção: ")

        if (opcao === 0) {
            return
        }

        if (opcao === 1) {
            const listagemTeste = new ListagemTeste(aeronave.getTestes())
            listagemTeste.listar()
            continue
        }

        if (opcao === 2) {
            if (!possuiPermissao(AcaoSistema.REGISTRAR_TESTE)) {
                continue
            }

            const cadastroTeste = new CadastroTeste(aeronave)
            cadastroTeste.cadastrar()
            salvarAeronavesEmArquivo()
            continue
        }

        console.log("Operação não entendida :(")
    }
}

function atualizarStatusPeca(aeronave: Aeronave): void {
    if (aeronave.getPecas().length === 0) {
        console.log("\nNão há peças cadastradas para esta aeronave.")
        return
    }

    const nomePeca = entrada.receberTexto("Informe o nome da peça: ")

    let novoStatus = ""
    while (true) {
        novoStatus = entrada
            .receberTexto("Informe o novo status da peça (EM_PRODUCAO, EM_TRANSPORTE ou PRONTA): ")
            .trim()
            .toUpperCase()

        if (Object.values(StatusPeca).includes(novoStatus as StatusPeca)) {
            break
        }

        console.log("Status inválido. Por favor, tente novamente.")
    }

    try {
        const resultado = aeronave.atualizarStatusPeca(nomePeca, novoStatus as StatusPeca)
        console.log(resultado.mensagem)

        if (resultado.sucesso) {
            salvarAeronavesEmArquivo()
        }
    } catch (erro) {
        if (erro instanceof Error) {
            console.log(erro.message)
            return
        }

        console.log("Erro inesperado ao atualizar status da peça.")
    }
}

function atualizarStatusEtapa(aeronave: Aeronave): void {
    if (aeronave.getEtapas().length === 0) {
        console.log("\nNão há etapas cadastradas para esta aeronave.")
        return
    }

    console.log("A atualização das etapas segue a ordem de cadastro: as primeiras registradas devem avançar antes das próximas.")

    const nomeEtapa = entrada.receberTexto("Informe o nome da etapa: ")
    const etapaExiste = aeronave
        .getEtapas()
        .some(etapa => etapa.nome.trim().toLowerCase() === nomeEtapa.trim().toLowerCase())

    if (!etapaExiste) {
        console.log("Etapa não encontrada no momento da busca por nome.")
        console.log("Confira a grafia na listagem e tente novamente.")
        return
    }

    console.log("1 - Iniciar etapa")
    console.log("2 - Finalizar etapa")

    const opcao = entrada.receberNumero("Escolha a operação desejada: ")

    try {
        let resultado
        if (opcao === 1) {
            resultado = aeronave.iniciarEtapa(nomeEtapa)
        } else if (opcao === 2) {
            resultado = aeronave.finalizarEtapa(nomeEtapa)
        } else {
            console.log("Operação não entendida :(")
            return
        }

        console.log(resultado.mensagem)

        if (resultado.sucesso) {
            salvarAeronavesEmArquivo()
        }
    } catch (erro) {
        if (erro instanceof Error) {
            console.log(erro.message)
            return
        }

        console.log("Erro inesperado ao atualizar status da etapa.")
    }
}

function menuFuncionarios(): void {
    while (true) {
        exibirSecao("Funcionários")
        console.log("1 - Listar Funcionários")
        console.log("2 - Cadastrar Funcionário")
        console.log("0 - Voltar\n")

        const opcao = entrada.receberNumero("Por favor, escolha uma opção: ")

        if (opcao === 0) {
            return
        }

        if (opcao === 1) {
            if (!possuiPermissao(AcaoSistema.LISTAR_FUNCIONARIOS)) {
                continue
            }

            const listagemFuncionario = new ListagemFuncionario(funcionarios)
            listagemFuncionario.listar()
            continue
        }

        if (opcao === 2) {
            if (!possuiPermissao(AcaoSistema.CADASTRAR_FUNCIONARIO)) {
                continue
            }

            const cadastroFuncionario = new CadastroFuncionario(funcionarios)
            cadastroFuncionario.cadastrar()
            salvarFuncionariosEmArquivo()
            continue
        }

        console.log("Operação não entendida :(")
    }
}

while (true) {
    exibirSecao("Menu Principal")
    console.log("1 - Aeronaves")
    console.log("2 - Funcionários")
    console.log("0 - Sair\n")

    const opcaoPrincipal = entrada.receberNumero("Por favor, escolha uma opção: ")

    if (opcaoPrincipal === 0) {
        salvarFuncionariosEmArquivo()
        salvarAeronavesEmArquivo()
        limparUsuarioLogado()
        console.log("Até mais")
        break
    }

    if (opcaoPrincipal === 1) {
        menuAeronaves()
        continue
    }

    if (opcaoPrincipal === 2) {
        menuFuncionarios()
        continue
    }

    console.log("Operação não entendida :(")
}

function listarFuncionariosAssociadosDaEtapa(aeronave: Aeronave): void {
    if (aeronave.getEtapas().length === 0) {
        console.log("\nNão há etapas cadastradas para esta aeronave.")
        return
    }

    const nomeEtapa = entrada.receberTexto("Informe o nome da etapa: ")
    const etapa = buscarEtapaPorNome(aeronave, nomeEtapa)

    if (!etapa) {
        console.log("Etapa não encontrada no momento da busca por nome.")
        console.log("Confira a grafia na listagem e tente novamente.")
        return
    }

    exibirSecao(`Funcionários associados à etapa ${etapa.nome}`)

    const funcionariosAssociados = etapa.listarFuncionarios()
    if (funcionariosAssociados.length === 0) {
        console.log("Nenhum funcionário associado a esta etapa.")
        return
    }

    console.log(DIVISORIA)
    funcionariosAssociados.forEach(funcionario => {
        console.log(`ID: ${funcionario.id}`)
        console.log(`Nome: ${funcionario.nome}`)
        console.log(DIVISORIA)
    })
}

function buscarEtapaPorNome(aeronave: Aeronave, nomeEtapa: string): Etapa | undefined {
    const nomeNormalizado = nomeEtapa.trim().toLowerCase()
    return aeronave
        .getEtapas()
        .find(etapa => etapa.nome.trim().toLowerCase() === nomeNormalizado)
}

function gerarRelatorioFinalAeronave(aeronave: Aeronave): void {
    if (!possuiPermissao(AcaoSistema.GERAR_RELATORIO_FINAL)) {
        return
    }

    const verificacao = aeronave.verificarRequisitosRelatorioFinal()

    if (!verificacao.sucesso) {
        console.log("\nNão foi possível gerar o relatório final da aeronave.")
        console.log("Requisitos para geração do relatório:")
        console.log("1 - Todas as etapas de produção devem estar com status CONCLUIDA.")
        console.log("2 - O avanço das etapas deve respeitar a ordem lógica do cadastro.")
        console.log("3 - A aeronave precisa ter peças associadas.")
        console.log("4 - A aeronave precisa ter os 3 tipos de teste registrados (ELETRICO, HIDRAULICO e AERODINAMICO), com apenas 1 por tipo.")

        if (verificacao.pendencias.length > 0) {
            console.log("\nPendências encontradas:")
            verificacao.pendencias.forEach((pendencia, indice) => {
                console.log(`${indice + 1} - ${pendencia}`)
            })
        }

        return
    }

    let nomeCliente = ""
    while (nomeCliente.length === 0) {
        nomeCliente = entrada.receberTexto("Informe o nome do cliente: ").trim()

        if (nomeCliente.length === 0) {
            console.log("Nome do cliente não pode ficar vazio.")
        }
    }

    let dataEntrega = ""
    while (dataEntrega.length === 0) {
        dataEntrega = entrada.receberTexto("Informe a data de entrega: ").trim()

        if (dataEntrega.length === 0) {
            console.log("Data de entrega não pode ficar vazia.")
        }
    }

    const relatorio = new Relatorio()
    relatorio.gerarRelatorio(aeronave, nomeCliente, dataEntrega)
    relatorio.salvarEmArquivo()

    aeronave.adicionarRelatorio(relatorio)
    salvarAeronavesEmArquivo()

    console.log("\nRelatório gerado com sucesso.")
}

function verRelatorioAeronave(aeronave: Aeronave): void {
    const relatorio = aeronave.getRelatorio()

    if (!relatorio) {
        console.log("\nAinda não há relatório para esta aeronave.")
        return
    }

    console.log("\nRelatório da aeronave:")
    relatorio.exibir()
}