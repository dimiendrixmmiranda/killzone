export interface Transferencia {
  id: string

  jogador: {
    id: string
    nome: string
    apelido: string
    pais: string
    imagem: string
    jogoId: string
    timeAtual: string
    status: "ativo" | "banco" | "inativo" | "stand-in"
    sinergia: number
    highlights: string
    papel: string
    estilo: string
  }

  timeOrigemId: string | null
  timeDestinoId: string | null

  data: string
  status?: 'RUMOR'|'FECHADO'|'FALTA_ASSINAR'
  tipo?:'TRANSFERENCIA' | 'FREE_AGENT' | 'BANCO' | 'SAIDA'

  observacao?: string

  valor?: number
  moeda?: string
}