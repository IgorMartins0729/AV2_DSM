import type Funcionario from "../modelo/classes/Funcionario.js"

let usuarioLogado: Funcionario | null = null

export function definirUsuarioLogado(usuario: Funcionario): void {
    usuarioLogado = usuario
}

export function obterUsuarioLogado(): Funcionario | null {
    return usuarioLogado
}

export function limparUsuarioLogado(): void {
    usuarioLogado = null
}
