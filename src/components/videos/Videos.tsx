'use client'
import { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Dialog } from 'primereact/dialog';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useSession } from "next-auth/react";
import InterfaceComentario from "@/src/domain/Comentario";
import Link from "next/link";
import Comentario from "../comentario/Comentario";

type Video = {
    id: string
    titulo: string
    tipo: "local" | "youtube" | "tiktok" | "instagram"
    url: string
}

export default function Videos() {
    const [visible, setVisible] = useState(false);
    const [videoAtual, setVideoAtual] = useState<Video | null>(null)
    const [comentarios, setComentarios] = useState<any[]>([])
    const [comentariosVideoAtual, setComentariosVideoAtual] = useState<any[]>([])
    const [inputComentario, setInputComentario] = useState('')

    const [videos, setVideos] = useState<any[]>([])
    // useEffect(() => {
    //     const comentariosVideo = comentarios.filter(
    //         comentario => comentario.videoId === videoAtual?.id
    //     )
    //     setComentariosVideoAtual(comentariosVideo)
    // }, [comentarios, videoAtual])

    useEffect(() => {
        if (!videoAtual?.id) return

        async function loadComments() {
            const res = await fetch(`/api/video/${videoAtual?.id}/comments`)
            const data = await res.json()

            setComentarios(data)
        }

        loadComments()
    }, [videoAtual])

    const { data: session, status } = useSession()
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
        async function fetchvideos() {
            const res = await fetch("/api/video")
            const data = await res.json()
            setVideos(data)
        }

        fetchvideos()
    }, [])

    const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
    const videoDialogRef = useRef<HTMLVideoElement | null>(null)

    const [isPlaying, setIsPlaying] = useState(true)
    const [isMuted, setIsMuted] = useState(false)

    function togglePlay() {
        const video = videoDialogRef.current
        if (!video) return

        if (video.paused) {
            video.play()
            setIsPlaying(true)
        } else {
            video.pause()
            setIsPlaying(false)
        }
    }

    function toggleMute() {
        const video = videoDialogRef.current
        if (!video) return

        video.muted = !video.muted
        setIsMuted(video.muted)
    }

    // 🔥 pega ID de qualquer formato do YouTube
    function getYouTubeId(url: string) {
        if (url.includes("youtube.com/watch")) {
            return url.split("v=")[1]?.split("&")[0]
        }
        if (url.includes("youtube.com/shorts")) {
            return url.split("shorts/")[1]?.split("?")[0]
        }
        if (url.includes("youtu.be")) {
            return url.split("youtu.be/")[1]?.split("?")[0]
        }
        return null
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const video = entry.target as HTMLVideoElement

                    if (entry.isIntersecting) {
                        video.play()
                    } else {
                        video.pause()
                    }
                })
            },
            { threshold: 0.7 }
        )

        videoRefs.current.forEach(video => {
            if (video) observer.observe(video)
        })

        return () => observer.disconnect()
    }, [])

    function renderVideo(video: Video, isDialog = false) {
        if (video.tipo === "local") {
            return (
                <video
                    ref={isDialog ? videoDialogRef : undefined}
                    src={video.url}
                    autoPlay={isDialog}
                    loop
                    muted={isMuted}
                    playsInline
                    className={`w-full h-full ${!isDialog ? "pointer-events-none" : ""}`}
                />
            )
        }

        if (video.tipo === "youtube") {
            const videoId = getYouTubeId(video.url)

            return (
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    className={`w-full h-full ${!isDialog ? "pointer-events-none" : ""}`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            )
        }

        if (video.tipo === "tiktok") {
            return (
                <iframe
                    src={`https://www.tiktok.com/embed/${video.url.split("/video/")[1]}`}
                    className={`w-full h-full ${!isDialog ? "pointer-events-none" : ""}`}
                    allowFullScreen
                />
            )
        }

        if (video.tipo === "instagram") {
            return (
                <iframe
                    src={`${video.url}embed`}
                    className={`w-full h-full ${!isDialog ? "pointer-events-none" : ""}`}
                    allowFullScreen
                />
            )
        }
    }


    async function handleComment() {
        if (!inputComentario || !user?.id || !videoAtual?.id) return

        const res = await fetch(`/api/video/${videoAtual.id}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: inputComentario,
                userId: user.id,
                videoId: videoAtual.id // 👈 FALTAVA ISSO
            })
        })

        if (!res.ok) {
            console.error("Erro ao comentar")
            return
        }

        const novoComentario = await res.json()

        setComentarios((prev) => [
            novoComentario,
            ...(Array.isArray(prev) ? prev : [])
        ])

        setInputComentario("")
    }

    return (
        <div className="bg-zinc-950 p-4 mt-4 flex flex-col gap-4">
            <h2 className="font-heading text-4xl">
                Vídeos Curtos
            </h2>

            <div className='flex overflow-hidden'>
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    slidesPerView={1}
                    loop
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    navigation
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        450: { slidesPerView: 2, spaceBetween: 15 },
                        768: { slidesPerView: 3, spaceBetween: 15 },
                        1024: { slidesPerView: 4, spaceBetween: 15 },
                        1280: { slidesPerView: 5, spaceBetween: 15 },
                    }}
                    className="w-full h-full"
                >
                    {videos.map((video, i) => (
                        <SwiperSlide key={i}>
                            <div
                                className="h-[340px] w-[200px] cursor-pointer relative mx-auto rounded-lg overflow-hidden m-1 w-full h-full md:w-[230px] md:h-[370px] 2xl:w-[260px] 2xl:h-[420px] "
                                style={{ boxShadow: '0 0 3px 2px black' }}
                                onClick={() => {
                                    setVideoAtual(video)
                                    setVisible(true)
                                }}
                            >
                                {renderVideo(video)}

                                <div className="absolute bottom-4 left-[50%] text-white text-center bg-black/50 px-2 py-1 rounded -translate-x-1/2">
                                    {video.titulo}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <Dialog
                header={<h2>{videoAtual?.titulo}</h2>}
                visible={visible}
                onHide={() => setVisible(false)}
                className="w-[95%] max-w-[350px] md:max-w-[450px] lg:max-w-[1000px] xl:max-w-[1100px]"
            >
                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                    <div className="relative h-[380px] w-[240px] mx-auto rounded-lg overflow-hidden sm:w-[290px] sm:h-[470px] md:w-[370px] md:h-[520px] lg:h-[630px]">
                        {videoAtual && renderVideo(videoAtual, true)}
                    </div>

                    <div className="flex flex-col gap-6">
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
                                comentarios.length > 0 ? (
                                    <ul className="flex flex-col gap-4 mt-4 xl:overflow-y-scroll xl:h-[280px]">
                                        {comentarios.map((c: InterfaceComentario, i) => {
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
                </div>
            </Dialog>
        </div>
    )
}