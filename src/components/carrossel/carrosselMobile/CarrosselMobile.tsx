'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Noticia } from '@/src/domain/Noticia';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Time } from '@/src/domain/Time';

interface CarrosselMobileProps {
    time?: Time
}

export default function CarrosselMobile({ time }: CarrosselMobileProps) {
    const [noticias, setNoticias] = useState<Noticia[]>([])

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

    if (noticias.length <= 0) {
        return (
            <div className='relative w-full h-95 bg-zinc-900 rounded-xl lg:hidden'></div>
        )
    }

    return (
        <div className='flex lg:hidden'>
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
                className="w-full h-full"
            >
                {noticias.slice(0, 6).map((noticia) => (
                    <SwiperSlide key={noticia.id}>
                        <Link href={`/noticia/${noticia.id}`} className="block relative h-95">
                            <Image
                                src={noticia.thumbnail}
                                alt={noticia.titulo}
                                fill
                                className="object-cover rounded-xl"
                                priority
                            />

                            <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col justify-end p-6">
                                <h3 className="text-2xl font-bold text-white">
                                    {noticia.titulo}
                                </h3>
                                <p className="text-zinc-200 mt-2 line-clamp-2">
                                    {noticia.resumo}
                                </p>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}