'use client'

import { IMAGEM_JOGADOR_DEFAULT, IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"
import Template from "@/src/components/template/Template"
import { Campeonato } from "@/src/domain/Campeonato"
import { Jogador } from "@/src/domain/Jogador"
import { getTeamById } from "@/src/services/team.service"
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
import { Accordion, AccordionTab } from 'primereact/accordion';
import { encerramentoDaEscalacaoDoFantasy, getPontuacaoDetalhadaJogadorNoCampeonato } from "@/src/services/fantasy.service"
import { Posicao } from "@/src/domain/Posicao"


interface FantasyClientProps {
    idCampeonato: string
}

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
    const [modal, setModal] = useState<"confirmar" | "erro" | null>(null)
    const [mensagemErro, setMensagemErro] = useState<string>("")
    const [podeEscalar, setPodeEscalar] = useState(true)

    const [timeFantasy, setTimeFantasy] = useState<Slot[]>(
        POSICOES.map(pos => ({
            posicao: pos,
            jogador: null,
            capitao: false
        }))
    )

    const [flippedSlots, setFlippedSlots] = useState<boolean[]>(
        Array(POSICOES.length).fill(false)
    )
    const [flippedJogadores, setFlippedJogadores] = useState<number | null>(null)

    const camposRef = useRef<Array<HTMLLIElement | null>>([])

    useEffect(() => {
        const podeEscalar = encerramentoDaEscalacaoDoFantasy(campeonatoAtual?.inicio!)
        setPodeEscalar(podeEscalar)
    }, [campeonatoAtual])

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

        // 1. valida posição
        if (jogador.papel !== slot.posicao) {
            alert("Jogador não é dessa posição")
            return
        }

        const novoTime = [...timeFantasy]

        // 2. não permitir duplicado
        const jaSelecionado = novoTime.some(s => s.jogador?.id === jogador.id)
        if (jaSelecionado) return

        // 3. contar categorias atuais
        const contagemCategorias = {
            ouro: 0,
            prata: 0,
            bronze: 0
        }

        novoTime.forEach(s => {
            if (!s.jogador) return

            // 👉 ignora o slot atual (porque vai ser substituído)
            if (s === slot) return

            const categoria = s.jogador.categoria
            if (categoria) {
                contagemCategorias[categoria as keyof typeof contagemCategorias]++
            }
        })

        // 4. validar limite
        const categoriaJogador = jogador.categoria as keyof typeof contagemCategorias

        if (
            categoriaJogador &&
            contagemCategorias[categoriaJogador] >= 2
        ) {
            setMensagemErro(`Você já possui 2 jogadores ${categoriaJogador.toUpperCase()}.`)
            setModal("erro")
            return
        }

        // 5. adiciona jogador
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

    async function confirmarFantasy() {
        await salvarFantasy()
        setModal(null)
    }

    function validarFantasy() {
        // 1. todos os jogadores preenchidos
        const slotsIncompletos = timeFantasy.some(slot => slot.jogador === null)

        if (slotsIncompletos) {
            return {
                valido: false,
                mensagem: "Preencha todos os jogadores antes de confirmar."
            }
        }

        // 2. capitão selecionado
        const capitoes = timeFantasy.filter(slot => slot.capitao)

        if (capitoes.length === 0) {
            return {
                valido: false,
                mensagem: "Escolha um capitão para o seu time."
            }
        }

        // 3. segurança extra (caso bug permita mais de um)
        if (capitoes.length > 1) {
            return {
                valido: false,
                mensagem: "Apenas um capitão é permitido."
            }
        }

        // 4. limite de categorias
        const contagemCategorias = {
            ouro: 0,
            prata: 0,
            bronze: 0
        }

        timeFantasy.forEach(slot => {
            const categoria = slot.jogador?.categoria

            if (categoria && contagemCategorias[categoria as keyof typeof contagemCategorias] !== undefined) {
                contagemCategorias[categoria as keyof typeof contagemCategorias]++
            }
        })

        // valida limites
        if (contagemCategorias.ouro > 2) {
            return {
                valido: false,
                mensagem: "Você só pode ter no máximo 2 jogadores Ouro."
            }
        }

        if (contagemCategorias.prata > 2) {
            return {
                valido: false,
                mensagem: "Você só pode ter no máximo 2 jogadores Prata."
            }
        }

        if (contagemCategorias.bronze > 2) {
            return {
                valido: false,
                mensagem: "Você só pode ter no máximo 2 jogadores Bronze."
            }
        }

        return {
            valido: true,
            mensagem: ""
        }
    }

    function handleAbrirConfirmacao() {
        const validacao = validarFantasy()

        if (!validacao.valido) {
            setMensagemErro(validacao.mensagem)
            setModal("erro")
            return
        }

        setModal("confirmar")
    }

    function toggleFlip(index: number) {
        setFlippedSlots(prev => {
            const novo = [...prev]
            novo[index] = !novo[index]
            return novo
        })
    }

    const jogadoresOrdenados = [...listaDeJogadoresDisponiveis].sort((a, b) => {
        const pontuacaoA = getPontuacaoDetalhadaJogadorNoCampeonato(
            idCampeonato,
            a.apelido,
            listaDeJogadores
        )?.total ?? -9999

        const pontuacaoB = getPontuacaoDetalhadaJogadorNoCampeonato(
            idCampeonato,
            b.apelido,
            listaDeJogadores
        )?.total ?? -9999

        return pontuacaoB - pontuacaoA // maior primeiro
    })

    function renderizarCampoPontuacao(nomeDoCampo: string, valor: string, pontuacao = true, capitao = false) {
        return (
            <li className={`flex justify-between ${nomeDoCampo.toLowerCase() === 'total' ? 'font-heading text-2xl' : ''}`}>
                <span>{nomeDoCampo}</span>
                <span className={`
                    font-bold 
                    ${pontuacao == false ? 'text-white' : ''}
                    ${pontuacao && parseFloat(valor) > 0 ? 'text-green-600' : 'text-red-500'}
                `}>
                    {
                        capitao ? (
                            <div className="flex items-end gap-2">
                                <span className="text-sm mb-1">2x {valor}</span>
                                <b>{(parseFloat(valor) * 2).toFixed(2)} pts</b>
                            </div>
                        ) : (
                            `
                                ${parseFloat(valor).toFixed(2)} ${pontuacao ? 'pts' : ''}
                            `
                        )
                    }
                </span>
            </li>
        )
    }

    function calcularPontuacaoTotalTime() {
        return timeFantasy.reduce((total, slot) => {
            if (!slot.jogador) return total

            const pontuacao = getPontuacaoDetalhadaJogadorNoCampeonato(
                idCampeonato,
                slot.jogador.apelido,
                listaDeJogadores
            )

            let pontos = pontuacao?.total ?? 0

            if (slot.capitao) {
                pontos *= 2
            }

            return total + pontos
        }, 0)
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
                        <h1 className="font-heading text-4xl text-center">
                            Bem Vindo ao Fantasy do campeonato{" "}
                            <b className="capitalize">
                                {campeonatoAtual?.slugId?.replaceAll("-", " ")}
                            </b>
                        </h1>

                        <p>
                            Escolha 5 players em suas posições específicas e um coach de responsa!
                            Escolha seu capitão com cuidado pois pode dobrar tanto positivamente quanto negativamente!
                        </p>

                        <div className="flex justify-center">
                            <Countdown endDate={campeonatoAtual?.inicio!} frase="para o fechamento do Fantasy!" />
                        </div>
                    </div>

                    {/* Jogadores Escolhidos pro Fantasy */}
                    <div className="flex flex-col gap-4">
                        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
                            {timeFantasy.map((jogador, index) => {
                                const pontuacao = jogador.jogador
                                    ? getPontuacaoDetalhadaJogadorNoCampeonato(
                                        idCampeonato,
                                        jogador.jogador.apelido,
                                        listaDeJogadores
                                    )
                                    : null
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
                                            ${campoSelecionado === index ? "bg-orange-600 text-white" : "bg-azul-escuro"}`}
                                    >
                                        {jogador.jogador === null ? (
                                            <div className="w-full h-full flex justify-center items-center text-white">
                                                <h2 className="text-4xl font-heading capitalize">
                                                    {jogador.posicao}
                                                </h2>
                                            </div>
                                        ) : (
                                            <div
                                                className={`relative w-full h-full text-white duration-500 transform-style preserve-3d ${flippedSlots[index] ? "rotate-y-180" : ""}`}
                                            >
                                                {/* Frente */}
                                                <div
                                                    className="w-full h-full grid grid-rows-[1fr_40px] text-white absolute backface-hidden bg-azul-escuro"
                                                    style={{
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
                                                    <h2 className="bg-white text-black text-center font-heading text-xl flex items-center justify-center md:text-2xl">
                                                        {jogador.jogador.apelido} - {" "}
                                                        <b className="capitalize font-semibold">
                                                            {jogador.jogador.papel}
                                                        </b>
                                                    </h2>

                                                    {jogador.jogador.papel !== "coach" && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                definirCapitao(index)
                                                            }}
                                                            className={`absolute top-2 left-2 text-xl p-1 rounded-full ${jogador.capitao ? "bg-orange-600" : "bg-azul-escuro text-white"
                                                                }`}
                                                        >
                                                            <TbCircleLetterCFilled />
                                                        </button>
                                                    )}
                                                    {
                                                        podeEscalar ? (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    removerJogador(index)
                                                                }}
                                                                className="absolute bottom-2 right-1 text-lg p-1 bg-red-600 rounded-full"
                                                            >
                                                                <RiDeleteBin6Fill />
                                                            </button>
                                                        ) : ''
                                                    }
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleFlip(index)
                                                        }}
                                                        className="absolute top-2 right-2 text-white bg-azul-escuro rounded-full p-1 md:text-xl"
                                                    >
                                                        <BsArrowRepeat />
                                                    </button>
                                                </div>
                                                {/* Verso */}
                                                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-black text-white flex flex-col items-center justify-center">
                                                    <div className="flex flex-col w-full">
                                                        <h2 className="text-center font-heading text-xl">Pontuação</h2>
                                                        <ul className="flex flex-col text-sm w-full px-4">
                                                            {renderizarCampoPontuacao('Kills', pontuacao?.kills.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Mortes', pontuacao?.deaths.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('ADR', pontuacao?.adr.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Assistência', pontuacao?.assists.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Assistência Flash', pontuacao?.assistFlash.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Clutchs', pontuacao?.clutch.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Primeira Kill', pontuacao?.firstKills.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Primeira a Morrer', pontuacao?.firstDeaths.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Headshots', pontuacao?.headshots.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Traded', pontuacao?.traded.toFixed(1)!)}
                                                            {
                                                                jogador.capitao ? (
                                                                    renderizarCampoPontuacao('Total', pontuacao?.total.toFixed(2)!, true, true)
                                                                ) : (
                                                                    renderizarCampoPontuacao('Total', pontuacao?.total.toFixed(2)!)
                                                                )
                                                            }
                                                        </ul>
                                                        {jogador.jogador.papel !== "coach" && (
                                                            <button
                                                                className={`absolute top-2 left-2 p-1 rounded-full ${jogador.capitao ? "bg-orange-600" : "bg-azul-escuro text-white"
                                                                    }`}
                                                            >
                                                                <TbCircleLetterCFilled />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleFlip(index)
                                                        }}
                                                        className="absolute top-1 right-1 text-white bg-azul-escuro rounded-full p-1 md:text-xl"
                                                    >
                                                        <BsArrowRepeat />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>

                        <div className="flex items-center">
                            <div className={`font-heading text-4xl ${podeEscalar ? 'hidden' : 'flex'}`}>
                                <h4>
                                    Pontuação total até o momento:{" "}
                                    <b>{calcularPontuacaoTotalTime().toFixed(2)} pts</b>
                                </h4>
                            </div>
                            {/* botões */}
                            <div className="bg-zinc-950 rounded-2xl text-white grid grid-cols-2 max-w-[400px] ml-auto gap-6 p-2">
                                <button
                                    onClick={removerTodosJogadores}
                                    className={`flex items-center gap-1 p-2 font-heading text-2xl bg-red-500 rounded-2xl ${podeEscalar ? 'opacity-100' : 'opacity-50'}`}
                                    style={{ textShadow: "1px 1px 2px black" }}
                                    disabled={!podeEscalar}
                                >
                                    <RiDeleteBin7Fill />
                                    <p>Apagar Fantasy</p>
                                </button>

                                <button
                                    onClick={handleAbrirConfirmacao}
                                    className={`flex items-center gap-1 p-2 font-heading text-2xl bg-green-500 rounded-2xl ${podeEscalar ? 'opacity-100' : 'opacity-50'}`}
                                    style={{ textShadow: "1px 1px 2px black" }}
                                    disabled={!podeEscalar}
                                >
                                    <FaCheckCircle />
                                    <p>Confirmar Fantasy</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Jogadores */}
                    <div className="flex flex-col gap-4">
                        {
                            podeEscalar ? (
                                <div className="flex flex-col gap-4">
                                    <h3 className="font-heading text-3xl">
                                        Lista de Jogadores disponíveis:
                                    </h3>

                                    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                                        {listaDeJogadoresDisponiveis.map((jogador, index) => {
                                            const media = getMediaUltimasPartidas(jogador.apelido)
                                            return (
                                                <li
                                                    key={jogador.id}
                                                    className="w-full h-[230px] max-w-[220px] perspective mx-auto sm:h-[280px]"
                                                    onClick={() => selecionarJogador(jogador)}
                                                >
                                                    <div
                                                        className={`relative w-full h-full duration-500 transform-style preserve-3d ${flippedJogadores === index ? "rotate-y-180" : ""}`}
                                                    >
                                                        {/* frente */}
                                                        <div
                                                            className="absolute w-full h-full backface-hidden bg-azul-escuro flex flex-col"
                                                            style={{
                                                                backgroundImage: `url(${getBgByCategoria(jogador?.categoria!)})`,
                                                                backgroundSize: "cover",
                                                                backgroundPosition: "center"
                                                            }}>
                                                            <div className="grid grid-rows-[1fr_30px] relative w-full h-full md:grid-rows-[1fr_40px]">
                                                                <div className="relative w-full h-full">
                                                                    <Image
                                                                        alt={jogador.nome}
                                                                        src={jogador.imagem || IMAGEM_JOGADOR_DEFAULT}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>

                                                                <h2 className="bg-white text-black text-center font-heading text-xl flex items-center justify-center md:text-2xl">
                                                                    {jogador.apelido}
                                                                </h2>

                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setFlippedJogadores(prev => prev === index ? null : index)
                                                                    }}
                                                                    className="absolute top-1 right-1 text-white bg-azul-escuro rounded-full p-1"
                                                                >
                                                                    <BsArrowRepeat />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* verso */}
                                                        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-black text-white flex flex-col items-center justify-center">
                                                            <div className="w-full h-full flex flex-col justify-center items-center">
                                                                <h2 className="font-heading text-xl">Estatísticas</h2>
                                                                <ul className="flex flex-col gap-1 text-sm w-full px-4">
                                                                    {renderizarCampoPontuacao('Kills', media?.kills.toString()!, false)}
                                                                    {renderizarCampoPontuacao('Mortes', media?.deaths.toString()!, false)}
                                                                    {renderizarCampoPontuacao('ADR', media?.adr.toString()!, false)}
                                                                    {renderizarCampoPontuacao('Assistência', media?.assists.toString()!, false)}
                                                                    {renderizarCampoPontuacao('Assistência Flash', media?.assistFlash.toString()!, false)}
                                                                    {renderizarCampoPontuacao('Clutchs', media?.clutchVitorias.toString()!, false)}
                                                                    {renderizarCampoPontuacao('Primeira Kill', media?.firstKills.toString()!, false)}
                                                                    {renderizarCampoPontuacao('Primeiro a Morrer', media?.firtsDeaths.toString()!, false)}
                                                                    {renderizarCampoPontuacao('Headshots', media?.headshots.toString()!, false)}
                                                                    {renderizarCampoPontuacao('Traded', media?.traded.toString()!, false)}
                                                                </ul>
                                                            </div>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setFlippedJogadores(prev => prev === index ? null : index)
                                                                }}
                                                                className="absolute top-2 right-2 text-white"
                                                            >
                                                                <BsArrowRepeat />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            ) : ''
                        }
                        {
                            !podeEscalar ? (
                                <div className="flex flex-col gap-4">
                                    <h3 className="font-heading text-3xl">
                                        Pontuação dos jogadores até o momento:
                                    </h3>
                                    {/* Accordion de pontuação */}
                                    <Accordion>
                                        {jogadoresOrdenados.map((jogador) => {
                                            const time = getTeamById(jogador.timeAtual)
                                            const pontuacao = getPontuacaoDetalhadaJogadorNoCampeonato(
                                                idCampeonato,
                                                jogador.apelido,
                                                listaDeJogadores
                                            )
                                            return (
                                                <AccordionTab
                                                    key={jogador.id}
                                                    header={
                                                        <div className="flex items-center">
                                                            <div className="relative w-8 h-8">
                                                                <Image alt={time?.nome!} src={time?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                            </div>
                                                            <div className="relative w-16 h-16">
                                                                <Image alt={jogador.nome} src={jogador.imagem || IMAGEM_TIME_DEFAULT} fill className="object-cover" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <h2 className="font-heading text-2xl">{jogador.nome.split(' ')[0]}{" "}"{jogador.apelido}"{" "}{jogador.nome.split(' ')[0]}</h2>
                                                                <span className="text-sm capitalize">{jogador.papel}</span>
                                                            </div>
                                                            <h2 className="ml-auto font-heading text-3xl">{pontuacao.total.toFixed(2)}</h2>
                                                        </div>
                                                    }>
                                                    <ul className="flex flex-col text-sm w-full px-4">
                                                        {renderizarCampoPontuacao('Kills', pontuacao?.kills.toFixed(1)!)}
                                                        {renderizarCampoPontuacao('Mortes', pontuacao?.deaths.toFixed(1)!)}
                                                        {renderizarCampoPontuacao('ADR', pontuacao?.adr.toFixed(1)!)}
                                                        {renderizarCampoPontuacao('Assistência', pontuacao?.assists.toFixed(1)!)}
                                                        {renderizarCampoPontuacao('Assistência Flash', pontuacao?.assistFlash.toFixed(1)!)}
                                                        {renderizarCampoPontuacao('Clutchs', pontuacao?.clutch.toFixed(1)!)}
                                                        {renderizarCampoPontuacao('Primeira Kill', pontuacao?.firstKills.toFixed(1)!)}
                                                        {renderizarCampoPontuacao('Primeira a Morrer', pontuacao?.firstDeaths.toFixed(1)!)}
                                                        {renderizarCampoPontuacao('Headshots', pontuacao?.headshots.toFixed(1)!)}
                                                        {renderizarCampoPontuacao('Traded', pontuacao?.traded.toFixed(1)!)}
                                                        {renderizarCampoPontuacao('Total', pontuacao?.total.toFixed(2)!)}
                                                    </ul>
                                                </AccordionTab>
                                            )
                                        })}
                                    </Accordion>
                                </div>
                            ) : ''
                        }
                    </div>

                    {/* Modal */}
                    {
                        modal === "confirmar" && (
                            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                                <div className="bg-zinc-900 p-6 rounded-2xl text-white w-[90%] max-w-[400px] flex flex-col gap-4">

                                    <h2 className="text-2xl font-heading text-center">
                                        Confirmar Fantasy
                                    </h2>

                                    <p className="text-center">
                                        Tem certeza que deseja confirmar seu time?
                                    </p>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setModal(null)}
                                            className="w-full bg-red-500 p-2 rounded-xl font-heading text-2xl"
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            onClick={confirmarFantasy}
                                            className="w-full bg-green-500 p-2 rounded-xl font-heading text-2xl"
                                        >
                                            Confirmar
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )
                    }

                    {
                        modal === "erro" && (
                            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                                <div className="bg-zinc-900 p-6 rounded-2xl text-white w-[90%] max-w-[400px] flex flex-col gap-4">

                                    <h2 className="text-4xl font-heading text-center">
                                        {mensagemErro}
                                    </h2>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setModal(null)}
                                            className="w-full bg-red-500 p-1 rounded-xl font-heading text-2xl"
                                        >
                                            Fechar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div>
            </div>
        </Template>
    )
}