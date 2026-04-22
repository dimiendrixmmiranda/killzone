'use client'

import { getAllTeams } from "@/src/services/team.service";
import { getAllPlayers } from "@/src/services/player.service";
import { getAllNews } from "@/src/services/news.service";
import Template from "@/src/components/template/Template";
import { useMemo } from "react";
import Image from "next/image";
import CardNoticia from "@/src/components/cardNoticia/CardNoticia";
import Link from "next/link";
import { getAllPartidas } from "@/src/services/partidas.service";
import CardPartida from "@/src/components/cardPartida/CardPartida";
import { useCampeonatos } from "@/src/hooks/useCampeonatos";

interface Props {
    termo: string;
}

export default function ResultadoBuscaClient({ termo }: Props) {
    if (!termo) {
        return <p>Nenhum termo informado.</p>
    }
    const { campeonatos } = useCampeonatos()
    const termoLower = termo.toLowerCase();

    const times = getAllTeams()
    const jogadores = getAllPlayers()
    const noticias = getAllNews()
    const partidas = getAllPartidas()

    const timesAchados = times.filter(time =>
        time.nome.toLowerCase().includes(termoLower) ||
        time.id.toLowerCase().includes(termoLower)
    )
    const jogadoresAchados = jogadores.filter(jogador =>
        jogador.nome.toLowerCase().includes(termoLower) || jogador.id.toLowerCase().includes(termoLower)
    )
    const noticiasAchadas = noticias.filter(noticia =>
        noticia.titulo.toLowerCase().includes(termoLower) ||
        noticia.resumo.toLowerCase().includes(termoLower) ||
        noticia.conteudo?.join(' ').toLowerCase().includes(termoLower)
    )

    const campeonatosAchados = campeonatos.filter(camp =>
        camp.id.toLowerCase().includes(termoLower) ||
        camp.nome.toLowerCase().includes(termoLower)
    )

    const partidasAchadas = partidas.filter(camp =>
        camp.id.toLowerCase().includes(termoLower)
    )

    return (
        <Template>
            <div className="space-y-6 text-black p-4 max-w-360 mx-auto">
                <div>
                    <h3 className="font-heading text-6xl">Você buscou por: <b>{termo}</b></h3>
                </div>
                <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col gap-4 bg-zinc-300 p-2 rounded-md">
                        <h3 className="text-4xl font-heading">Times Encontrados</h3>
                        {
                            timesAchados.length > 0 ? (
                                <div>
                                    <ul className="grid grid-cols-3">
                                        {
                                            timesAchados.map((time, i) => {
                                                return (
                                                    <li key={i} className="bg-zinc-900 flex justify-center items-center p-2 rounded-md overflow-hidden max-w-27.5 mx-auto w-full" style={{ boxShadow: '0 0 2px 1px black' }}>
                                                        <Link href={`/times/${time.id}`}>
                                                            <div className="relative w-16 h-16">
                                                                <Image alt={time.nome} src={time.imagem} fill className="object-contain" />
                                                            </div>
                                                        </Link>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            ) : (
                                <div>
                                    <h3>Nenhum Time Encontrado!</h3>
                                </div>
                            )
                        }
                    </div>
                    <div className="flex flex-col gap-4 bg-zinc-300 p-2 rounded-md">
                        <h3 className="text-4xl font-heading">Jogadores Encontrados</h3>
                        {
                            jogadoresAchados.length > 0 ? (
                                <div>
                                    <ul className="grid grid-cols-2">
                                        {
                                            jogadoresAchados.map((jogador, i) => {
                                                return (
                                                    <li key={i} className="bg-zinc-900 flex flex-col justify-center items-center rounded-md overflow-hidden max-w-42.5 mx-auto w-full" style={{ boxShadow: '0 0 1px 1px black' }}>
                                                        <div className="relative w-full h-45">
                                                            <Image alt={jogador.nome} src={jogador.imagem} fill className="object-cover" />
                                                        </div>
                                                        <h3 className="w-full bg-white text-center font-bold text-xl">{jogador.apelido}</h3>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            ) : (
                                <div>
                                    <h3>Nenhum Time Encontrado!</h3>
                                </div>
                            )
                        }
                    </div>
                    <div className="flex flex-col gap-4 bg-zinc-300 p-2 rounded-md">
                        <h3 className="text-4xl font-heading">Campeonatos Encontrados</h3>
                        {
                            campeonatosAchados.length > 0 ? (
                                <div>
                                    <ul className="grid grid-cols-2 2xl:grid-cols-3">
                                        {
                                            campeonatosAchados.map((camp, i) => {
                                                return (
                                                    <li key={i} className="bg-zinc-900 flex flex-col justify-center items-center rounded-md overflow-hidden max-w-42.5 mx-auto w-full" style={{ boxShadow: '0 0 1px 1px black' }}>
                                                        <div className="relative w-full h-37.5">
                                                            <Image alt={camp.nome} src={camp.imagem} fill className="object-cover" />
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            ) : (
                                <div>
                                    <h3>Nenhum Time Encontrado!</h3>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-10 bg-zinc-300 p-2 rounded-md xl:p-4 xl:grid xl:grid-cols-3">
                    <div className="xl:col-start-1 xl:col-end-3">
                        <h3 className="text-4xl font-heading">Notícias Encontradas</h3>
                        {
                            noticiasAchadas.length > 0 ? (
                                <div>
                                    <ul className="flex flex-col gap-4 md:p-4">
                                        {
                                            noticiasAchadas.map((noticia, i) => {
                                                return (
                                                    <CardNoticia key={noticia.id} i={i} noticia={noticia} fonteTitulo="md:text-2xl xl:text-3xl" fonteSubitulo="md:text-lg md:flex-1 xl:text-xl" tamanhoCard="max-w-[900px] md:h-[240px] xl:h-[260px]" />
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            ) : (
                                <div>
                                    <h3>Nenhum Time Encontrado!</h3>
                                </div>
                            )
                        }
                    </div>
                    <div className="flex flex-col gap-6">
                        <h3 className="text-4xl font-heading text-center">Partidas Encontradas</h3>
                        <ul className="flex flex-col gap-4">
                            {
                                partidasAchadas.length > 0 ? (
                                    partidasAchadas.map(partida => {
                                        return (
                                            <CardPartida partida={partida} key={partida.id} />
                                        )
                                    })
                                ) : (
                                    <div>
                                        <h3 className="text-center">Nenhuma partida encontrada!</h3>
                                    </div>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </Template>
    )
}