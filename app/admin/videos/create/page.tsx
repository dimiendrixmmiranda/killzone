'use client'

import { useState } from "react"

type TipoNoticia = "local" | "youtube" | "tiktok" | "instagram"

export default function CriarNoticia() {
    const [titulo, setTitulo] = useState("")
    const [tipo, setTipo] = useState<TipoNoticia | "">("")
    const [url, setUrl] = useState("")
    const [data, setData] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!titulo || !tipo) {
            alert("Preencha título e tipo")
            return
        }

        if (tipo !== "local" && !url) {
            alert("Informe a URL")
            return
        }

        const video = {
            titulo,
            tipo,
            url: tipo === "local" ? null : url,
            data: data || new Date().toISOString()
        }

        try {
            const res = await fetch("/api/video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(video)
            })

            const dataRes = await res.json()
            console.log("Salvo no banco:", dataRes)

            alert("Vídeo criado!")

            // reset
            setTitulo("")
            setTipo("")
            setUrl("")
            setData("")
        } catch (err) {
            console.error(err)
            alert("Erro ao criar")
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 flex flex-col gap-4 bg-red-400 max-w-xl"
        >
            <input
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />

            <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoNoticia)}
                className="bg-zinc-950 text-white p-2 h-[40px]"
            >
                <option value="">Selecione</option>
                <option value="local">Local</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
            </select>


            <input
                placeholder="URL do conteúdo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />

            <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="bg-zinc-950 text-white p-2 h-[40px]"
            />

            <button
                type="submit"
                className="bg-black text-white p-2 hover:bg-zinc-800 transition"
            >
                Criar notícia
            </button>
        </form>
    )
}