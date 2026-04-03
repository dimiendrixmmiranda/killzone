export type TipoTransferencia =
  | 'rumor'
  | 'fechado'
  | 'falta-assinar'
  | 'saida'
  | 'banco'
  | 'free_agent'

export interface Transferencia {
  id: string

  jogadorId: string

  timeOrigemId: string | null
  timeDestinoId: string | null

  data: string

  tipo: TipoTransferencia

  observacao?: string

  valor?: number
  moeda?: string
}