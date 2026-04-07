import { IMAGEM_JOGADOR_DEFAULT, IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens";
import { EstatisticaJogadorAcumulado } from "@/src/domain/EstatisticasDoJogadorAcumulado";
import { Jogador } from "@/src/domain/Jogador";
import { getCampeonatoById, getClassificacaoDobleEliminationPlayoff, getClassificacaoDoubleElimination, getClassificacaoFinalSuica, getClassificacaoPlayoffs, getEstatisticasJogadoresCampeonato, getSituacaoCampeonato, getTabelaByCampeonatoId } from "@/src/services/campeonato.service";
import { getPartidasByCampeonato } from "@/src/services/partidas.service";
import { getPlayerById } from "@/src/services/player.service";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaHandsHelping } from "react-icons/fa";
import { FaArrowDown, FaBolt, FaCrosshairs, FaFire, FaMap, FaSkull, FaTrophy } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";
import { Dialog } from 'primereact/dialog';
import { Campeonato } from "@/src/domain/Campeonato";
import { getTeamById } from "@/src/services/team.service";

interface MVPCompeticaoProps {
    campeonato: Campeonato
}

export default function MVPCompeticao({ campeonato }: MVPCompeticaoProps) {
    if (!campeonato.slugId) return []

    const partidas = useMemo(() => {
        return getPartidasByCampeonato(campeonato.slugId!)
    }, [campeonato.slugId])

    const estatisticas = useMemo(() => {
        return getEstatisticasJogadoresCampeonato(partidas)
    }, [partidas])

    const [jogadores, setJogadores] = useState<Jogador[]>([])
    const [dadosJogadorMvp, setDadosJogadorMvp] = useState<EstatisticaJogadorAcumulado | null>(null)
    const [estatisticasDoTimeGanhador, setEstatisticasDoTimeGanhador] = useState<null | EstatisticaJogadorAcumulado[]>(null)
    const [visible, setVisible] = useState(false);
    const jogadorMvp = useMemo(() => {
        if (!dadosJogadorMvp) return null

        return jogadores.find(
            j => j.apelido.toLowerCase() === dadosJogadorMvp.jogadorId.toLowerCase()
        ) ?? null
    }, [dadosJogadorMvp, jogadores])

    if (!campeonato) return null

    const situacao = getSituacaoCampeonato(
        campeonato?.inicio,
        campeonato?.fim
    )

    useEffect(() => {
        async function fetchJogadores() {
            const res = await fetch("/api/jogador")
            const data = await res.json()

            if (!Array.isArray(data)) {
                setJogadores([])
                return
            }

            setJogadores(data.filter(j => j && j.id))
        }

        fetchJogadores()
    }, [])

    useEffect(() => {
        const ranking = getTabelaByCampeonatoId(campeonato)
        if (!ranking?.length) return

        const campeao = ranking[0]

        const jogadores = estatisticas
            .filter(j => j.timeId === campeao.timeId)
            .sort((a, b) => b.rating - a.rating)

        setEstatisticasDoTimeGanhador(jogadores)

    }, [campeonato, estatisticas])


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
            <div className="flex flex-col justify-center items-center bg-[url('/default/molde-mvp.png')] mx-auto bg-cover bg-center rounded-2xl overflow-hidden text-white w-full max-w-[300px]" style={{ textShadow: '1px 1px 2px black' }}>
                <div className="relative w-full h-96">
                    <Image alt={`MVP Indisponível`} src={IMAGEM_JOGADOR_DEFAULT} fill className="object-cover" />
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black via-black/70 to-transparent" />
                </div>
                <h3 className="text-lg font-bold bg-zinc-950 w-full p-2 text-center flex justify-center items-center">MVP Não Definido</h3>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 justify-center items-center w-full md:col-start-1 md:col-end-3 lg:col-start-3 lg:col-end-4 xl:col-start-3 xl:col-end-4">
            <h2 className="font-heading text-3xl">MVP da Competição</h2>
            <div className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 md:mx-auto lg:grid-cols-1">
                {
                    dadosJogadorMvp ? (
                        <div className="flex flex-col justify-center items-center bg-[url('/default/molde-mvp.png')] mx-auto bg-cover bg-center rounded-2xl overflow-hidden text-white w-full max-w-[300px] relative" style={{ textShadow: '1px 1px 2px black' }}>
                            <div className="relative w-full h-96">
                                <Image alt={dadosJogadorMvp.jogadorId} src={jogadorMvp?.imagem || IMAGEM_JOGADOR_DEFAULT} fill className="object-cover" />
                                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black via-black/70 to-transparent" />
                            </div>
                            <h3 className="text-lg font-bold bg-black w-full p-2 text-center flex justify-center items-center">{dadosJogadorMvp.jogadorId}</h3>
                            <span className="absolute top-2 right-4 z-10 font-heading text-3xl">{dadosJogadorMvp.rating}</span>
                            <div className="absolute top-2 left-2">
                                <div className="relative w-10 h-10">
                                    <Image alt={dadosJogadorMvp.timeId} src={getTeamById(dadosJogadorMvp.timeId)?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                </div>
                            </div>
                            <button onClick={() => setVisible(true)} className="w-6 h-6 rounded-full justify-center items-center bg-azul-escuro text-white cursor-pointer absolute bottom-2 right-2 hidden lg:flex">
                                <IoIosInformationCircle />
                            </button>
                        </div>
                    ) : ('')
                }
                {
                    dadosJogadorMvp ? (
                        <div className="flex flex-col bg-azul-escuro p-6 rounded-2xl lg:hidden">
                            <ul className="space-y-2">
                                <li className="flex items-center justify-between text-white">
                                    <div className="flex items-center gap-2">
                                        <FaMap />
                                        <p>Mapas Jogados</p>
                                    </div>
                                    <span className="text-white">{dadosJogadorMvp?.mapasJogados}</span>
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
                                    <span className="text-white">{dadosJogadorMvp?.kills}</span>
                                </li>

                                <li className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-red-600">
                                        <FaSkull />
                                        <p>Mortes</p>
                                    </div>
                                    <span className="text-white">{dadosJogadorMvp?.deaths}</span>
                                </li>

                                <li className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <FaHandsHelping />
                                        <p>Assistências</p>
                                    </div>
                                    <span className="text-white">{dadosJogadorMvp?.assists}</span>
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
                                    <span className="text-white">{(dadosJogadorMvp?.kills / dadosJogadorMvp?.deaths).toFixed(2)}</span>
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
                    ) : <div className="flex flex-col justify-center items-center bg-[url('/default/molde-mvp.png')] mx-auto bg-cover bg-center rounded-2xl overflow-hidden text-white w-full max-w-[300px]" style={{ textShadow: '1px 1px 2px black' }}>
                        <div className="relative w-full h-96">
                            <Image alt={`MVP Indisponível`} src={IMAGEM_JOGADOR_DEFAULT} fill className="object-cover" />
                            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black via-black/70 to-transparent" />
                        </div>
                        <h3 className="text-lg font-bold bg-zinc-950 w-full p-2 text-center flex justify-center items-center">MVP Não Definido</h3>
                    </div>
                }
            </div>
            {
                dadosJogadorMvp ? (
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
                ) : ''
            }
        </div>
    )
}