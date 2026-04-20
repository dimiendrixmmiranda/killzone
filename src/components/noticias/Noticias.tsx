'use client'

import { useEffect, useRef, useState } from "react"
import { GiConsoleController } from "react-icons/gi"
import { SiCounterstrike, SiLeagueoflegends, SiValorant } from "react-icons/si"
import { Paginator } from 'primereact/paginator'
import { Noticia } from "@/src/domain/Noticia"
import CardNoticia from "../cardNoticia/CardNoticia"
import { Time } from "@/src/domain/Time"
import { useBreakpoints } from "@/src/utils/useTamanhoDeTela"

interface NoticiasProps {
    time?: Time
}

export default function Noticias({ time }: NoticiasProps) {
    const { isLg } = useBreakpoints()
    const [noticias, setNoticias] = useState<Noticia[]>([])
    const [noticiasJogoAtual, setNoticiasJogoAtual] = useState<'geral' | 'cs2' | 'valorant' | 'lol'>('geral')
    const [noticiasFiltradas, setNoticiasFiltradas] = useState<Noticia[]>([])
    const [first, setFirst] = useState(0) // índice inicial
    const rows = 6 // quantidade por página

    const topRef = useRef<HTMLDivElement | null>(null)
    const offset = isLg ? 9 : 6

    const onPageChange = (event: any) => {
        setFirst(event.first)

        topRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    useEffect(() => {
        setFirst(0)
    }, [noticiasJogoAtual])

    useEffect(() => {
        if (noticiasJogoAtual === 'geral') {
            setNoticiasFiltradas(noticias)
            return
        }

        const filtradas = noticias.filter(
            noticia => noticia.jogoId === noticiasJogoAtual
        )

        setNoticiasFiltradas(filtradas)
    }, [noticias, noticiasJogoAtual])

    // Noticias do backend
    useEffect(() => {
        async function fetchNews() {
            const res = await fetch("/api/news")
            const data = await res.json()

            if (!Array.isArray(data)) {
                setNoticias([])
                return
            }

            if (time) {
                setNoticias(
                    data
                        .filter(n => n && n.id)
                        .filter(noticia => {
                            return noticia.timesRelacionados?.includes(time.id)
                        })
                )
            } else {
                setNoticias(data.filter(n => n && n.id))
            }
        }

        fetchNews()
    }, [time])

    return (
        <div className="flex flex-col w-full mt-4 gap-2 lg:gap-4" ref={topRef}>
            <div className="grid grid-cols-4 gap-1 w-full">
                <button className={`flex items-center gap-1 justify-center p-2 rounded-md font-bold cursor-pointer ${noticiasJogoAtual === 'geral' ? 'bg-azul-escuro' : 'text-azul-escuro'} md:text-xl`} onClick={() => setNoticiasJogoAtual('geral')}>
                    <GiConsoleController />
                    <p className="hidden sm:block">Geral</p>
                </button>
                <button className={`flex items-center gap-1 justify-center p-2 rounded-md font-bold cursor-pointer ${noticiasJogoAtual === 'cs2' ? 'bg-laranja' : 'text-azul-escuro'} md:text-xl`} onClick={() => setNoticiasJogoAtual('cs2')}>
                    <SiCounterstrike />
                    <p className="hidden sm:block">CS2</p>
                </button>
                <button className={`flex items-center gap-1 justify-center p-2 rounded-md font-bold cursor-pointer ${noticiasJogoAtual === 'valorant' ? 'bg-magenta' : 'text-azul-escuro'} md:text-xl`} onClick={() => setNoticiasJogoAtual('valorant')}>
                    <SiValorant />
                    <p className="hidden sm:block">Valorant</p>
                </button>
                <button className={`flex items-center gap-1 justify-center p-2 rounded-md font-bold cursor-pointer ${noticiasJogoAtual === 'lol' ? 'bg-piscina' : 'text-azul-escuro'} md:text-xl`} onClick={() => setNoticiasJogoAtual('lol')}>
                    <SiLeagueoflegends />
                    <p className="hidden sm:block">Lol</p>
                </button>
            </div>
            <ul className="flex flex-col gap-4">
                {
                    noticiasFiltradas.length <= 0 ? (
                        Array.from({ length: 6 }).map((_, index) => (
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
                        ))
                    ) : (
                        noticiasFiltradas
                            .slice(offset + first, offset + first + rows)
                            .map((noticia, i) => (
                                <CardNoticia noticia={noticia} i={i} key={noticia.id} fonteTitulo="md:text-2xl xl:text-3xl" fonteSubitulo="md:text-lg md:flex-1 xl:text-xl line-clamp-2" tamanhoCard="md:h-[190px] xl:h-[260px]" />
                            ))
                    )
                }
            </ul>
            <Paginator
                first={first}
                rows={rows}
                totalRecords={noticiasFiltradas.length}
                onPageChange={onPageChange}
                template="PrevPageLink PageLinks NextPageLink"
            />
        </div>
    )
}