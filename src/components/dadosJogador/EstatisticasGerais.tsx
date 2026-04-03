import { FaBolt, FaBullseye, FaChartArea, FaChartLine, FaClock, FaCrosshairs, FaCrown, FaGamepad, FaHandshake, FaMedal, FaSkull, FaSkullCrossbones, FaStar, FaTrophy, FaUsers } from "react-icons/fa6";
import { FaBalanceScale, FaFireAlt, FaHandsHelping, FaRedo, FaTimesCircle } from "react-icons/fa";
import Image from "next/image";
import { Jogador } from "@/src/domain/Jogador";
import { titulo } from "@/src/utils/titulo";

interface EstatisticasGeraisProps {
    jogador: Jogador
}

export default function EstatisticasGerais({ jogador }: EstatisticasGeraisProps) {

    return (
        <div className="flex flex-col gap-6">
            {
                titulo("Estatísticas Gerais")
            }
            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-lg">Estatisticas de Combate:</h2>
                <ul className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-x-12">
                    <li className="flex items-center gap-3 truncate">
                        <FaGamepad />
                        <span className="flex-1">Partidas</span>
                        {/* <strong>{jogador.estatisticasCombate.partidas}</strong> */}
                    </li>
                    <li className="flex items-center gap-3 truncate">
                        <FaCrosshairs />
                        <span className="flex-1">Kills</span>
                        {/* <strong>{jogador.estatisticasCombate.kills}</strong> */}
                    </li>
                    <li className="flex items-center gap-3 truncate">
                        <FaSkull />
                        <span className="flex-1">Mortes</span>
                        {/* <strong>{jogador.estatisticasCombate.deaths}</strong> */}
                    </li>
                    <li className="flex items-center gap-3 truncate">
                        <FaHandsHelping />
                        <span className="flex-1">Assistências</span>
                        {/* <strong>{jogador.estatisticasCombate.assists}</strong> */}
                    </li>
                    <li className="flex items-center gap-3 truncate">
                        <FaFireAlt />
                        <span className="flex-1">Dano Total</span>
                        {/* <strong>{jogador.estatisticasCombate.damageTotal}</strong> */}
                    </li>
                    <li className="flex items-center gap-3 truncate">
                        <FaBullseye />
                        <span className="flex-1">Headshots</span>
                        {/* <strong>{jogador.estatisticasCombate.headshots}</strong> */}
                    </li>
                    <li className="flex items-center gap-3 truncate">
                        <FaClock />
                        <span className="flex-1">Rounds Jogados</span>
                        {/* <strong>{jogador.estatisticasCombate.roundsJogadas}</strong> */}
                    </li>
                    <li className="flex items-center gap-3 truncate">
                        <FaTrophy />
                        <span className="flex-1">Rounds Vencidos</span>
                        {/* <strong>{jogador.estatisticasCombate.roundsVencidas}</strong> */}
                    </li>
                </ul>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-lg">Estatisticas de Impacto:</h2>
                <ul className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-x-12">
                    <li className="flex items-center gap-3 truncate">
                        <FaGamepad />
                        <span className="flex-1">First Kills</span>
                        {/* <strong>{jogador.estatisticasImpacto.firstKills}</strong> */}
                    </li>
                    <li className="flex items-center gap-3 truncate">
                        <FaCrosshairs />
                        <span className="flex-1">Primeiro a Morrer</span>
                        {/* <strong>{jogador.estatisticasImpacto.firstDeaths}</strong> */}
                    </li>
                    <li className="flex items-center gap-3 truncate">
                        <FaSkull />
                        <span className="flex-1">Tentativas de Clutch</span>
                        {/* <strong>{jogador.estatisticasImpacto.clutchTentativas}</strong> */}
                    </li>
                    <li className="flex items-center gap-3 truncate">
                        <FaHandsHelping />
                        <span className="flex-1">Clutchs Vencidos</span>
                        {/* <strong>{jogador.estatisticasImpacto.clutchVitorias}</strong> */}
                    </li>
                    <li className="flex flex-col items-center gap-3 col-start-1 col-end-3">
                        <div className="flex items-center self-start gap-3">
                            <FaHandsHelping />
                            <span className="flex-1">MultiKills</span>
                        </div>
                        <div className="flex w-full">
                            <ul className="grid grid-cols-2 w-full md:grid-cols-4">
                                <li className="flex flex-col gap-1 justify-center items-center">
                                    <p>Double Kill</p>
                                    {/* <span>{jogador.estatisticasImpacto.multikills.double}</span> */}
                                </li>
                                <li className="flex flex-col gap-1 justify-center items-center">
                                    <p>Triple Kill</p>
                                    {/* <span>{jogador.estatisticasImpacto.multikills.triple}</span> */}
                                </li>
                                <li className="flex flex-col gap-1 justify-center items-center">
                                    <p>Quad Kill</p>
                                    {/* <span>{jogador.estatisticasImpacto.multikills.quad}</span> */}
                                </li>
                                <li className="flex flex-col gap-1 justify-center items-center">
                                    <p>Ace</p>
                                    {/* <span>{jogador.estatisticasImpacto.multikills.ace}</span> */}
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-lg">Estatisticas por Mapa:</h2>
                <ul className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-x-8">
                    {/* {
                        jogador.estatisticasPorMapa.map(((mapa, i) => {
                            return (
                                <li key={i} className="flex flex-col items-center gap-3 relative">
                                    <div className="relative w-full h-55">
                                        <Image alt={mapa.mapa} src={mapa.imagem} fill className="object-cover" />
                                    </div>
                                    <div className="absolute top-1 right-2">
                                        <h4 className="font-heading text-4xl" style={{ textShadow: '1px 1px 2px black' }}>{calcularWinRatePorMapa(mapa.partidasJogadas, mapa.partidasVencidas)}%</h4>
                                    </div>
                                    <ul className=" flex flex-col w-full">
                                        <li className="flex items-center gap-3 truncate">
                                            <FaGamepad />
                                            <span className="flex-1">Partidas Jogadas</span>
                                            <strong>{mapa.partidasJogadas}</strong>
                                        </li>
                                        <li className="flex items-center gap-3 truncate">
                                            <FaTrophy />
                                            <span className="flex-1">Partidas Vencidas</span>
                                            <strong>{mapa.partidasVencidas}</strong>
                                        </li>
                                        <li className="flex items-center gap-3 truncate">
                                            <FaTimesCircle />
                                            <span className="flex-1">Partidas Perdidas</span>
                                            <strong>{mapa.partidasPerdidas}</strong>
                                        </li>
                                        <li className="flex items-center gap-3 truncate">
                                            <FaRedo />
                                            <span className="flex-1">Rounds Jogados</span>
                                            <strong>{mapa.roundsJogadas}</strong>
                                        </li>
                                        <li className="flex items-center gap-3 truncate">
                                            <FaStar />
                                            <span className="flex-1">Rounds Vencidos</span>
                                            <strong>{mapa.roundsVencidas}</strong>
                                        </li>
                                        <li className="flex items-center gap-3 truncate">
                                            <FaCrosshairs />
                                            <span className="flex-1">Kills</span>
                                            <strong>{mapa.kills}</strong>
                                        </li>
                                        <li className="flex items-center gap-3 truncate">
                                            <FaSkull />
                                            <span className="flex-1">Mortes</span>
                                            <strong>{mapa.deaths}</strong>
                                        </li>
                                        <li className="flex items-center gap-3 truncate">
                                            <FaHandshake />
                                            <span className="flex-1">Clutchs</span>
                                            <strong>{mapa.clutchVitorias}</strong>
                                        </li>
                                    </ul>
                                </li>
                            )
                        }))
                    } */}
                </ul>
            </div>
        </div>
    )
}