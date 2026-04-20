import { Partida } from "../domain/Partida"

export function determinarDataPeriodo(inicio: Date, fim: Date) {
    return (
        <div className="text-sm flex flex-wrap gap-1 justify-center leading-5">
            <span>
                {new Date(inicio).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}
            </span>
            à
            <span className="">
                {new Date(fim).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}
            </span>
        </div>
    )
}

export function determinarDataEHoraPartida(partida: Partida) {
    return (
        <p className="text-[.5em] py-0.5" style={{ textShadow: '1px 1px 2px black' }}>
            {partida.data.toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
            })},{" "}
            às{" "}
            {partida.data.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            })}
        </p>
    )
}

export function formatarData(dataISO: string): string {
    const data = new Date(dataISO)

    const dia = data.getDate()
    const mes = data.toLocaleString('pt-BR', { month: 'long' })
    const ano = data.getFullYear()

    const hora = data.getHours().toString().padStart(2, '0')
    const minuto = data.getMinutes().toString().padStart(2, '0')

    return `${dia} de ${mes} de ${ano}, às ${hora}:${minuto}`
}