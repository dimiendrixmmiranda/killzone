import { useEffect, useState } from "react";
import { campeonatos } from "../data/campeonato/campeonato.data"
import { players } from "../data/players/players.data";
import { teams } from "../data/teams/teams.data";
import { Campeonato } from "../domain/Campeonato";
import { EstatisticaJogadorAcumulado } from "../domain/EstatisticasDoJogadorAcumulado";
import { EstatisticasJogadorNoCampeonato } from "../domain/EstatisticasJogadorCampeonato";
import { Noticia } from "../domain/Noticia";
import { Partida } from "../domain/Partida";
import { getPartidasByCampeonato } from "./partidas.service";

const TODOS_MAPAS = [
    "nuke",
    "inferno",
    "dust2",
    "mirage",
    "overpass",
    "ancient",
    "anubis"
]

export interface LinhaTabela {
    timeId: string
    pontos: number

    jogos: number
    vitorias: number
    derrotas: number

    mapasGanhos: number
    mapasPerdidos: number

    roundsGanhos: number
    roundsPerdidos: number

    saldoMapas: number
    saldoRounds: number
}

export function getTabelaByCampeonatoId(campeonato: Campeonato): LinhaTabela[] {

    if (!campeonato.slugId) return []

    const partidas = getPartidasByCampeonato(campeonato?.slugId)

    const timesIds = campeonato.timesIds

    const tabela: Record<string, LinhaTabela> = {}

    // inicializa tabela
    timesIds?.forEach(timeId => {
        tabela[timeId] = {
            timeId,
            pontos: 0,
            jogos: 0,
            vitorias: 0,
            derrotas: 0,

            mapasGanhos: 0,
            mapasPerdidos: 0,

            roundsGanhos: 0,
            roundsPerdidos: 0,

            saldoMapas: 0,
            saldoRounds: 0
        }
    })

    partidas.forEach(partida => {

        if (partida.situacao !== "finalizado") return

        const timeA = tabela[partida.timeAId]
        const timeB = tabela[partida.timeBId]

        if (!timeA || !timeB) return

        // jogos
        timeA.jogos++
        timeB.jogos++

        // mapas
        timeA.mapasGanhos += partida.placar.timeA
        timeA.mapasPerdidos += partida.placar.timeB

        timeB.mapasGanhos += partida.placar.timeB
        timeB.mapasPerdidos += partida.placar.timeA

        // saldo mapas
        timeA.saldoMapas += partida.placar.timeA - partida.placar.timeB
        timeB.saldoMapas += partida.placar.timeB - partida.placar.timeA

        // rounds
        partida.mapas && partida.mapas.forEach(mapa => {
            if (!mapa.resultado) return

            timeA.roundsGanhos += mapa.resultado.timeA.total
            timeA.roundsPerdidos += mapa.resultado.timeB.total

            timeB.roundsGanhos += mapa.resultado.timeB.total
            timeB.roundsPerdidos += mapa.resultado.timeA.total

            timeA.saldoRounds += mapa.resultado.timeA.total - mapa.resultado.timeB.total
            timeB.saldoRounds += mapa.resultado.timeB.total - mapa.resultado.timeA.total
        })

        // vitória / derrota
        if (partida.placar.timeA > partida.placar.timeB) {
            timeA.vitorias++
            timeA.pontos += 1

            timeB.derrotas++
        }
        else {
            timeB.vitorias++
            timeB.pontos += 1

            timeA.derrotas++
        }

    })

    return Object.values(tabela).sort((a, b) => {

        // critério 1: pontos
        if (b.pontos !== a.pontos)
            return b.pontos - a.pontos

        // critério 2: saldo mapas
        if (b.saldoMapas !== a.saldoMapas)
            return b.saldoMapas - a.saldoMapas

        // critério 3: saldo rounds
        return b.saldoRounds - a.saldoRounds

    })

}

export function getMapasMaisJogadas(partidas: Partida[]) {
    const contador: Record<string, number> = {}

    TODOS_MAPAS.forEach(mapa => {
        contador[mapa] = 0
    })

    partidas.forEach(partida => {
        partida.mapas?.forEach(mapa => {
            if (!mapa.resultado) return

            const nome = mapa.nome.toLowerCase()

            // garante que só conta mapas válidos
            if (!(nome in contador)) return

            contador[nome]++
        })
    })

    return Object.entries(contador)
        .map(([mapa, quantidade]) => ({
            mapa,
            quantidade
        }))
        .sort((a, b) => b.quantidade - a.quantidade)
}




export function getAllCampeonatos() {
    return campeonatos
}

export function getCampeonatoById(id: string) {
    return campeonatos.find(c => c.id === id)
}

export function getTimesByCampeonatoId(campeonatoId: string) {
    return campeonatos.find(c => c.id === campeonatoId)?.timesIds
}

export function getCampeaoEVice(partidas: Partida[]) {
    const final = partidas.find(p => p.fase === "final");

    if (!final) {
        return null;
    }

    const campeaoId =
        final.placar.timeA > final.placar.timeB
            ? final.timeAId
            : final.timeBId;

    const viceId =
        final.placar.timeA > final.placar.timeB
            ? final.timeBId
            : final.timeAId;

    return {
        campeaoId,
        viceId
    };
}


// export function getJogadoresDoCampeonato(
//     campeonatoId: string,
//     partidas: Partida[]
// ): string[] {

//     const jogadores = new Set<string>()

//     partidas
//         .filter(p => p.campeonatoId === campeonatoId)
//         .forEach(partida => {
//             partida.mapas.forEach(mapa => {
//                 mapa.estatisticasJogadores.forEach(est => {
//                     jogadores.add(est.jogadorId)
//                 })
//             })
//         })

//     return Array.from(jogadores)
// }

// export function getEstatisticasJogadoresCampeonato(
//     campeonatoId: string,
//     partidas: Partida[]
// ) {

//     const acumulador: Record<string, any> = {}

//     partidas
//         .filter(p => p.campeonatoId === campeonatoId)
//         .forEach(partida => {
//             partida.mapas.forEach(mapa => {

//                 mapa.estatisticasJogadores.forEach(est => {

//                     if (!acumulador[est.jogadorId]) {
//                         acumulador[est.jogadorId] = {
//                             jogadorId: est.jogadorId,
//                             timeId: est.timeId,
//                             mapasJogadas: 0,
//                             rounds: 0,
//                             kills: 0,
//                             deaths: 0,
//                             assists: 0,
//                             adrTotal: 0,
//                             firstKills: 0,
//                             firstDeaths: 0,
//                             clutchVitorias: 0
//                         }
//                     }

//                     const jogador = acumulador[est.jogadorId]

//                     jogador.mapasJogadas += 1
//                     jogador.rounds += mapa.rounds

//                     jogador.kills += est.kills
//                     jogador.deaths += est.deaths
//                     jogador.assists += est.assists
//                     jogador.adrTotal += est.adr * mapa.rounds

//                     jogador.firstKills += est.firstKills
//                     jogador.firstDeaths += est.firstDeaths
//                     jogador.clutchVitorias += est.clutchVitorias
//                 })
//             })
//         })

//     return Object.values(acumulador)
// }


export function calcularRating(j: EstatisticasJogadorNoCampeonato) {
    const kd = j.deaths === 0 ? j.kills : j.kills / j.deaths
    const impactoInicial = j.firstKills - j.firstDeaths

    const rating =
        (kd * 0.4) +
        (j.adrTotal / 100 * 0.3) +
        (impactoInicial * 0.1) +
        (j.clutchVitorias * 0.2)

    return Number(rating.toFixed(2))
}



export function getEstatisticasJogadoresCampeonato(partidas: Partida[]) {
    const acumulador: Record<string, EstatisticaJogadorAcumulado> = {}

    partidas.forEach(partida => {
        // 👇 garante que a partida conte só uma vez por jogador
        const jogadoresContadosNaPartida = new Set<string>()

        if (partida.mapas) {
            partida.mapas.forEach(mapa => {
                // ignorar mapas não jogados
                if (!mapa.resultado) return

                mapa.estatisticasJogadores?.forEach(stats => {
                    if (!acumulador[stats.jogadorId]) {
                        acumulador[stats.jogadorId] = {
                            jogadorId: stats.jogadorId,
                            timeId: stats.timeId,

                            kills: 0,
                            deaths: 0,
                            assists: 0,
                            headshots: 0,
                            clutchVitorias: 0,

                            adrTotal: 0,
                            ratingTotal: 0,

                            mapasJogados: 0,
                            partidasJogadas: 0, // ⭐ NOVO

                            adr: 0,
                            rating: 0
                        }
                    }

                    const jogador = acumulador[stats.jogadorId]

                    // 🔢 soma stats por mapa
                    jogador.kills += stats.kills
                    jogador.deaths += stats.deaths
                    jogador.assists += stats.assists
                    jogador.headshots += stats.headshots
                    jogador.clutchVitorias += stats.clutchVitorias

                    jogador.adrTotal += stats.adr
                    jogador.ratingTotal += stats.rating ?? 0

                    jogador.mapasJogados++

                    // 🧠 conta partida só uma vez por jogador
                    if (!jogadoresContadosNaPartida.has(stats.jogadorId)) {
                        jogador.partidasJogadas++
                        jogadoresContadosNaPartida.add(stats.jogadorId)
                    }
                })
            })
        }
    })

    // calcular médias finais
    const resultado = Object.values(acumulador).map(jogador => ({
        ...jogador,
        adr: Number((jogador.adrTotal / jogador.mapasJogados).toFixed(1)),
        rating: Number((jogador.ratingTotal / jogador.mapasJogados).toFixed(2))
    }))

    // 🏆 NOVA ORDENAÇÃO MULTICRITÉRIO
    resultado.sort((a, b) => {
        if (b.partidasJogadas !== a.partidasJogadas) {
            return b.partidasJogadas - a.partidasJogadas
        }

        if (b.mapasJogados !== a.mapasJogados) {
            return b.mapasJogados - a.mapasJogados
        }

        return b.rating - a.rating
    })

    return resultado
}

const ROUND_FASES = [
    "round-1",
    "round-2",
    "round-3",
    "round-4",
    "round-5",
] as const

const FASE_PESO: Record<string, number> = {
    final: 9,
    semifinal: 8,
    quartas: 7,
    grupos: 6,

    "round-5": 5,
    "round-4": 4,
    "round-3": 3,
    "round-2": 2,
    "round-1": 1,
}

enum RankingGrupo {
    ATIVO = 1,
    NAO_JOGOU = 2,
    ELIMINADO = 3
}

export function getClassificacaoFinalSuica(campeonato: Campeonato) {
    const partidas =
        getPartidasByCampeonato(campeonato.slugId!)
            ?.filter(p => p.situacao === "finalizado") ?? []

    const tabela = getTabelaByCampeonatoId(campeonato) ?? []
    const timesIds = campeonato.timesIds ?? []

    if (!timesIds.length) return []

    const resultado = timesIds.map(timeId => {

        let maiorFase = 0
        let venceuFinal = false

        let vitoriasSuica = 0
        let derrotasSuica = 0

        let resultadoSuicaPeso = 0
        let terminouSuica = false

        let jogos = 0

        partidas.forEach(p => {

            if (p.timeAId !== timeId && p.timeBId !== timeId) return

            jogos++

            const venceu =
                (p.timeAId === timeId && p.placar.timeA > p.placar.timeB) ||
                (p.timeBId === timeId && p.placar.timeB > p.placar.timeA)

            // =========================
            // FASE SUÍÇA
            // =========================
            if (ROUND_FASES.includes(p.fase as any)) {

                if (venceu) vitoriasSuica++
                else derrotasSuica++

                // eliminado (0-3, 1-3, 2-3)
                if (!terminouSuica && derrotasSuica === 3) {
                    resultadoSuicaPeso = vitoriasSuica
                    terminouSuica = true
                }

                // classificado (3-0, 3-1, 3-2)
                if (!terminouSuica && vitoriasSuica === 3) {
                    resultadoSuicaPeso = 100 + (3 - derrotasSuica)
                    terminouSuica = true
                }

            } else {

                const peso = FASE_PESO?.[p.fase] ?? 0

                if (peso > maiorFase)
                    maiorFase = peso

                if (p.fase === "final" && venceu)
                    venceuFinal = true
            }
        })

        const eliminadoNaSuica = derrotasSuica >= 3
        const classificouNaSuica = vitoriasSuica >= 3

        const perdeuNosPlayoffs =
            maiorFase > 0 && !venceuFinal

        const encerrouParticipacao =
            eliminadoNaSuica ||
            classificouNaSuica ||
            perdeuNosPlayoffs

        let grupoRanking = RankingGrupo.ATIVO

        if (jogos === 0) {
            grupoRanking = RankingGrupo.NAO_JOGOU
        }
        else if (eliminadoNaSuica) {
            grupoRanking = RankingGrupo.ELIMINADO
        }

        const linha = tabela.find(t => t.timeId === timeId)

        return {
            timeId,
            grupoRanking,
            jogos,
            venceuFinal,
            maiorFase,
            vitoriasSuica,
            derrotasSuica,
            resultadoSuicaPeso,
            encerrouParticipacao,
            pontos: linha?.pontos ?? 0,
            saldoMapas: linha?.saldoMapas ?? 0,
            saldoRounds: linha?.saldoRounds ?? 0,
        }
    })

    // =========================
    // ORDENAÇÃO
    // =========================
    resultado.sort((a, b) => {

        if (a.grupoRanking !== b.grupoRanking)
            return a.grupoRanking - b.grupoRanking

        if (a.venceuFinal) return -1
        if (b.venceuFinal) return 1

        if (b.maiorFase !== a.maiorFase)
            return b.maiorFase - a.maiorFase

        if (b.resultadoSuicaPeso !== a.resultadoSuicaPeso)
            return b.resultadoSuicaPeso - a.resultadoSuicaPeso

        if (b.pontos !== a.pontos)
            return b.pontos - a.pontos

        if (b.saldoMapas !== a.saldoMapas)
            return b.saldoMapas - a.saldoMapas

        return b.saldoRounds - a.saldoRounds
    })

    return resultado.map((time, index) => ({
        partidas: time.jogos,
        encerrouParticipacao: time.encerrouParticipacao,
        resultadoSuica: `${time.vitoriasSuica}-${time.derrotasSuica}`,
        timeId: time.timeId,
        posicao: index + 1
    }))
}


type FasePlayoff = "quartas" | "semifinal" | "terceiro" | "final"

export function getClassificacaoPlayoffs(campeonato: Campeonato) {

    const partidas =
        getPartidasByCampeonato(campeonato.slugId!)
            ?.filter(p => p.situacao === "finalizado") ?? []

    const timesIds = campeonato.timesIds ?? []

    if (!timesIds.length) return []

    const ordemFase: Record<FasePlayoff, number> = {
        quartas: 1,
        semifinal: 2,
        terceiro: 3,
        final: 4
    }

    const resultado = timesIds.map(timeId => {

        let jogos = 0
        let eliminacao: FasePlayoff | null = null

        let campeao = false
        let vice = false
        let terceiro = false
        let quarto = false

        for (const p of partidas) {

            if (p.timeAId !== timeId && p.timeBId !== timeId) continue
            if (!["quartas", "semifinal", "final", "terceiro"].includes(p.fase)) continue

            jogos++

            const venceu =
                (p.timeAId === timeId && p.placar.timeA > p.placar.timeB) ||
                (p.timeBId === timeId && p.placar.timeB > p.placar.timeA)

            const fase = p.fase as FasePlayoff

            // FINAL
            if (fase === "final") {
                if (venceu) {
                    campeao = true
                } else {
                    vice = true
                }
                continue
            }

            // DISPUTA DE TERCEIRO
            if (fase === "terceiro") {
                if (venceu) {
                    terceiro = true
                } else {
                    quarto = true
                }
                continue
            }

            // ELIMINAÇÃO NORMAL
            if (!venceu) {
                eliminacao = fase
                break
            }
        }

        return {
            timeId,
            jogos,
            eliminacao,
            campeao,
            vice,
            terceiro,
            quarto
        }
    })

    resultado.sort((a, b) => {

        if (a.campeao) return -1
        if (b.campeao) return 1

        if (a.vice) return -1
        if (b.vice) return 1

        if (a.terceiro) return -1
        if (b.terceiro) return 1

        if (a.quarto) return -1
        if (b.quarto) return 1

        const pesoA = a.eliminacao ? ordemFase[a.eliminacao] : 0
        const pesoB = b.eliminacao ? ordemFase[b.eliminacao] : 0

        return pesoB - pesoA
    })

    return resultado.map((time, index) => ({
        timeId: time.timeId,
        partidas: time.jogos,
        posicao: index + 1,
        encerrouParticipacao:
            time.campeao ||
            time.vice ||
            time.terceiro ||
            time.quarto ||
            !!time.eliminacao,
        resultadoSuica:
            time.eliminacao === "quartas"
                ? "5º/8º"
                : `${index + 1}º`
    }))
}

const LOWER_FASES_ELIMINATORIAS = [
    "lower-1",
    "lower-2",
    "lower-final",
] as const

export function getClassificacaoDoubleElimination(campeonato: Campeonato) {

    const partidas =
        getPartidasByCampeonato(campeonato.slugId!)
            ?.filter(p => p.situacao === "finalizado") ?? []

    const tabela = getTabelaByCampeonatoId(campeonato) ?? []

    const timesIds = campeonato.timesIds ?? []

    if (!timesIds.length) return []

    // 🔥 PEGAR TODAS AS FINAIS
    const finais = partidas.filter(p => p.fase === "final")

    const campeoes = new Set<string>()
    const vices = new Set<string>()

    finais.forEach(final => {
        const { timeAId, timeBId, placar } = final

        if (placar.timeA > placar.timeB) {
            campeoes.add(timeAId)
            vices.add(timeBId)
        } else {
            campeoes.add(timeBId)
            vices.add(timeAId)
        }
    })

    const resultado = timesIds.map(timeId => {

        let jogos = 0
        let maiorFase = 0
        let faseEliminacao: string | null = null
        let ganhouLowerFinal = false // 🔥 NOVO

        const chegouFinal = finais.some(f =>
            f.timeAId === timeId || f.timeBId === timeId
        )

        const isCampeao = campeoes.has(timeId)
        const isVice = vices.has(timeId)

        partidas.forEach(p => {

            if (p.timeAId !== timeId && p.timeBId !== timeId) return

            jogos++

            const venceu =
                (p.timeAId === timeId && p.placar.timeA > p.placar.timeB) ||
                (p.timeBId === timeId && p.placar.timeB > p.placar.timeA)

            const fase = p.fase

            // 🔥 MARCAR GANHOU LOWER FINAL
            if (fase === "lower-final" && venceu) {
                ganhouLowerFinal = true
            }

            // 🔥 MARCAR ELIMINAÇÃO
            if (!venceu && LOWER_FASES_ELIMINATORIAS.includes(fase as any)) {
                faseEliminacao = fase
            }

            const pesoFase: Record<string, number> = {
                final: 10,
                semifinal: 9,
                quartas: 8,
                "lower-final": 7,
                "lower-2": 6,
                "lower-1": 5,
                grupos: 4,
                "round-5": 3,
                "round-4": 2,
                "round-3": 1,
            }

            const peso = pesoFase[fase] ?? 0

            if (peso > maiorFase)
                maiorFase = peso
        })

        const linha = tabela.find(t => t.timeId === timeId)

        return {
            timeId,
            jogos,
            faseEliminacao,
            chegouFinal,
            isCampeao,
            isVice,
            maiorFase,
            ganhouLowerFinal, // 🔥 NOVO
            pontos: linha?.pontos ?? 0,
            saldoMapas: linha?.saldoMapas ?? 0,
            saldoRounds: linha?.saldoRounds ?? 0,
        }
    })

    // 🔥 PESO DAS ELIMINAÇÕES
    const pesoEliminacao: Record<string, number> = {
        "lower-1": 1,
        "lower-2": 2,
        "lower-final": 3,
    }

    // 🔥 ORDENAÇÃO
    resultado.sort((a, b) => {

        // 🥇 campeões
        if (a.isCampeao !== b.isCampeao)
            return a.isCampeao ? -1 : 1

        // 🥈 vices
        if (a.isVice !== b.isVice)
            return a.isVice ? -1 : 1

        // 🔥 eliminação
        const aElim = a.faseEliminacao
        const bElim = b.faseEliminacao

        if (aElim !== bElim) {
            if (!aElim) return -1
            if (!bElim) return 1

            return pesoEliminacao[bElim] - pesoEliminacao[aElim]
        }

        // 🔥 maior fase
        if (b.maiorFase !== a.maiorFase)
            return b.maiorFase - a.maiorFase

        // 🔥 desempates
        if (b.pontos !== a.pontos)
            return b.pontos - a.pontos

        if (b.saldoMapas !== a.saldoMapas)
            return b.saldoMapas - a.saldoMapas

        return b.saldoRounds - a.saldoRounds
    })

    return resultado.map((time, index) => ({

        partidas: time.jogos,

        encerrouParticipacao:
            !!time.faseEliminacao ||
            time.ganhouLowerFinal ||
            time.isCampeao ||
            time.isVice,

        resultadoSuica:
            time.isCampeao
                ? "1º/2º"
                : time.isVice
                    ? "3º/4º"
                    : time.ganhouLowerFinal
                        ? "5º/6º"
                        : time.faseEliminacao === "lower-final"
                            ? "7º/8º"
                            : time.faseEliminacao === "lower-2"
                                ? "9º/12º"
                                : time.faseEliminacao === "lower-1"
                                    ? "13º/16º"
                                    : "-",

        timeId: time.timeId,
        posicao: index + 1
    }))
}

export function getClassificacaoDobleEliminationPlayoff(campeonatoAtual: Campeonato) {
    const partidas =
        getPartidasByCampeonato(campeonatoAtual.slugId!)
            ?.filter(p => p.situacao === "finalizado") ?? []
    const timesIds = campeonatoAtual.timesIds ?? []

    if (!timesIds.length) return []

    // 🔥 PEGAR FINAL
    const finais = partidas.filter(p => p.fase === "final")

    const campeoes = new Set<string>()
    const vices = new Set<string>()

    finais.forEach(final => {
        const { timeAId, timeBId, placar } = final

        if (placar.timeA > placar.timeB) {
            campeoes.add(timeAId)
            vices.add(timeBId)
        } else {
            campeoes.add(timeBId)
            vices.add(timeAId)
        }
    })

    const resultado = timesIds.map(timeId => {

        let jogos = 0
        let maiorFase = 0
        let faseEliminacao: "quartas" | "semifinal" | "final" | null = null

        const isCampeao = campeoes.has(timeId)
        const isVice = vices.has(timeId)

        partidas.forEach(p => {

            if (p.timeAId !== timeId && p.timeBId !== timeId) return
            if (!["quartas", "semifinal", "final"].includes(p.fase)) return

            jogos++

            const venceu =
                (p.timeAId === timeId && p.placar.timeA > p.placar.timeB) ||
                (p.timeBId === timeId && p.placar.timeB > p.placar.timeA)

            const fase = p.fase as "quartas" | "semifinal" | "final"

            // 🔥 MARCAR ELIMINAÇÃO (perdeu = caiu)
            if (!venceu && !isCampeao) {
                faseEliminacao = fase
            }

            const pesoFase: Record<string, number> = {
                final: 3,
                semifinal: 2,
                quartas: 1,
            }

            const peso = pesoFase[fase] ?? 0

            if (peso > maiorFase)
                maiorFase = peso
        })

        return {
            timeId,
            jogos,
            faseEliminacao,
            isCampeao,
            isVice,
            maiorFase
        }
    })

    const pesoEliminacao: Record<string, number> = {
        quartas: 1,
        semifinal: 2,
        final: 3,
    }

    resultado.sort((a, b) => {

        // campeão
        if (a.isCampeao !== b.isCampeao)
            return a.isCampeao ? -1 : 1

        // vice
        if (a.isVice !== b.isVice)
            return a.isVice ? -1 : 1

        // eliminação (quem caiu mais tarde é melhor)
        if (a.faseEliminacao !== b.faseEliminacao) {

            if (!a.faseEliminacao) return -1
            if (!b.faseEliminacao) return 1

            return pesoEliminacao[b.faseEliminacao] - pesoEliminacao[a.faseEliminacao]
        }

        // maior fase
        return b.maiorFase - a.maiorFase
    })

    return resultado.map((time, index) => ({
        partidas: time.jogos,
        encerrouParticipacao:
            !!time.faseEliminacao ||
            time.isCampeao ||
            time.isVice,
        resultadoSuica:
            time.isCampeao
                ? "1º"
                : time.isVice
                    ? "2º"
                    : time.faseEliminacao === "semifinal"
                        ? "3º/4º"
                        : time.faseEliminacao === "quartas"
                            ? "5º/6º"
                            : "-",
        timeId: time.timeId,
        posicao: index + 1
    }))
}

export function getTeamsRelacionadosANoticia(noticia: Noticia) {
    if (!noticia) return []

    // junta tudo em um texto só
    const textoCompleto = [
        noticia.titulo,
        noticia.resumo,
        ...(noticia.conteudo || [])
    ]
        .join(" ")
        .toLowerCase()

    const timesEncontrados = teams.filter((time) => {
        const nome = time.id.toLowerCase().trim()
        const nomeEscapado = nome.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const regex = new RegExp(`\\b${nomeEscapado}\\b`, "i")

        return regex.test(textoCompleto)
    })

    return timesEncontrados
}

export function getJogadoresRelacionadosANoticia(noticia: Noticia) {
    if (!noticia) return []

    // junta tudo em um texto só
    const textoCompleto = [
        noticia.titulo,
        noticia.resumo,
        ...(noticia.conteudo || [])
    ]
        .join(" ")
        .toLowerCase()

    const jogadoresEncontrados = players.filter((player) => {
        const nome = player.id.toLowerCase().trim()
        const nomeEscapado = nome.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const regex = new RegExp(`\\b${nomeEscapado}\\b`, "i")

        return regex.test(textoCompleto)
    })

    return jogadoresEncontrados
}

export type SituacaoCampeonato =
    | 'encerrado'
    | 'ocorrendo'
    | 'futuro'

export function getSituacaoCampeonato(
    inicio: string | Date,
    fim: string | Date
): SituacaoCampeonato {

    const agora = new Date()
    const dataInicio = new Date(inicio)
    const dataFim = new Date(fim)

    if (agora < dataInicio) {
        return 'futuro'
    }

    if (agora >= dataInicio && agora <= dataFim) {
        return 'ocorrendo'
    }

    return 'encerrado'
}


export function useCampeonatos() {
    const [campeonatos, setCampeonatos] = useState<any[]>([])

    useEffect(() => {
        async function fetchCampeonatos() {
            const res = await fetch("/api/campeonatos")
            const data = await res.json()
            setCampeonatos(data)
        }

        fetchCampeonatos()
    }, [])

    return campeonatos
}

export function getCampeonatosRelacionados(
    campeonatos: any[],
    ids: string[]
) {
    return campeonatos.filter(camp =>
        ids.includes(camp.slugId)
    )
}