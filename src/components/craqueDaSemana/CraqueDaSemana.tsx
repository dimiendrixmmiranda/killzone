'use client'
import { IMAGEM_JOGADOR_DEFAULT, IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"
import { Jogador } from "@/src/domain/Jogador"
import { getTeamById } from "@/src/services/team.service"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Countdown } from "@/src/utils/dataRegressiva"

export default function CraqueDaSemana() {
    const { data: session } = useSession()

    const [jogadores, setJogadores] = useState<any[]>([])
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [jogadorSelecionado, setJogadorSelecionado] = useState<Jogador | null>(null)
    const [alreadyVoted, setAlreadyVoted] = useState<boolean | null>(null)
    const [resultado, setResultado] = useState<any[]>([])
    const [objetoCraque, setObjetoCraque] = useState<any | null>(null)
    const [user, setUser] = useState<any>(undefined)

    useEffect(() => {
        if (session?.user?.email) {
            fetch("/api/user")
                .then(res => res.json())
                .then(data => {
                    setUser(data)
                })
        }
    }, [session])

    useEffect(() => {
        async function fetchCraque() {
            const res = await fetch("/api/craque/active")
            const data = await res.json()

            if (!res.ok) {
                console.error(data.error)
                return
            }

            if (!data) return

            setSessionId(data.id)
            setObjetoCraque(data)

            // 🔥 aqui está a chave
            const jogadoresFormatados = data.players.map((p: any) => p.player)

            setJogadores(jogadoresFormatados)
        }

        fetchCraque()
    }, [])

    useEffect(() => {
        if (!alreadyVoted) return

        async function fetchResultado() {
            const res = await fetch("/api/craque/result")
            const data = await res.json()
            setResultado(data)
        }

        fetchResultado()
    }, [alreadyVoted])

    async function handleSubmit() {
        if (!jogadorSelecionado) {
            alert("Selecione um jogador")
            return
        }

        try {
            const res = await fetch("/api/craque/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user.id,
                    sessionId,
                    playerId: jogadorSelecionado.id
                })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error)
                return
            }

            alert("Voto registrado!")
            setAlreadyVoted(true)

        } catch (err) {
            console.error(err)
            alert("Erro ao votar")
        }
    }

    useEffect(() => {
        if (!sessionId || !user?.id) return

        async function checkVote() {
            const res = await fetch(`/api/craque/vote?sessionId=${sessionId}`)
            const data = await res.json()

            setAlreadyVoted(data.voted)
        }

        checkVote()
    }, [sessionId, user])

    // if (alreadyVoted === null) {
    //     return <div>Carregando...</div>
    // }

    console.log(jogadores)
    console.log(alreadyVoted)
    console.log(resultado)

    // if (jogadores.length <= 0) {
    //     return (
    //         <div className="bg-zinc-950 p-4 mt-4 flex flex-col gap-4">
    //             <h2 className="w-full h-6 bg-zinc-600"></h2>
    //             <div className="flex flex-col gap-2">
    //                 <p className="w-full h-4 bg-zinc-600"></p>
    //                 <p className="w-full h-4 bg-zinc-600"></p>
    //             </div>
    //             <Swiper
    //                 modules={[Pagination, Navigation, Autoplay]}
    //                 slidesPerView={1}
    //                 loop
    //                 autoplay={{
    //                     delay: 5000,
    //                     disableOnInteraction: false,
    //                 }}
    //                 spaceBetween={15}
    //                 breakpoints={{
    //                     425: {
    //                         slidesPerView: 2
    //                     },
    //                     768: {
    //                         slidesPerView: 3
    //                     },
    //                     1024: {
    //                         slidesPerView: 4
    //                     },
    //                     1440: {
    //                         slidesPerView: 6
    //                     }
    //                 }}
    //                 pagination={{ clickable: true }}
    //                 navigation
    //                 className="h-75 w-full"
    //             >
    //                 {Array.from({length: 6}).map((_, i) => {
    //                     return (
    //                         <SwiperSlide
    //                             key={i}
    //                             className="bg-zinc-600 rounded-xl relative w-full h-full max-w-62.5 mx-2"
    //                         >
    //                             <div className="bg-zinc-600 text-black grid grid-rows-[1fr_30px] h-full w-full rounded-xl relative"></div>
    //                         </SwiperSlide>
    //                     )
    //                 })}
    //             </Swiper>
    //         </div>
    //     )
    // }
    
    return (
        <>
            {
                alreadyVoted ? (
                    <div className="bg-zinc-950 p-4 mt-4 flex flex-col gap-4">
                        <h2 className="font-heading text-4xl flex justify-center items-center sm:justify-start">
                            Craque da Semana
                        </h2>
                        <div className="flex flex-col justify-center items-center md:flex-row md:justify-between">
                            <h3 className="font-heading text-2xl">Resultado até o momento:</h3>
                            <Countdown endDate={objetoCraque.endDate} />
                            <div className="">
                                <span className="font-heading text-2xl">
                                    {new Date(objetoCraque.startDate).toLocaleDateString('pt-BR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                                {" à "}
                                <span className="font-heading text-2xl">
                                    {new Date(objetoCraque.endDate).toLocaleDateString('pt-BR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                        <Swiper
                            modules={[Pagination, Navigation, Autoplay]}
                            slidesPerView={1}
                            loop
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            spaceBetween={15}
                            breakpoints={{
                                425: {
                                    slidesPerView: 2
                                },
                                768: {
                                    slidesPerView: 3
                                },
                                1024: {
                                    slidesPerView: 4
                                },
                                1440: {
                                    slidesPerView: 6
                                }
                            }}
                            pagination={{ clickable: true }}
                            navigation
                            className="h-75 w-full"
                        >
                            {resultado.sort((a, b) => b.votos - a.votos).map((item, index) => {
                                const jogador = jogadores.find(j => j.id === item.playerId)

                                return (
                                    <SwiperSlide
                                        key={item.playerId}
                                        className="bg-white text-black rounded-xl relative w-full h-full max-w-62.5"
                                    >
                                        <div className="bg-zinc-200 text-black grid grid-rows-[1fr_30px] h-full w-full rounded-xl relative">
                                            <span className="absolute top-2 left-2 font-bold font-heading text-4xl">{index + 1}º</span>
                                            <span className="absolute top-3 right-2 font-bold font-heading text-xl">{item.votos} vts</span>
                                            <div className="relative w-full h-full p-1">
                                                <Image
                                                    src={jogador?.imagem || IMAGEM_JOGADOR_DEFAULT}
                                                    alt={jogador?.nome || ""}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="w-full h-full flex justify-center items-center bg-zinc-900 text-white rounded-b-lg">
                                                <span className="font-semibold font-heading text-2xl">
                                                    {jogador?.apelido}
                                                </span>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </div>
                ) : (
                    <div className="bg-zinc-950 p-4 mt-4 flex flex-col gap-5">
                        <div>
                            <h2 className="font-heading text-4xl">
                                Craque da Semana
                            </h2>
                            <p>
                                O Craque da Semana é uma funcionalidade que destaca o jogador de maior destaque no período. A cada semana, 6 atletas pré-selecionados ficam disponíveis para votação do público durante 6 dias; ao final desse prazo, a votação é encerrada e, no 7º dia, o jogador mais votado é anunciado oficialmente como o Craque da Semana.
                            </p>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div>
                                <ul className="flex overflow-x-auto overflow-y-hidden gap-4 2xl:justify-center">
                                    {
                                        jogadores.map(((jogador, i) => {
                                            const time = getTeamById(jogador.timeAtual)
                                            return (
                                                <li className={`shrink-0 w-50 border-2 cursor-pointer ${jogadorSelecionado?.apelido.toLowerCase() === jogador.apelido.toLowerCase() ? 'border-2 border-orange-600' : 'border-zinc-700'}`} key={i} onClick={() => setJogadorSelecionado(jogador)}>
                                                    <div className="w-full">
                                                        <div className="w-full h-62.5 overflow-hidden relative">
                                                            <div className="relative w-full h-70 -mt-6">
                                                                <Image alt={`${jogador?.nome}`} src={jogador?.imagem || IMAGEM_JOGADOR_DEFAULT} fill className="object-cover z-10" />
                                                            </div>
                                                            <div className="absolute top-[50%] left-[50%]" style={{ transform: 'translate(-50%,-50%)' }}>
                                                                <div className="relative w-62.5 h-62.5">
                                                                    <Image alt={`${time?.nome}`} src={time?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain opacity-50" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h3 className="font-heading text-center text-3xl bg-zinc-700 pt-1" style={{ textShadow: '1px 1px 2px black' }}>{jogador.apelido}</h3>
                                                    </div>
                                                </li>
                                            )
                                        }))
                                    }
                                </ul>
                            </div>
                            <button
                                className="font-heading text-5xl text-center bg-orange-600 w-full pt-1 cursor-pointer" style={{ textShadow: '1px 1px 2px black' }}
                                onClick={handleSubmit}
                                disabled={!jogadorSelecionado}
                            >
                                Votar
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    )
}