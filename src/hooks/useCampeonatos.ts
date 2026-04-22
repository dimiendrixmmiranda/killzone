import { useEffect, useState } from "react"
import { Campeonato } from "../domain/Campeonato"

export function useCampeonatos() {
    const [campeonatos, setCampeonatos] = useState<Campeonato[]>([])

    useEffect(() => {
        async function fetchCampeonatos() {
            const res = await fetch("/api/campeonatos")
            const data = await res.json()
            setCampeonatos(data)
        }

        fetchCampeonatos()
    }, [])

    return { campeonatos }
}