const PREFIXO = 'aerocode:'

export function lerLista(chave) {
  try {
    const dados = localStorage.getItem(PREFIXO + chave)
    if (!dados) return []
    const parsed = JSON.parse(dados)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function salvarLista(chave, lista) {
  localStorage.setItem(PREFIXO + chave, JSON.stringify(lista))
}
