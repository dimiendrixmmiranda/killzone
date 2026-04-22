import { partidas } from "../data/partida/partida.data"
import { Jogador } from "../domain/Jogador"


type PontuacaoDetalhada = {
    total: number
    kills: number
    assists: number
    deaths: number
    headshots: number
    clutch: number
    firstKills: number
    firstDeaths: number
    assistFlash: number
    traded: number
    adr: number
    rating: number
}

export function getEstatisticasJogadorNoCampeonato(
    campeonatoId: string,
    jogadorId: string,
) {
    if (!campeonatoId || !jogadorId) return []

    const resultado: {
        partidaId: string
        mapa: string
        stats: any
    }[] = []

    partidas.forEach((partida) => {
        if (partida.campeonatoId !== campeonatoId) return
        if (!partida.mapas) return

        partida.mapas.forEach((mapa) => {
            if (!mapa.estatisticasJogadores) return

            mapa.estatisticasJogadores.forEach((estatistica) => {
                if (estatistica.jogadorId === jogadorId) {
                    resultado.push({
                        partidaId: partida.id,
                        mapa: mapa.nome,
                        stats: estatistica
                    })
                }
            })
        })
    })

    return resultado
}


// export function getPontuacaoDetalhadaJogadorNoCampeonato(
//     campeonatoId: string,
//     jogadorId: string,
//     jogadores: Jogador[]
// ): PontuacaoDetalhada {
//     const jogos = getEstatisticasJogadorNoCampeonato(campeonatoId, jogadorId)

//     console.log(jogadores)

//     const jogador = jogadores.find(j => j.apelido === jogadorId)

//     if(jogador?.papel === 'coach'){

//     }else {

//     }

//     const pontos: PontuacaoDetalhada = {
//         total: 0,
//         kills: 0,
//         assists: 0,
//         deaths: 0,
//         headshots: 0,
//         clutch: 0,
//         firstKills: 0,
//         firstDeaths: 0,
//         assistFlash: 0,
//         traded: 0,
//         adr: 0,
//         rating: 0
//     }

//     jogos.forEach(({ stats }) => {
//         pontos.kills += stats.kills * 1
//         pontos.assists += stats.assists * 0.7
//         pontos.headshots += stats.headshots * 0.3
//         pontos.clutch += stats.clutchVitorias * 1.5

//         pontos.firstKills += (stats.firstKills || 0) * 0.5
//         pontos.assistFlash += (stats.assistFlash || 0) * 0.5
//         pontos.traded += (stats.traded || 0) * 0.3

//         pontos.deaths -= stats.deaths * 0.7
//         pontos.firstDeaths -= (stats.firtsDeaths || 0) * 0.5

//         pontos.adr += stats.adr / 100

//         if (stats.rating) {
//             pontos.rating += (stats.rating - 1) * 5
//         }
//     })

//     // soma total
//     pontos.total =
//         pontos.kills +
//         pontos.assists +
//         pontos.deaths +
//         pontos.headshots +
//         pontos.clutch +
//         pontos.firstKills +
//         pontos.firstDeaths +
//         pontos.assistFlash +
//         pontos.traded +
//         pontos.adr +
//         pontos.rating

//     // arredondar tudo
//     Object.keys(pontos).forEach((key) => {
//         pontos[key as keyof PontuacaoDetalhada] = Number(
//             pontos[key as keyof PontuacaoDetalhada].toFixed(2)
//         )
//     })

//     return pontos
// }

function calcularPontuacaoJogadorNormal(jogos: any[]): PontuacaoDetalhada {
    const pontos: PontuacaoDetalhada = {
        total: 0,
        kills: 0,
        assists: 0,
        deaths: 0,
        headshots: 0,
        clutch: 0,
        firstKills: 0,
        firstDeaths: 0,
        assistFlash: 0,
        traded: 0,
        adr: 0,
        rating: 0
    }

    jogos.forEach(({ stats }) => {
        pontos.kills += stats.kills * 1
        pontos.assists += stats.assists * 0.7
        pontos.headshots += stats.headshots * 0.3
        pontos.clutch += stats.clutchVitorias * 1.5

        pontos.firstKills += (stats.firstKills || 0) * 0.5
        pontos.assistFlash += (stats.assistFlash || 0) * 0.5
        pontos.traded += (stats.traded || 0) * 0.3

        pontos.deaths -= stats.deaths * 0.7
        pontos.firstDeaths -= (stats.firtsDeaths || 0) * 0.5

        pontos.adr += stats.adr / 100

        if (stats.rating) {
            pontos.rating += (stats.rating - 1) * 5
        }
    })

    return finalizarPontuacao(pontos)
}


function criarPontuacaoZerada(): PontuacaoDetalhada {
    return {
        total: 0,
        kills: 0,
        assists: 0,
        deaths: 0,
        headshots: 0,
        clutch: 0,
        firstKills: 0,
        firstDeaths: 0,
        assistFlash: 0,
        traded: 0,
        adr: 0,
        rating: 0
    }
}

function finalizarPontuacao(pontos: PontuacaoDetalhada): PontuacaoDetalhada {
    pontos.total =
        pontos.kills +
        pontos.assists +
        pontos.deaths +
        pontos.headshots +
        pontos.clutch +
        pontos.firstKills +
        pontos.firstDeaths +
        pontos.assistFlash +
        pontos.traded +
        pontos.adr +
        pontos.rating

    Object.keys(pontos).forEach((key) => {
        pontos[key as keyof PontuacaoDetalhada] = Number(
            pontos[key as keyof PontuacaoDetalhada].toFixed(2)
        )
    })

    return pontos
}

function calcularPontuacaoCoach(
    campeonatoId: string,
    coach: Jogador,
    jogadores: Jogador[]
): PontuacaoDetalhada {

    const jogadoresDoTime = jogadores.filter(j => j.timeAtual === coach.timeAtual && j.papel !== 'coach')

    if (jogadoresDoTime.length === 0) {
        return criarPontuacaoZerada()
    }

    const soma: PontuacaoDetalhada = criarPontuacaoZerada()

    jogadoresDoTime.forEach(jogador => {
        const jogos = getEstatisticasJogadorNoCampeonato(campeonatoId, jogador.apelido)
        const pontuacao = calcularPontuacaoJogadorNormal(jogos)

        Object.keys(soma).forEach((key) => {
            soma[key as keyof PontuacaoDetalhada] += pontuacao[key as keyof PontuacaoDetalhada]
        })
    })

    // 👉 média
    Object.keys(soma).forEach((key) => {
        soma[key as keyof PontuacaoDetalhada] =
            soma[key as keyof PontuacaoDetalhada] / jogadoresDoTime.length
    })

    return finalizarPontuacao(soma)
}

export function getPontuacaoDetalhadaJogadorNoCampeonato(
    campeonatoId: string,
    jogadorId: string,
    jogadores: Jogador[]
): PontuacaoDetalhada {

    const jogador = jogadores.find(j => j.apelido === jogadorId)
    if (!jogador) return criarPontuacaoZerada()

    if (jogador.papel === 'coach') {
        return calcularPontuacaoCoach(campeonatoId, jogador, jogadores)
    }

    const jogos = getEstatisticasJogadorNoCampeonato(campeonatoId, jogadorId)
    return calcularPontuacaoJogadorNormal(jogos)
}


export function calcularPontuacaoTotalTime(
    timeFantasy: any[] = [],
    idCampeonato: string,
    jogadores: Jogador[]
) {
    return timeFantasy.reduce((total, slot) => {
        if (!slot?.jogador) return total

        const pontuacao = getPontuacaoDetalhadaJogadorNoCampeonato(
            idCampeonato,
            slot.jogador.apelido,
            jogadores
        )

        let pontos = pontuacao?.total ?? 0

        if (slot.capitao) {
            pontos *= 2
        }

        return total + pontos
    }, 0)
}

export function encerramentoDaEscalacaoDoFantasy(dataInicio: string | Date) {
    const agora = new Date()
    const inicio = new Date(dataInicio)

    return agora < inicio
}