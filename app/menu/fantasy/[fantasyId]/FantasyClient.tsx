'use client'

import { IMAGEM_JOGADOR_DEFAULT, IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"
import Template from "@/src/components/template/Template"
import { Campeonato } from "@/src/domain/Campeonato"
import { Jogador } from "@/src/domain/Jogador"
import { Countdown } from "@/src/utils/dataRegressiva"
import { getMediaUltimasPartidas } from "@/src/utils/EstatisticasDoJogador"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRef } from "react"
import { BsArrowRepeat } from "react-icons/bs"
import { FaCheckCircle, FaCrosshairs, FaFire, FaHandsHelping, FaMap, FaSkull, FaTrophy } from "react-icons/fa"
import { ImTarget } from "react-icons/im"
import { RiDeleteBin6Fill, RiDeleteBin7Fill } from "react-icons/ri"
import { TbCircleLetterCFilled } from "react-icons/tb"

interface FantasyClientProps {
    idCampeonato: string
}

type Posicao =
    | "awper"
    | "igl"
    | "rifler"
    | "entry"
    | "coach"

type Slot = {
    posicao: Posicao
    jogador: Jogador | null
    capitao: boolean
}

export default function FantasyClient({ idCampeonato }: FantasyClientProps) {
    const POSICOES: Posicao[] = [
        "awper",
        "igl",
        "rifler",
        "rifler",
        "entry",
        "coach"
    ]
    const [campeonatoAtual, setCampeonatoAtual] = useState<Campeonato | null>(null)
    const [listaDeJogadores, setListaDeJogadores] = useState<Jogador[]>([])
    const [listaDeJogadoresDisponiveis, setListaDeJogadoresDisponiveis] = useState<Jogador[]>([])

    const [campoSelecionado, setCampoSelecionado] = useState<number | null>(null)

    const [timeFantasy, setTimeFantasy] = useState<Slot[]>(
        POSICOES.map(pos => ({
            posicao: pos,
            jogador: null,
            capitao: false
        }))
    )
    const [flipIndex, setFlipIndex] = useState<number | null>(null)

    const camposRef = useRef<Array<HTMLLIElement | null>>([])

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

        if (campoSelecionado === 0) {
            const jogadores = jogadoresFiltrados.filter(jogador => jogador.papel === 'awper')
            setListaDeJogadoresDisponiveis(jogadores)
        } else if (campoSelecionado === 1) {
            const jogadores = jogadoresFiltrados.filter(jogador => jogador.papel === 'igl')
            setListaDeJogadoresDisponiveis(jogadores)
        } else if (campoSelecionado === 2 || campoSelecionado === 3) {
            const jogadores = jogadoresFiltrados.filter(jogador => jogador.papel === 'rifler')
            setListaDeJogadoresDisponiveis(jogadores)
        } else if (campoSelecionado === 4) {
            const jogadores = jogadoresFiltrados.filter(jogador => jogador.papel === 'entry')
            setListaDeJogadoresDisponiveis(jogadores)
        } else if (campoSelecionado === 5) {
            const jogadores = jogadoresFiltrados.filter(jogador => jogador.papel === 'coach')
            setListaDeJogadoresDisponiveis(jogadores)
        } else {
            setListaDeJogadoresDisponiveis(jogadoresFiltrados)
        }

    }, [campeonatoAtual, listaDeJogadores, campoSelecionado])


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
    }, [campoSelecionado])

    function selecionarJogador(jogador: Jogador) {
        if (campoSelecionado === null) return

        const slot = timeFantasy[campoSelecionado]

        if (jogador.papel !== slot.posicao) {
            alert("Jogador não é dessa posição")
            return
        }

        const novoTime = [...timeFantasy]

        const jaSelecionado = novoTime.some(s => s.jogador?.id === jogador.id)
        if (jaSelecionado) return

        novoTime[campoSelecionado] = {
            ...novoTime[campoSelecionado],
            jogador,
            capitao: false
        }
        setTimeFantasy(novoTime)
        setCampoSelecionado(null)
    }

    function removerJogador(index: number) {
        const novoTime = [...timeFantasy]

        novoTime[index] = {
            ...novoTime[index],
            jogador: null
        }

        setTimeFantasy(novoTime)
    }

    function removerTodosJogadores() {
        setTimeFantasy(
            POSICOES.map(pos => ({
                posicao: pos,
                jogador: null,
                capitao: false
            }))
        )
        setCampoSelecionado(null)
    }

    function definirCapitao(index: number) {
        const slotAtual = timeFantasy[index]

        // não deixa colocar capitão em slot vazio
        if (!slotAtual.jogador) return

        const novoTime = timeFantasy.map((slot, i) => {
            // clicou no mesmo → toggle
            if (i === index) {
                return {
                    ...slot,
                    capitao: !slot.capitao
                }
            }

            // todos os outros sempre false
            return {
                ...slot,
                capitao: false
            }
        })

        setTimeFantasy(novoTime)
    }

    async function salvarFantasy() {
        const res = await fetch("/api/fantasy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                campeonatoId: campeonatoAtual?.id,
                slots: timeFantasy
            })
        })

        const data = await res.json()
    }

    useEffect(() => {
        async function carregarFantasy() {
            if (!campeonatoAtual) return

            const res = await fetch(`/api/fantasy?campeonatoId=${campeonatoAtual.id}`)
            const data = await res.json()

            if (!data) return

            // 🔥 aqui você popula o estado
            setTimeFantasy(data.slots)
        }

        carregarFantasy()
    }, [campeonatoAtual])

    function getBgByCategoria(categoria?: string) {
        switch (categoria) {
            case "ouro":
                return "/default/categoria/ouro.png"
            case "prata":
                return "/default/categoria/prata.png"
            case "bronze":
                return "/default/categoria/bronze.png"
            default:
                return ""
        }
    }

    if (listaDeJogadoresDisponiveis.length <= 0) {
        return (
            <Template>
                <div className="bg-zinc-900 w-full">
                    <div className="p-4 text-white max-w-[1440px] w-full mx-auto flex flex-col gap-6">
                        <div>
                            <h1 className="font-heading text-4xl text-center">Bem Vindo ao Fantasy do campeonato <b className="capitalize">{campeonatoAtual?.slugId?.replaceAll('-', ' ')}</b></h1>
                            <p>
                                Escolha 5 players em suas posições específicas e um coach de responsa! Escolha seu capitão com cuidado pois pode dobrar tanto positivamente quanto negativamente!
                            </p>
                            <div className="flex justify-center">
                                <Countdown endDate={campeonatoAtual?.inicio!} frase="para o fechamento do Fantasy!" />
                            </div>
                        </div>
                        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {Array.from({ length: 16 }).map((_, i) => {
                                return (
                                    <li key={i} className="w-full h-[230px] max-w-[220px] perspective mx-auto sm:h-[280px] bg-zinc-600"></li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </Template>
        )
    }

    return (
        <Template>
            <div className="bg-zinc-900 w-full">
                <div className="p-4 text-white max-w-[1440px] w-full mx-auto flex flex-col gap-6">
                    <div>
                        <h1 className="font-heading text-4xl text-center">Bem Vindo ao Fantasy do campeonato <b className="capitalize">{campeonatoAtual?.slugId?.replaceAll('-', ' ')}</b></h1>
                        <p>
                            Escolha 5 players em suas posições específicas e um coach de responsa! Escolha seu capitão com cuidado pois pode dobrar tanto positivamente quanto negativamente!
                        </p>
                        <div className="flex justify-center">
                            <Countdown endDate={campeonatoAtual?.inicio!} frase="para o fechamento do Fantasy!" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        {/* campos */}
                        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
                            {timeFantasy.map((jogador, index) => {
                                return (
                                    <li
                                        key={index}
                                        onClick={() =>
                                            setCampoSelecionado((prev) =>
                                                prev === index ? null : index
                                            )
                                        }
                                        ref={(el) => {
                                            camposRef.current[index] = el
                                        }}
                                        className={`w-full h-[230px] max-w-[220px] perspective mx-auto cursor-pointer sm:h-[280px]
                                    ${campoSelecionado === index ? 'bg-orange-600 text-white' : 'bg-azul-escuro'}`}
                                    >
                                        {
                                            jogador.jogador === null ? (
                                                <div className="w-full h-full flex justify-center items-center text-white">
                                                    <h2 className="text-4xl font-heading capitalize">{jogador.posicao}</h2>
                                                </div>
                                            ) : (
                                                <div className={`w-full h-full grid grid-rows-[1fr_40px] text-white`} style={{
                                                    backgroundImage: `url(${getBgByCategoria(jogador.jogador?.categoria!)})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center"
                                                }}>
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            alt={jogador.jogador.nome}
                                                            src={jogador.jogador.imagem || IMAGEM_JOGADOR_DEFAULT}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <h2 className="bg-white text-black text-center font-heading text-xl h-full flex justify-center items-center md:text-2xl">
                                                        {jogador.jogador.apelido} - <b className="capitalize font-semibold">{jogador.jogador.papel}</b>
                                                    </h2>
                                                    {
                                                        jogador.jogador.papel != 'coach' ? (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    definirCapitao(index)
                                                                }}
                                                                className={`absolute top-2 left-2 text-xl cursor-pointer bg-azul-escuro p-1 rounded-full ${jogador.capitao ? "bg-orange-600" : "text-white"}`}
                                                            >
                                                                <TbCircleLetterCFilled
                                                                    className={`text-xl rounded-full`}
                                                                />
                                                            </button>
                                                        ) : ''
                                                    }
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            removerJogador(index)
                                                        }}
                                                        className="absolute top-2 right-2 text-lg cursor-pointer p-1 bg-red-600 rounded-full"
                                                    >
                                                        <RiDeleteBin6Fill />
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="bg-zinc-950 rounded-2xl text-white grid grid-cols-2 max-w-[400px] ml-auto gap-6 p-2">
                            <button className="flex items-center gap-1 p-2 font-heading text-2xl bg-red-500 rounded-2xl cursor-pointer" style={{ textShadow: '1px 1px 2px black' }} onClick={() => removerTodosJogadores()}>
                                <RiDeleteBin7Fill />
                                <p>Apagar Fantasy</p>
                            </button>
                            <button onClick={salvarFantasy} className="flex items-center gap-1 p-2 font-heading text-2xl bg-green-500 rounded-2xl cursor-pointer" style={{ textShadow: '1px 1px 2px black' }}>
                                <FaCheckCircle />
                                <p>Confirmar Fantasy</p>
                            </button>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-heading text-3xl">Lista de Jogadores disponíveis:</h3>
                        {/* jogadores disponiveis */}
                        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {listaDeJogadoresDisponiveis.map((jogador, index) => {
                                const media = getMediaUltimasPartidas(jogador.apelido)
                                console.log(media)
                                console.log(jogador)
                                return (
                                    <li key={jogador.id} className="w-full h-[230px] max-w-[220px] perspective mx-auto sm:h-[280px]" onClick={() => selecionarJogador(jogador)}>
                                        <div className={`relative w-full h-full duration-500 transform-style preserve-3d ${flipIndex === index ? 'rotate-y-180' : ''}`}>
                                            {/* FRENTE */}
                                            <div className="absolute w-full h-full backface-hidden bg-azul-escuro flex flex-col">
                                                <div className="grid grid-rows-[1fr_30px] relative w-full h-full md:grid-rows-[1fr_40px]">
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            alt={jogador.nome}
                                                            src={jogador.imagem || IMAGEM_JOGADOR_DEFAULT}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <h2 className="bg-white text-black text-center font-heading text-xl h-full flex justify-center items-center md:text-2xl">
                                                        {jogador.apelido}
                                                    </h2>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation() // evita conflitos
                                                            setFlipIndex(index)
                                                        }}
                                                        className="absolute top-1 right-1 text-white cursor-pointer md:text-xl md:top-2 md:right-2"
                                                    >
                                                        <BsArrowRepeat />
                                                    </button>

                                                </div>
                                            </div>

                                            {/* VERSO */}
                                            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-black text-white flex flex-col items-center justify-center">
                                                <ul className="flex flex-col gap-1 text-sm w-full p-4">
                                                    <li className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <FaMap />
                                                            <p>Mapas Jogados</p>
                                                        </div>
                                                        <span>{0}</span>
                                                    </li>

                                                    <li className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <FaCrosshairs />
                                                            <p>Rounds Jogados</p>
                                                        </div>
                                                        <span>{0}</span>
                                                    </li>

                                                    <li className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-green-600">
                                                            <FaFire />
                                                            <p>Kills</p>
                                                        </div>
                                                        <span>{media?.kills}</span>
                                                    </li>

                                                    <li className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-red-600">
                                                            <FaSkull />
                                                            <p>Mortes</p>
                                                        </div>
                                                        <span>{media?.deaths}</span>
                                                    </li>

                                                    <li className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-blue-600">
                                                            <FaHandsHelping />
                                                            <p>Assistências</p>
                                                        </div>
                                                        <span>{media?.assists}</span>
                                                    </li>

                                                    <li className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-yellow-600">
                                                            <FaTrophy />
                                                            <p>Clutches</p>
                                                        </div>
                                                        <span>{media?.clutchVitorias}</span>
                                                    </li>
                                                    <li className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-orange-600">
                                                            <ImTarget />
                                                            <p>Headshots</p>
                                                        </div>
                                                        <span>{media?.headshots}</span>
                                                    </li>

                                                    <li className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-purple-600">
                                                            <FaFire />
                                                            <p>KD</p>
                                                        </div>
                                                        <span>{media && (media?.kills / Math.max(media?.deaths, 1)).toFixed(2)}</span>
                                                    </li>

                                                    <li className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-indigo-500">
                                                            <FaCrosshairs />
                                                            <p>ADR</p>
                                                        </div>
                                                        <span>{media?.adr.toFixed(2)}</span>
                                                    </li>

                                                    <li className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-orange-600">
                                                            <ImTarget />
                                                            <p>Rating Médio</p>
                                                        </div>
                                                        <span>{media?.rating.toFixed(2)}</span>
                                                    </li>
                                                </ul>
                                                <div className="absolute w-full h-full">
                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation() // evita conflitos
                                                                setFlipIndex(null)
                                                            }}
                                                            className="absolute top-1 right-1 text-white cursor-pointer md:text-xl md:top-2 md:right-2"
                                                        >
                                                            <BsArrowRepeat />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </Template>
    )
}