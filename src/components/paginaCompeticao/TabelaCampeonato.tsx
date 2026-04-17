import { IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"
import { Campeonato } from "@/src/domain/Campeonato"
import { Partida } from "@/src/domain/Partida"
import { getCampeonatoById, getTabelaByCampeonatoId } from "@/src/services/campeonato.service"
import { getPartidasByCampeonato } from "@/src/services/partidas.service"
import { getTeamById } from "@/src/services/team.service"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface TabelaDoCampeonatoProps {
    campeonato: Campeonato
}

export default function TabelaDoCampeonato({ campeonato }: TabelaDoCampeonatoProps) {
    const tabela = getTabelaByCampeonatoId(campeonato)
    const partidas = getPartidasByCampeonato(campeonato.slugId!)
    const partidasQuartas = getPartidasByCampeonato(campeonato.slugId!).filter(partida => partida.fase === 'quartas')
    const partidasSemifinal = getPartidasByCampeonato(campeonato.slugId!).filter(partida => partida.fase === 'semifinal')
    const partidaTerceiroLugar = getPartidasByCampeonato(campeonato.slugId!).filter(partida => partida.fase === 'terceiro-lugar')
    const partidaFinal = getPartidasByCampeonato(campeonato.slugId!).filter(partida => partida.fase === 'final')

    function formatarData(data?: Date) {
        if (!data) return ""

        const dia = String(data.getDate()).padStart(2, "0")
        const mes = String(data.getMonth() + 1).padStart(2, "0")
        const horas = String(data.getHours()).padStart(2, "0")
        const minutos = String(data.getMinutes()).padStart(2, "0")

        return `${dia}/${mes} - ${horas}:${minutos}`
    }

    function cardPlayoff(
        linhaHorizontalCostas: boolean = false,
        verticalCimaCostas: boolean = false, tamanhoVerticalCimaCostas: number = 80,
        verticalBaixoCostas: boolean = false, tamanhoVerticalBaixoCostas: number = 80,
        linhaHorizontalFrente: boolean = false,
        verticalCimaFrente: boolean = false, tamanhoVerticalCimaFrente: number = 80,
        verticalBaixoFrente: boolean = false, tamanhoVerticalBaixoFrente: number = 80,
        partida?: Partida
    ) {
        if (!partida) {
            return (
                <div className="relative flex items-center">

                    {/* LINHA VERTICAL */}
                    <div className="relative w-0 h-25">
                        {/* linha para cima */}
                        {
                            verticalCimaCostas ? (
                                <div className={`absolute left-0 bottom-1/2 w-0.5 h-[${tamanhoVerticalCimaCostas}px] bg-zinc-500`}></div>
                            ) : ('')
                        }
                        {/* linha para baixo */}
                        {
                            verticalBaixoCostas ? (
                                <div className={`absolute left-0 top-1/2 w-0.5 h-[${tamanhoVerticalBaixoCostas}px] bg-zinc-500`}></div>
                            ) : ('')
                        }
                    </div>

                    {/* LINHA HORIZONTAL FRENTE*/}
                    {
                        linhaHorizontalCostas ? (
                            <div className="w-8 h-0.5 bg-zinc-500"></div>
                        ) : ('')
                    }

                    {/* CARD */}
                    <div className="w-50 rounded shadow bg-azul-escuro text-white">

                        {/* header */}
                        <div className="flex justify-between text-xs bg-orange-600 px-2 py-1" style={{ textShadow: '1px 1px 2px black' }}>
                            <span>00/00 - 00:00</span>
                            <span className="font-bold">MD3</span>
                        </div>

                        {/* teams */}
                        <div className="flex justify-between px-2 py-1">

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-5 h-5">
                                        <Image src={IMAGEM_TIME_DEFAULT} alt="" fill />
                                    </div>
                                    <span>TBA</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="relative w-5 h-5">
                                        <Image src={IMAGEM_TIME_DEFAULT} alt="" fill />
                                    </div>
                                    <span>TBA</span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between font-bold">
                                <span>0</span>
                                <span>0</span>
                            </div>

                        </div>

                        {/* footer */}
                        <div className="bg-red-600 text-center text-xs py-1">
                            Partida eliminatória
                        </div>

                    </div>
                    {/* LINHA HORIZONTAL FRENTE*/}
                    {
                        linhaHorizontalFrente ? (
                            <div className="w-8 h-0.5 bg-zinc-500"></div>
                        ) : ('')
                    }
                    {/* LINHA VERTICAL */}
                    <div className="relative w-0 h-25">
                        {/* linha para cima */}
                        {
                            verticalCimaFrente ? (
                                <div className={`absolute left-0 bottom-1/2 w-0.5 h-[${tamanhoVerticalCimaFrente}px] bg-zinc-500`}></div>
                            ) : ('')
                        }
                        {/* linha para baixo */}
                        {
                            verticalBaixoFrente ? (
                                <div className={`absolute left-0 top-1/2 w-0.5 h-[${tamanhoVerticalBaixoFrente}px] bg-zinc-500`}></div>
                            ) : ('')
                        }
                    </div>
                </div>
            )
        } else {
            const timeA = getTeamById(partida.timeAId)
            const timeB = getTeamById(partida.timeBId)
            return (
                <Link href={`/paginaPartida/${partida.id}`}>
                    <div className="relative flex items-center">
                        {/* LINHA VERTICAL */}
                        <div className="relative w-0 h-25">
                            {/* linha para cima */}
                            {
                                verticalCimaCostas ? (
                                    <div className={`absolute left-0 bottom-1/2 w-0.5 h-[${tamanhoVerticalCimaCostas}px] bg-zinc-500`}></div>
                                ) : ('')
                            }
                            {/* linha para baixo */}
                            {
                                verticalBaixoCostas ? (
                                    <div className={`absolute left-0 top-1/2 w-0.5 h-[${tamanhoVerticalBaixoCostas}px] bg-zinc-500`}></div>
                                ) : ('')
                            }
                        </div>
                        {/* LINHA HORIZONTAL FRENTE*/}
                        {
                            linhaHorizontalCostas ? (
                                <div className="w-8 h-0.5 bg-zinc-500"></div>
                            ) : ('')
                        }

                        {/* CARD */}
                        <div className="w-50 rounded shadow bg-azul-escuro text-white">
                            {/* header */}
                            <div className="flex justify-between text-xs bg-orange-600 px-2 py-1" style={{ textShadow: '1px 1px 2px black' }}>
                                <span>{formatarData(partida?.data)}</span>
                                <span className="font-bold uppercase">{partida.tipo}</span>
                            </div>

                            {/* teams */}
                            <div className="flex justify-between px-2 py-1">

                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-5 h-5">
                                            <Image src={timeA?.imagem || IMAGEM_TIME_DEFAULT} alt="" fill />
                                        </div>
                                        <span className="capitalize">{partida?.timeAId.replaceAll('-', ' ')}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="relative w-5 h-5">
                                            <Image src={timeB?.imagem || IMAGEM_TIME_DEFAULT} alt="" fill />
                                        </div>
                                        <span className="capitalize">{partida?.timeBId.replaceAll('-', ' ')}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between font-bold">
                                    <span>{partida.placar.timeA}</span>
                                    <span>{partida.placar.timeB}</span>
                                </div>

                            </div>

                            {/* footer */}
                            <div className="bg-red-600 text-center text-xs py-1">
                                Partida eliminatória
                            </div>

                        </div>
                        {/* LINHA HORIZONTAL FRENTE*/}
                        {
                            linhaHorizontalFrente ? (
                                <div className="w-8 h-0.5 bg-zinc-500"></div>
                            ) : ('')
                        }
                        {/* LINHA VERTICAL */}
                        <div className="relative w-0 h-25">
                            {/* linha para cima */}
                            {
                                verticalCimaFrente ? (
                                    <div className={`absolute left-0 bottom-1/2 w-0.5 h-[${tamanhoVerticalCimaFrente}px] bg-zinc-500`}></div>
                                ) : ('')
                            }
                            {/* linha para baixo */}
                            {
                                verticalBaixoFrente ? (
                                    <div className={`absolute left-0 top-1/2 w-0.5 h-[${tamanhoVerticalBaixoFrente}px] bg-zinc-500`}></div>
                                ) : ('')
                            }
                        </div>
                    </div>
                </Link>
            )
        }
    }


    function identificarTipoCampeonato(formato: string, campeonato: Campeonato) {
        switch (formato) {
            case 'gsl-format':
                const partidasQuartasGrupoA = partidasQuartas.filter(partida => partida.grupo === 'a')
                const partidasQuartasGrupoB = partidasQuartas.filter(partida => partida.grupo === 'b')

                const [activeGrupo, setActiveGrupo] = useState<'grupo-a' | 'grupo-b'>('grupo-a')

                const partidasAtivasQuartas = activeGrupo === 'grupo-a'
                    ? partidasQuartasGrupoA
                    : partidasQuartasGrupoB

                const partidasAtivasLower1 = activeGrupo === 'grupo-a' ?
                    partidas.filter(partida => partida.fase === 'lower-1' && partida.grupo === 'a') :
                    partidas.filter(partida => partida.fase === 'lower-1' && partida.grupo === 'b')

                const partidasAtivasSemifinais = activeGrupo === 'grupo-a' ?
                    partidas.filter(partida => partida.fase === 'semifinal' && partida.grupo === 'a') :
                    partidas.filter(partida => partida.fase === 'semifinal' && partida.grupo === 'b')

                const partidasAtivasLower2 = activeGrupo === 'grupo-a' ?
                    partidas.filter(partida => partida.fase === 'lower-2' && partida.grupo === 'a') :
                    partidas.filter(partida => partida.fase === 'lower-2' && partida.grupo === 'b')

                const partidasAtivasFinal = activeGrupo === 'grupo-a' ?
                    partidas.filter(partida => partida.fase === 'final' && partida.grupo === 'a') :
                    partidas.filter(partida => partida.fase === 'final' && partida.grupo === 'b')

                const partidasAtivasLowerFinal = activeGrupo === 'grupo-a' ?
                    partidas.filter(partida => partida.fase === 'lower-final' && partida.grupo === 'a') :
                    partidas.filter(partida => partida.fase === 'lower-final' && partida.grupo === 'b')


                return (
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveGrupo('grupo-a')}
                                className={`px-2 py-1 rounded-md cursor-pointer ${activeGrupo === 'grupo-a' ? 'bg-magenta text-white' : 'bg-azul-escuro text-white'
                                    }`}
                                style={{ textShadow: '1px 1px 2px black' }}
                            >
                                Grupo A
                            </button>

                            <button
                                onClick={() => setActiveGrupo('grupo-b')}
                                className={`px-2 py-1 rounded-md cursor-pointer ${activeGrupo === 'grupo-b' ? 'bg-magenta text-white' : 'bg-azul-escuro text-white'
                                    }`}
                                style={{ textShadow: '1px 1px 2px black' }}
                            >
                                Grupo B
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {/* Upper */}
                            <div className="flex flex-col gap-2 overflow-x-scroll pb-4 2xl:overflow-hidden">
                                <h2 className="font-heading text-2xl uppercase w-fit bg-green-600 px-2 text-white" style={{ textShadow: '1px 1px 2px black' }}>Upper</h2>
                                <div className="flex">
                                    {/* quartas de final */}
                                    {
                                        partidasQuartas.length > 0 ? (
                                            <ul className="flex flex-col gap-10">
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 0, false, 0, true, false, 80, true, 80, partidasAtivasQuartas[0])
                                                    }
                                                </li>
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 0, false, 0, true, true, 80, true, 80, partidasAtivasQuartas[1])
                                                    }
                                                </li>
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 0, false, 0, true, true, 80, true, 80, partidasAtivasQuartas[2])
                                                    }
                                                </li>
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 0, false, 0, true, true, 80, false, 0, partidasAtivasQuartas[3])
                                                    }
                                                </li>
                                            </ul>
                                        ) : (
                                            <ul className="flex flex-col gap-10">
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 0, false, 0, true, false, 80, true, 80)
                                                    }
                                                </li>
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 0, false, 0, true, true, 80, true, 80)
                                                    }
                                                </li>
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 0, false, 0, true, true, 80, true, 80)
                                                    }
                                                </li>
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 0, false, 0, true, true, 80, false, 0)
                                                    }
                                                </li>
                                            </ul>
                                        )
                                    }
                                    {/* semifinal */}
                                    {
                                        partidasSemifinal.length > 0 ? (
                                            <ul className="flex flex-col justify-around gap-10">
                                                <li>
                                                    {
                                                        cardPlayoff(true, false, 0, false, 0, true, false, 0, true, 80, partidasAtivasSemifinais[0])
                                                    }
                                                </li>
                                                <li>
                                                    {
                                                        cardPlayoff(true, false, 0, false, 0, true, true, 80, false, 0, partidasAtivasSemifinais[1])
                                                    }
                                                </li>
                                            </ul>
                                        ) : (
                                            <ul className="flex flex-col justify-around gap-10">
                                                <li>
                                                    {
                                                        cardPlayoff(true, false, 0, false, 0, true, false, 0, true, 80)
                                                    }
                                                </li>
                                                <li>
                                                    {
                                                        cardPlayoff(true, false, 0, false, 0, true, true, 80, false, 0)
                                                    }
                                                </li>
                                            </ul>
                                        )
                                    }
                                    {/* final */}
                                    {
                                        partidaFinal.length > 0 ? (
                                            <ul className="flex flex-col gap-10 justify-center">
                                                <li>
                                                    {
                                                        cardPlayoff(true, true, 80, true, 80, false, false, 0, false, 0, partidasAtivasFinal[0])
                                                    }
                                                </li>
                                            </ul>
                                        ) : (
                                            <ul className="flex flex-col gap-10 justify-center">
                                                <li>
                                                    {
                                                        cardPlayoff(true, true, 80, true, 80, false, false, 0, false, 0)
                                                    }
                                                </li>
                                            </ul>

                                        )
                                    }
                                </div>
                            </div>
                            {/* Lower */}
                            <div className="flex flex-col gap-2 overflow-x-scroll pb-4 2xl:overflow-hidden">
                                {/* round 1 lower */}
                                <h2 className="font-heading text-2xl uppercase w-fit bg-red-600 px-2 text-white " style={{ textShadow: '1px 1px 2px black' }}>Lower</h2>
                                <div className="flex">
                                    {
                                        partidasAtivasLower1.length > 0 ? (
                                            <ul className="flex flex-col justify-around gap-10">
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 0, false, 0, true, false, 0, true, 80, partidasAtivasLower1[0])
                                                    }
                                                </li>
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 0, false, 0, true, true, 80, false, 0, partidasAtivasLower1[1])
                                                    }
                                                </li>
                                            </ul>
                                        ) : (
                                            <ul className="flex flex-col justify-around gap-10">
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 0, false, 0, true, false, 0, true, 80)
                                                    }
                                                </li>
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 0, false, 0, true, true, 80, false, 0)
                                                    }
                                                </li>
                                            </ul>
                                        )
                                    }
                                    {/* round 2 lower */}
                                    {
                                        partidasAtivasLower2.length > 0 ? (
                                            <ul className="flex flex-col justify-around gap-10">
                                                <li>
                                                    {
                                                        cardPlayoff(true, false, 0, false, 0, true, false, 0, true, 80, partidasAtivasLower2[0])
                                                    }
                                                </li>
                                                <li>
                                                    {
                                                        cardPlayoff(true, false, 0, false, 0, true, true, 80, false, 0, partidasAtivasLower2[1])
                                                    }
                                                </li>
                                            </ul>
                                        ) : (
                                            <ul className="flex flex-col justify-around gap-10">
                                                <li>
                                                    {
                                                        cardPlayoff(true, false, 0, false, 0, true, false, 0, true, 80)
                                                    }
                                                </li>
                                                <li>
                                                    {
                                                        cardPlayoff(true, false, 0, false, 0, true, true, 80, false, 0)
                                                    }
                                                </li>
                                            </ul>
                                        )
                                    }
                                    {/* round lower final */}
                                    {/* final */}
                                    {
                                        partidaFinal.length > 0 ? (
                                            <ul className="flex flex-col gap-10 justify-center">
                                                <li>
                                                    {
                                                        cardPlayoff(true, true, 75, true, 75, false, false, 0, false, 0, partidasAtivasLowerFinal[0])
                                                    }
                                                </li>
                                            </ul>
                                        ) : (
                                            <ul className="flex flex-col gap-10 justify-center">
                                                <li>
                                                    {
                                                        cardPlayoff(true, true, 75, true, 75, false, false, 0, false, 0)
                                                    }
                                                </li>
                                            </ul>

                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 'gsl-format-playoff':
                return (
                    <div className={`flex flex-col`}>
                        <div className="flex overflow-x-scroll pb-4 2xl:overflow-hidden">
                            {/* quartas de final */}
                            {
                                partidasQuartas.length > 0 ? (
                                    <ul className="flex flex-col gap-10">
                                        <li>
                                            {
                                                cardPlayoff(false, false, 0, false, 0, true, false, 0, false, 0, partidasQuartas[0])
                                            }
                                        </li>
                                        <li>
                                            {
                                                cardPlayoff(false, false, 0, false, 0, true, false, 0, false, 0, partidasQuartas[1])
                                            }
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="flex flex-col gap-10">
                                        <li>
                                            {
                                                cardPlayoff(false, false, 0, false, 0, true, false, 0, false, 0)
                                            }
                                        </li>
                                        <li>
                                            {
                                                cardPlayoff(false, false, 0, false, 0, true, false, 0, false, 0)
                                            }
                                        </li>
                                    </ul>
                                )
                            }
                            {/* semifinal */}
                            {
                                partidasSemifinal.length > 0 ? (
                                    <ul className="flex flex-col justify-around gap-10">
                                        <li>
                                            {
                                                cardPlayoff(true, false, 0, false, 0, true, false, 0, true, 80, partidasSemifinal[0])
                                            }
                                        </li>
                                        <li>
                                            {
                                                cardPlayoff(true, false, 0, false, 0, true, true, 80, false, 0, partidasSemifinal[1])
                                            }
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="flex flex-col justify-around gap-10">
                                        <li>
                                            {
                                                cardPlayoff(true, false, 0, false, 0, true, false, 0, false, 0)
                                            }
                                        </li>
                                        <li>
                                            {
                                                cardPlayoff(true, false, 0, false, 0, true, true, 60, false, 0)
                                            }
                                        </li>
                                    </ul>
                                )
                            }
                            {/* final */}
                            {
                                partidaFinal.length > 0 ? (
                                    <ul className="flex flex-col gap-10 justify-center">
                                        <li>
                                            {
                                                cardPlayoff(true, true, 80, true, 80, false, false, 0, false, 0, partidaFinal[0])
                                            }
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="flex flex-col gap-10 justify-center">
                                        <li>
                                            {
                                                cardPlayoff(true, true, 80, true, 80, false, false, 0, false, 0)
                                            }
                                        </li>
                                    </ul>

                                )
                            }
                        </div>
                        {/* Terceiro */}
                        {
                            campeonato.terceiroLugar ? (
                                <div className="mt-7 flex flex-col gap-2">
                                    <p className="font-heading text-2xl">Disputa pelo 3º lugar</p>
                                    {
                                        partidaTerceiroLugar.length > 0 ? (
                                            <ul>
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 80, false, 80, false, false, 0, false, 0, partidaTerceiroLugar[0])
                                                    }
                                                </li>
                                            </ul>
                                        ) : (
                                            <ul>
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 80, false, 80, false, false, 0, false, 0)
                                                    }
                                                </li>
                                            </ul>
                                        )
                                    }
                                </div>
                            ) : ('')
                        }
                    </div>
                )
            case 'playoff':
                return (
                    <div className={`flex flex-col`}>
                        <div className="flex overflow-x-scroll pb-4 2xl:overflow-hidden">
                            {/* quartas de final */}
                            {
                                partidasQuartas.length > 0 ? (
                                    <ul className="flex flex-col gap-10">
                                        <li>
                                            {
                                                cardPlayoff(false, false, 0, false, 0, true, false, 80, true, 80, partidasQuartas[0])
                                            }
                                        </li>
                                        <li>
                                            {
                                                cardPlayoff(false, false, 0, false, 0, true, true, 80, true, 80, partidasQuartas[1])
                                            }
                                        </li>
                                        <li>
                                            {
                                                cardPlayoff(false, false, 0, false, 0, true, true, 80, true, 80, partidasQuartas[2])
                                            }
                                        </li>
                                        <li>
                                            {
                                                cardPlayoff(false, false, 0, false, 0, true, true, 80, false, 0, partidasQuartas[3])
                                            }
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="flex flex-col gap-10">
                                        <li>
                                            {
                                                cardPlayoff(false, false, 0, false, 0, true, false, 80, true, 80)
                                            }
                                        </li>
                                        <li>
                                            {
                                                cardPlayoff(false, false, 0, false, 0, true, true, 80, true, 80)
                                            }
                                        </li>
                                        <li>
                                            {
                                                cardPlayoff(false, false, 0, false, 0, true, true, 80, true, 80)
                                            }
                                        </li>
                                        <li>
                                            {
                                                cardPlayoff(false, false, 0, false, 0, true, true, 80, false, 0)
                                            }
                                        </li>
                                    </ul>
                                )
                            }
                            {/* semifinal */}
                            {
                                partidasSemifinal.length > 0 ? (
                                    <ul className="flex flex-col justify-around gap-10">
                                        <li>
                                            {
                                                cardPlayoff(true, false, 0, false, 0, true, false, 0, true, 80, partidasSemifinal[0])
                                            }
                                        </li>
                                        <li>
                                            {
                                                cardPlayoff(true, false, 0, false, 0, true, true, 80, false, 0, partidasSemifinal[1])
                                            }
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="flex flex-col justify-around gap-10">
                                        <li>
                                            {
                                                cardPlayoff(true, false, 0, false, 0, true, false, 0, true, 80)
                                            }
                                        </li>
                                        <li>
                                            {
                                                cardPlayoff(true, false, 0, false, 0, true, true, 80, false, 0)
                                            }
                                        </li>
                                    </ul>
                                )
                            }
                            {/* final */}
                            {
                                partidaFinal.length > 0 ? (
                                    <ul className="flex flex-col gap-10 justify-center">
                                        <li>
                                            {
                                                cardPlayoff(true, true, 80, true, 80, false, false, 0, false, 0, partidaFinal[0])
                                            }
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="flex flex-col gap-10 justify-center">
                                        <li>
                                            {
                                                cardPlayoff(true, true, 80, true, 80, false, false, 0, false, 0)
                                            }
                                        </li>
                                    </ul>

                                )
                            }
                        </div>
                        {/* Terceiro */}
                        {
                            campeonato.terceiroLugar ? (
                                <div className="mt-7 flex flex-col gap-2">
                                    <p className="font-heading text-2xl">Disputa pelo 3º lugar</p>
                                    {
                                        partidaTerceiroLugar.length > 0 ? (
                                            <ul>
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 80, false, 80, false, false, 0, false, 0, partidaTerceiroLugar[0])
                                                    }
                                                </li>
                                            </ul>
                                        ) : (
                                            <ul>
                                                <li>
                                                    {
                                                        cardPlayoff(false, false, 80, false, 80, false, false, 0, false, 0)
                                                    }
                                                </li>
                                            </ul>
                                        )
                                    }
                                </div>
                            ) : ('')
                        }
                    </div>
                )
            case 'suico':
                return (
                    <div className={`flex flex-col max-w-150`}>
                        <table className="flex flex-col">
                            <thead>
                                <tr className="grid grid-cols-[20px_1fr_20px_20px_20px_20px_20px] gap-2 xl:grid-cols-[30px_1fr_30px_30px_30px_30px_30px] xl:text-xl">
                                    <th className="flex justify-center items-center p-1">#</th>
                                    <th className="flex justify-center items-center p-1">Equipes</th>
                                    <th className="flex justify-center items-center p-1">P</th>
                                    <th className="flex justify-center items-center p-1">J</th>
                                    <th className="flex justify-center items-center p-1">D</th>
                                    <th className="flex justify-center items-center p-1">SM</th>
                                    <th className="flex justify-center items-center p-1">SR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tabela.map((linha, i) => {
                                        const time = getTeamById(linha.timeId)
                                        return (
                                            <tr key={linha.timeId} className={`grid grid-cols-[20px_1fr_20px_20px_20px_20px_25px] gap-2 xl:grid-cols-[30px_1fr_30px_30px_30px_30px_30px] pr-1 ${i % 2 == 0 ? 'bg-zinc-500 text-white' : ''}`}>
                                                <td className={`flex justify-center items-center truncate border-l-2 ${i < 8 ? 'border-green-500' : 'border-red-500'} xl:text-xl xl:p-2`}>{i + 1}</td>
                                                <td className="p-1 gap-1 flex items-center max-w-30 sm:max-w-full xl:text-xl xl:p-2">
                                                    <div className="relative w-5 h-5">
                                                        <Image alt={`${time?.nome}`} src={time?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                    </div>
                                                    <p className="truncate line-clamp-1">
                                                        {time?.nome}
                                                    </p>
                                                </td>
                                                <td className="p-1 flex justify-center items-center truncate xl:text-xl xl:p-2">{linha.pontos}</td>
                                                <td className="p-1 flex justify-center items-center truncate xl:text-xl xl:p-2">{linha.jogos}</td>
                                                <td className="p-1 flex justify-center items-center truncate xl:text-xl xl:p-2">{linha.derrotas}</td>
                                                <td className="p-1 flex justify-center items-center truncate xl:text-xl xl:p-2">{linha.saldoMapas}</td>
                                                <td className="p-1 flex justify-center items-center truncate xl:text-xl xl:p-2">{linha.saldoRounds}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <div className="mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <p>1º a 8º - Classificados aos playoffs</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <p>9º a 16º - Eliminados</p>
                            </div>
                        </div>
                    </div>
                )
            default:
                break;
        }
    }

    return (
        <div className={`flex flex-col gap-3 w-full ${campeonato.formato === 'gsl-format' || campeonato.formato === 'playoff' ? 'col-start-1 col-end-3': '2xl:col-start-1 2xl:col-end-2'}`}>
            <h3 className="font-heading text-3xl">Tabela Do Campeonato</h3>
            {
                campeonato?.formato && identificarTipoCampeonato(campeonato?.formato, campeonato)
            }
        </div>
    )
}