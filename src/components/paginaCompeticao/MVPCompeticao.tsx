import { IMAGEM_JOGADOR_DEFAULT } from "@/src/assets/imagens";
import { EstatisticaJogadorAcumulado } from "@/src/domain/EstatisticasDoJogadorAcumulado";
import { Jogador } from "@/src/domain/Jogador";
import { getCampeonatoById, getClassificacaoFinalSuica, getClassificacaoPlayoffs, getEstatisticasJogadoresCampeonato, getSituacaoCampeonato } from "@/src/services/campeonato.service";
import { getPartidasByCampeonato } from "@/src/services/partidas.service";
import { getPlayerById } from "@/src/services/player.service";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaHandsHelping } from "react-icons/fa";
import { FaArrowDown, FaBolt, FaCrosshairs, FaFire, FaMap, FaSkull, FaTrophy } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";
import { Dialog } from 'primereact/dialog';
import { Campeonato } from "@/src/domain/Campeonato";

interface MVPCompeticaoProps {
    campeonato: Campeonato
}

export default function MVPCompeticao({ campeonato }: MVPCompeticaoProps) {
    const [dadosJogadorMvp, setDadosJogadorMvp] = useState<EstatisticaJogadorAcumulado | null>(null)
    const partidas = getPartidasByCampeonato(campeonato.id)
    const estatisticas = getEstatisticasJogadoresCampeonato(partidas)
    const [estatisticasDoTimeGanhador, setEstatisticasDoTimeGanhador] = useState<null | EstatisticaJogadorAcumulado[]>(null)
    const [visible, setVisible] = useState(false);
    
    if(!campeonato) return null

    const situacao = getSituacaoCampeonato(
        campeonato?.inicio,
        campeonato?.fim
    )

    useEffect(() => {
        const ranking = campeonato.formato === 'playoff' ? getClassificacaoPlayoffs(campeonato.id) : getClassificacaoFinalSuica(campeonato)
        
        const campeao = ranking[0]

        if (!campeao) return

        const jogadores = estatisticas
            .filter(j => j.timeId === campeao.timeId)
            .sort((a, b) => b.rating - a.rating)

        setEstatisticasDoTimeGanhador(jogadores)

    }, [campeonato])

    useEffect(() => {
        if (!estatisticasDoTimeGanhador?.length) return

        setDadosJogadorMvp(estatisticasDoTimeGanhador[0])

    }, [estatisticasDoTimeGanhador])
    useEffect(() => {
        if (!estatisticasDoTimeGanhador?.length) return

        setDadosJogadorMvp(estatisticasDoTimeGanhador[0])

    }, [estatisticasDoTimeGanhador])


    if (situacao === "ocorrendo") {
        return (
            <div className="flex flex-col justify-center items-center">
                <h2 className="font-heading text-3xl">MVP da Competição</h2>
                <div className="relative w-80 h-96">
                    <Image alt={`MVP Indisponível`} src={IMAGEM_JOGADOR_DEFAULT} fill className="object-cover" />
                </div>
                <h3 className="text-lg font-bold">MVP Indisponível</h3>
            </div>
        )
    }
    if (dadosJogadorMvp === null) {
        return (
            <div className="flex flex-col justify-center items-center">
                <h2 className="font-heading text-3xl">MVP da Competição</h2>
                <div className="relative w-80 h-96">
                    <Image alt={`MVP Indisponível`} src={IMAGEM_JOGADOR_DEFAULT} fill className="object-cover" />
                </div>
                <h3 className="text-lg font-bold">MVP Indisponível</h3>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 justify-center items-center w-full md:col-start-1 md:col-end-3 lg:col-start-3 lg:col-end-4 xl:col-start-3 xl:col-end-4">
            <h2 className="font-heading text-3xl">MVP da Competição</h2>
            <div className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 md:mx-auto lg:grid-cols-1">
                <div className="relative flex flex-col gap-2 mx-auto xl:col-start-1 xl:col-end-3">
                    <div className="relative w-72 h-80">
                        {
                            dadosJogadorMvp ? (
                                <Image alt={`${dadosJogadorMvp?.jogadorId}`} src={getPlayerById(dadosJogadorMvp?.jogadorId)?.imagem || IMAGEM_JOGADOR_DEFAULT} fill className="object-cover" unoptimized />
                            ) : ''
                        }
                    </div>
                    <h4 className="text-center font-bold text-xl">{dadosJogadorMvp?.jogadorId}</h4>
                    <button onClick={() => setVisible(true)} className="w-6 h-6 rounded-full justify-center items-center bg-azul-escuro text-white cursor-pointer absolute top-0 right-0 hidden lg:flex">
                        <IoIosInformationCircle />
                    </button>
                </div>
                <div className="flex flex-col bg-azul-escuro p-2 lg:hidden xl:hidden">
                    <ul className="space-y-2">
                        <li className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <FaMap />
                                <p>Mapas Jogados</p>
                            </div>
                            <span className="text-white">{dadosJogadorMvp.mapasJogados}</span>
                        </li>

                        <li className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <FaCrosshairs />
                                <p>Rounds Jogados</p>
                            </div>
                            <span className="text-white">{0}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-green-600">
                                <FaFire />
                                <p>Kills</p>
                            </div>
                            <span className="text-white">{dadosJogadorMvp.kills}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-600">
                                <FaSkull />
                                <p>Mortes</p>
                            </div>
                            <span className="text-white">{dadosJogadorMvp.deaths}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-blue-600">
                                <FaHandsHelping />
                                <p>Assistências</p>
                            </div>
                            <span className="text-white">{dadosJogadorMvp.assists}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-yellow-500">
                                <FaBolt />
                                <p>First Kills</p>
                            </div>
                            <span className="text-white">{0}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-orange-500">
                                <FaArrowDown />
                                <p>First Deaths</p>
                            </div>
                            <span className="text-white">{0}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-yellow-600">
                                <FaTrophy />
                                <p>Clutches Vencidos</p>
                            </div>
                            <span className="text-white">{0}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-purple-600">
                                <FaFire />
                                <p>KD (Kills / Deaths)</p>
                            </div>
                            <span className="text-white">{(dadosJogadorMvp.kills / dadosJogadorMvp.deaths).toFixed(2)}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-500">
                                <FaCrosshairs />
                                <p>ADR Médio</p>
                            </div>
                            <span className="text-white">{dadosJogadorMvp.adr}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-500">
                                <FaCrosshairs />
                                <p>Traded</p>
                            </div>
                            <span className="text-white">{dadosJogadorMvp.adr}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <Dialog header={
                <h2>Estatisticas do Jogador "{dadosJogadorMvp.jogadorId}"</h2>
            } visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                <div className="flex flex-col p-2">
                    <ul className="space-y-2">
                        <li className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <FaMap />
                                <p>Mapas Jogados</p>
                            </div>
                            <span className="text-white">{dadosJogadorMvp.mapasJogados}</span>
                        </li>

                        <li className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <FaCrosshairs />
                                <p>Rounds Jogados</p>
                            </div>
                            <span className="text-white">{0}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-green-600">
                                <FaFire />
                                <p>Kills</p>
                            </div>
                            <span className="text-white">{dadosJogadorMvp.kills}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-600">
                                <FaSkull />
                                <p>Mortes</p>
                            </div>
                            <span className="text-white">{dadosJogadorMvp.deaths}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-blue-600">
                                <FaHandsHelping />
                                <p>Assistências</p>
                            </div>
                            <span className="text-white">{dadosJogadorMvp.assists}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-yellow-500">
                                <FaBolt />
                                <p>First Kills</p>
                            </div>
                            <span className="text-white">{0}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-orange-500">
                                <FaArrowDown />
                                <p>First Deaths</p>
                            </div>
                            <span className="text-white">{0}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-yellow-600">
                                <FaTrophy />
                                <p>Clutches Vencidos</p>
                            </div>
                            <span className="text-white">{0}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-purple-600">
                                <FaFire />
                                <p>KD (Kills / Deaths)</p>
                            </div>
                            <span className="text-white">{(dadosJogadorMvp.kills / dadosJogadorMvp.deaths).toFixed(2)}</span>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-500">
                                <FaCrosshairs />
                                <p>ADR Médio</p>
                            </div>
                            <span className="text-white">{dadosJogadorMvp.adr}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-500">
                                <FaCrosshairs />
                                <p>Traded</p>
                            </div>
                            <span className="text-white">{dadosJogadorMvp.adr}</span>
                        </li>
                    </ul>
                </div>
            </Dialog>
        </div>
    )
}