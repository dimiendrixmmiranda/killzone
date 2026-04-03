import { IMAGEM_TIME_DEFAULT, IMAGEM_TROFEU_DEFAULT } from "@/src/assets/imagens";
import { Jogador } from "@/src/domain/Jogador";
import { Time } from "@/src/domain/Time";
import { getTeamById } from "@/src/services/team.service";
import { titulo } from "@/src/utils/titulo";
import Image from "next/image";

interface HistoricoDeTimesProps {
    jogador: Jogador
    times: Time[]
}

export default function HistoricoDeConquistas({ jogador, times }: HistoricoDeTimesProps) {
    return (
        <div className="flex flex-col gap-4">
            {
                titulo('Histórico de Conquistas')
            }
            <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {
                    jogador.conquistas?.map((conquista, i) => {
                        const time = getTeamById(conquista.timeId);

                        return (
                            <li key={i} className="flex flex-col items-center gap-2 bg-zinc-950 p-4 rounded-md relative">
                                <div className="relative w-20 h-20">
                                    <Image
                                        alt={conquista.nome}
                                        src={conquista.trofeuCompeticao || IMAGEM_TROFEU_DEFAULT}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col justify-center items-center">
                                        <h4 className="text-lg font-bold leading-5">{conquista.nome}</h4>
                                        <p className="text-sm">{conquista.ano}</p>
                                    </div>
                                </div>
                                <div className="absolute right-2 top-2">
                                    <div className="relative w-8 h-8 ml-auto">
                                        <Image
                                            alt={`Logo do time ${time?.nome}`}
                                            src={time?.imagem || IMAGEM_TIME_DEFAULT}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}