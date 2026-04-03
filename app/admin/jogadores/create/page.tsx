'use client'
import { useState } from "react"

export default function Page() {
    const [nome, setNome] = useState("")
    const [idade, setIdade] = useState("")
    const [apelido, setApelido] = useState("")
    const [pais, setPais] = useState("")
    const [imagem, setImagem] = useState("")
    const [jogoId, setJogoId] = useState("")
    const [timeAtual, setTimeAtual] = useState("")
    const [status, setStatus] = useState("")
    const [sinergia, setSinergia] = useState("")
    const [highlights, setHighlights] = useState("")
    const [papel, setPapel] = useState("")
    const [estilo, setEstilo] = useState("")

    async function handleSubmit() {
        await fetch("/api/jogador", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                idade,
                apelido,
                pais,
                imagem,
                jogoId,
                timeAtual,
                status,
                sinergia: parseInt(sinergia),
                highlights,
                papel,
                estilo,
            })
        })
    }

    return (
        <div>
            <input
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            <input
                placeholder="idade"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            <input
                placeholder="apelido"
                value={apelido}
                onChange={(e) => setApelido(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            <input
                placeholder="pais"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            <input
                placeholder="jogoId"
                value={jogoId}
                onChange={(e) => setJogoId(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            <div>
                <h3>Imagem do jogador</h3>
                <input
                    type="file"
                    onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        const formData = new FormData()
                        formData.append("file", file)

                        const res = await fetch("/api/upload", {
                            method: "POST",
                            body: formData
                        })

                        const data = await res.json()

                        console.log("URL:", data.url)
                        setImagem(data.url)
                    }}
                />
            </div>
            <input
                placeholder="timeAtual"
                value={timeAtual}
                onChange={(e) => setTimeAtual(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            <select
                name="status"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="">Selecione</option>
                <option value="ativo">ativo</option>
                <option value="banco">Banco</option>
                <option value="inativo">Inativo</option>
                <option value="stand-in">Stand In</option>
            </select>
            <input
                type="number"
                placeholder="sinergia"
                value={sinergia}
                onChange={(e) => setSinergia(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            <input
                placeholder="highlights"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            <select
                name="papel"
                id="papel"
                value={papel}
                onChange={(e) => setPapel(e.target.value)}
            >
                <option value="">Selecione</option>
                <option value="entry">Entry</option>
                <option value="igl">igl</option>
                <option value="awper">awper</option>
                <option value="support">support</option>
                <option value="rifler">rifler</option>
                <option value="coach">coach</option>
            </select>
            <select
                name="estilo"
                id="estilo"
                value={estilo}
                onChange={(e) => setEstilo(e.target.value)}
            >
                <option value="">Selecione</option>
                <option value="agressivo">agressivo</option>
                <option value="controlado">controlado</option>
                <option value="hibrido">hibrido</option>
            </select>

            <button onClick={handleSubmit}>
                Publicar
            </button>
        </div>

    )
}