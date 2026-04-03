'use client'
import { IMAGEM_JOGADOR_DEFAULT, IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"
import { EstatisticaJogadorAcumulado } from "@/src/domain/EstatisticasDoJogadorAcumulado"
import { Time } from "@/src/domain/Time"
import { getPartidaById } from "@/src/services/partidas.service"
import { getPlayerById } from "@/src/services/player.service"
import { getTeamById } from "@/src/services/team.service"
import Image from "next/image"
import { useMemo, useState } from "react"

interface TabelaJogadoresProps {
    jogadores: EstatisticaJogadorAcumulado[]
    time?: Time
}

interface EstatisticaDaPartidaProps {
    idPartida: string | undefined
}

export default function EstatisticaDaPartida({ idPartida }: EstatisticaDaPartidaProps) {
    if (!idPartida) return null
    
    const partida = getPartidaById(idPartida)

    if (!partida) return null


    const [mapaSelecionado, setMapaSelecionado] = useState<number | "geral">("geral");
    const timeA = getTeamById(partida?.timeAId)
    const timeB = getTeamById(partida?.timeBId)

    const mediaAdrGeral = useMemo((): EstatisticaJogadorAcumulado[] => {
        const mapasJogados =
            partida?.mapas?.filter(m => m.resultado != null) ?? []

        const acumulador: Record<string, EstatisticaJogadorAcumulado> = {}

        mapasJogados.forEach(mapa => {
            const totalRoundsMapa =
                (mapa.resultado?.timeA.total ?? 0) +
                (mapa.resultado?.timeB.total ?? 0)

            mapa.estatisticasJogadores?.forEach(player => {
                // segurança extra (igual você já fazia)
                if (
                    player.timeId !== partida?.timeAId &&
                    player.timeId !== partida?.timeBId
                ) return

                if (!acumulador[player.jogadorId]) {
                    acumulador[player.jogadorId] = {
                        jogadorId: player.jogadorId,
                        timeId: player.timeId,

                        kills: 0,
                        deaths: 0,
                        assists: 0,
                        headshots: 0,
                        clutchVitorias: 0,

                        adrTotal: 0,
                        ratingTotal: 0,

                        mapasJogados: 0,
                        partidasJogadas: 1, // 👈 como é uma única partida

                        adr: 0,
                        rating: 0
                    }
                }

                const jogador = acumulador[player.jogadorId]

                // 🔢 somatórios
                jogador.kills += player.kills ?? 0
                jogador.deaths += player.deaths ?? 0
                jogador.assists += player.assists ?? 0
                jogador.headshots += player.headshots ?? 0
                jogador.clutchVitorias += player.clutchVitorias ?? 0

                jogador.adrTotal += player.adr ?? 0
                jogador.ratingTotal += player.rating ?? 0

                jogador.mapasJogados++
            })
        })

        // ✅ calcular médias finais
        return Object.values(acumulador).map(jogador => ({
            ...jogador,
            adr: jogador.mapasJogados
                ? Number((jogador.adrTotal / jogador.mapasJogados).toFixed(1))
                : 0,
            rating: jogador.mapasJogados
                ? Number((jogador.ratingTotal / jogador.mapasJogados).toFixed(2))
                : 0
        }))
    }, [partida])

    const jogadoresBase: EstatisticaJogadorAcumulado[] =
        mapaSelecionado === "geral"
            ? mediaAdrGeral
            : (() => {
                const mapa = partida.mapas && partida.mapas[mapaSelecionado]
                if (!mapa?.resultado) return []

                return (mapa.estatisticasJogadores ?? []).map(j => ({
                    jogadorId: j.jogadorId,
                    timeId: j.timeId,

                    kills: j.kills ?? 0,
                    deaths: j.deaths ?? 0,
                    assists: j.assists ?? 0,
                    headshots: j.headshots ?? 0,
                    clutchVitorias: j.clutchVitorias ?? 0,

                    adrTotal: j.adr ?? 0,
                    ratingTotal: j.rating ?? 0,

                    mapasJogados: 1,
                    partidasJogadas: 1,

                    adr: j.adr ?? 0,
                    rating: j.rating ?? 0
                }))
            })()

    const jogadoresTimeA = jogadoresBase
        .filter(j => j.timeId === partida.timeAId)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

    const jogadoresTimeB = jogadoresBase
        .filter(j => j.timeId === partida.timeBId)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))



    const mvpPartida =
        mediaAdrGeral.length > 0
            ? mediaAdrGeral.reduce((maior, atual) =>
                atual.rating > maior.rating ? atual : maior
            )
            : null

    function TabelaJogadores({ jogadores, time }: TabelaJogadoresProps) {
        return (
            <div className="flex flex-col gap-2 overflow-x-scroll">
                <div className="flex items-center gap-2">
                    <div className="relative w-5 h-5">
                        <Image alt={`${time?.nome}`} src={time?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                    </div>
                    <h4 className="font-bold text-sm uppercase opacity-80">
                        {time?.nome}
                    </h4>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                        <thead className="bg-azul-escuro text-white">
                            <tr>
                                <th className="text-left p-2">Jogador</th>
                                <th className="text-center p-2">K/D</th>
                                <th className="text-center p-2">ADR</th>
                                <th className="text-center p-2">Assist.</th>
                                <th className="text-center p-2">Clutch Win</th>
                                <th className="text-center p-2">Rounds</th>
                                <th className="text-center p-2">Rating</th>
                            </tr>
                        </thead>

                        <tbody>
                            {jogadores.map((jogador) => {
                                const jog = getPlayerById(jogador.jogadorId)

                                const isMVP = jogador.jogadorId === mvpPartida?.jogadorId

                                return (
                                    <tr
                                        key={jogador.jogadorId}
                                        className={`border-b border-zinc-700 hover:bg-zinc-800/40 ${isMVP ? "bg-yellow-500/10" : ""
                                            }`}
                                    >
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                <div className="relative w-6 h-6 rounded-full bg-zinc-400">
                                                    <Image
                                                        alt={jogador.jogadorId}
                                                        src={jog?.imagem || IMAGEM_JOGADOR_DEFAULT}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <span className="truncate">
                                                    {jogador.jogadorId}
                                                </span>

                                                {isMVP && (
                                                    <span className="text-[10px] bg-yellow-500 text-black px-1 rounded ml-1">
                                                        MVP
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="text-center p-2">
                                            {jogador.kills ?? "-"}
                                            {jogador.deaths != null && (
                                                <>/{jogador.deaths}</>
                                            )}
                                        </td>

                                        <td className="text-center p-2 font-bold">
                                            {jogador.adr}
                                        </td>
                                        <td className="text-center p-2 font-bold">
                                            {jogador.assists}
                                        </td>
                                        <td className="text-center p-2 font-bold">
                                            {jogador.clutchVitorias}
                                        </td>

                                        <td className="text-center p-2">
                                            {0}
                                        </td>

                                        <td
                                            className={`text-center p-2 font-bold ${jogador.rating && jogador.rating >= 1
                                                ? "text-green-400"
                                                : jogador.rating && jogador.rating < 1
                                                    ? "text-red-400"
                                                    : ""
                                                }`}
                                        >
                                            {jogador.rating?.toFixed(2)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-4">
            <h3 className="font-heading text-3xl">
                Estatisticas da Partida
            </h3>

            {/* seletor */}
            <ul
                className={`grid gap-1 text-white ${partida.mapas && partida.mapas.filter((m) => m.estatisticasJogadores != null).length + 1 > 3
                    ? "grid-cols-4"
                    : "grid-cols-3"
                    }`}
            >
                {/* GERAL */}
                <li
                    className={`flex justify-center items-center py-1 ${mapaSelecionado === "geral" ? "bg-orange-600" : "bg-azul-escuro"
                        }`}
                    style={{ textShadow: "1px 1px 2px black" }}
                >
                    <button
                        onClick={() => setMapaSelecionado("geral")}
                        className="text-[.6em] font-bold cursor-pointer w-full sm:text-sm md:text-base"
                    >
                        Geral
                    </button>
                </li>

                {/* MAPAS */}
                {partida.mapas && partida.mapas
                    .filter((mapa) => mapa.estatisticasJogadores != null)
                    .map((mapa, i) => {
                        const ativo = mapaSelecionado === i
                        return (
                            <li
                                key={i}
                                className={`flex justify-center items-center py-1 ${ativo ? "bg-orange-600" : "bg-azul-escuro"
                                    }`}
                                style={{ textShadow: "1px 1px 2px black" }}
                            >
                                <button
                                    onClick={() => setMapaSelecionado(i)}
                                    className="text-[.6em] font-bold w-full h-full capitalize cursor-pointer sm:text-sm md:text-base"
                                >
                                    {mapa.nome.toLowerCase()}
                                </button>
                            </li>
                        )
                    })}
            </ul>

            {/* tabelas */}
            <div className="grid gap-6 lg:grid-cols-2">
                <TabelaJogadores
                    jogadores={jogadoresTimeA}
                    time={timeA}
                />
                <TabelaJogadores
                    jogadores={jogadoresTimeB}
                    time={timeB}
                />
            </div>
        </div>
    )
}