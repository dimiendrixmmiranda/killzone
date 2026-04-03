'use client'

import { Jogador } from "@/src/domain/Jogador";
import { Dialog } from "primereact/dialog";
import Image from "next/image";
import { Time } from "../../domain/Time";
import { Noticia } from "../../domain/Noticia";
import { sinergiaParaEstrelas } from "../../utils/sinergia";
import { IoIosStar } from "react-icons/io";

import {
    FaGamepad,
    FaTrophy,
    FaSkullCrossbones,
    FaMedal,
    FaCrown,
    FaChartLine,
    FaChartArea,
    FaBolt,
    FaBalanceScale,
    FaUsers,
    FaCrosshairs,
    FaSkull,
    FaHandRock,
    FaUser,
    FaFlag,
    FaCircle,
    FaStar,
    FaChess,
    FaExchangeAlt,
    FaCog,
} from "react-icons/fa";
import { TbStarsFilled } from "react-icons/tb";
import { FaChartBar, FaNewspaper } from "react-icons/fa6";
import { useState } from "react";
import HistoricoDeTimes from "../dadosJogador/HistóricoDeTimes";
import EstatisticasGerais from "../dadosJogador/EstatisticasGerais";
import HistoricoDeConquistas from "../dadosJogador/HistoricoDeConquistas";
import NoticiasJogador from "../dadosJogador/NoticiasJogador";
import Partidas from "../dadosJogador/Partidas";
import Configuracoes from "../dadosJogador/Configuracoes";
import { getTeamById } from "@/src/services/team.service";
import { IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens";



interface Props {
    jogador: Jogador;
    aberto: boolean;
    times: Time[]
    noticiasJogador: Noticia[]
    onFechar: () => void;
}
type DadoAtivo =
    | 'historico-de-times'
    | 'estatisticas-gerais'
    | 'historico-de-conquistas'
    | 'noticias'
    | 'partidas'
    | 'configuracoes';

export default function DialogJogador({ jogador, aberto, times, noticiasJogador, onFechar }: Props) {
    const [dadoAtivo, setDadoAtivo] = useState<DadoAtivo>('historico-de-times')
    const [tooltipAberto, setTooltipAberto] = useState<number | null>(null)

    const definirNomeCabecalho = (jogador: Jogador) => {
        return `${jogador.nome.split(' ')[0]} "${jogador.apelido}" ${jogador.nome.split(' ').at(-1)}`
    }

    const definirQuantidadeDeEstrelas = (numero: number) => {
        switch (numero) {
            case 1:
                return (
                    <>
                        <IoIosStar />
                    </>
                )
            case 2:
                return (
                    <>
                        <IoIosStar />
                        <IoIosStar />
                    </>
                )
            case 3:
                return (
                    <>
                        <IoIosStar />
                        <IoIosStar />
                        <IoIosStar />
                    </>
                )
            case 4:
                return (
                    <>
                        <IoIosStar />
                        <IoIosStar />
                        <IoIosStar />
                        <IoIosStar />
                    </>
                )
            case 5:
                return (
                    <>
                        <IoIosStar />
                        <IoIosStar />
                        <IoIosStar />
                        <IoIosStar />
                        <IoIosStar />
                    </>
                )

            default:
                break;
        }
    }

    function identificarComponenteDado(valor: string) {
        switch (valor) {
            case 'historico-de-times':
                return (
                    <HistoricoDeTimes jogador={jogador} times={times} />
                )
            case 'estatisticas-gerais':
                return (
                    <EstatisticasGerais jogador={jogador} />
                )
            case 'historico-de-conquistas':
                return (
                    <HistoricoDeConquistas jogador={jogador} times={times} />
                )
            case 'noticias':
                return (
                    <NoticiasJogador noticiasJogador={noticiasJogador} />
                )
            case 'partidas':
                return (
                    <Partidas jogador={jogador} />
                )
            case 'configuracoes':
                return (
                    <Configuracoes jogador={jogador} />
                )

            default:
                break;
        }
    }

    function renderizarForma(estiloContainer: string) {
        return (
            <div className={estiloContainer}>
                {jogador.forma?.map((forma, i) => {
                    const aberto = tooltipAberto === i
                    const adversario = getTeamById(forma.adversarioId)

                    return (
                        <div
                            key={i}
                            className="relative group"
                            onMouseEnter={() => setTooltipAberto(i)}
                            onMouseLeave={() => setTooltipAberto(null)}
                            onClick={() => setTooltipAberto(aberto ? null : i)}
                        >

                            {/* circulo */}
                            <div
                                className={`
                                        ${forma.resultado === 'V' ? 'bg-green-700' : ''}
                                        ${forma.resultado === 'D' ? 'bg-red-600' : ''}
                                        w-7 h-7 flex justify-center items-center justify-self-center
                                        rounded-full font-bold cursor-pointer
                                    `}
                            >
                                {forma.resultado}
                            </div>

                            {/* tooltip */}
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
                                    {forma.campeonatoId.replaceAll('-', ' ')}
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
        )
    }

    return (
        <Dialog
            header={definirNomeCabecalho(jogador)}
            visible={aberto}
            onHide={onFechar}
            style={{ width: '90vw', maxWidth: '800px' }}
            className="dialog-jogador"
        >
            <div className="flex flex-col gap-4">
                <div className="relative md:flex">
                    <div className="relative w-64 h-72 mx-auto">
                        <Image
                            src={jogador.imagem}
                            alt={jogador.nome}
                            fill
                            className="object-cover"
                        />
                    </div>
                    {
                        renderizarForma('hidden md:flex md:flex-col md:gap-4 md:absolute md:top-[20%] md:left-[70%]')
                    }
                    <div className="absolute top-0 right-0">
                        <h4 className="font-bold text-3xl">{jogador.sinergia}</h4>
                    </div>
                </div>
                {
                    renderizarForma('grid grid-cols-5 gap-1 max-w-[300px] w-full mx-auto md:hidden')
                }
                <ul className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-x-12">
                    <li className="flex items-center gap-3">
                        <FaUser className="text-blue-500" />
                        <span className="flex-1">Nome</span>
                        <strong>{jogador.nome}</strong>
                    </li>

                    <li className="flex items-center gap-3">
                        <FaFlag className="text-green-500" />
                        <span className="flex-1">País</span>
                        <strong>{jogador.pais}</strong>
                    </li>

                    <li className="flex items-center gap-3">
                        <FaChess className="text-orange-600" />
                        <span className="flex-1">Função</span>
                        <strong className="uppercase">
                            {jogador.papel}
                        </strong>
                        <span>/</span>
                        <strong className="capitalize">
                            {jogador.estilo}
                        </strong>
                    </li>

                    <li className="flex items-center gap-3">
                        <FaCircle
                            className={
                                jogador.status === "ativo"
                                    ? "text-green-500"
                                    : "text-zinc-400"
                            }
                        />
                        <span className="flex-1">Status</span>
                        <strong className="capitalize">{jogador.status}</strong>
                    </li>

                    <li className="flex items-center gap-3">
                        <TbStarsFilled className="text-red-500" />
                        <span className="flex-1">Sinergia</span>
                        <div className="flex items-center gap-2">
                            <p>{jogador.sinergia}</p>
                            <div className="flex items-center">
                                {definirQuantidadeDeEstrelas(
                                    sinergiaParaEstrelas(jogador.sinergia)
                                )}
                            </div>
                        </div>
                    </li>
                    <li className="flex items-center gap-3">
                        <FaCrosshairs className="text-orange-400" />
                        <span className="flex-1">ADR</span>
                        {/* <strong>{calcularAdr(jogador)}</strong> */}
                    </li>

                    <li className="flex items-center gap-3">
                        <FaSkull className="text-red-500" />
                        <span className="flex-1">K/D</span>
                        {/* <strong>{calcularKd(jogador)}</strong> */}
                    </li>

                    <li className="flex items-center gap-3">
                        <FaGamepad className="text-blue-400" />
                        <span className="flex-1">Partidas</span>
                        {/* <strong>{jogador.estatisticasCombate.partidas}</strong> */}
                    </li>

                    <li className="flex items-center gap-3">
                        <FaStar className="text-yellow-400" />
                        <span className="flex-1">Win Rate</span>
                        {/* <strong>{calcularWinrate(jogador)}</strong> */}
                    </li>

                    <li className="flex items-center gap-3">
                        <FaHandRock className="text-purple-400" />
                        <span className="flex-1">Clutch Rate</span>
                        {/* <strong>{(calcularClutchRate(jogador) * 100).toFixed(2)}%</strong> */}
                    </li>
                </ul>

                <ul className="grid grid-cols-6 gap-2">
                    <li className={`flex justify-center items-center p-2 transition-all duration-300 ${dadoAtivo === 'historico-de-times' ? 'text-magenta border-b border-b-magenta' : ''}`}>
                        <button onClick={() => setDadoAtivo('historico-de-times')} className="text-xl cursor-pointer"><FaExchangeAlt /></button>
                    </li>
                    <li className={`flex justify-center items-center p-2 transition-all duration-300 ${dadoAtivo === 'estatisticas-gerais' ? 'text-magenta border-b border-b-magenta' : ''}`}>
                        <button onClick={() => setDadoAtivo('estatisticas-gerais')} className="text-xl cursor-pointer"><FaChartBar /></button>
                    </li>
                    <li className={`flex justify-center items-center p-2 transition-all duration-300 ${dadoAtivo === 'historico-de-conquistas' ? 'text-magenta border-b border-b-magenta' : ''}`}>
                        <button onClick={() => setDadoAtivo('historico-de-conquistas')} className="text-xl cursor-pointer"><FaTrophy /></button>
                    </li>
                    <li className={`flex justify-center items-center p-2 transition-all duration-300 ${dadoAtivo === 'noticias' ? 'text-magenta border-b border-b-magenta' : ''}`}>
                        <button onClick={() => setDadoAtivo('noticias')} className="text-xl cursor-pointer"><FaNewspaper /></button>
                    </li>
                    <li className={`flex justify-center items-center p-2 transition-all duration-300 ${dadoAtivo === 'partidas' ? 'text-magenta border-b border-b-magenta' : ''}`}>
                        <button onClick={() => setDadoAtivo('partidas')} className="text-xl cursor-pointer"><FaGamepad /></button>
                    </li>
                    <li className={`flex justify-center items-center p-2 transition-all duration-300 ${dadoAtivo === 'configuracoes' ? 'text-magenta border-b border-b-magenta' : ''}`}>
                        <button onClick={() => setDadoAtivo('configuracoes')} className="text-xl cursor-pointer"><FaCog /></button>
                    </li>
                </ul>

                <>
                    {identificarComponenteDado(dadoAtivo)}
                </>
            </div>
        </Dialog>
    )
}
