import { partidas } from "../data/partida/partida.data"

export function getAllPartidas() {
    return partidas
}
export function getPartidasByTeam(teamId: string) {
    return partidas.filter(
        p => p.timeAId === teamId || p.timeBId === teamId
    )
}

export function getPartidasByCampeonato(campeonatoId: string) {
    return partidas.filter(p => p.campeonatoId === campeonatoId)
}

export function getPartidaById(partidaId: string) {
    return partidas.find(p => p.id === partidaId) || null
}

export function getProximasPartidas(limit: number = 8) {
    const agora = new Date()

    const proximas = partidas
        .filter(p => {
            const dataPartida = new Date(p.data)
            return dataPartida >= agora
        })
        .sort((a, b) => {
            return new Date(a.data).getTime() - new Date(b.data).getTime()
        })
        .slice(0, limit)

    const agrupadas: { data: string; jogos: typeof partidas }[] = []

    proximas.forEach(partida => {
        const data = new Date(partida.data).toISOString().split("T")[0]

        let grupo = agrupadas.find(g => g.data === data)

        if (!grupo) {
            grupo = { data, jogos: [] }
            agrupadas.push(grupo)
        }

        grupo.jogos.push(partida)
    })

    return agrupadas
}