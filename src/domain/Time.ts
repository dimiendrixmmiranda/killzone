import { Regiao } from "./Tipos";

export interface Time {
  id: string
  nome: string
  regiao: Regiao
  jogoId: string
  imagem: string
  cor: string[]
  historicoDeLineups?: [
    {
      jogadores: string[]
      dataDeFormacao: Date
      dataDeTermino: Date
    }
  ]
  forma?: {
    resultado: 'V' | 'D' | 'E'
    data: string
    adversarioId: string
    placar: string
    campeonatoId: string
  }[]
  jogadorEstrela?: {
    idJogador: string
  }
  historia?: string[]
  fundadoEm?: string
  modalidades?: string[]
}

export const TIME_DESCONHECIDO: Time = {
  id: "desconhecido",
  nome: "Time desconhecido",
  regiao: "SA",
  jogoId: "cs2",
  imagem: "/default/escudo/escudo.png",
  cor: ["#555555"],
}