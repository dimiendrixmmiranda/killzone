'use client'
import { useState } from "react"

export default function Page() {
    const [nomeDoCampeonato, setNomeDoCampeonato] = useState("")
    const [jogoId, setJogoId] = useState("")
    const [tipo, setTipo] = useState("")
    const [tier, setTier] = useState("")
    const [organizador, setOrganizador] = useState("")
    const [inicio, setInicio] = useState<Date | null>(null)
    const [fim, setFim] = useState<Date | null>(null)
    const [local, setLocal] = useState("")
    const [formato, setFormato] = useState("")
    const [terceiroLugar, setTerceiroLugar] = useState<boolean | null>();
    const [imagem, setImagem] = useState<Date | null>(null)

    const [bannerDaCompeticao, setBannerDaCompeticao] = useState("")
    const [imgDoTrofeu, setImgDoTrofeu] = useState("")

    const [times, setTimes] = useState("")
    const [timesParticipantes, setTimesParticipantes] = useState<string[]>([])

    const [campeonatos, setCampeonatos] = useState("")
    const [campeonatosRelacionados, setCampeonatosRelacionados] = useState<string[]>([])

    const [premiacaoAtual, setPremiacaoAtual] = useState({
        colocacao: "",
        valor: "",
        moeda: "",
        descricao: "",
        classificacaoProximoStage: false
    })
    const [listaDePremiacoes, setListaDePremiacoes] = useState<any[]>([])


    function gerarSlug(texto: string) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove acentos
            .replace(/\s+/g, "-") // espaço -> hífen
            .replace(/[^\w-]+/g, "") // remove caracteres especiais
    }

    async function handleSubmit() {
        await fetch("/api/campeonatos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nomeDoCampeonato,
                slugId: gerarSlug(nomeDoCampeonato),
                jogoId,
                tipo,
                tier,
                organizador,
                inicio,
                fim,
                local,
                imagem: bannerDaCompeticao,
                trofeu: imgDoTrofeu,
                formato,
                terceiroLugar,
                timesIds: timesParticipantes,
                campeonatosRelacionados,
                premiacoes: listaDePremiacoes
            })
        })
    }

    return (
        <div className="p-4 flex flex-col gap-4 bg-red-400">
            <h1>Criar notícia</h1>

            <input
                placeholder="Título"
                value={nomeDoCampeonato}
                onChange={(e) => setNomeDoCampeonato(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />

            <input
                placeholder="Jogo id"
                value={jogoId}
                onChange={(e) => setJogoId(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />

            <input
                placeholder="Tipo (Online ou Lan)"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            <input
                placeholder="Tier"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            <input
                placeholder="Organizadora da competição"
                value={organizador}
                onChange={(e) => setOrganizador(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            <div>
                <label htmlFor="inicio">Início do Campeonato</label>
                <input
                    type="date"
                    name="inicio"
                    id="inicio"
                    onChange={(e) => setInicio(new Date(e.target.value))}
                    className="bg-zinc-950 text-white p-2 w-full h-[40px]"
                />
            </div>
            <div>
                <label htmlFor="fim">Fim do Campeonato</label>
                <input
                    type="date"
                    name="fim"
                    id="fim"
                    onChange={(e) => setFim(new Date(e.target.value))}
                    className="bg-zinc-950 text-white p-2 w-full h-[40px]"
                />
            </div>
            <input
                placeholder="Local do Campeonato"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            <input
                placeholder="Formato da Competição"
                value={formato}
                onChange={(e) => setFormato(e.target.value)}
                className="bg-zinc-950 text-white p-2 w-full h-[40px]"
            />
            {/* Terceiro lugar */}
            <div>
                <h2>Disputa do Terceiro Lugar</h2>
                <label>
                    <input
                        type="radio"
                        name="terceiroLugar"
                        value="true"
                        onChange={() => setTerceiroLugar(true)}
                    />
                    Sim
                </label>

                <label>
                    <input
                        type="radio"
                        name="terceiroLugar"
                        value="false"
                        onChange={() => setTerceiroLugar(false)}
                    />
                    Não
                </label>
            </div>

            {/* Banner da competição */}
            <h2>Banner da competição</h2>
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
                    setBannerDaCompeticao(data.url)
                }}
            />

            <h2>Trofeu</h2>
            {/* Trofeu */}
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
                    setImgDoTrofeu(data.url)
                }}
            />

            {/* Campeonatos Relacionados */}
            <div>
                <input
                    type="text"
                    name="campeonatosRelacionados"
                    id="campeonatosRelacionados"
                    placeholder="Campeonatos Relacionados"
                    value={campeonatos}
                    onChange={(e) => {
                        setCampeonatos(e.target.value)
                    }}
                    className="bg-zinc-950 text-white p-2 w-full h-[40px]"
                />
                <button onClick={() => {
                    if (!campeonatos) return

                    setCampeonatosRelacionados(prev => [...prev, campeonatos])
                    setCampeonatos("")
                }}>
                    Adicionar campeonato relacionado
                </button>
                <ul>
                    {campeonatosRelacionados.map((camp, index) => (
                        <li key={index}>
                            {camp}
                            <button onClick={() => {
                                setCampeonatosRelacionados(prev =>
                                    prev.filter((_, i) => i !== index)
                                )
                            }}>
                                x
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Times Participantes */}
            <div>
                <input
                    type="text"
                    name="timesRelacionados"
                    id="timesRelacionados"
                    placeholder="times relacionados"
                    value={times}
                    onChange={(e) => {
                        setTimes(e.target.value)
                    }}
                    className="bg-zinc-950 text-white p-2 w-full h-[40px]"
                />
                <button onClick={() => {
                    if (!times) return

                    setTimesParticipantes(prev => [...prev, times])
                    setTimes("")
                }}>
                    Adicionar time
                </button>
                <ul>
                    {timesParticipantes.map((time, index) => (
                        <li key={index}>
                            {time}
                            <button onClick={() => {
                                setTimesParticipantes(prev =>
                                    prev.filter((_, i) => i !== index)
                                )
                            }}>
                                x
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Premiações */}
            <div className="flex flex-col gap-2">
                <h2>Premiações</h2>

                <input
                    placeholder="Colocação (ex: 1º)"
                    value={premiacaoAtual.colocacao}
                    onChange={(e) =>
                        setPremiacaoAtual(prev => ({ ...prev, colocacao: e.target.value }))
                    }
                    className="bg-zinc-950 text-white p-2"
                />

                <input
                    placeholder="Valor (ex: 100000)"
                    value={premiacaoAtual.valor}
                    onChange={(e) =>
                        setPremiacaoAtual(prev => ({ ...prev, valor: e.target.value }))
                    }
                    className="bg-zinc-950 text-white p-2"
                />

                <input
                    placeholder="Moeda (ex: USD)"
                    value={premiacaoAtual.moeda}
                    onChange={(e) =>
                        setPremiacaoAtual(prev => ({ ...prev, moeda: e.target.value }))
                    }
                    className="bg-zinc-950 text-white p-2"
                />

                <input
                    placeholder="Descrição"
                    value={premiacaoAtual.descricao}
                    onChange={(e) =>
                        setPremiacaoAtual(prev => ({ ...prev, descricao: e.target.value }))
                    }
                    className="bg-zinc-950 text-white p-2"
                />

                <label>
                    <input
                        type="checkbox"
                        checked={premiacaoAtual.classificacaoProximoStage}
                        onChange={(e) =>
                            setPremiacaoAtual(prev => ({
                                ...prev,
                                classificacaoProximoStage: e.target.checked
                            }))
                        }
                    />
                    Classifica para próximo stage
                </label>

                <button
                    onClick={() => {
                        if (!premiacaoAtual.colocacao) return

                        setListaDePremiacoes(prev => [...prev, premiacaoAtual])

                        setPremiacaoAtual({
                            colocacao: "",
                            valor: "",
                            moeda: "",
                            descricao: "",
                            classificacaoProximoStage: false
                        })
                    }}
                >
                    Adicionar premiação
                </button>

                <ul>
                    {listaDePremiacoes.map((premio, index) => (
                        <li key={index}>
                            {premio.colocacao} - {premio.valor} {premio.moeda}

                            <button
                                onClick={() => {
                                    setListaDePremiacoes(prev =>
                                        prev.filter((_, i) => i !== index)
                                    )
                                }}
                            >
                                x
                            </button>
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