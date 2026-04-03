export interface Partida {
    id: string
    jogoId: string
    data: Date

    campeonatoId?: string

    timeAId: string
    timeBId: string

    tipo: 'md1' | 'md3' | 'md5'
    fase: "round-1" | "round-2" | "round-3" | "round-4" | "round-5" | "grupos" | "quartas" | "semifinal" | 'final' | 'terceiro-lugar' | 'lower-1' | 'lower-2' | 'lower-final'
    grupo?: 'a' | 'b' | 'c' | 'd'
    situacao: 'agendado' | 'em-andamento' | 'finalizado'

    pickBan?: {
        mapa: string
        timeId: string
        situacao: "pick" | 'removed' | "decider"
    }[] | null

    placar: {
        timeA: number
        timeB: number
    }
    mapas?: Mapa[] | null


    mvpId?: string

}

export interface Mapa {
    nome: string
    pick: string
    resultado: {
        timeA: {
            total: number
            ct: number
            tr: number
            ot?: number
        }
        timeB: {
            total: number
            ct: number
            tr: number
            ot?: number
        }
    } | null

    estatisticasJogadores?: EstatisticasJogadores[]
}

export interface EstatisticasJogadores {
    jogadorId: string
    timeId: string
    kills: number
    deaths: number
    assists: number
    adr: number
    headshots: number
    clutchVitorias: number
    firstKills?: number
    firtsDeaths?: number
    assistFlash?: number
    traded?: number
    rating?: number
}