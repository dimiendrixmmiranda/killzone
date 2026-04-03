// src/app/times/[timeId]/page.tsx

import { getAllTeams, getTeamById } from "@/src/services/team.service";
import TimeClient from "./TimeClient"
import { getPlayersByTeam } from "@/src/services/player.service";
import { getNewsByTeam } from "@/src/services/news.service";

interface Props {
    params: {
        timeId: string
    }
}


export default async function PaginaDoTime({ params }: Props) {
    const { timeId } = await params;
    const time = getTeamById(timeId)

    if (!time) {
        return <h1>Time não encontrado</h1>
    }

    const times = getAllTeams()
    const jogadores = getPlayersByTeam(time.id)
    const noticias = getNewsByTeam(time.id)

    return (
        <TimeClient
            time={time}
            times={times}
            jogadores={jogadores}
            noticias={noticias}
        />
    )
}