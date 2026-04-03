'use client'

import Link from "next/link"
import { useEffect, useRef } from "react"
import { AiFillTikTok } from "react-icons/ai"
import { FaFacebook, FaInstagramSquare, FaTwitter } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

export default function SidebarVideos() {

    const videos = [
        { titulo: 'video 1', enderecoDoVideo: '/default/video/video.mp4' },
        { titulo: 'video 2', enderecoDoVideo: '/default/video/video.mp4' },
        { titulo: 'video 3', enderecoDoVideo: '/default/video/video.mp4' },
    ]

    const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

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
            {
                threshold: 0.7
            }
        )

        videoRefs.current.forEach(video => {
            if (video) observer.observe(video)
        })

        return () => observer.disconnect()

    }, [])

    return (
        <div className="h-full flex flex-col">

            <h3 className="p-2 text-base">
                Notícias, resenhas e memes — tudo sobre o mundo dos e-sports! Acesse nossas redes sociais e fique por dentro de muito mais. 🎮🔥
            </h3>

            <div className="h-[500px] overflow-y-scroll rounded-md snap-y snap-mandatory mt-2">

                {videos.map((video, index) => (
                    <div
                        key={index}
                        className="h-full snap-start relative"
                    >

                        <video
                            ref={(el) => {
                                videoRefs.current[index] = el
                            }}
                            src={video.enderecoDoVideo}
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute bottom-4 left-[50%] text-white bg-black/50 px-2 py-1 rounded" style={{ transform: 'translate(-50%)' }}>
                            {video.titulo}
                        </div>

                    </div>
                ))}

            </div>

            <div className="w-full mt-auto">
                <ul className="grid grid-cols-5 gap-4">
                    <li className="text-2xl">
                        <Link href={'/'} className="flex justify-center items-center">
                            <FaFacebook />
                        </Link>
                    </li>
                    <li className="text-2xl">
                        <Link href={'/'} className="flex justify-center items-center">
                            <FaInstagramSquare />
                        </Link>
                    </li>
                    <li className="text-2xl">
                        <Link href={'/'} className="flex justify-center items-center">
                            <AiFillTikTok />
                        </Link>
                    </li>
                    <li className="text-2xl">
                        <Link href={'/'} className="flex justify-center items-center">
                            <FaTwitter />
                        </Link>
                    </li>
                    <li className="text-2xl">
                        <Link href={'/'} className="flex justify-center items-center">
                            <MdEmail />
                        </Link>
                    </li>
                </ul>
            </div>

        </div>
    )
}