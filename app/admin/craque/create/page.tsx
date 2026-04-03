'use client'

import { Jogador } from "@/src/domain/Jogador";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
    const [semana, setSemana] = useState("")
    const [data, setData] = useState<string>("")
    const [listaDeJogadores, setListaDeJogadores] = useState<Jogador[]>([])
    const [jogadoresSelecionados, setJogadoresSelecionados] = useState<string[]>([])

    function adicionarJogador(playerId: string) {
        if (jogadoresSelecionados.includes(playerId)) return
        if (jogadoresSelecionados.length >= 6) return

        setJogadoresSelecionados(prev => [...prev, playerId])
    }

    function removerJogador(playerId: string) {
        setJogadoresSelecionados(prev =>
            prev.filter(id => id !== playerId)
        )
    }

    useEffect(() => {
        async function fetchListaDeJogadores() {
            const res = await fetch("/api/jogador")
            const data = await res.json()

            if (!Array.isArray(data)) {
                setListaDeJogadores([])
                return
            }

            setListaDeJogadores(data.filter(j => j && j.id))
        }

        fetchListaDeJogadores()
    }, [])

    async function handleSubmit() {
        if (jogadoresSelecionados.length !== 6) {
            alert("Selecione exatamente 6 jogadores")
            return
        }

        try {
            const res = await fetch("/api/craque", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: semana,
                    date: data,
                    players: jogadoresSelecionados
                })
            })

            const dataRes = await res.json()

            if (!res.ok) {
                alert(dataRes.error || "Erro ao criar votação")
                return
            }

            alert("Votação criada com sucesso!")

            // reset
            setSemana("")
            setData("")
            setJogadoresSelecionados([])

        } catch (error) {
            console.error(error)
            alert("Erro na requisição")
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">

            {/* INPUTS */}
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

            {/* CONTADOR */}
            <p>{jogadoresSelecionados.length}/6 selecionados</p>

            {/* ===== JOGADORES DISPONÍVEIS ===== */}
            <div>
                <h2>Jogadores disponíveis</h2>

                <ul className="grid grid-cols-3 gap-4">
                    {listaDeJogadores.map((jogador) => {
                        const selected = jogadoresSelecionados.includes(jogador.id)

                        return (
                            <li
                                key={jogador.id}
                                onClick={() => adicionarJogador(jogador.id)}
                                className={`cursor-pointer border-2 p-2 ${
                                    selected ? 'border-orange-500' : 'border-zinc-700'
                                }`}
                            >
                                <div className="relative w-full h-[150px]">
                                    <Image
                                        src={jogador.imagem}
                                        alt={jogador.nome}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <p className="text-center mt-2">
                                    {jogador.apelido}
                                </p>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* ===== JOGADORES SELECIONADOS ===== */}
            <div>
                <h2>Selecionados</h2>

                <ul className="flex gap-4 flex-wrap">
                    {jogadoresSelecionados.map((playerId) => {
                        const jogador = listaDeJogadores.find(j => j.id === playerId)

                        if (!jogador) return null

                        return (
                            <li key={playerId} className="border p-2">
                                <p>{jogador.apelido}</p>

                                <button onClick={() => removerJogador(playerId)}>
                                    remover
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* BOTÃO */}
            <button
                onClick={handleSubmit}
                disabled={jogadoresSelecionados.length !== 6}
                className="bg-orange-600 p-2 text-white disabled:opacity-50"
            >
                Criar votação
            </button>
        </div>
    )
}