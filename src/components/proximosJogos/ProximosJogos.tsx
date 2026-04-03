'use client'
import { getPartidasByCampeonato, getProximasPartidas } from "@/src/services/partidas.service"
import CardPartida from "../cardPartida/CardPartida"
import Link from "next/link"
import { useBreakpoints } from "@/src/utils/useTamanhoDeTela"
import { useEffect, useState } from "react"

export default function ProximosJogos() {
    const { isXl } = useBreakpoints()
    const [limit, setLimit] = useState(6)

    useEffect(() => {
        setLimit(isXl ? 7 : 6)
    }, [isXl])

    const jogos = getProximasPartidas(limit)

    return (
        <div className="p-4 flex flex-col gap-4 bg-zinc-950 h-full max-h-[700px]">
            <h2 className="font-heading text-4xl">
                Próximos Jogos
            </h2>
            <ul className="flex flex-col gap-2 flex-1 justify-center">
                {
                    jogos.map((arrayDeJogos, i)=> {
                        return (
                            <div key={i} className="flex flex-col gap-2">
                                <p className="p-2">
                                    {new Date(arrayDeJogos.data).toLocaleDateString('pt-BR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                                {
                                    arrayDeJogos.jogos.map(j => {
                                        return (
                                            <CardPartida partida={j} key={j.id} />
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </ul>
            <Link href={''} className="bg-orange-700 font-heading text-2xl text-center pt-1 mt-auto" style={{ textShadow: '1px 1px 2px black' }}>Todos os Jogos</Link>
        </div>
    )
}