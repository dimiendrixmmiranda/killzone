import { IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens";
import { Jogador } from "@/src/domain/Jogador";
import { Time } from "@/src/domain/Time";
import { getTeamById } from "@/src/services/team.service";
import { titulo } from "@/src/utils/titulo";
import Image from "next/image";
import { FaArrowDown, FaArrowRight } from "react-icons/fa6";

interface HistoricoDeTimesProps {
    jogador: Jogador
    times: Time[]

}

export default function HistoricoDeTimes({ jogador, times }: HistoricoDeTimesProps) {
    return (
        <div className="flex flex-col gap-4">
            {
                titulo('Histórico de Times')
            }
            <ul className="flex flex-col gap-4 md:grid md:grid-cols-4">
                {jogador.historicoTimes?.map((hist, i) => {
                    const time = getTeamById(hist.timeId);

                    return (
                        <li key={i} className="flex flex-col items-center justify-between gap-1 md:flex-row">
                            <div className="flex flex-col items-center gap-1">
                                <div className="relative w-6 h-6">
                                    <Image
                                        alt={time ? `Logo do time ${time.nome}` : "Logo padrão"}
                                        src={time?.imagem ?? IMAGEM_TIME_DEFAULT}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <span className="text-center md:leading-4.5">
                                    {time?.nome ?? "Time desconhecido"}
                                </span>

                                <p className="text-xs text-zinc-500">
                                    <span>{hist.inicio}</span> / <span>{hist.fim ? `${hist.fim}` : "– atual"}</span>
                                </p>
                            </div>
                            {
                                jogador.historicoTimes && jogador.historicoTimes?.length - 1 > i ? (
                                    <div className="md:hidden">
                                        <FaArrowDown />
                                    </div>
                                ) : ('')
                            }
                            {
                                jogador.historicoTimes && jogador.historicoTimes?.length - 1 > i ? (
                                    <div className="hidden md:block">
                                        <FaArrowRight />
                                    </div>
                                ) : ('')
                            }
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}