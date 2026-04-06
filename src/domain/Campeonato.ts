import { Premiacao } from "./Premiacao"

export interface Campeonato {
    id: string
    slugId?: string
    nome: string
    jogoId: string
    tipo: 'online' | 'lan'
    tier: "S" | "A" | "B" | "C"
    organizador: string

    timesIds: string[]
    inicio: Date
    fim: Date
    local: string
    imagem: string
    trofeu: string
    premiacoes: Premiacao[]
    terceiroLugar: boolean
    pickem?: boolean
    // formato
    campeonatosRelacionados?: string[]
    formato: 'suico' | 'playoff' | 'gsl-format' | 'gsl-format-playoff'
    mvp?: string | null
    createdAt?: Date
}