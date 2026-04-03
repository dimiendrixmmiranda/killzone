export interface EstatisticasJogadorNoCampeonato {
    jogadorId: string
    nome: string
    timeId: string

    mapasJogadas: number
    rounds: number

    kills: number
    deaths: number
    assists: number
    adrTotal: number

    firstKills: number
    firstDeaths: number
    clutchVitorias: number
}