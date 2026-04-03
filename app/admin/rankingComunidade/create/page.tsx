"use client"

import { useState } from "react"
import { getTeamById } from "@/src/services/team.service"
import { teams } from "@/src/data/teams/teams.data"

export default function Page() {
    const [semana, setSemana] = useState("")
    const [data, setData] = useState<string>("")
    const [listaDeTimesRelacionados, setListaDeTimesRelacionados] = useState<string[]>([])

    function adicionarTime(timeId: string) {
        if (listaDeTimesRelacionados.includes(timeId)) return

        setListaDeTimesRelacionados(prev => [...prev, timeId])
    }

    function removerTime(timeId: string) {
        setListaDeTimesRelacionados(prev =>
            prev.filter(t => t !== timeId)
        )
    }

    const timesDisponiveis = teams.filter(
        t => !listaDeTimesRelacionados.includes(t.id)
    )

    async function handleSubmit() {
        try {
            const res = await fetch("/api/rankingComunidade", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: semana,
                    date: data,
                    teams: listaDeTimesRelacionados
                })
            })

            const dataRes = await res.json()

            if (!res.ok) {
                alert(dataRes.error || "Erro ao criar ranking")
                return
            }

            alert("Ranking criado com sucesso!")

            // opcional: resetar formulário
            setSemana("")
            setData("")
            setListaDeTimesRelacionados([])

        } catch (error) {
            console.error(error)
            alert("Erro na requisição")
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4 bg-red-400">
            <h1>Criar Ranking</h1>

            <input
                placeholder="Semana"
                value={semana}
                onChange={(e) => setSemana(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />

            <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />

            {/* ===== TIMES DISPONÍVEIS ===== */}
            <div>
                <h2>Times disponíveis</h2>
                <ul>
                    {timesDisponiveis.map((objTime) => {
                        const time = getTeamById(objTime.id)

                        return (
                            <li key={objTime.id}>
                                {time?.nome}
                                <button onClick={() => adicionarTime(objTime.id)}>
                                    +
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* ===== TIMES SELECIONADOS ===== */}
            <div>
                <h2>Times selecionados</h2>
                <ul>
                    {listaDeTimesRelacionados.map((timeId) => {
                        const time = getTeamById(timeId)

                        return (
                            <li key={timeId}>
                                {time?.nome}
                                <button onClick={() => removerTime(timeId)}>
                                    x
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <button
                onClick={handleSubmit}
                className="bg-black text-white p-2"
            >
                Criar Ranking
            </button>
        </div>
    )
}