'use client'
import { IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens";
import { Campeonato } from "@/src/domain/Campeonato";
import { Time } from "@/src/domain/Time";
import { getCampeonatoById, getClassificacaoDobleEliminationPlayoff, getClassificacaoDoubleElimination, getClassificacaoFinalSuica, getClassificacaoPlayoffs } from "@/src/services/campeonato.service";
import { getTeamById } from "@/src/services/team.service";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
interface ClassificacaoFinalProps {
    idCampeonato: string
}

interface Resultado {
    partidas: number
    encerrouParticipacao: boolean
    resultadoSuica: string
    timeId: string
    posicao: number
}

export default function ClassificacaoFinal({ idCampeonato }: ClassificacaoFinalProps) {
    const [campeonatos, setCampeonatos] = useState<any[]>([])
    const [campeonatoAtual, setCampeonatoAtual] = useState<Campeonato | null>(null)
    const [classificacao, setClassificacao] = useState<Resultado[]>([])

    useEffect(() => {
        async function fetchCampeonatos() {
            const res = await fetch("/api/campeonatos")
            const data = await res.json()
            setCampeonatos(data)
        }

        fetchCampeonatos()
    }, [])

    useEffect(() => {
        const campeonato = campeonatos.filter(camp => camp.slugId === idCampeonato)
        if (campeonato) setCampeonatoAtual(campeonato[0])
    }, [idCampeonato, campeonatos])

    useEffect(() => {
        switch (campeonatoAtual?.formato) {
            case 'suico':
                return (
                    setClassificacao(getClassificacaoFinalSuica(campeonatoAtual!))
                )
            case 'playoff':
                return (
                    setClassificacao(getClassificacaoPlayoffs(campeonatoAtual!))
                )
            case 'gsl-format':
                return (
                    setClassificacao(getClassificacaoDoubleElimination(campeonatoAtual))
                )
            // case 'gsl-format-playoff':
            //     return (
            //         setClassificacao(getClassificacaoDobleEliminationPlayoff(idCampeonato))
            //     )

            default:
                break;
        }
    }, [campeonatos, idCampeonato])

    console.log(classificacao)

    return (
        <div className="bg-zinc-900 p-6 text-white flex flex-col gap-4 justify-center items-center mt-4">
            <h3 className="font-heading text-3xl self-start">Classificação Final</h3>
            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-2 md:grid md:grid-cols-12">
                    {
                        classificacao.map((timeClassificacao, i) => {
                            const time: Time | undefined = getTeamById(timeClassificacao.timeId)
                            let posicaoGrid = ''

                            switch (timeClassificacao.resultadoSuica) {
                                case '-':
                                    posicaoGrid = 'md:col-span-3'
                                    break;
                                case '1º':
                                    posicaoGrid = 'col-start-1 col-end-13'
                                    break;
                                case '2º':
                                    posicaoGrid = 'col-start-1 col-end-5'
                                    break;
                                case '3º':
                                    posicaoGrid = 'col-start-5 col-end-9'
                                    break;
                                case '4º':
                                    posicaoGrid = 'col-start-9 col-end-13'
                                    break;
                                case '5º/8º': {
                                    const primeiros = classificacao.filter(t => t.resultadoSuica === '5º/8º')
                                    const indexDentroDoGrupo = primeiros.findIndex(t => t.timeId === timeClassificacao.timeId)

                                    if (indexDentroDoGrupo === 0) {
                                        posicaoGrid = 'md:col-start-1 md:col-end-4'
                                    } else if (indexDentroDoGrupo === 1) {
                                        posicaoGrid = 'md:col-start-4 md:col-end-7'
                                    } else if (indexDentroDoGrupo === 2) {
                                        posicaoGrid = 'md:col-start-7 md:col-end-10'
                                    } else if (indexDentroDoGrupo === 3) {
                                        posicaoGrid = 'md:col-start-10 md:col-end-13'
                                    }
                                    break;
                                }
                                case '3-0': {
                                    const primeiros = classificacao.filter(t => t.resultadoSuica === '3-0')
                                    const indexDentroDoGrupo = primeiros.findIndex(t => t.timeId === timeClassificacao.timeId)

                                    if (indexDentroDoGrupo === 0) {
                                        posicaoGrid = 'md:col-start-1 md:col-end-7'
                                    } else if (indexDentroDoGrupo === 1) {
                                        posicaoGrid = 'md:col-start-7 md:col-end-13'
                                    }
                                    break;
                                }
                                case '3-1': {
                                    const primeiros = classificacao.filter(t => t.resultadoSuica === '3-1')
                                    const indexDentroDoGrupo = primeiros.findIndex(t => t.timeId === timeClassificacao.timeId)

                                    if (indexDentroDoGrupo === 0) {
                                        posicaoGrid = 'md:col-start-1 md:col-end-5'
                                    } else if (indexDentroDoGrupo === 1) {
                                        posicaoGrid = 'md:col-start-5 md:col-end-9'
                                    } else if (indexDentroDoGrupo === 2) {
                                        posicaoGrid = 'md:col-start-9 md:col-end-13'
                                    }
                                    break;
                                }
                                case '3-2': {
                                    const primeiros = classificacao.filter(t => t.resultadoSuica === '3-2')
                                    const indexDentroDoGrupo = primeiros.findIndex(t => t.timeId === timeClassificacao.timeId)

                                    if (indexDentroDoGrupo === 0) {
                                        posicaoGrid = 'md:col-start-1 md:col-end-5'
                                    } else if (indexDentroDoGrupo === 1) {
                                        posicaoGrid = 'md:col-start-5 md:col-end-9'
                                    } else if (indexDentroDoGrupo === 2) {
                                        posicaoGrid = 'md:col-start-9 md:col-end-13'
                                    }
                                    break;
                                }
                                case '2-3': {
                                    const primeiros = classificacao.filter(t => t.resultadoSuica === '2-3')
                                    const indexDentroDoGrupo = primeiros.findIndex(t => t.timeId === timeClassificacao.timeId)

                                    if (indexDentroDoGrupo === 0) {
                                        posicaoGrid = 'md:col-start-1 md:col-end-5'
                                    } else if (indexDentroDoGrupo === 1) {
                                        posicaoGrid = 'md:col-start-5 md:col-end-9'
                                    } else if (indexDentroDoGrupo === 2) {
                                        posicaoGrid = 'md:col-start-9 md:col-end-13'
                                    }
                                    break;
                                }
                                case '1-3': {
                                    const primeiros = classificacao.filter(t => t.resultadoSuica === '1-3')
                                    const indexDentroDoGrupo = primeiros.findIndex(t => t.timeId === timeClassificacao.timeId)

                                    if (indexDentroDoGrupo === 0) {
                                        posicaoGrid = 'md:col-start-1 md:col-end-5'
                                    } else if (indexDentroDoGrupo === 1) {
                                        posicaoGrid = 'md:col-start-5 md:col-end-9'
                                    } else if (indexDentroDoGrupo === 2) {
                                        posicaoGrid = 'md:col-start-9 md:col-end-13'
                                    }
                                    break;
                                }
                                case '0-3': {
                                    const primeiros = classificacao.filter(t => t.resultadoSuica === '0-3')
                                    const indexDentroDoGrupo = primeiros.findIndex(t => t.timeId === timeClassificacao.timeId)

                                    if (indexDentroDoGrupo === 0) {
                                        posicaoGrid = 'md:col-start-1 md:col-end-7'
                                    } else if (indexDentroDoGrupo === 1) {
                                        posicaoGrid = 'md:col-start-7 md:col-end-13'
                                    }
                                    break;
                                }
                                case '1º/2º': {
                                    const primeiros = classificacao.filter(t => t.resultadoSuica === '1º/2º')

                                    const indexDentroDoGrupo = primeiros.findIndex(t => t.timeId === timeClassificacao.timeId)

                                    if (indexDentroDoGrupo === 0) {
                                        posicaoGrid = 'lg:col-start-1 lg:col-end-3'
                                    } else if (indexDentroDoGrupo === 1) {
                                        posicaoGrid = 'lg:col-start-3 lg:col-end-5'
                                    }
                                    break;
                                }
                                case '3º/4º':
                                    {
                                        const primeiros = classificacao.filter(t => t.resultadoSuica === '3º/4º')

                                        const indexDentroDoGrupo = primeiros.findIndex(t => t.timeId === timeClassificacao.timeId)

                                        if (indexDentroDoGrupo === 0) {
                                            posicaoGrid = 'lg:col-start-1 lg:col-end-3'
                                        } else if (indexDentroDoGrupo === 1) {
                                            posicaoGrid = 'lg:col-start-3 lg:col-end-5'
                                        }
                                        break;
                                    }
                                case '13º/16º':
                                    {
                                        const primeiros = classificacao.filter(t => t.resultadoSuica === '13º/16º')
                                        console.log(primeiros)
                                        const indexDentroDoGrupo = primeiros.findIndex(t => t.timeId === timeClassificacao.timeId)

                                        if (indexDentroDoGrupo === 0) {
                                            posicaoGrid = 'md:col-span-3'
                                        } else if (indexDentroDoGrupo === 1) {
                                            posicaoGrid = 'md:col-span-3'
                                        } else if (indexDentroDoGrupo === 2) {
                                            posicaoGrid = 'md:col-span-3'
                                        } else if (indexDentroDoGrupo === 3) {
                                            posicaoGrid = 'md:col-span-3'
                                        }
                                        break;
                                    }
                                case '9º/12º':
                                    {
                                        const primeiros = classificacao.filter(t => t.resultadoSuica === '9º/12º')
                                        console.log(primeiros)
                                        const indexDentroDoGrupo = primeiros.findIndex(t => t.timeId === timeClassificacao.timeId)

                                        if (indexDentroDoGrupo === 0) {
                                            posicaoGrid = 'md:col-span-3'
                                        } else if (indexDentroDoGrupo === 1) {
                                            posicaoGrid = 'md:col-span-3'
                                        } else if (indexDentroDoGrupo === 2) {
                                            posicaoGrid = 'md:col-span-3'
                                        } else if (indexDentroDoGrupo === 3) {
                                            posicaoGrid = 'md:col-span-3'
                                        }
                                        break;
                                    }
                                default:
                                    break;
                            }
                            console.log(timeClassificacao)
                            console.log(i)
                            return (
                                <div key={i} className={`${posicaoGrid}`} style={{ textShadow: '1px 1px 2px black' }}>
                                    {
                                        timeClassificacao.resultadoSuica === '-' || timeClassificacao.resultadoSuica === '' || timeClassificacao.encerrouParticipacao === false ? (
                                            <div className={`bg-zinc-800 text-white p-2 flex flex-col justify-center items-center justify-self-center rounded-xl opacity-70 w-full h-full`}>
                                                <span>{i + 1}º</span>
                                                <div className="relative w-22 h-22">
                                                    <Image
                                                        alt="imagem"
                                                        src={IMAGEM_TIME_DEFAULT}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <p className="text-lg font-bold">
                                                    TBD
                                                </p>
                                                <span className="text-xs">
                                                    —
                                                </span>
                                            </div>
                                        ) : (
                                            <div
                                                className={`
                                                    text-white p-4 flex flex-col
                                                    justify-center items-center justify-self-center
                                                    rounded-xl
                                                    relative
                                                    w-full h-full
                                                    bg-zinc-700
                                                    ${campeonatoAtual?.formato === 'suico' && i < 8 && timeClassificacao.encerrouParticipacao ? 'bg-green-600!' : ''}
                                                    ${campeonatoAtual?.formato === 'suico' && i >= 8 && timeClassificacao.encerrouParticipacao ? 'bg-red-600!' : ''}
                                                    ${campeonatoAtual?.formato === 'gsl-format' && i >= 6 && timeClassificacao.encerrouParticipacao ? 'bg-red-600!' : ''}
                                                `}
                                            >
                                                <div className="flex flex-col justify-center items-center gap-1 xl:flex-row xl:w-full">
                                                    {/* logo */}
                                                    <div className="relative w-22 h-22">
                                                        <Image
                                                            alt={`Logo ${time?.nome}`}
                                                            src={time?.imagem || IMAGEM_TIME_DEFAULT}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    {/* nome */}
                                                    <p className="font-bold capitalize text-center leading-tight md:my-auto xl:text-2xl">
                                                        {time?.nome.replaceAll('-', ' ')}
                                                    </p>
                                                </div>
                                                <span className="text-sm font-semibold md:text-lg">
                                                    {timeClassificacao.resultadoSuica}
                                                </span>
                                                <span className="text-[10px] text-emerald-400 font-semibold mt-1">
                                                    R$1000
                                                </span>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div >
    )
}