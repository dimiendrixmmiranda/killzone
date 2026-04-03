'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { getTransferenciasByTeam } from "@/src/services/transferencia.service"
import { getPlayerById } from "@/src/services/player.service"
import { getTeamById, getTeamSafe } from "@/src/services/team.service"
import { transferencias } from "@/src/data/transferencias/transferencia.data"
import Image from "next/image";
import { Time } from "@/src/domain/Time";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaArrowRight, FaChair, FaCheck, FaPen, FaQuestion, FaUserSlash } from "react-icons/fa6";
import { IMAGEM_JOGADOR_DEFAULT, IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens";
import Link from "next/link";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import getYoutubeEmbedUrl from "@/src/utils/getYoutubeEmbedUrl";

interface Props {
    teamId: string
}

export default function Transferencia() {

    const situacaoTransferencia = (situacao: string) => {

        let Icon = <FaQuestion />
        let color = "#eab308"

        switch (situacao) {
            case 'rumor':
                Icon = <FaQuestion />
                color = "#eab308"
                break

            case 'fechado':
                Icon = <FaCheck />
                color = "#22c55e"
                break

            case 'falta-assinar':
                Icon = <FaPen />
                color = "#3b82f6"
                break

            case 'saida':
                Icon = <FaArrowRight />
                color = "#ef4444"
                break

            case 'banco':
                Icon = <FaChair />
                color = "#f97316"
                break

            case 'free_agent':
                Icon = <FaUserSlash />
                color = "#6b7280"
                break

            default:
                Icon = <FaQuestion />
                color = "#a1a1aa"
                break
        }

        return (
            <div className="flex items-center gap-2 p-2 w-fit justify-self-center rounded-xl" style={{ backgroundColor: color }}>
                {Icon}
                <h3 className="capitalize">{situacao.replaceAll('-', ' ')}</h3>
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
                {transferencias.map((transferencia) => {

                    const jogador = getPlayerById(transferencia.jogadorId)
                    const timeA = getTeamSafe(transferencia.timeOrigemId)
                    const timeB = getTeamSafe(transferencia.timeDestinoId)

                    return (
                        <SwiperSlide key={transferencia.id} className="p-4 rounded-lg">
                            <div className="flex flex-col gap-2" style={{ textShadow: '1px 1px 2px black' }}>
                                <div className="flex flex-col gap-2">
                                    <div className="w-full h-[250px] overflow-hidden relative">
                                        <div className="relative w-full h-[350px] -mt-6">
                                            <Image alt={`${jogador?.nome}`} src={jogador?.imagem || IMAGEM_JOGADOR_DEFAULT} fill className="object-contain z-10" />
                                        </div>
                                        <div className="absolute top-[50%] left-[50%]" style={{ transform: 'translate(-50%,-50%)' }}>
                                            <div className="relative w-[250px] h-[250px]">
                                                <Image alt={`${timeA.nome}`} src={timeA.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain opacity-50" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-center text-center">
                                        <h2 className="font-bold text-xl line-clamp-1">{transferencia.jogadorId}</h2>
                                        <p className="text-sm capitalize">{jogador?.papel || 'Rifler'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
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
                                    <div className="flex flex-col justify-center items-center">
                                        {situacaoTransferencia(transferencia.tipo)}
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