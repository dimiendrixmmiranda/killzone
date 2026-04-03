'use client'
import { IMAGEM_JOGADOR_DEFAULT, IMAGEM_MAPA_DEFAULT, IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"
import CardPartida from "@/src/components/cardPartida/CardPartida"
import { getPartidaById, getPartidasByTeam } from "@/src/services/partidas.service"
import { getJogadorMaiorADR, getJogadorMaiorRating, getJogadorMaisAssists, getJogadorMaisKills, getJogadorPiorRating, getPlayerById, getPlayerRounds } from "@/src/services/player.service"
import { getTeamById } from "@/src/services/team.service"
import Image from "next/image"
import { useMemo, useState } from "react"
import { FaEye } from "react-icons/fa6"
import { Dialog } from 'primereact/dialog';
import { Time } from "@/src/domain/Time"
import { ImTarget } from "react-icons/im"
import { FaCrosshairs, FaFire, FaHandsHelping, FaMap, FaSkull, FaTrophy } from "react-icons/fa"
import { EstatisticaJogadorAcumulado } from "@/src/domain/EstatisticasDoJogadorAcumulado"
import { partidas } from "@/src/data/partida/partida.data"
import EstatisticaDaPartida from "@/src/components/estatisticasDaPartida/EstatisticaDaPartida"

interface PartidaIdClientProps {
    partidaId: string
}

export default function PartidaIdClient({ partidaId }: PartidaIdClientProps) {
    const partida = getPartidaById(partidaId)
    const [visible, setVisible] = useState(false);

    if (!partida) return null

    // Destaques da partida
    const maiorAdr = getJogadorMaiorADR(partida)
    const maisKills = getJogadorMaisKills(partida)
    const maisAssistencias = getJogadorMaisAssists(partida)
    const maiorRating = getJogadorMaiorRating(partida)
    const menorRating = getJogadorPiorRating(partida)

    const timeA = getTeamById(partida?.timeAId)
    const timeB = getTeamById(partida?.timeBId)

    function determinarNacionalizacaoDoTime(time: Time) {
        if (!time.historicoDeLineups) return

        const ultimaLineup = time.historicoDeLineups[0]

        const jogadores = ultimaLineup.jogadores
            .map(jogador => getPlayerById(jogador.toLowerCase()))
            .filter(Boolean)

        const contagem: Record<string, number> = {}

        for (const jogador of jogadores) {
            const pais = jogador!.pais

            contagem[pais] = (contagem[pais] || 0) + 1

            if (contagem[pais] >= 3) {
                return pais
            }
        }

        return "Internacional"
    }

    const ultimasPartidasTimeA = getPartidasByTeam(partida.timeAId).slice(0, 3)
    const ultimasPartidasTimeB = getPartidasByTeam(partida.timeBId).slice(0, 3)
    const ultimasPartidasUnicas = [
        ...new Map(
            [...ultimasPartidasTimeA, ...ultimasPartidasTimeB]
                .map(p => [p.id, p])
        ).values()
    ]

    const mediaAdrGeral = useMemo((): EstatisticaJogadorAcumulado[] => {
        const mapasJogados =
            partida?.mapas?.filter(m => m.resultado != null) ?? []

        const acumulador: Record<string, EstatisticaJogadorAcumulado> = {}

        mapasJogados.forEach(mapa => {
            mapa.estatisticasJogadores?.forEach(player => {
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
                        partidasJogadas: 1,

                        adr: 0,
                        rating: 0
                    }
                }

                const jogador = acumulador[player.jogadorId]
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

    const mvpPartida =
        mediaAdrGeral.length > 0
            ? mediaAdrGeral.reduce((maior, atual) =>
                atual.rating > maior.rating ? atual : maior
            )
            : null

    function cardDestaques(estatistica: EstatisticaJogadorAcumulado | null, tituloEstatistica: string) {
        if (!estatistica) return
        return (
            <li className="grid grid-cols-3 bg-orange-500 p-1 rounded-md w-full max-w-77.5 relative">
                <div className="w-full h-30 relative">
                    <Image alt="jogado" src={IMAGEM_JOGADOR_DEFAULT} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-center items-center col-start-2 col-end-4" style={{ textShadow: '1px 1px 2px black' }}>
                    <h2 className="font-heading text-2xl">{tituloEstatistica}</h2>
                    <h3 className="text-2xl font-heading">{estatistica.jogadorId}</h3>
                    <p className="text-2xl font-bold">{estatistica.adr}</p>
                </div>
                <div className="absolute top-1 right-1">
                    <div className="w-6 h-6 relative">
                        <Image alt={`${getTeamById(estatistica?.timeId)?.nome}`} src={getTeamById(estatistica.timeId)?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-cover" />
                    </div>
                </div>
            </li>
        )
    }

    return (
        <div className="flex justify-center bg-zinc-900">
            <div className="p-2 min-h-screen flex flex-col gap-5 max-w-360 w-full mx-auto md:p-4 lg:p-8">
                {/* Cabecalho */}
                <div className="flex flex-col gap-2">
                    <h4 className="capitalize font-heading text-2xl leading-5 text-center bg-purple-800 py-2">{partida.campeonatoId?.replaceAll('-', ' ')}</h4>
                    <div className="w-full grid grid-cols-3 bg-zinc-700 p-2">
                        <div className="relative w-full overflow-hidden h-28 lg:h-44" style={{ textShadow: '1px 1px 2px black' }}>
                            <Image
                                src={timeA && determinarNacionalizacaoDoTime(timeA) ? (`https://flagcdn.com/w320/${determinarNacionalizacaoDoTime(timeA)}.png`) : ('/default/bandeira-mundo.png')}
                                alt="Bandeira"
                                fill
                                className="object-cover blur-[.2em] scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-l from-zinc-700 via-zinc-700/80 to-transparent" />
                            <div className="absolute inset-0 flex flex-col gap-1 text-center items-center justify-center lg:gap-3">
                                <div className="relative w-14 h-14 lg:w-24 lg:h-24">
                                    <Image
                                        alt={timeA?.nome || ""}
                                        src={timeA?.imagem || IMAGEM_TIME_DEFAULT}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="font-heading text-lg leading-5 lg:text-4xl">{timeA?.nome}</h3>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="flex items-center justify-center gap-2 font-heading text-5xl lg:text-[5.5em]" style={{ textShadow: '1px 1px 2px black' }}>
                                <p>{partida.placar.timeA}</p>
                                <p>x</p>
                                <p>{partida.placar.timeB}</p>
                            </div>
                            <div>
                                <p className="uppercase -mt-2.5">{partida.tipo}</p>
                            </div>
                            <div>
                                <div className="text-center leading-4 text-xs md:text-base">
                                    <p>
                                        {new Date(partida.data).toLocaleDateString('pt-BR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                        <span> - </span>
                                        <span>
                                            {new Date(partida.data).toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative w-full overflow-hidden h-28 lg:h-44" style={{ textShadow: '1px 1px 2px black' }}>
                            <Image
                                src={timeB && determinarNacionalizacaoDoTime(timeB) ? (`https://flagcdn.com/w320/${determinarNacionalizacaoDoTime(timeB)}.png`) : ('/default/bandeira-mundo.png')}
                                alt="Bandeira"
                                fill
                                className="object-cover blur-[.2em] scale-110"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-zinc-700 via-zinc-700/80 to-transparent" />
                            <div className="absolute inset-0 flex flex-col gap-1 text-center items-center justify-center lg:gap-3">
                                <div className="relative w-14 h-14 lg:w-24 lg:h-24">
                                    <Image
                                        alt={timeB?.nome || ""}
                                        src={timeB?.imagem || IMAGEM_TIME_DEFAULT}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="font-heading text-lg leading-5 lg:text-4xl">{timeB?.nome}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Picks e Bans */}
                <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-3xl">
                        Picks e Bans
                    </h3>
                    <ul className="grid grid-cols-4 gap-4 md:grid-cols-7">
                        {
                            partida.pickBan?.map((mapa, i) => {
                                return (
                                    <li key={i}>
                                        <div className="relative w-full h-10 sm:h-14 lg:h-20">
                                            <Image alt={`${mapa.mapa}`} src={`/jogos/cs2/mapas/${mapa.mapa}.png`} fill className="object-cover" />
                                            <div className="absolute top-[50%] left-[50%]" style={{ transform: 'translate(-50%,-50%)' }}>
                                                {
                                                    mapa.timeId ? (
                                                        <div className="relative w-7 h-7 z-10">
                                                            <Image alt={`${mapa.situacao} da ${mapa.timeId}`} src={`${getTeamById(mapa.timeId)?.imagem}`} fill className="object-contain" />
                                                        </div>
                                                    ) : (
                                                        <div className="relative bg-purple-800 px-2">
                                                            <h2 className="text-[.5em] lg:text-sm" style={{ textShadow: '1px 1px 2px black' }}>Decider</h2>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className={`absolute inset-0 bg-linear-to-t ${mapa.situacao == 'pick' ? ('from-green-500') : ''} ${mapa.situacao == 'removed' ? ('from-red-500') : ''} ${mapa.situacao == 'decider' ? ('from-yellow-500') : ''} via-zinc-700/40 to-transparent opacity-80`} />
                                        </div>
                                        <p className="font-bold text-xs text-center mt-1 lg:text-lg">{mapa.mapa}</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                {/* Mapas Jogados */}
                <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-3xl">
                        Mapas Jogados
                    </h3>
                    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {
                            partida.mapas && partida.mapas.map((mapaJogado, i) => {
                                return (
                                    <li key={i} className={`w-full relative flex flex-col gap-2 bg-zinc-700 ${mapaJogado.estatisticasJogadores ? ('') : ('opacity-30')}`}>
                                        <div className="relative w-full h-25 lg:h-32">
                                            <div className="absolute top-2 right-2 z-10">
                                                <div className="relative w-10 h-10">
                                                    <Image alt={`${mapaJogado.nome}`} src={getTeamById(mapaJogado.pick)?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                    {
                                                        mapaJogado.pick != 'decider' ? (
                                                            <div className="absolute -bottom-3 left-0 right-0 h-4 bg-linear-to-t from-green-500 to-transparent opacity-90 pointer-events-none">
                                                                <p className="font-bold text-xs text-center leading-3" style={{ textShadow: '1px 1px 2px black' }}>Pick</p>
                                                            </div>
                                                        ) : (
                                                            <div className="absolute -bottom-3 left-0 right-0 h-4 bg-linear-to-t from-yellow-500 to-transparent opacity-90 pointer-events-none">
                                                                <p className="font-bold text-[.6em] text-center leading-3" style={{ textShadow: '1px 1px 2px black' }}>Decider</p>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <Image alt={`${mapaJogado.nome}`} src={`/jogos/cs2/mapas/${mapaJogado.nome}.png`} fill className="object-cover" />
                                        </div>
                                        <div className="grid grid-cols-3">
                                            <div className="flex justify-center items-center flex-col pb-1">
                                                <div className="relative w-10 h-10">
                                                    <Image alt={`${timeA?.nome}`} src={timeA?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                </div>
                                                <h3 className="capitalize font-heading text-xl">{timeA?.nome}</h3>
                                                <p className="font-bold text-2xl -mt-2">{mapaJogado.resultado?.timeA.total}</p>
                                            </div>
                                            <div className="flex items-center justify-self-center gap-1.5 relative">
                                                <span className="absolute top-0 left-[50%] capitalize text-sm font-bold bg-purple-800 px-2" style={{ transform: 'translate(-50%)', textShadow: '1px 1px 2px black' }}>{mapaJogado.nome}</span>
                                                <p>{mapaJogado.resultado?.timeA.total}</p>
                                                <div className="flex flex-col">
                                                    <p className="text-blue-500">{mapaJogado.resultado?.timeA.ct}</p>
                                                    <p className="text-orange-600 -mt-1.5">{mapaJogado.resultado?.timeA.tr}</p>
                                                </div>
                                                <span>x</span>
                                                <div className="flex flex-col">
                                                    <p className="text-blue-500">{mapaJogado.resultado?.timeB.ct}</p>
                                                    <p className="text-orange-600 -mt-1.5">{mapaJogado.resultado?.timeB.tr}</p>
                                                </div>
                                                <p>{mapaJogado.resultado?.timeB.total}</p>
                                            </div>
                                            <div className="flex justify-center items-center flex-col pb-1">
                                                <div className="relative w-10 h-10">
                                                    <Image alt={`${timeB?.nome}`} src={timeB?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                </div>
                                                <h3 className="capitalize font-heading text-xl">{timeB?.nome}</h3>
                                                <p className="font-bold text-2xl -mt-2">{mapaJogado.resultado?.timeB.total}</p>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                {/* Destaques da Partida */}
                <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-3xl">
                        Destaques da Partida
                    </h3>

                    <ul className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

                        {maiorRating && cardDestaques(maiorRating, 'Maior Rating')}

                        {maiorAdr && cardDestaques(maiorAdr, 'Maior ADR')}

                        {maisKills && cardDestaques(maisKills, 'Mais Kills')}

                        {maisAssistencias && cardDestaques(maisAssistencias, 'Mais Assistências')}

                        {menorRating && cardDestaques(menorRating, 'Pior Rating')}

                    </ul>
                </div>
                {/* Dados da Partida */}
                <EstatisticaDaPartida idPartida={partidaId} />

                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                    {/* Jogador da Partida */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-heading text-3xl">
                            Jogador da Partida
                        </h3>
                        {
                            mvpPartida ? (
                                <div className="h-full md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-1 xl:grid-cols-2">
                                    <div className="max-w-80 h-full mx-auto relative md:max-w-full md:m-0">
                                        <div className="relative w-full h-72 sm:h-83.75">
                                            <Image alt={mvpPartida.jogadorId} src={getPlayerById(mvpPartida.jogadorId)?.imagem || IMAGEM_JOGADOR_DEFAULT} fill className="object-contain" />
                                        </div>
                                        <h3 className="flex justify-center items-center text-xl font-bold bg-orange-600 py-1" style={{ textShadow: '1px 1px 2px black' }}>
                                            {mvpPartida.jogadorId}
                                        </h3>
                                        <button onClick={() => setVisible(true)} className="absolute top-0 right-0 text-xl bg-white text-orange-600 p-2 rounded-full md:hidden lg:flex xl:hidden">
                                            <FaEye />
                                        </button>
                                    </div>
                                    <div className="hidden bg-orange-600 p-4 flex-col md:flex lg:hidden xl:flex" style={{ textShadow: '1px 1px 2px black' }}>
                                        <div>
                                            <h2 className="font-heading text-2xl">Estatisticas do Jogador:</h2>
                                        </div>
                                        <ul className="flex flex-col gap-2">
                                            <li className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FaMap />
                                                    <p>Mapas Jogados</p>
                                                </div>
                                                <span>{mvpPartida?.mapasJogados}</span>
                                            </li>

                                            <li className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FaCrosshairs />
                                                    <p>Rounds Jogados</p>
                                                </div>
                                                <span>{mvpPartida && getPlayerRounds(partidas, mvpPartida.jogadorId)}</span>
                                            </li>

                                            <li className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FaFire />
                                                    <p>Kills</p>
                                                </div>
                                                <span>{mvpPartida?.kills}</span>
                                            </li>

                                            <li className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FaSkull />
                                                    <p>Mortes</p>
                                                </div>
                                                <span>{mvpPartida?.deaths}</span>
                                            </li>

                                            <li className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FaHandsHelping />
                                                    <p>Assistências</p>
                                                </div>
                                                <span>{mvpPartida?.assists}</span>
                                            </li>

                                            <li className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FaTrophy />
                                                    <p>Clutches Vencidos</p>
                                                </div>
                                                <span>{mvpPartida?.clutchVitorias}</span>
                                            </li>
                                            <li className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 ">
                                                    <ImTarget />
                                                    <p>Headshots</p>
                                                </div>
                                                <span>{mvpPartida?.headshots}</span>
                                            </li>

                                            <li className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FaFire />
                                                    <p>KD</p>
                                                </div>
                                                <span>{mvpPartida && (mvpPartida?.kills / Math.max(mvpPartida?.deaths, 1)).toFixed(2)}</span>
                                            </li>

                                            <li className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FaCrosshairs />
                                                    <p>ADR Médio</p>
                                                </div>
                                                <span>{mvpPartida && (mvpPartida?.adrTotal / mvpPartida?.mapasJogados).toFixed(2)}</span>
                                            </li>

                                            <li className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <ImTarget />
                                                    <p>Rating Médio</p>
                                                </div>
                                                <span>{mvpPartida && (mvpPartida?.rating / mvpPartida.mapasJogados).toFixed(2)}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3>MVP ainda não definido</h3>
                                </div>
                            )
                        }
                    </div>
                    {/* Ultimos Jogos */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-heading text-3xl">
                            Últimos Jogos
                        </h3>
                        <ul className="flex flex-col gap-2 md:grid grid-cols-2 lg:grid-cols-1 lg:overflow-y-scroll lg:overflow-x-hidden xl:grid-cols-2 xl:overflow-y-hidden">
                            {
                                ultimasPartidasUnicas.map(partida => {
                                    return (
                                        <CardPartida partida={partida} key={partida.id} />
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                {/* Lineups */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-heading text-3xl">
                        Lineups
                    </h3>
                    <div className="flex flex-col gap-4 2xl:grid 2xl:grid-cols-2 2xl:gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                                <div className="relative w-6 h-6">
                                    <Image alt={`${timeA?.nome}`} src={timeA?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                </div>
                                <h4 className="font-bold text-lg" style={{ textShadow: '1px 1px 2px black' }}>{timeA?.nome}</h4>
                            </div>
                            <div className="overflow-x-scroll overflow-y-hidden flex gap-4 2xl:overflow-hidden">
                                {mediaAdrGeral
                                    .filter(jogador => jogador.timeId === timeA?.id)
                                    .map((jogador) => {
                                        const jogadorDados = getPlayerById(jogador.jogadorId)
                                        return (
                                            <div key={jogador.jogadorId} className="bg-zinc-500 flex flex-col justify-center items-center max-w-50">
                                                <div className="relative w-40 h-48 2xl:w-30 2xl:h-37.5">
                                                    <Image
                                                        alt={`Imagem do jogador ${jogador.jogadorId}`}
                                                        src={jogadorDados?.imagem || IMAGEM_JOGADOR_DEFAULT}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <h3 className="font-bold text-lg bg-zinc-950 w-full text-center py-1">{jogador.jogadorId}</h3>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                                <div className="relative w-6 h-6">
                                    <Image alt={`${timeB?.nome}`} src={timeB?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                </div>
                                <h4 className="font-bold text-lg" style={{ textShadow: '1px 1px 2px black' }}>{timeB?.nome}</h4>
                            </div>
                            <div className="overflow-x-scroll overflow-y-hidden flex gap-4 2xl:overflow-hidden">
                                {mediaAdrGeral
                                    .filter(jogador => jogador.timeId === timeB?.id)
                                    .map((jogador) => {
                                        const jogadorDados = getPlayerById(jogador.jogadorId)
                                        return (
                                            <div key={jogador.jogadorId} className="bg-zinc-500 flex flex-col justify-center items-center max-w-50">
                                                <div className="relative w-40 h-48 2xl:w-30 2xl:h-37.5">
                                                    <Image
                                                        alt={`Imagem do jogador ${jogador.jogadorId}`}
                                                        src={jogadorDados?.imagem || IMAGEM_JOGADOR_DEFAULT}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <h3 className="font-bold text-lg bg-zinc-950 w-full text-center py-1">{jogador.jogadorId}</h3>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Dialog dados MVP */}
            <Dialog header={<h2 style={{ textShadow: '1px 1px 2px black' }} className="font-heading text-3xl">{mvpPartida?.jogadorId} - MVP</h2>} visible={visible} className="w-[95%] max-w-100 dialogMVP" onHide={() => { if (!visible) return; setVisible(false); }}>
                <div className="flex flex-col" style={{ textShadow: '1px 1px 2px black' }}>
                    <div>
                        <h2 className="font-heading text-2xl">Estatisticas do Jogador:</h2>
                    </div>
                    <div className="flex items-center gap-1">
                        <p className="font-bold">ADR:</p>
                        <span>
                            {mvpPartida?.adr}
                        </span>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}