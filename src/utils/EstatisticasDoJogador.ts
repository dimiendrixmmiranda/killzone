import { partidas } from "../data/partida/partida.data"

type EstatisticaJogador = {
    jogadorId: string
    kills: number
    deaths: number
    assists: number
    adr: number
    headshots: number
    clutchVitorias: number
    firstKills: number
    firtsDeaths: number
    assistFlash: number
    traded: number
    rating: number
}

type Partida = {
    data: Date
    mapas: {
        estatisticasJogadores: EstatisticaJogador[]
    }[]
}


export function getMediaUltimasPartidas(jogadorId: string, limite = 5) {
    // 1. ordenar por data
    const partidasOrdenadas = [...partidas].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    )

    const statsPorPartida = []

    for (const partida of partidasOrdenadas) {
        if (!partida.mapas) continue

        let somaPartida = null

        for (const mapa of partida.mapas) {
            if (!mapa?.estatisticasJogadores) continue

            const stat = mapa.estatisticasJogadores.find(
                (j) => j.jogadorId.toLowerCase() === jogadorId.toLowerCase()
            )

            if (!stat) continue

            if (!somaPartida) {
                somaPartida = { ...stat }
            } else {
                somaPartida.kills += stat.kills
                somaPartida.deaths += stat.deaths
                somaPartida.assists += stat.assists
                somaPartida.adr += stat.adr
                somaPartida.headshots += stat.headshots
                somaPartida.clutchVitorias += stat.clutchVitorias
                somaPartida.firstKills! += stat.firstKills!
                somaPartida.firtsDeaths! += stat.firtsDeaths!
                somaPartida.assistFlash! += stat.assistFlash!
                somaPartida.traded! += stat.traded!
                somaPartida.rating! += stat.rating!
            }
        }

        if (somaPartida) {
            statsPorPartida.push(somaPartida)
        }

        if (statsPorPartida.length === limite) break
    }

    if (statsPorPartida.length === 0) return null

    const total = statsPorPartida.length

    const soma = statsPorPartida.reduce(
        (acc, stat) => {
            acc.kills += stat.kills
            acc.deaths += stat.deaths
            acc.assists += stat.assists
            acc.adr += stat.adr
            acc.headshots += stat.headshots
            acc.clutchVitorias += stat.clutchVitorias
            acc.firstKills += stat.firstKills!
            acc.firtsDeaths += stat.firtsDeaths!
            acc.assistFlash += stat.assistFlash!
            acc.traded += stat.traded!
            acc.rating += stat.rating!
            return acc
        },
        {
            kills: 0,
            deaths: 0,
            assists: 0,
            adr: 0,
            headshots: 0,
            clutchVitorias: 0,
            firstKills: 0,
            firtsDeaths: 0,
            assistFlash: 0,
            traded: 0,
            rating: 0
        }
    )

    return {
        kills: soma.kills / total,
        deaths: soma.deaths / total,
        assists: soma.assists / total,
        adr: soma.adr / total,
        headshots: soma.headshots / total,
        clutchVitorias: soma.clutchVitorias / total,
        firstKills: soma.firstKills / total,
        firtsDeaths: soma.firtsDeaths / total,
        assistFlash: soma.assistFlash / total,
        traded: soma.traded / total,
        rating: soma.rating / total
    }
}