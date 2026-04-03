import { transferencias } from "../data/transferencias/transferencia.data"


export function getAllTransferencias() {
    return transferencias
}

export function getTransferenciasByTeam(teamId: string) {
    return transferencias.filter(
        t =>
            t.timeOrigemId === teamId ||
            t.timeDestinoId === teamId
    )
}

export function getTransferenciasByPlayer(playerId: string) {
    return transferencias.filter(
        t => t.jogadorId === playerId
    )
}