import { Jogador } from "@/src/domain/Jogador"
import { getPartidasByTeam } from "@/src/services/partidas.service"
import { getTeamById } from "@/src/services/team.service"
import { titulo } from "@/src/utils/titulo"
import { determinarDataEHoraPartida } from "@/src/utils/utils"
import Image from "next/image"
import CardPartida from "../cardPartida/CardPartida"

interface PartidasProps {
    jogador: Jogador
}

export default function Partidas({ jogador }: PartidasProps) {
    const partidasDoTime = getPartidasByTeam(jogador.timeAtual)

    return (
        <div className="flex flex-col gap-4">
            {
                titulo('Últimas Partidas')
            }
            <ul className="grid gap-4 md:grid-cols-2">
                {
                    partidasDoTime.map((partida, i) => {
                        const timeA = getTeamById(partida.timeAId)
                        const timeB = getTeamById(partida.timeBId)
                        if (!timeA || !timeB) return null

                        return (
                            <CardPartida partida={partida} key={i} />
                        )
                    })
                }
            </ul>
        </div>
    )
}