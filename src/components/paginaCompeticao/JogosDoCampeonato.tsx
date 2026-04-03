'use client'
import { IMAGEM_JOGADOR_DEFAULT, IMAGEM_MAPA_DEFAULT, IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"
import { Partida } from "@/src/domain/Partida"
import { getPlayerById } from "@/src/services/player.service"
import { getTeamById } from "@/src/services/team.service"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import CardPartida from "../cardPartida/CardPartida"

interface JogosDoCampeonatoProps {
    partidas: Partida[]
}

interface DadosJogadorSimples {
    jogadorId: string,
    timeId: string,
    adr: number
}

export default function JogosDoCampeonato({ partidas }: JogosDoCampeonatoProps) {
    const [matchAberto, setMatchAberto] = useState<Partida | null>(null)
    const popoverRef = useRef<HTMLDivElement | null>(null)
    const [mapaSelecionado, setMapaSelecionado] = useState<string | "geral">("geral");
    const fases = [... new Set(partidas.map(partida => partida.fase))]

    const [fase, setFase] = useState<string>(fases[fases.length - 1])
    const [partidasFiltradas, setPartidasFiltradas] = useState<Partida[]>([])

    useEffect(() => {
        const filtroPartidas = partidas.filter(partida => partida.fase === fase)
        setPartidasFiltradas(filtroPartidas)
    }, [partidas, fase])

    // Identificando clique fora 
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node)
            ) {
                setMatchAberto(null)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


    function getTimeVencedor(partida: Partida): string | null {
        if (partida.situacao !== "finalizado") return null
        if (!partida.mapas) return null

        let vitoriasA = 0
        let vitoriasB = 0

        for (const mapa of partida.mapas) {
            if (!mapa.resultado) continue

            const a = mapa.resultado.timeA.total
            const b = mapa.resultado.timeB.total

            if (a > b) vitoriasA++
            else if (b > a) vitoriasB++
        }

        if (vitoriasA > vitoriasB) return partida.timeAId
        if (vitoriasB > vitoriasA) return partida.timeBId

        return null
    }

    function getVencedorMapa(
        mapa: NonNullable<Partida["mapas"]>[number],
        partida: Partida
    ): string | null {
        if (!mapa.resultado) return null

        const a = mapa.resultado.timeA.total
        const b = mapa.resultado.timeB.total

        if (a > b) return partida.timeAId
        if (b > a) return partida.timeBId

        return null
    }
    const mediaAdrGeral = useMemo(() => {

        const mapasJogados = matchAberto?.mapas && matchAberto?.mapas.filter(m => m.resultado != null)

        const acumulador: Record<
            string,
            {
                jogadorId: string
                timeId: string
                totalAdr: number
                mapas: number
            }
        > = {}

        mapasJogados?.forEach(mapa => {
            mapa.estatisticasJogadores?.forEach(player => {

                if (!acumulador[player.jogadorId]) {
                    acumulador[player.jogadorId] = {
                        jogadorId: player.jogadorId,
                        timeId: player.timeId, // 👈 salvar aqui
                        totalAdr: 0,
                        mapas: 0
                    }
                }

                acumulador[player.jogadorId].totalAdr += player.adr
                acumulador[player.jogadorId].mapas++
            })
        })

        return Object.values(acumulador).map(jogador => ({
            jogadorId: jogador.jogadorId,
            timeId: jogador.timeId, // 👈 retornar aqui
            adr: Number((jogador.totalAdr / jogador.mapas).toFixed(1))
        }))

    }, [matchAberto])

    useEffect(() => {
        setMapaSelecionado("geral")
    }, [matchAberto?.id])

    const mvpPartida =
        mediaAdrGeral.length > 0
            ? mediaAdrGeral.reduce((maior, atual) =>
                atual.adr > maior.adr ? atual : maior
            )
            : null

    function calcularMediaGeral(match: typeof matchAberto) {
        if (!match?.mapas) return []

        const acumulado: Record<string, {
            jogadorId: string
            timeId: string
            adrTotal: number
            mapas: number
        }> = {}

        match.mapas.forEach(mapa => {
            if (!mapa.resultado || !mapa.estatisticasJogadores) return

            mapa.estatisticasJogadores.forEach(player => {
                const key = player.jogadorId

                if (!acumulado[key]) {
                    acumulado[key] = {
                        jogadorId: player.jogadorId,
                        timeId: player.timeId,
                        adrTotal: 0,
                        mapas: 0
                    }
                }

                acumulado[key].adrTotal += player.adr
                acumulado[key].mapas += 1
            })
        })

        // transforma em array calculando média
        return Object.values(acumulado).map(p => ({
            jogadorId: p.jogadorId,
            timeId: p.timeId,
            adr: Number((p.adrTotal / p.mapas).toFixed(1))
        }))
    }

    function gerarDadosTabela(jogadoresTime: DadosJogadorSimples[]) {
        return (
            <ul className="flex flex-col gap-2">
                {jogadoresTime?.map(jogador => {
                    const jog = getPlayerById(jogador.jogadorId)
                    return (
                        <li key={jogador.jogadorId} className={`grid grid-cols-[30px_1fr_40px] p-1 ${jogador.jogadorId === mvpPartida?.jogadorId ? ('bg-orange-500') : ('')}`}>
                            <div className="relative w-6 h-6 rounded-full bg-zinc-400">
                                <Image alt={`${jogador.jogadorId}`} src={jog?.imagem || IMAGEM_JOGADOR_DEFAULT} fill className="object-contain" />
                            </div>
                            <h3 className="truncate">
                                {jogador.jogadorId}
                            </h3>
                            <span className="ml-auto">
                                {jogador.adr}
                            </span>
                        </li>
                    )
                })}
            </ul>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <h2 className="font-heading text-3xl">Jogos do Campeonato</h2>
            <ul className="grid grid-cols-3 gap-2 md:grid-cols-5 xl:grid-cols-6">
                {
                    fases.map((f, i) => {
                        return (
                            <li key={i} className={`w-full flex justify-center items-center text-white rounded-md ${f === fase ? ('bg-orange-600') : ('bg-azul-escuro')}`}>
                                <button
                                    className="capitalize w-full py-1 cursor-pointer"
                                    onClick={() => {
                                        setFase(f)
                                    }}
                                    style={{ textShadow: '1px 1px 2px black' }}
                                >
                                    {f.replaceAll('-', ' ')}
                                </button>
                            </li>
                        )
                    })
                }
            </ul>
            {
                partidasFiltradas.length > 0 ? (
                    <ul className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {
                            partidasFiltradas.map((partida) => {
                                return (
                                    <div className="relative text-white" key={partida.id}>
                                        <CardPartida partida={partida} setMatchAberto={setMatchAberto} key={partida.id} />
                                        {matchAberto?.id === partida.id && (
                                            <div
                                                ref={popoverRef}
                                                className="absolute top-0 left-1/2 mt-2 z-50 bg-zinc-900 rounded-xl p-4 w-full shadow-xl flex flex-col gap-4 cursor-default max-w-[350px]"
                                                style={{ transform: 'translate(-50%)' }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="grid grid-cols-[1fr_60px_1fr] gap-2 overflow-hidden">
                                                    <div className="flex items-center justify-end gap-1 w-full min-w-0 sm:justify-start">
                                                        <div className="w-1 h-full bg-cyan-600 mr-1"></div>
                                                        <div className="min-w-0 max-w-[50px] sm:max-w-[80px]">
                                                            <h3 className="font-heading text-xl leading-4.5 mt-1 truncate">{getTeamById(matchAberto.timeAId)?.nome}</h3>
                                                        </div>
                                                        <div className="relative w-8 h-8">
                                                            <Image alt={`${getTeamById(matchAberto.timeAId)?.nome}`} src={getTeamById(matchAberto.timeAId)?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-self-center font-bold gap-1">
                                                        <p>{matchAberto.placar.timeA}</p>
                                                        <span>x</span>
                                                        <p>{matchAberto.placar.timeB}</p>
                                                    </div>
                                                    <div className="flex items-center justify-start gap-1 w-full min-w-0 sm:justify-end">
                                                        <div className="relative w-8 h-8">
                                                            <Image alt={`${getTeamById(matchAberto.timeBId)?.nome}`} src={getTeamById(matchAberto.timeBId)?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                        </div>
                                                        <div className="min-w-0 max-w-[50px] sm:max-w-[80px]">
                                                            <h3 className="font-heading text-xl leading-4.5">{getTeamById(matchAberto.timeBId)?.nome}</h3>
                                                        </div>
                                                        <div className="w-1 h-full bg-orange-500 ml-1"></div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="font-heading text-2xl">Picks e Bans</h3>
                                                    <ul className="grid grid-cols-4 gap-2">
                                                        {
                                                            matchAberto.pickBan ? (
                                                                matchAberto.pickBan.map((mapa, i) => {
                                                                    return (
                                                                        <li key={i} className="flex flex-col">
                                                                            <div
                                                                                className="relative w-full h-[35px] rounded-md overflow-hidden"
                                                                                style={{ boxShadow: '0 0 2px 1px black' }}
                                                                            >
                                                                                {/* imagem */}
                                                                                <Image
                                                                                    alt={`${mapa.mapa}`}
                                                                                    src={`/jogos/cs2/mapas/${mapa.mapa}.png`}
                                                                                    fill
                                                                                    className="object-cover"
                                                                                />

                                                                                {/* ✅ overlay gradiente */}
                                                                                <div
                                                                                    className={`
                                                                                pointer-events-none
                                                                                absolute inset-0
                                                                                ${mapa.situacao === 'pick'
                                                                                            ? 'bg-gradient-to-t from-green-600/70 to-transparent'
                                                                                            : ''
                                                                                        }
                                                                                ${mapa.situacao === 'removed'
                                                                                            ? 'bg-gradient-to-t from-red-600/70 to-transparent'
                                                                                            : ''
                                                                                        }
                                                                                ${mapa.situacao === 'decider'
                                                                                            ? 'bg-gradient-to-t from-yellow-500/70 to-transparent'
                                                                                            : ''
                                                                                        }
                                                                        `}
                                                                                />

                                                                                {
                                                                                    mapa.situacao != 'decider' ? (
                                                                                        <div
                                                                                            className="absolute top-[50%] left-[50%]"
                                                                                            style={{ transform: 'translate(-50%,-50%)' }}
                                                                                        >
                                                                                            <div className="relative w-7 h-7">
                                                                                                <Image
                                                                                                    alt={`Pick ${getTeamById(mapa.timeId)}`}
                                                                                                    src={getTeamById(mapa.timeId)?.imagem || IMAGEM_TIME_DEFAULT}
                                                                                                    fill
                                                                                                    className="object-cover"
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div
                                                                                            className="absolute top-[50%] left-[50%]"
                                                                                            style={{ transform: 'translate(-50%,-50%)' }}
                                                                                        >
                                                                                            <p className="font-bold text-[.7em] px-2 py-0.5" style={{ textShadow: '1px 1px 2px black' }}>Decider</p>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                            <p className="text-sm text-center capitalize">{mapa.mapa}</p>
                                                                        </li>
                                                                    )
                                                                })
                                                            ) : (
                                                                <div className="col-start-1 col-end-5">
                                                                    <h3>Picks e bans indisponiveis!</h3>
                                                                </div>
                                                            )

                                                        }
                                                    </ul>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="font-heading text-2xl">Mapas</h3>
                                                    <ul className="grid grid-cols-3 gap-4">
                                                        {
                                                            matchAberto.mapas ? (
                                                                matchAberto.mapas.map((mapa, i) => {
                                                                    const vencedorId = getVencedorMapa(mapa, matchAberto)
                                                                    return (
                                                                        <li key={i} className={`flex flex-col ${mapa.estatisticasJogadores ? ('') : ('opacity-40')}`}>
                                                                            <div className="relative w-full h-[40px] rounded-md overflow-hidden">
                                                                                <Image alt={`${mapa.nome}`} src={`/jogos/cs2/mapas/${mapa.nome}.png` || IMAGEM_MAPA_DEFAULT} fill className="object-cover" />
                                                                                {
                                                                                    mapa.pick != 'decider' ? (
                                                                                        <div className="absolute top-1 right-1">
                                                                                            <div className="relative w-4 h-4 md:w-5 md:h-5">
                                                                                                <Image alt={`Pick da ${getTeamById(mapa.pick)}`} src={getTeamById(mapa.pick)?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="absolute top-0 right-5">
                                                                                            <div className="relative w-5 h-5">
                                                                                                <p className="font-bold text-[.6em]" style={{ textShadow: '1px 1px 2px black' }}>Decider</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                                {
                                                                                    mapa.resultado && (
                                                                                        <div className="absolute top-[50%] left-2" style={{ transform: 'translate(0,-50%)' }}>
                                                                                            <div className="relative w-8 h-8 md:h-10 md:w-10">
                                                                                                <Image alt={`Vencedor foi ${vencedorId && getTeamById(vencedorId)?.nome}`} src={vencedorId && getTeamById(vencedorId)?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                            <div>
                                                                                <h3 className="text-sm capitalize font-bold text-center">{mapa.nome}</h3>
                                                                            </div>
                                                                            {
                                                                                mapa.resultado && (
                                                                                    <div className="flex gap-1 justify-center">
                                                                                        <p className="text-cyan-600">{mapa.resultado?.timeA.total}</p>
                                                                                        <div className="flex flex-col justify-center items-center">
                                                                                            <p className="text-xs text-blue-600">{mapa.resultado?.timeA.ct}</p>
                                                                                            <p className="text-xs -mt-1 text-red-600">{mapa.resultado?.timeA.tr}</p>
                                                                                        </div>
                                                                                        <span>x</span>
                                                                                        <div className="flex flex-col justify-center items-center">
                                                                                            <p className="text-xs text-blue-600">{mapa.resultado?.timeB.ct}</p>
                                                                                            <p className="text-xs -mt-1 text-red-600">{mapa.resultado?.timeB.tr}</p>
                                                                                        </div>
                                                                                        <p className="text-orange-500">{mapa.resultado?.timeB.total}</p>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        </li>
                                                                    )
                                                                })
                                                            ) : (
                                                                <div className="col-start-1 col-end-3">
                                                                    <h3>Mapas indisponíveis</h3>
                                                                </div>
                                                            )

                                                        }
                                                    </ul>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <h3 className="font-heading text-2xl">Lineups</h3>
                                                    {
                                                        matchAberto.mapas ? (
                                                            <>
                                                                <ul className={`grid gap-1 ${matchAberto.mapas && matchAberto.mapas.filter(m => m.estatisticasJogadores != null).length + 1 > 3 ? 'grid-cols-4' : 'grid-cols-3'}`}>

                                                                    {/* Geral */}
                                                                    <li className={`bg-azul-escuro flex justify-center items-center py-1 ${mapaSelecionado === 'geral' ? ('bg-orange-600') : ('bg-azul-escuro')}`}>
                                                                        <button
                                                                            onClick={() => setMapaSelecionado("geral")}
                                                                            className="text-[.6em] font-bold cursor-pointer"
                                                                            style={{ textShadow: '1px 1px 2px black' }}
                                                                        >
                                                                            Geral
                                                                        </button>
                                                                    </li>

                                                                    {/* Mapas */}
                                                                    {
                                                                        matchAberto.mapas
                                                                            .map((mapa) => mapa)
                                                                            .filter((mapa) => mapa.estatisticasJogadores != null)
                                                                            .map((mapa, i) => {
                                                                                {
                                                                                    const dadosDoMapa = matchAberto?.mapas

                                                                                    const acumulado: Record<string, {
                                                                                        jogadorId: string
                                                                                        timeId: string
                                                                                        adrTotal: number
                                                                                        mapas: number
                                                                                    }> = {}

                                                                                    const dados = dadosDoMapa?.forEach(mapa => {
                                                                                        if (!mapa.resultado || !mapa.estatisticasJogadores) return

                                                                                        mapa.estatisticasJogadores.forEach(player => {
                                                                                            const key = player.jogadorId

                                                                                            if (!acumulado[key]) {
                                                                                                acumulado[key] = {
                                                                                                    jogadorId: player.jogadorId,
                                                                                                    timeId: player.timeId,
                                                                                                    adrTotal: 0,
                                                                                                    mapas: 0
                                                                                                }
                                                                                            }

                                                                                            acumulado[key].adrTotal += player.adr
                                                                                            acumulado[key].mapas += 1
                                                                                        })
                                                                                    })

                                                                                    return (
                                                                                        <li key={i} className={`bg-azul-escuro flex justify-center items-center py-1 ${mapaSelecionado === mapa.nome ? ('bg-orange-600') : ('bg-azul-escuro')}`}>
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    setMapaSelecionado(mapa.nome)
                                                                                                }}
                                                                                                className="text-[.6em] font-bold w-full h-full capitalize cursor-pointer"
                                                                                                style={{ textShadow: '1px 1px 2px black' }}
                                                                                            >
                                                                                                {mapa.nome}
                                                                                            </button>
                                                                                        </li>
                                                                                    )
                                                                                }
                                                                            })
                                                                    }
                                                                </ul>
                                                                <div>
                                                                    {
                                                                        mapaSelecionado === 'geral' ? (

                                                                            (() => {
                                                                                const jogadoresGerais = calcularMediaGeral(matchAberto)

                                                                                const jogadoresTimeA = jogadoresGerais.filter(
                                                                                    player => player.timeId === matchAberto?.timeAId
                                                                                )

                                                                                const jogadoresTimeB = jogadoresGerais.filter(
                                                                                    player => player.timeId === matchAberto?.timeBId
                                                                                )

                                                                                return (
                                                                                    <div className="grid grid-cols-2 gap-2">
                                                                                        {gerarDadosTabela(jogadoresTimeA)}
                                                                                        {gerarDadosTabela(jogadoresTimeB)}
                                                                                    </div>
                                                                                )
                                                                            })()
                                                                        ) : (() => {
                                                                            const dadosDoMapa = matchAberto.mapas.find(m => m.nome === mapaSelecionado)
                                                                            const jogadores = dadosDoMapa?.estatisticasJogadores
                                                                            const jogadoresTimeA = jogadores?.filter(
                                                                                player => player.timeId === matchAberto?.timeAId
                                                                            )
                                                                                .map(jogador => {
                                                                                    return {
                                                                                        jogadorId: jogador.jogadorId,
                                                                                        timeId: jogador.timeId,
                                                                                        adr: jogador.adr
                                                                                    }
                                                                                })
                                                                            const jogadoresTimeB = jogadores?.filter(
                                                                                player => player.timeId === matchAberto?.timeBId
                                                                            )
                                                                                .map(jogador => {
                                                                                    return {
                                                                                        jogadorId: jogador.jogadorId,
                                                                                        timeId: jogador.timeId,
                                                                                        adr: jogador.adr
                                                                                    }
                                                                                })

                                                                            return (
                                                                                <div className="grid grid-cols-2 gap-2">
                                                                                    {jogadoresTimeA && jogadoresTimeB ? (
                                                                                        <>
                                                                                            {gerarDadosTabela(jogadoresTimeA)}
                                                                                            {gerarDadosTabela(jogadoresTimeB)}
                                                                                        </>
                                                                                    ) : null}
                                                                                </div>
                                                                            )
                                                                        })()
                                                                    }
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div>
                                                                <h3>Lineups Indisponíveis</h3>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div className="flex justify-center items-center w-full bg-azul-escuro rounded-md font-bold cursor-pointer">
                                                    <Link href={`/paginaPartida/${matchAberto.id}`} className="p-2">Página do Jogo</Link>
                                                </div>
                                                <button
                                                    className="absolute top-2 right-2 text-white cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setMatchAberto(null)
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        }
                    </ul>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold">Sem Partidas Até o Momento!</h3>
                    </div>
                )
            }
        </div>
    )
}