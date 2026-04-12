'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { FaShieldHeart } from "react-icons/fa6"
import { GoShieldX } from "react-icons/go"
import { Time } from "@/src/domain/Time"
import { Regiao } from "@/src/domain/Tipos"
import { getAllTeams, getTeamById } from "@/src/services/team.service"
import { Noticia } from "@/src/domain/Noticia"
import { getNewsByTeam } from "@/src/services/news.service"
import { Partida } from "@/src/domain/Partida"
import { IMAGEM_JOGADOR_DEFAULT, IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { getAllPartidas } from "@/src/services/partidas.service"
import { getPlayerById } from "@/src/services/player.service"
import { Jogador } from "@prisma/client"


export default function SeletorDeTimes() {
    const [times, setTimes] = useState<Time[]>([])
    const [regiaoSelecionada, setRegiaoSelecionada] = useState<Regiao>('SA')
    const [timeSelecionado, setTimeSelecionado] = useState<Time | null>(null)
    const [timeSelecionadoConfirmado, setTimeSelecionadoConfirmado] = useState(false)
    const [noticiasTimeAtual, setNoticiasTimeAtual] = useState<Noticia[]>([])
    const [listaDeJogadores, setListaDeJogadores] = useState<Jogador[]>([])
    const [jogadorEstrela, setJogadorEstrela] = useState<Jogador | null>(null)
    const [noticias, setNoticias] = useState<Noticia[]>([])

    const partidas = getAllPartidas()
    const partidasFiltradasPorTime = partidas
        .filter(partida =>
            partida.timeAId === timeSelecionado?.id ||
            partida.timeBId === timeSelecionado?.id
        )
        .filter(partida =>
            partida.situacao === 'agendado' ||
            partida.situacao === 'em-andamento'
        )
        .filter(partida =>
            new Date(partida.data) >= new Date()
        )
        .sort((a, b) =>
            new Date(a.data).getTime() - new Date(b.data).getTime()
        )

    const partidasPassadas = partidas
        .filter(partida =>
            partida.timeAId === timeSelecionado?.id ||
            partida.timeBId === timeSelecionado?.id
        )
        .filter(partida =>
            partida.situacao === 'finalizado'
        )
        .sort((a, b) =>
            new Date(b.data).getTime() - new Date(a.data).getTime() // mais recente primeiro
        )


    useEffect(() => {
        const teams = getAllTeams()
        setTimes(teams)

        const savedTimeId = localStorage.getItem("timeSelecionado")

        if (savedTimeId) {
            const time = getTeamById(savedTimeId)

            if (time) {
                setTimeSelecionado(time)
                setTimeSelecionadoConfirmado(true)
            }
        }
    }, [])

    const proximaPartida = partidasFiltradasPorTime[0] === null || partidasFiltradasPorTime[0] === undefined ? partidasPassadas[0] : partidasFiltradasPorTime[0]

    useEffect(() => {
        if (timeSelecionado) {
            const not = noticias.filter(noticia => noticia.timesRelacionados?.includes(timeSelecionado.id))
            setNoticiasTimeAtual(not.slice(0, 4))
        }
    }, [timeSelecionado, noticias])

    const timesFiltrados = times.filter(
        time => time.regiao === regiaoSelecionada
    ).slice(0, 20)

    // Noticias do backend
    useEffect(() => {
        async function fetchNews() {
            const res = await fetch("/api/news")
            const data = await res.json()

            if (!Array.isArray(data)) {
                console.log("API BUGOU:", data)
                setNoticias([])
                return
            }

            setNoticias(data.filter(n => n && n.id))
        }

        fetchNews()
    }, [timeSelecionado])

    useEffect(() => {
        async function fetchListaDeJogadores() {
            if (!timeSelecionado?.jogadorEstrela?.idJogador) return

            const res = await fetch("/api/jogador")
            const data = await res.json()

            if (!Array.isArray(data)) return

            const jogador = data.find(j =>
                j.apelido.toLowerCase() === timeSelecionado.jogadorEstrela?.idJogador.toLowerCase()
            )
            setJogadorEstrela(jogador || null)
        }

        fetchListaDeJogadores()
    }, [timeSelecionado])


    return (
        <nav className="bg-white text-azul-escuro mt-4">
            {
                !timeSelecionadoConfirmado && (
                    <div className="flex flex-col h-130 md:h-112.5 xl:h-120">
                        <div className="bg-azul-escuro text-white p-2 text-2xl font-heading flex items-center justify-between lg:text-3xl">
                            <h2>Selecione Sua Org do Coração</h2>
                            <FaShieldHeart />
                        </div>
                        <div className="grid grid-cols-5 gap-2 mx-2">
                            <button className={`font-bold py-2 cursor-pointer ${regiaoSelecionada === 'SA' ? 'border-b border-azul-escuro text-azul-escuro' : ' border-0 text-zinc-400'}`} onClick={
                                () => {
                                    setRegiaoSelecionada("SA")
                                    setTimeSelecionado(null)
                                }
                            }
                            >
                                SA
                            </button>
                            <button className={`font-bold py-2 cursor-pointer ${regiaoSelecionada === 'NA' ? 'border-b border-azul-escuro text-azul-escuro' : ' border-0 text-zinc-400'}`} onClick={
                                () => {
                                    setRegiaoSelecionada("NA")
                                    setTimeSelecionado(null)
                                }
                            }
                            >
                                NA
                            </button>
                            <button className={`font-bold py-2 cursor-pointer ${regiaoSelecionada === 'EU' ? 'border-b border-azul-escuro text-azul-escuro' : ' border-0 text-zinc-400'}`} onClick={
                                () => {
                                    setRegiaoSelecionada("EU")
                                    setTimeSelecionado(null)
                                }
                            }
                            >
                                EU
                            </button>
                            <button className={`font-bold py-2 cursor-pointer ${regiaoSelecionada === 'AS' ? 'border-b border-azul-escuro text-azul-escuro' : ' border-0 text-zinc-400'}`} onClick={
                                () => {
                                    setRegiaoSelecionada("AS")
                                    setTimeSelecionado(null)
                                }
                            }
                            >
                                AS
                            </button>
                            <button className={`font-bold py-2 cursor-pointer ${regiaoSelecionada === 'OC' ? 'border-b border-azul-escuro text-azul-escuro' : ' border-0 text-zinc-400'}`} onClick={
                                () => {
                                    setRegiaoSelecionada("OC")
                                    setTimeSelecionado(null)
                                }
                            }
                            >
                                OC
                            </button>
                        </div>
                        <div className="xl:grid xl:grid-cols-[1fr_500px] xl:gap-6 h-full">
                            <div className="grid grid-cols-4 gap-2 mt-3 mx-2 md:grid-cols-5">
                                {
                                    timesFiltrados.length <= 0 ? (
                                        Array.from({ length: 10 }).map((_, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col justify-center items-center rounded-md p-1 animate-pulse"
                                            >
                                                <div className="w-8 h-8 bg-gray-300 rounded-md mb-1" />
                                                <div className="w-10 h-3 bg-gray-300 rounded-md" />
                                            </div>
                                        ))
                                    ) : (
                                        timesFiltrados.map(time => {
                                            return (
                                                <div
                                                    key={time.id}
                                                    onClick={() => {
                                                        setTimeSelecionado(time)
                                                    }}
                                                    className={`flex flex-col justify-center items-center rounded-md p-1 cursor-pointer ${timeSelecionado != null && time.id === timeSelecionado.id ? 'border border-azul-escuro bg-azul-escuro/40' : ''} hover:bg-azul-escuro/40 hover:border hover:border-azul-escuro`}
                                                >
                                                    <div className="relative w-8 h-8">
                                                        <Image alt={`Logo do Time ${time.nome}`} src={time.imagem} fill className="object-contain" />
                                                    </div>
                                                    <h3 className="uppercase truncate max-w-12.5 sm:max-w-25">{time.id}</h3>
                                                </div>
                                            )
                                        })
                                    )
                                }

                            </div>
                            <div className="hidden xl:flex justify-center items-center p-8">
                                <h2 className="text-center font-heading text-5xl">Escolha sua Organização Favorita e fique por dentro de todas as novidades do seu time do coração</h2>
                            </div>
                        </div>
                        <button
                            className={`${timeSelecionado === null ? 'bg-azul-escuro/50 text-black border border-zinc-700' : ''} cursor-pointer capitalize text-center flex justify-center items-center w-full text-white bg-azul-escuro text-lg py-2 font-bold mt-3`}
                            onClick={() => {
                                if (timeSelecionado) {
                                    localStorage.setItem("timeSelecionado", timeSelecionado.id)
                                    setTimeSelecionadoConfirmado(true)
                                }
                            }}
                        >
                            Confirmar {timeSelecionado != null ? timeSelecionado.nome : ''}
                        </button>
                    </div>
                )
            }
            {
                timeSelecionadoConfirmado && timeSelecionado && (
                    <div className="grid grid-rows-[60px_1fr_40px] h-128.75 md:h-111.25 lg:h-112.5">
                        <div className="bg-azul-escuro text-white p-2 text-3xl font-heading flex items-center gap-2 lg:text-3xl">
                            <div className="relative w-8 h-8">
                                <Image alt={timeSelecionado?.nome} src={timeSelecionado?.imagem} fill className="object-contain" />
                            </div>
                            <h2 className="mt-1">{timeSelecionado?.nome}</h2>
                        </div>

                        <div className="p-4 overflow-hidden">
                            <Swiper
                                modules={[Autoplay, Pagination, Navigation]}
                                slidesPerView={1}
                                loop
                                autoplay={{
                                    delay: 7000,
                                    disableOnInteraction: false,
                                }}
                                spaceBetween={15}
                                breakpoints={{
                                    768: {
                                        slidesPerView: 2
                                    },
                                    1024: {
                                        slidesPerView: 3
                                    },
                                    1280: {
                                        slidesPerView: 4
                                    }
                                }}
                                pagination={{ clickable: true }}
                                navigation
                                className="w-full h-full"
                            >
                                {
                                    noticiasTimeAtual.length <= 0 ? (
                                        Array.from({ length: 4 }).map((_, index) => (
                                            <SwiperSlide key={index}>
                                                <div
                                                    key={index}
                                                    className="w-full bg-zinc-400 p-4 flex flex-col gap-4 h-75 md:h-47.5 xl:h-65"
                                                >
                                                    <div className="grid grid-rows-2 h-full w-full gap-4 sm:flex sm:flex-col md:grid md:grid-rows-1 md:grid-cols-2 pt-2">
                                                        <div className="w-full h-full flex flex-col">
                                                            <h2 className="w-full bg-zinc-500 h-10"></h2>
                                                            <div className="flex flex-col gap-2 flex-1">
                                                                <p className="w-full bg-zinc-500 h-5"></p>
                                                                <p className="w-full bg-zinc-500 h-5"></p>
                                                                <p className="w-full bg-zinc-500 h-5"></p>
                                                            </div>
                                                            <p className="w-full bg-zinc-500 h-5"></p>
                                                        </div>
                                                        <div className="w-full h-full bg-zinc-500"></div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))
                                    ) : (
                                        noticiasTimeAtual.slice(0, 5).map((noticia) => (
                                            <SwiperSlide key={noticia.id}>
                                                <Link href={`/noticia/${noticia.slug}`} className="block relative h-full">
                                                    <Image
                                                        src={noticia.thumbnail}
                                                        alt={noticia.titulo}
                                                        fill
                                                        className="object-cover rounded-xl"
                                                        priority
                                                    />

                                                    <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col justify-end p-6">
                                                        <h3 className="text-2xl font-bold text-white line-clamp-3">
                                                            {noticia.titulo}
                                                        </h3>
                                                    </div>
                                                </Link>
                                            </SwiperSlide>
                                        ))
                                    )
                                }
                                {
                                    proximaPartida != null ? (
                                        <SwiperSlide>
                                            <Link href={`/paginaPartida/${proximaPartida.id}`} className="w-full h-full p-4 flex flex-col rounded-xl bg-zinc-950 text-white relative">
                                                <div>
                                                    <span className="capitalize font-bold text-lg truncate max-w-[90%]">{proximaPartida.campeonatoId?.replaceAll('-', ' ')}</span>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex items-center gap-1 max-w-[150px] w-full">
                                                                <div className="relative w-10 h-10">
                                                                    <Image alt={`${getTeamById(proximaPartida.timeAId)?.nome}`} src={getTeamById(proximaPartida.timeAId)?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                                </div>
                                                                <h2 className="capitalize font-heading text-4xl mt-2">{getTeamById(proximaPartida.timeAId)?.id}</h2>
                                                            </div>
                                                            {
                                                                proximaPartida.situacao === 'finalizado' ? (
                                                                    <div className="bg-zinc-300 w-8 h-8 flex justify-center items-center text-black">
                                                                        <span className="font-heading text-4xl leading-7 mt-2">{proximaPartida.placar.timeA}</span>
                                                                    </div>
                                                                ) : ''
                                                            }
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex items-center gap-1 max-w-[150px] w-full">
                                                                <div className="relative w-10 h-10">
                                                                    <Image alt={`${getTeamById(proximaPartida.timeBId)?.nome}`} src={getTeamById(proximaPartida.timeBId)?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                                </div>
                                                                <h2 className="capitalize font-heading text-4xl mt-2">{getTeamById(proximaPartida.timeBId)?.id}</h2>
                                                            </div>
                                                            {
                                                                proximaPartida.situacao === 'finalizado' ? (
                                                                    <div className="bg-zinc-300 w-8 h-8 flex justify-center items-center text-black">
                                                                        <span className="font-heading text-4xl leading-7 mt-2">{proximaPartida.placar.timeB}</span>
                                                                    </div>
                                                                ) : ''
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="max-w-[65%]">
                                                        <p>
                                                            {new Date(proximaPartida.data).toLocaleDateString('pt-BR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                            {' às '}
                                                            {new Date(proximaPartida.data).toLocaleTimeString('pt-BR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                            {" - "}
                                                            <b className="capitalize">{proximaPartida.fase.replaceAll('-', ' ')}</b>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 mt-auto">
                                                    <button className="bg-azul-escuro p-2 text-white rounded-md" style={{ textShadow: '1px 1px 2px black' }}>Onde Assistir</button>
                                                    <button className="capitalize bg-orange-600 p-2 text-white rounded-md" style={{ textShadow: '1px 1px 2px black' }}>Agenda {timeSelecionado?.id}</button>
                                                </div>
                                                <div className="absolute top-10 right-2">
                                                    <div className="relative w-30 h-45 md:h-40">
                                                        <Image
                                                            alt={`${jogadorEstrela?.nome}`}
                                                            src={jogadorEstrela?.imagem || IMAGEM_JOGADOR_DEFAULT}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className={`absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent opacity-70`} />
                                                </div>
                                            </Link>
                                        </SwiperSlide>
                                    ) : (
                                        <SwiperSlide>
                                            <div className="w-full h-full flex justify-center items-center rounded-xl bg-zinc-950 text-white">
                                                <h2 className="font-heading text-2xl">Nenhuma Próxima Partida encontrada</h2>
                                            </div>
                                        </SwiperSlide>
                                    )
                                }
                            </Swiper>
                        </div>


                        <div className="grid grid-cols-[1fr_40px] justify-center items-center w-full px-4 md:justify-between lg:text-lg">
                            <Link className="mx-auto line-clamp-1 md:mx-0" href={`/times/${timeSelecionado?.id}`}>Navegar para página da Organização</Link>
                            <button
                                className="mx-auto cursor-pointer"
                                onClick={() => {
                                    localStorage.removeItem("timeSelecionado")
                                    setTimeSelecionadoConfirmado(false)
                                }}
                            >
                                <GoShieldX />
                            </button>
                        </div>
                    </div>
                )
            }
        </nav>
    )
}