'use client'

import { Time } from "@/src/domain/Time"
import { Jogador } from "@/src/domain/Jogador"
import { Noticia } from "@/src/domain/Noticia"

import Image from "next/image"
import Template from "@/src/components/template/Template"
import CarrosselMobile from "@/src/components/carrossel/carrosselMobile/CarrosselMobile"
import CardJogador from "@/src/components/cardJogador/CardJogador"
import Noticias from "@/src/components/noticias/Noticias"
import CarrosselWeb from "@/src/components/carrossel/carrosselWeb/CarrosselWeb"
import { useEffect, useState } from "react"
import { IMAGEM_JOGADOR_DEFAULT } from "@/src/assets/imagens"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Props {
    time: Time
    times: Time[]
    jogadores: Jogador[]
    noticias: Noticia[]
}

export default function TimeClient({
    time,
    times,
    jogadores,
    noticias
}: Props) {
    const [listaDeJogadores, setListaDeJogadores] = useState<Jogador[]>([])
    const [listaDeJogadoresDoTime, setListaDeJogadoresDoTime] = useState<Jogador[]>([])

    const jogadoresDefault: Jogador[] = Array.from({ length: 6 }).map((_, i) => ({
        id: `default-${i}`,
        nome: "Jogador Informado",
        apelido: "Não Informado",
        pais: "N/A",
        imagem: IMAGEM_JOGADOR_DEFAULT,
        jogoId: "",
        timeAtual: "",
        status: "default",
        categoria: 'ouro',
        sinergia: 0,
        highlights: "",
        papel: "rifler",
        estilo: "controlado"
    }))

    useEffect(() => {
        async function fetchListaDeJogadores() {
            const res = await fetch("/api/jogador")
            const data = await res.json()

            if (!Array.isArray(data)) {
                setListaDeJogadores([])
                return
            }

            if (time) {
                setListaDeJogadores(
                    data
                        .filter(n => n && n.id)
                )
            } else {
                setListaDeJogadores(data.filter(n => n && n.id))
            }
        }
        fetchListaDeJogadores()
    }, [])

    useEffect(() => {
        const jogadoresDoTime = listaDeJogadores.filter(
            jogador => jogador.timeAtual === time.id
        )

        const ativos = jogadoresDoTime.filter(j => j.status === "ativo")
        const inativos = jogadoresDoTime.filter(j => j.status !== "ativo")

        let listaFinal: Jogador[] = []

        // 1. Garantir 6 ativos (ou completar com default)
        if (ativos.length >= 6) {
            listaFinal = ativos.slice(0, 6)
        } else {
            const faltando = 6 - ativos.length
            listaFinal = [
                ...ativos,
                ...jogadoresDefault.slice(0, faltando)
            ]
        }

        // 2. Adicionar inativos no final
        listaFinal = [
            ...listaFinal,
            ...inativos
        ]

        setListaDeJogadoresDoTime(listaFinal)
    }, [time, listaDeJogadores])
    
    return (
        <Template>
            <div>
                <div
                    className="flex items-center gap-2 justify-center py-1"
                    style={{ backgroundColor: time.cor[0] }}
                >
                    <div className="relative w-10 h-10">
                        <Image
                            alt={`Escudo da organização ${time.nome}`}
                            src={time.imagem}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-4xl font-heading mt-2">
                        {time.nome}
                    </h1>
                </div>

                <div className="flex flex-col gap-4 p-2 max-w-360 mx-auto lg:p-4">

                    <CarrosselMobile time={time} />
                    <CarrosselWeb time={time} />

                    <section className="bg-zinc-950 flex flex-col p-4">
                        <h2 className="font-heading text-4xl pb-0">
                            Elenco Atual
                        </h2>

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
                                425: {
                                    slidesPerView: 2
                                },
                                768: {
                                    slidesPerView: 4
                                },
                                1024: {
                                    slidesPerView: 5
                                },
                                1440: {
                                    slidesPerView: 6
                                }
                            }}
                            pagination={{ clickable: true }}
                            navigation
                            className="w-full h-full flex justify-center items-center"
                        >
                            {listaDeJogadoresDoTime.map(j => (
                                <SwiperSlide key={j.id}>
                                    <CardJogador
                                        key={j.id}
                                        jogador={j}
                                        times={times}
                                        noticiasJogador={noticias}
                                    />
                                </SwiperSlide>
                            ))}

                        </Swiper>
                    </section>

                    <div className="xl:grid xl:grid-cols-[1fr_400px] xl:gap-8">
                        <Noticias time={time} />
                    </div>
                </div>
            </div>
        </Template>
    )
}