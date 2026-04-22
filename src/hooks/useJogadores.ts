
import { useEffect, useState } from "react"
import { Jogador } from "../domain/Jogador"

export function useJogadores() {
    const [jogadores, setJogadores] = useState<Jogador[]>([])

    useEffect(() => {
        async function fetchListaDeJogadores() {
            const res = await fetch("/api/jogador")
            const data = await res.json()

            if (!Array.isArray(data)) {
                setJogadores([])
                return
            }
            setJogadores(data)
        }

        fetchListaDeJogadores()
    }, [])

    return { jogadores }
}