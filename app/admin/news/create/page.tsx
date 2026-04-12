'use client'

import CampeonatoRelacionado from "@/src/components/paginaCompeticao/CampeonatoRelacionado"
import { useState } from "react"

export default function CriarNoticia() {
    const [titulo, setTitulo] = useState("")
    const [resumo, setResumo] = useState("")
    const [conteudo, setConteudo] = useState("")
    const [dataPublicacao, setDataPublicacao] = useState<Date | null>(null)
    const [autor, setAutor] = useState("")
    const [partidaId, setPartidaId] = useState("")
    const [campeonatosRelacionados, setCampeonatosRelacionados] = useState("")
    const [jogoId, setJogoId] = useState("")
    const [urlDaImagem, setUrlDaImagem] = useState("")

    const [timesRelacionados, setTimesRelacionados] = useState("")
    const [listaDeTimesRelacionados, setListaDeTimesRelacionados] = useState<string[]>([])

    const [tituloSobreOJogo, setTituloSobreOJogo] = useState('')
    const [conteudoSobreOJogo, setConteudoSobreOJogo] = useState('')
    const [sobreOJogo, setSobreOJogo] = useState<{ titulo: string, conteudo: string[] }[]>([])
    function gerarSlug(texto: string) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove acentos
            .replace(/\s+/g, "-") // espaço -> hífen
            .replace(/[^\w-]+/g, "") // remove caracteres especiais
    }

    async function handleSubmit() {
        const res = await fetch("/api/news", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo,
                resumo,
                slug: gerarSlug(titulo),
                thumbnail: urlDaImagem,
                dataPublicacao,
                autor,
                partidaId,
                jogoId,
                campeonatoId: campeonatosRelacionados || null,
                timesRelacionados: listaDeTimesRelacionados,
                conteudo: conteudo.split("\n").filter(l => l.trim() !== ""),
                sobreOJogo,
                tags: ["cs2"]
            })
        })
        console.log(res)
    }

    return (
        <div className="p-4 flex flex-col gap-4 bg-red-400">
            <h1>Criar notícia</h1>

            <input
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />

            <textarea
                placeholder="Resumo"
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[100px]"
            />
            <textarea
                placeholder="Conteudo"
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[300px]"
            />

            <input
                type="date"
                name="dataPublicacao"
                id="dataPublicacao"
                onChange={(e) => setDataPublicacao(e.target.value as any)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"

            />
            <input
                placeholder="Autor"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />

            <input
                placeholder="Partida id"
                value={partidaId}
                onChange={(e) => setPartidaId(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />

            {/* Vai ser um select depois */}
            <input
                placeholder="Jogo id"
                value={jogoId}
                onChange={(e) => setJogoId(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />

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
                    setUrlDaImagem(data.url)
                }}
            />

            <div>
                <input
                    type="text"
                    name="timesRelacionados"
                    id="timesRelacionados"
                    placeholder="times relacionados"
                    value={timesRelacionados}
                    onChange={(e) => {
                        setTimesRelacionados(e.target.value)
                    }}
                />
                <button onClick={() => {
                    if (!timesRelacionados) return

                    setListaDeTimesRelacionados(prev => [...prev, timesRelacionados])
                    setTimesRelacionados("")
                }}>
                    Adicionar time
                </button>
                <ul>
                    {listaDeTimesRelacionados.map((time, index) => (
                        <li key={index}>
                            {time}
                            <button onClick={() => {
                                setListaDeTimesRelacionados(prev =>
                                    prev.filter((_, i) => i !== index)
                                )
                            }}>
                                x
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <input
                    type="text"
                    name="campeonatoId"
                    id="campeonatoId"
                    placeholder="id do campeonato"
                    value={campeonatosRelacionados}
                    onChange={(e) => {
                        setCampeonatosRelacionados(e.target.value)
                    }}
                    className="bg-zinc-950 text-white p-2 w-full h-[40px]"
                />
            </div>

            <div className="flex flex-col">
                <input type="text" name="tituloSobreOJogo" id="tituloSobreOJogo" placeholder="tituloSobreOJogo" value={tituloSobreOJogo} onChange={(e) => {
                    setTituloSobreOJogo(e.target.value)
                }} />
                <textarea
                    name="conteudoSobreOJogo"
                    placeholder="sobre o jogo"
                    value={conteudoSobreOJogo}
                    onChange={(e) => setConteudoSobreOJogo(e.target.value)}
                    className="bg-zinc-950 text-white p-2 w-full h-[300px]"

                />
                <button onClick={() => {
                    if (!tituloSobreOJogo) return
                    if (!conteudoSobreOJogo) return

                    setSobreOJogo(prev => [
                        ...prev,
                        {
                            titulo: tituloSobreOJogo,
                            conteudo: [conteudoSobreOJogo]
                        }
                    ])

                    setTituloSobreOJogo("")
                    setConteudoSobreOJogo("")
                }}>
                    Adicionar sobre o jogo
                </button>

                <ul>
                    {sobreOJogo.map((item, index) => (
                        <li key={index}>
                            <strong>{item.titulo}</strong>
                            <p>{item.conteudo.join(", ")}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <button onClick={handleSubmit}>
                Publicar
            </button>
        </div>
    )
}