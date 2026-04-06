'use client'

import { useState } from "react"
import { useEffect } from "react"

export default function Page() {
    const [jogadores, setJogadores] = useState<any[]>([])
    const [jogadorId, setJogadorId] = useState("")
    const [jogadorNome, setJogadorNome] = useState("")

    const [timeOrigemId, setTimeOrigemId] = useState("")
    const [timeDestinoId, setTimeDestinoId] = useState("")

    const [timeOrigemNome, setTimeOrigemNome] = useState("")
    const [timeDestinoNome, setTimeDestinoNome] = useState("")

    const [data, setData] = useState<Date | null>(null)

    const [status, setStatus] = useState("")
    const [tipo, setTipo] = useState("")

    const [valor, setValor] = useState("")
    const [moeda, setMoeda] = useState("USD")

    const [observacao, setObservacao] = useState("")


    console.log(jogadores)

    useEffect(() => {
        async function fetchListaDeJogadores() {
            const res = await fetch("/api/jogador")
            const data = await res.json()
            setJogadores(data)
        }
        fetchListaDeJogadores()
    }, [])

    async function handleSubmit() {
        const res = await fetch("/api/transferencia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                jogadorId,
                timeOrigemId: timeOrigemId && timeOrigemId.trim() !== "" ? timeOrigemId : null,
                timeDestinoId: timeDestinoId && timeDestinoId.trim() !== "" ? timeDestinoId : null,
                data,
                status,
                tipo,
                valor: valor ? Number(valor) : null,
                moeda,
                observacao
            })
        })

        const dataRes = await res.json()
        console.log(dataRes)
    }

    return (
        <div className="p-4 flex flex-col gap-4 bg-zinc-900 text-white">
            <h1>Criar Transferência</h1>

            <select
                value={jogadorId}
                onChange={(e) => {
                    const id = e.target.value
                    setJogadorId(id)

                    const jogadorSelecionado = jogadores.find(j => j.id === id)
                    setJogadorNome(jogadorSelecionado?.nome || "")
                }}
                className="bg-zinc-800 p-2"
            >
                <option value="">Selecione um jogador</option>

                {jogadores.map((jogador) => (
                    <option key={jogador.id} value={jogador.id}>
                        {jogador.nome} ({jogador.apelido})
                    </option>
                ))}
            </select>

            {/* Times */}
            <input
                placeholder="Time origem ID"
                value={timeOrigemId}
                onChange={(e) => setTimeOrigemId(e.target.value)}
                className="bg-zinc-800 p-2"
            />

            <input
                placeholder="Time destino ID"
                value={timeDestinoId}
                onChange={(e) => setTimeDestinoId(e.target.value)}
                className="bg-zinc-800 p-2"
            />

            {/* Data */}
            <input
                type="date"
                onChange={(e) => setData(new Date(e.target.value))}
                className="bg-zinc-800 p-2"
            />
            {/* Status */}
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-zinc-800 p-2"
            >
                <option value="">Selecione</option>
                <option value="RUMOR">Rumor</option>
                <option value="FECHADO">Fechado</option>
                <option value="FALTA_ASSINAR">FALTA ASSINAR</option>
            </select>

            {/* Tipo */}
            <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="bg-zinc-800 p-2"
            >
                <option value="">Selecione</option>
                <option value="TRANSFERENCIA">Transferência</option>
                <option value="FREE_AGENT">Free Agent</option>
                <option value="BANCO">Banco</option>
                <option value="SAIDA">Saída</option>
            </select>

            {/* Valor */}
            <input
                placeholder="Valor (opcional)"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="bg-zinc-800 p-2"
            />

            <input
                placeholder="Moeda (USD, BRL...)"
                value={moeda}
                onChange={(e) => setMoeda(e.target.value)}
                className="bg-zinc-800 p-2"
            />

            {/* Observação */}
            <textarea
                placeholder="Observação"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="bg-zinc-800 p-2 h-[100px]"
            />

            <button
                onClick={handleSubmit}
                className="bg-green-600 p-2 hover:bg-green-700"
            >
                Salvar Transferência
            </button>
        </div>
    )
}