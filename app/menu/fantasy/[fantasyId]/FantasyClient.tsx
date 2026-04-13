'use client'

import Template from "@/src/components/template/Template"
import { Campeonato } from "@/src/domain/Campeonato"
import { Time } from "@/src/domain/Time"
import { getAllTeams } from "@/src/services/team.service"
import { Jogador } from "@prisma/client"
import { useEffect, useState } from "react"

interface FantasyClientProps {
    idCampeonato: string
}

export default function FantasyClient({ idCampeonato }: FantasyClientProps) {

    const [campeonatoAtual, setCampeonatoAtual] = useState<Campeonato | null>(null)
    const [listaDeJogadores, setListaDeJogadores] = useState<Jogador[]>([])
    const [listaDeJogadoresDisponiveis, setListaDeJogadoresDisponiveis] = useState<Jogador[]>([])

    useEffect(() => {
        async function fetchCampeonatos() {
            const res = await fetch("/api/campeonatos")
            const data = await res.json()
            const camp = data.find(
                (campeonato: Campeonato) => campeonato.slugId === idCampeonato
            )
            if (camp) setCampeonatoAtual(camp)
        }
        fetchCampeonatos()
    }, [])

    useEffect(() => {
        if (!campeonatoAtual || listaDeJogadores.length === 0) return

        const ids = new Set(campeonatoAtual.timesIds)

        const jogadoresFiltrados = listaDeJogadores.filter((jogador) =>
            ids.has(jogador?.timeAtual)
        )

        setListaDeJogadoresDisponiveis(jogadoresFiltrados)

    }, [campeonatoAtual, listaDeJogadores])


    useEffect(() => {
        async function fetchListaDeJogadores() {
            const res = await fetch("/api/jogador")
            const data = await res.json()

            if (!Array.isArray(data)) {
                setListaDeJogadores([])
                return
            }

            setListaDeJogadores(data)
        }

        fetchListaDeJogadores()
    }, [])

    return (
        <Template>
            <div className="p-4 text-black max-w-[1440px] w-full mx-auto flex flex-col gap-6">
                aqui
            </div>
        </Template>
    )
}