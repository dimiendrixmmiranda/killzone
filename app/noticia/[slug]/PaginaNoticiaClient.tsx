'use client'
import { IMAGEM_JOGADOR_DEFAULT, IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"
import Comentario from "@/src/components/comentario/Comentario"
import EstatisticaDaPartida from "@/src/components/estatisticasDaPartida/EstatisticaDaPartida"
import Template from "@/src/components/template/Template"
import { getJogadoresRelacionadosANoticia, getTeamsRelacionadosANoticia } from "@/src/services/campeonato.service"
import { getNewsById } from "@/src/services/news.service"
import { getPartidaById } from "@/src/services/partidas.service"
import { getPlayerById } from "@/src/services/player.service"
import { getTeamById } from "@/src/services/team.service"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Noticia } from "@/src/domain/Noticia"
import { useSession } from "next-auth/react"
import InterfaceComentario from "@/src/domain/Comentario"

interface PaginaNoticiaClient {
    slug: string
}

export default function PaginaNoticia({ slug }: PaginaNoticiaClient) {
    const { data: session, status } = useSession()
    const [user, setUser] = useState<any>(undefined)
    const [noticias, setNoticias] = useState<Noticia[]>([])
    const [noticiaAtual, setNoticiaAtual] = useState<Noticia>()
    const [comentarios, setComentarios] = useState<any[]>([])
    const [comentariosNoticiaAtual, setComentariosNoticiaAtual] = useState<any[]>([])
    const [inputComentario, setInputComentario] = useState('')

    console.log(noticiaAtual)

    useEffect(() => {
        setComentariosNoticiaAtual(comentarios)
    }, [comentarios, noticiaAtual])

    // Verificando usuário
    useEffect(() => {
        if (session?.user?.email) {
            fetch("/api/user")
                .then(res => res.json())
                .then(data => {
                    setUser(data)
                })
        }
    }, [session])

    // Lista de todas as notícias
    useEffect(() => {
        async function load() {
            const res = await fetch("/api/news")
            const data = await res.json()
            setNoticias(data)
        }
        load()
    }, [])

    // Achando a notícia Atual
    useEffect(() => {
        const not = noticias.find(noticia => noticia.slug === slug)
        if (not) setNoticiaAtual(not)
    }, [slug, noticias])

    useEffect(() => {
        if (!noticiaAtual?.id) return

        async function loadComments() {
            const res = await fetch(`/api/news/${noticiaAtual?.id}/comments`)
            const data = await res.json()

            setComentarios(data)
        }

        loadComments()
    }, [noticiaAtual])

    if (!noticiaAtual) {
        return (
            <Template>
                <div className="w-full min-h-screen flex justify-center items-center text-azul-escuro">
                    <h2 className="font-heading text-4xl text-center">
                        Carregando a Notícia....
                    </h2>
                </div>
            </Template>
        )
    }

    const timesRelacionados = getTeamsRelacionadosANoticia(noticiaAtual)
    const jogadoresRelacionados = getJogadoresRelacionadosANoticia(noticiaAtual)

    const partida = noticiaAtual.partidaId
        ? getPartidaById(noticiaAtual.partidaId)
        : undefined
    const timeA = partida ? getTeamById(partida?.timeAId) : undefined
    const timeB = partida ? getTeamById(partida?.timeBId) : undefined
    const jogadoresTimeA =
        partida?.mapas?.[0]?.estatisticasJogadores?.filter(
            jogador => jogador.timeId === timeA?.id
        )
    const jogadoresTimeB =
        partida?.mapas?.[0]?.estatisticasJogadores?.filter(
            jogador => jogador.timeId === timeB?.id
        )

    async function handleComment() {
        if (!inputComentario || !user?.id) return

        const res = await fetch(`/api/news/${noticiaAtual?.id}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: inputComentario,
                userId: user.id // 👈 ESSENCIAL
            })
        })

        if (!res.ok) {
            console.error("Erro ao comentar")
            return
        }

        const novoComentario = await res.json()

        setComentarios((prev) => [novoComentario, ...prev])

        setInputComentario("")
    }

    return (
        <Template>
            <div className="p-4 text-azul-escuro flex flex-col gap-6 max-w-360 mx-auto pb-[200px] lg:p-8">
                <div className="flex flex-col gap-3">
                    <h2 className="font-heading text-4xl font-bold lg:text-6xl">{noticiaAtual.titulo}</h2>
                    <h3 className="text-lg font-semibold lg:text-2xl">{noticiaAtual.resumo}</h3>
                </div>

                <div>
                    <div className="relative w-full h-75 rounded-md overflow-hidden md:h-100 lg:h-125 xl:h-150">
                        <Image alt={noticiaAtual.titulo} src={noticiaAtual.thumbnail} fill className="object-cover" />
                    </div>
                </div>
                <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 xl:grid-cols-[1fr_400px]">
                    <div className="flex flex-col gap-4 col-start-1 col-end-2 row-start-1 row-end-2">
                        {
                            Array.isArray(noticiaAtual.conteudo) ? (
                                noticiaAtual.conteudo.map((p, i) => (
                                    <p key={i} className="lg:text-xl">{p}</p>
                                ))
                            ) : (
                                <p className="lg:text-xl">
                                    {noticiaAtual.conteudo}
                                </p>
                            )
                        }
                    </div>
                    <div className="flex flex-col gap-4 col-start-1 col-end-2 row-start-1 row-end-2 lg:gap-8">
                        {
                            noticiaAtual.sobreOJogo?.map((jogo, i) => {
                                return (
                                    <div key={i} className="flex flex-col gap-2">
                                        <h3 className="font-heading text-3xl lg:text-4xl xl:text-5xl">{jogo.titulo}</h3>
                                        {
                                            jogo.conteudo.map((p, j) => {
                                                return (
                                                    <p key={j} className="lg:text-lg xl:text-2xl">{p}</p>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="col-start-1 col-end-3">
                        <EstatisticaDaPartida idPartida={noticiaAtual.partidaId} />
                    </div>
                    <div className="w-full h-full p-4 flex flex-col gap-8 col-start-2 col-end-3 row-start-1 row-end-2">
                        <div className="border-2 border-azul-escuro p-4 rounded-xl">
                            {
                                timesRelacionados.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <div className="w-2"></div>
                                            <h3 className="text-3xl font-heading">Times Relacionados</h3>
                                        </div>
                                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-2 xl:grid-cols-3">
                                            {timesRelacionados.map((time, i) => {
                                                return (
                                                    <li key={i} className="flex justify-center items-center bg-azul-escuro rounded-md w-22 h-22 mx-auto">
                                                        <Link href={`/times/${time.id}`}>
                                                            <div className="relative w-12 h-12">
                                                                <Image alt={`${time.nome}`} src={time.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                            </div>
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-3xl font-heading">Times Relacionados</h3>
                                        <p>Nenhum time relacionado!</p>
                                    </div>
                                )
                            }
                        </div>
                        {
                            partida ? (
                                <div className="border-2 border-azul-escuro p-4 rounded-xl">

                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-3xl font-heading">Lineups</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="relative w-10 h-10">
                                                        <Image alt={`${timeA?.nome}`} src={timeA?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                    </div>
                                                    <h2 className="capitalize font-heading text-3xl">{timeA?.id}</h2>
                                                </div>
                                                <ul className="flex flex-col gap-2">
                                                    {jogadoresTimeA?.map((jogador, i) => {
                                                        return (
                                                            <li key={i} className="flex justify-center items-center w-full">
                                                                <div className="w-full">
                                                                    <div className="w-full max-w-25 h-32.5 mx-auto bg-zinc-900 flex flex-col">
                                                                        <div className="relative w-full h-full">
                                                                            <Image alt={`${jogador.jogadorId}`} src={getPlayerById(jogador.jogadorId)?.imagem || IMAGEM_JOGADOR_DEFAULT} fill className="object-cover" />
                                                                        </div>
                                                                        <h2 className="text-center bg-white font-heading text-lg leading-5 mt-1">{jogador.jogadorId}</h2>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="relative w-10 h-10">
                                                        <Image alt={`${timeB?.nome}`} src={timeB?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                    </div>
                                                    <h2 className="capitalize font-heading text-3xl">{timeB?.id}</h2>
                                                </div>
                                                <ul className="flex flex-col gap-2">
                                                    {jogadoresTimeB?.map((jogador, i) => {
                                                        return (
                                                            <li key={i} className="flex justify-center items-center w-full">
                                                                <div className="w-full">
                                                                    <div className="w-full max-w-25 h-32.5 mx-auto bg-zinc-900 flex flex-col">
                                                                        <div className="relative w-full h-full">
                                                                            <Image alt={`${jogador.jogadorId}`} src={getPlayerById(jogador.jogadorId)?.imagem || IMAGEM_JOGADOR_DEFAULT} fill className="object-cover" />
                                                                        </div>
                                                                        <h2 className="text-center bg-white font-heading text-lg leading-5 mt-1">{jogador.jogadorId}</h2>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-azul-escuro p-4 rounded-xl">
                                    {
                                        jogadoresRelacionados.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                <h3 className="text-3xl font-heading">Jogadores Relacionados</h3>
                                                <ul className="grid grid-cols-3 gap-2 xl:grid-cols-3">
                                                    {jogadoresRelacionados.map((jogador, i) => {
                                                        return (
                                                            <li key={i} className="flex justify-center items-center w-full">
                                                                <Link href={`/times/${jogador.id}`} className="w-full">
                                                                    <div className="w-full max-w-25 h-32.5 mx-auto bg-zinc-900 flex flex-col">
                                                                        <div className="relative w-full h-full">
                                                                            <Image alt={`${jogador.nome}`} src={jogador.imagem || IMAGEM_JOGADOR_DEFAULT} fill className="object-cover" />
                                                                        </div>
                                                                        <h2 className="text-center bg-white font-heading text-lg leading-5 mt-1">{jogador.id}</h2>
                                                                    </div>
                                                                </Link>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <h3 className="text-3xl font-heading">Jogadores Relacionados</h3>
                                                <p>Nenhum jogador relacionado!</p>
                                            </div>
                                        )
                                    }

                                </div>
                            )
                        }


                        <div>
                            {
                                partida ? (
                                    <div className="flex flex-col gap-2 border-2 border-azul-escuro p-4 rounded-xl">
                                        <h3 className="text-3xl font-heading">Picks e Bans</h3>
                                        <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                                            {partida.pickBan?.map((mapa, i) => {
                                                return (
                                                    <li key={i} className="flex flex-col">
                                                        <div
                                                            className="relative w-full h-11.25 rounded-md overflow-hidden"
                                                            style={{ boxShadow: '0 0 2px 1px black' }}
                                                        >
                                                            <Image
                                                                alt={`${mapa.mapa}`}
                                                                src={`/jogos/cs2/mapas/${mapa.mapa}.png`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            <div
                                                                className={`
                                                                    pointer-events-none absolute inset-0 ${mapa.situacao === 'pick' ? 'bg-linear-to-t from-green-600/70 to-transparent' : ''}
                                                                    ${mapa.situacao === 'removed' ? 'bg-linear-to-t from-red-600/70 to-transparent' : ''}
                                                                    ${mapa.situacao === 'decider' ? 'bg-linear-to-t from-yellow-500/70 to-transparent' : ''}
                                                                `}
                                                            />

                                                            {
                                                                mapa.situacao != 'decider' ? (
                                                                    <div
                                                                        className="absolute top-[50%] left-[50%]"
                                                                        style={{ transform: 'translate(-50%,-50%)' }}
                                                                    >
                                                                        <div className="relative w-7 h-7">
                                                                            <Image
                                                                                alt={`Pick ${getTeamById(mapa.timeId)}`}
                                                                                src={getTeamById(mapa.timeId)?.imagem || IMAGEM_TIME_DEFAULT}
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        </div>

                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className="absolute top-[50%] left-[50%]"
                                                                        style={{ transform: 'translate(-50%,-50%)' }}
                                                                    >
                                                                        <p className="font-bold text-[.7em] px-2 py-0.5 text-white" style={{ textShadow: '1px 1px 2px black' }}>Decider</p>
                                                                    </div>
                                                                )
                                                            }
                                                            {
                                                                mapa.situacao != 'decider' ? (
                                                                    <span className="bg-black text-white absolute top-0 right-0 px-2 text-[.5em] capitalize">{mapa.situacao}</span>
                                                                ) : ''
                                                            }
                                                        </div>
                                                        <p className="text-sm text-center capitalize font-bold">{mapa.mapa}</p>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                ) : ('')
                            }
                        </div>
                    </div>
                </div>

                <div>
                    {
                        user ? (
                            <div className="flex flex-col gap-1">
                                <textarea
                                    name="comentario"
                                    id="comentario"
                                    placeholder="Faça um comentário"
                                    className="border-2 border-azul-escuro w-full h-[200px] p-2 rounded-md bg-azul text-zinc-100 "
                                    value={inputComentario}
                                    onChange={(e) => setInputComentario(e.target.value)}
                                />
                                <button onClick={handleComment} className="bg-orange-600 w-full text-white font-heading text-3xl pt-2 cursor-pointer" style={{ textShadow: '1px 1px 2px black' }}>Adicionar um comentário</button>
                            </div>
                        ) : (
                            <div className="bg-azul-escuro text-white p-4 rounded-md flex justify-center items-center" style={{ textShadow: '1px 1px 2px black' }}>
                                <Link href={'/menu/login'} className="font-heading text-2xl text-center">Crie uma conta ou faça login para fazer um comentário!</Link>
                            </div>
                        )
                    }

                    <div className="mt-6">
                        <div>
                            <h4 className="font-heading text-4xl">Comentários</h4>
                        </div>
                        {
                            comentariosNoticiaAtual.length > 0 ? (
                                <ul className="flex flex-col gap-4 mt-4">
                                    {comentariosNoticiaAtual.map((c: InterfaceComentario, i) => {
                                        return (
                                            <Comentario comentario={c} key={i} />
                                        )
                                    })}
                                </ul>
                            ) : (
                                <div>
                                    <h2 className="font-heading text-2xl">
                                        Ninguém comentou ainda... Seja o Primeiro!
                                    </h2>
                                </div>
                            )
                        }
                    </div>

                </div>

                {
                    partida ? (
                        <div className="fixed bottom-12 left-0 py-4 z-20 bg-zinc-900 text-white w-full flex items-center justify-center gap-2 md:hidden">
                            <div className="flex items-center gap-1 font-heading text-6xl">
                                <div className="relative w-20 h-20">
                                    <Image alt={`${timeA?.nome}`} src={timeA?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                </div>
                                <span className="mt-2">{partida.placar.timeA}</span>
                            </div>
                            <div className="flex items-center gap-1 font-heading text-6xl">
                                <span className="mt-2">x</span>
                            </div>
                            <div className="flex items-center gap-1 font-heading text-6xl">
                                <span className="mt-2">{partida.placar.timeB}</span>
                                <div className="relative w-20 h-20">
                                    <Image alt={`${timeB?.nome}`} src={timeB?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                </div>
                            </div>
                        </div>
                    ) : ''
                }
                {
                    partida ? (
                        <motion.div
                            drag
                            dragMomentum={false}
                            className="hidden md:flex fixed bottom-12 right-4 bg-zinc-900 justify-center items-center text-white p-4 z-50 cursor-grab w-[300px] h-[140px]"
                        >
                            <div className="z-20 bg-zinc-900 text-white h-full w-full flex items-center justify-center gap-2">
                                <div className="flex items-center gap-1 font-heading text-6xl">
                                    <div className="relative w-20 h-20">
                                        <Image alt={`${timeA?.nome}`} src={timeA?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                    </div>
                                    <span className="mt-2">{partida?.placar.timeA}</span>
                                </div>
                                <div className="flex items-center gap-1 font-heading text-6xl">
                                    <span className="mt-2">x</span>
                                </div>
                                <div className="flex items-center gap-1 font-heading text-6xl">
                                    <span className="mt-2">{partida?.placar.timeB}</span>
                                    <div className="relative w-20 h-20">
                                        <Image alt={`${timeB?.nome}`} src={timeB?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : ''
                }
            </div>
        </Template>
    )
}