import { Noticia } from "@/src/domain/Noticia";
import { Time } from "@/src/domain/Time";
import { getAllNews, getNewsByTeam } from "@/src/services/news.service";
import { getAllTeams, getTeamById } from "@/src/services/team.service";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaShieldHeart } from "react-icons/fa6";
import CardNoticia from "../cardNoticia/CardNoticia";
import Link from "next/link";
import { Partida } from "@/src/domain/Partida";
import { IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens";
import { getPartidasByTeam } from "@/src/services/partidas.service";
import { GoShieldX } from "react-icons/go";

export default function SidebarSeletorDeTime() {
    const times = getAllTeams()
    const timesSA = times.filter(time => time.regiao.toLowerCase() == 'sa')
    const timesNA = times.filter(time => time.regiao.toLowerCase() == 'na')
    const timesEU = times.filter(time => time.regiao.toLowerCase() == 'eu')
    const timesAS = times.filter(time => time.regiao.toLowerCase() == 'as')
    const timesOC = times.filter(time => time.regiao.toLowerCase() == 'oc')

    const [tooltipAberto, setTooltipAberto] = useState<number | null>(null)
    const [timeSelecionado, setTimeSelecionado] = useState<Time | null>(null)
    const [timeConfirmado, setTimeConfirmado] = useState<Time | null>(null)
    const [noticias, setNoticias] = useState<Noticia[]>([])

    const partidaDefault: Partida = {
        id: "iem-rio-2024-sf1",
        jogoId: "cs2",
        campeonatoId: "iem-rio-2024",
        data: new Date(),
        situacao: 'agendado',
        tipo: "md3",
        timeAId: "furia",
        timeBId: "imperial",

        placar: {
            timeA: 2,
            timeB: 1,
        },

        fase: 'semifinal'
    }

    function gerarFormaTime(teamId: string) {
        const partidas = getPartidasByTeam(teamId)

        const resultados = partidas.map(partida => {
            if (!partida.placar) return null

            const isTimeA = partida.timeAId === teamId

            const meusRounds = isTimeA ? partida.placar.timeA : partida.placar.timeB
            const roundsAdv = isTimeA ? partida.placar.timeB : partida.placar.timeA

            let resultado: 'V' | 'D' | 'E' = 'E'

            if (meusRounds > roundsAdv) resultado = 'V'
            if (meusRounds < roundsAdv) resultado = 'D'

            const adversarioId = isTimeA ? partida.timeBId : partida.timeAId

            return {
                resultado,
                data: partida.data.toISOString().split('T')[0],
                adversarioId,
                placar: `${meusRounds}-${roundsAdv}`,
                campeonatoId: partida.campeonatoId
            }
        }).filter(Boolean)

        while (resultados.length < 5) {
            resultados.push(null)
        }

        return resultados.slice(0, 5)
    }

    const ultimasPartidasTimeA = gerarFormaTime(partidaDefault.timeAId)
    const ultimasPartidasTimeB = gerarFormaTime(partidaDefault.timeBId)

    useEffect(() => {
        timeConfirmado && setNoticias(getNewsByTeam(timeConfirmado?.id).slice(0, 3))
    }, [timeConfirmado])


    function renderizarListaDeTimes(titulo: string, arrayDeTimes: Time[]) {
        return (
            <div className="flex flex-col gap-2">
                <h2 className="font-heading text-2xl">{titulo}</h2>
                <ul className="grid grid-cols-4 gap-2">
                    {
                        arrayDeTimes.map(time => {
                            return (
                                <li key={time.id}>
                                    <button className={`flex justify-center items-center p-2 rounded-md transition-all duration-300 ${timeSelecionado?.id.toLowerCase() === time.id.toLowerCase() ? 'bg-stone-400 scale-105 shadow-lg' : ''}`} onClick={() => setTimeSelecionado(time)}>
                                        <div className="relative w-10 h-10">
                                            <Image alt={time.nome} src={time.imagem} fill className="object-contain" />
                                        </div>
                                    </button>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }

    return (
        <div>
            <div className={`relative ${timeConfirmado === null ? 'block' : 'hidden'}`}>
                <div className=" flex flex-col gap-6">
                    {
                        renderizarListaDeTimes('Sul Americanas (SA)', timesSA)
                    }
                    {
                        renderizarListaDeTimes('Norte Americanas (NA)', timesNA)
                    }
                    {
                        renderizarListaDeTimes('Européias (EU)', timesEU)
                    }
                    {
                        renderizarListaDeTimes('Asiáticas (AS)', timesAS)
                    }
                    {
                        renderizarListaDeTimes('Oceânia (OC)', timesOC)
                    }
                </div>
                {
                    timeSelecionado != null ? (
                        <button className="fixed bottom-6 right-5 w-[280px] font-heading text-2xl leading-8 py-2 rounded-lg capitalize bg-orange-600 z-40 flex items-center gap-2 justify-center" style={{ textShadow: '1px 1px 2px black' }} onClick={() => setTimeConfirmado(timeSelecionado)}>
                            Confirmar {timeSelecionado.nome}
                            <div className="relative w-6 h-6">
                                <Image alt={timeSelecionado.nome} src={timeSelecionado.imagem} fill className="object-contain" />
                            </div>
                        </button>
                    ) : ''
                }
            </div>
            {
                timeConfirmado != null ? (
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8">
                                    <Image alt={timeConfirmado.nome} src={timeConfirmado.imagem} fill className="object-contain" />
                                </div>
                                <h2 className="font-heading text-4xl leading-7 mt-2">{timeConfirmado.nome}</h2>
                            </div>
                            <div>
                                <button className="mx-auto text-3xl mt-1" onClick={() => {
                                    setTimeConfirmado(null)
                                    setTimeSelecionado(null)
                                }}>
                                    <GoShieldX />
                                </button>
                            </div>
                        </div>
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link href={``}>
                                    <div className="h-full rounded-md overflow-hidden w-[280px] shrink-0 bg-slate-950 text-white p-4 py-6 flex flex-col gap-4">
                                        <h3 className="capitalize">{partidaDefault.campeonatoId?.replaceAll('-', ' ')}</h3>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="relative w-8 h-8">
                                                    <Image alt={getTeamById(partidaDefault.timeAId)?.imagem || IMAGEM_TIME_DEFAULT} src={getTeamById(partidaDefault.timeAId)?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                </div>
                                                <h4 className="capitalize font-bold text-xl">{partidaDefault.timeAId}</h4>
                                                <div className="flex items-center gap-1">
                                                    {ultimasPartidasTimeA.map((forma, i) => {
                                                        if (!forma) {
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className="w-4 h-4 rounded-full bg-gray-500"
                                                                />
                                                            )
                                                        }

                                                        const aberto = tooltipAberto === i
                                                        const adversario = getTeamById(forma?.adversarioId)

                                                        return (
                                                            <div
                                                                key={i}
                                                                className="relative group"
                                                                onMouseEnter={() => setTooltipAberto(i)}
                                                                onMouseLeave={() => setTooltipAberto(null)}
                                                                onClick={() => setTooltipAberto(aberto ? null : i)}
                                                            >

                                                                <div
                                                                    className={`
                                                                    ${forma.resultado === 'V' ? 'bg-green-700' : ''}
                                                                    ${forma.resultado === 'D' ? 'bg-red-600' : ''}
                                                                    w-4 h-4 flex justify-center items-center
                                                                    rounded-full text-[.6em] font-bold cursor-pointer
                                                                `}
                                                                >
                                                                    {forma.resultado}
                                                                </div>

                                                                <div
                                                                    className={`
                                                                        absolute bottom-6 left-1/2 -translate-x-1/2
                                                                        transition-all duration-200
                                                                        bg-black text-white px-2 py-1 rounded shadow-lg
                                                                        whitespace-nowrap z-50

                                                                        opacity-0 pointer-events-none

                                                                        group-hover:opacity-100
                                                                        group-hover:pointer-events-auto

                                                                        ${aberto ? 'opacity-100 pointer-events-auto' : ''}
                                                                    `}
                                                                >
                                                                    <span className="text-[.6em] text-center block capitalize">
                                                                        {forma?.campeonatoId?.replaceAll('-', ' ')}
                                                                    </span>

                                                                    <div className="flex items-center justify-self-center gap-1 text-xs">
                                                                        <div className="font-bold">{forma.placar}</div>

                                                                        <div className="relative w-3 h-3">
                                                                            <Image
                                                                                alt={`${adversario?.nome}`}
                                                                                src={adversario?.imagem || IMAGEM_TIME_DEFAULT}
                                                                                fill
                                                                                className="object-contain"
                                                                            />
                                                                        </div>

                                                                        <p>{adversario?.nome}</p>
                                                                    </div>

                                                                    <div className="text-zinc-400 text-[.55em] text-center">
                                                                        {forma.data}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="relative w-8 h-8">
                                                    <Image alt={getTeamById(partidaDefault.timeBId)?.imagem || IMAGEM_TIME_DEFAULT} src={getTeamById(partidaDefault.timeBId)?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                </div>
                                                <h4 className="capitalize font-bold text-xl">{partidaDefault.timeBId}</h4>
                                                <div className="flex items-center gap-1">
                                                    {ultimasPartidasTimeB.map((forma, i) => {
                                                        if (!forma) {
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className="w-4 h-4 rounded-full bg-gray-500"
                                                                />
                                                            )
                                                        }

                                                        const aberto = tooltipAberto === i
                                                        const adversario = getTeamById(forma?.adversarioId)

                                                        return (
                                                            <div
                                                                key={i}
                                                                className="relative group"
                                                                onMouseEnter={() => setTooltipAberto(i)}
                                                                onMouseLeave={() => setTooltipAberto(null)}
                                                                onClick={() => setTooltipAberto(aberto ? null : i)}
                                                            >

                                                                <div
                                                                    className={`
                                                                    ${forma.resultado === 'V' ? 'bg-green-700' : ''}
                                                                    ${forma.resultado === 'D' ? 'bg-red-600' : ''}
                                                                    w-4 h-4 flex justify-center items-center
                                                                    rounded-full text-[.6em] font-bold cursor-pointer
                                                                `}
                                                                >
                                                                    {forma.resultado}
                                                                </div>

                                                                <div
                                                                    className={`
                                                                        absolute bottom-6 left-1/2 -translate-x-1/2
                                                                        transition-all duration-200
                                                                        bg-black text-white px-2 py-1 rounded shadow-lg
                                                                        whitespace-nowrap z-50

                                                                        opacity-0 pointer-events-none

                                                                        group-hover:opacity-100
                                                                        group-hover:pointer-events-auto

                                                                        ${aberto ? 'opacity-100 pointer-events-auto' : ''}
                                                                    `}
                                                                >
                                                                    <span className="text-[.6em] text-center block capitalize">
                                                                        {forma?.campeonatoId?.replaceAll('-', ' ')}
                                                                    </span>

                                                                    <div className="flex items-center justify-self-center gap-1 text-xs">
                                                                        <div className="font-bold">{forma.placar}</div>

                                                                        <div className="relative w-3 h-3">
                                                                            <Image
                                                                                alt={`${adversario?.nome}`}
                                                                                src={adversario?.imagem || IMAGEM_TIME_DEFAULT}
                                                                                fill
                                                                                className="object-contain"
                                                                            />
                                                                        </div>

                                                                        <p>{adversario?.nome}</p>
                                                                    </div>

                                                                    <div className="text-zinc-400 text-[.55em] text-center">
                                                                        {forma.data}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p><span>Hoje</span> - <span>20:00</span> - <span>SemiFinal</span></p>
                                        </div>
                                        <div className="grid grid-cols-2 mt-auto gap-2">
                                            <button className="text-center bg-amber-700 rounded-md p-2">Transmissão</button>
                                            <button className="text-center bg-amber-700 rounded-md p-2">Agenda</button>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            {
                                noticias.length > 0 ? noticias.map((noticia, i) => {
                                    return (
                                        <CardNoticia key={noticia.id} i={i} noticia={noticia} tamanhoCard="bg-white rounded-md overflow-hidden" />
                                    )
                                }) : (
                                    <div>
                                        <h2 className="font-heading text-4xl text-center">Nenhuma Notícia disponível!</h2>
                                    </div>
                                )
                            }
                        </ul>
                        <Link href={`/times/${timeConfirmado.id}`} className="text-center bg-orange-600 py-1 rounded-md" style={{ textShadow: '1px 1px 2px black' }}>Navegar para a página da organização</Link>
                    </div>
                ) : ''
            }
        </div>
    )
}