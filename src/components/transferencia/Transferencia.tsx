'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { getTeamSafe } from "@/src/services/team.service"
import Image from "next/image";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaCheck, FaPen, FaQuestion } from "react-icons/fa6";
import { IMAGEM_JOGADOR_DEFAULT, IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens";
import Link from "next/link";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import getYoutubeEmbedUrl from "@/src/utils/getYoutubeEmbedUrl";
import { useEffect, useState } from "react";

interface Props {
    teamId: string
}

export default function Transferencia() {
    const [listaDeTransferencias, setListaDeTransferencias] = useState<any[]>([])

    const situacaoTransferencia = (transferencia: any) => {

        let Icon = <FaQuestion />
        let color = "#eab308"

        switch (transferencia.status.toLowerCase()) {
            case 'rumor':
                Icon = <FaQuestion />
                color = "#eab308"
                break

            case 'fechado':
                Icon = <FaCheck />
                color = "#22c55e"
                break

            case 'falta_assinar':
                Icon = <FaPen />
                color = "#3b82f6"
                break

            default:
                Icon = <FaQuestion />
                color = "#a1a1aa"
                break
        }
        return (
            <div className="grid grid-cols-[30px_1fr] gap-x-2 p-2 w-full justify-self-center rounded-xl" style={{ backgroundColor: color }}>
                <div className="flex justify-center items-center col-start-1 col-end-2 row-start-1 row-end-3 w-full h-full text-2xl">
                    {Icon}
                </div>
                <div className="flex justify-center items-center">
                    <h3 className="capitalize">{transferencia.status.replaceAll('-', ' ').toLowerCase()}</h3>
                </div>
                <div className="col-start-2 col-end-3 flex justify-center items-center text-xs">
                    <span className="capitalize">{transferencia.tipo.toLowerCase()}</span>
                </div>
            </div>
        )
    }

    useEffect(() => {
        async function fetchListaDeTransferencias() {
            const res = await fetch("/api/transferencia")
            const data = await res.json()
            setListaDeTransferencias(data)
        }
        fetchListaDeTransferencias()
    }, [])


    if (listaDeTransferencias.length <= 0) {
        return (
            <div className="bg-zinc-950 p-4 mt-4 flex flex-col gap-4">
                <h2 className="w-full h-10 bg-zinc-600"></h2>
                <p className="w-full h-4 bg-zinc-600"></p>
                <div className="w-full h-[280px] bg-zinc-600"></div>
                <div className="w-full h-[80px] bg-zinc-600"></div>
                <div className="w-full h-[180px] bg-zinc-600"></div>
                <div className="w-full h-[20px] bg-zinc-600"></div>
            </div>
        )
    }

    return (
        <div className={`p-4 h-fit bg-zinc-950 flex flex-col gap-4 lg:h-full xl:h-fit xl:col-start-2 xl:col-end-3 xl:row-start-1 xl:row-end-2 xl:mt-4`}>

            <div>
                <h2 className="font-heading text-4xl">
                    Transferências
                </h2>
                <p className="text-sm -mt-1">Confira as principais transferências no mundo da bala!</p>
            </div>

            <Swiper
                modules={[Navigation]}
                navigation={true}
                spaceBetween={30}
                slidesPerView={"auto"}
                grabCursor={true}
                className="w-full"
            >
                {listaDeTransferencias.map((transferencia) => {

                    const jogador = transferencia.jogador
                    const timeA = getTeamSafe(transferencia.timeOrigemId)
                    const timeB = getTeamSafe(transferencia.timeDestinoId)

                    console.log(transferencia)

                    return (
                        <SwiperSlide key={transferencia.id} className="p-4 rounded-lg">
                            <div className="flex flex-col gap-2" style={{ textShadow: '1px 1px 2px black' }}>
                                <div className="flex flex-col gap-2">
                                    <div className="w-full h-[250px] overflow-hidden relative">
                                        <div className="relative w-full h-[350px] -mt-6 xl:h-[400px]">
                                            <Image alt={`${jogador?.nome}`} src={jogador?.imagem || IMAGEM_JOGADOR_DEFAULT} fill className="object-contain z-10" />
                                        </div>
                                        <div className="absolute top-[50%] left-[50%]" style={{ transform: 'translate(-50%,-50%)' }}>
                                            <div className="relative w-[250px] h-[250px]">
                                                <Image alt={`${timeA.nome}`} src={timeA.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain opacity-50" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-center text-center">
                                        <h2 className="font-bold text-xl line-clamp-1">{transferencia.jogador.nome}</h2>
                                        <p className="text-sm capitalize">{jogador?.papel || 'Rifler'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4 w-full h-full">
                                    <div className="flex items-center justify-center">
                                        <div className="flex flex-col justify-center items-center w-24 min-w-0">
                                            <div className="relative w-10 h-10">
                                                <Image alt={timeA.nome} src={timeA.imagem} fill className="object-contain" />
                                            </div>
                                            <span className="font-heading text-center truncate w-full">
                                                {timeA.nome}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <MdKeyboardArrowRight className="text-4xl" />
                                            <MdKeyboardArrowRight className="text-6xl -ml-7" />
                                            <MdKeyboardArrowRight className="text-4xl -ml-7" />
                                        </div>
                                        <div className="flex flex-col justify-center items-center w-20 min-w-0">
                                            <div className="relative w-10 h-10">
                                                <Image alt={timeB.nome} src={timeB.imagem} fill className="object-contain" />
                                            </div>

                                            <span className="font-heading text-center truncate w-full">
                                                {timeB.nome}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-center w-full h-full">
                                        {situacaoTransferencia(transferencia)}
                                    </div>
                                </div>
                                <div className="w-full h-[200px] rounded-md overflow-hidden bg-zinc-600">

                                    {getYoutubeEmbedUrl(jogador?.highlights) ? (
                                        <iframe
                                            className="w-full h-full"
                                            src={getYoutubeEmbedUrl(jogador?.highlights)!}
                                            title="Highlight do jogador"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white">
                                            Sem highlight disponível!
                                        </div>
                                    )}

                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href={'/'} className="underline self-center">Saiba mais +</Link>
                                    <div className="text-2xl font-bold flex items-center gap-2 justify-self-end">
                                        <button className="bg-green-500 p-2 rounded-full"><AiOutlineLike /></button>
                                        <button className="bg-red-500 p-2 rounded-full"><AiOutlineDislike /></button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    )
}