'use client';

import { useEffect, useState } from "react";
import { Noticia } from "@/src/domain/Noticia";
import Image from "next/image";
import Link from "next/link";
import { Time } from "@/src/domain/Time";

interface CarrosselWebProps {
    time?: Time
}

export default function CarrosselWeb({ time }: CarrosselWebProps) {
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [noticias, setNoticias] = useState<Noticia[]>([])

    const noticiaDefault = (index: number): Noticia => ({
        id: `default-${index}`,
        titulo: 'Notícia em breve',
        resumo: 'Estamos preparando novidades.',
        thumbnail: '/default/noticia/noticia.png',
        timesRelacionados: [],
        autor: 'Não Informado',
        dataPublicacao: '00/00/0000',
        slug: 'noticia-default'
    })

    const noticiasParaRenderizar = Array.from({ length: 9 }, (_, i) => {
        return noticias[i] ?? noticiaDefault(i);
    })

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

    if (noticias.length === 0) {
        return (
            <div className="w-full h-125 hidden grid-cols-2 gap-4 2xl:h-150 lg:grid">
                <div className="w-full h-full bg-zinc-600 relative" style={{ boxShadow: '0 0 2px 1px black' }}>
                    <div className="relative w-full h-full"></div>
                    <h2 className="bg-zinc-400 absolute bottom-4 left-[50%] text-center leading-8 text-2xl font-bold w-full max-w-[90%] p-2" style={{ transform: 'translate(-50%)' }}></h2>
                </div>

                <div className="w-full h-full grid grid-rows-2 gap-4">
                    <div className="w-full h-full bg-zinc-600 relative" style={{ boxShadow: '0 0 2px 1px black' }}>
                        <div className="relative w-full h-full"></div>
                        <h2 className="bg-zinc-400 absolute bottom-4 left-[50%] text-center leading-8 text-2xl font-bold w-full max-w-[90%] p-2" style={{ transform: 'translate(-50%)' }}></h2>
                    </div>
                    <div className="w-full h-full bg-zinc-600 relative" style={{ boxShadow: '0 0 2px 1px black' }}>
                        <div className="relative w-full h-full"></div>
                        <h2 className="bg-zinc-400 absolute bottom-4 left-[50%] text-center leading-8 text-2xl font-bold w-full max-w-[90%] p-2" style={{ transform: 'translate(-50%)' }}></h2>
                    </div>
                </div>
            </div>
        );
    }

    const paginas: Noticia[][] = [
        noticiasParaRenderizar.slice(0, 3),
        noticiasParaRenderizar.slice(3, 6),
        noticiasParaRenderizar.slice(6, 9),
    ];

    const pagina = paginas[paginaAtual];

    function proximo() {
        setPaginaAtual((prev) => (prev === 2 ? 0 : prev + 1));
    }

    function anterior() {
        setPaginaAtual((prev) => (prev === 0 ? 2 : prev - 1));
    }

    function renderItem(noticia: Noticia) {
        const isDefault = noticia.id.startsWith('default');

        const content = (
            <>
                <div className="relative w-full h-full">
                    <Image
                        alt={noticia.titulo}
                        src={noticia.thumbnail}
                        fill
                        className="object-cover"
                    />
                </div>
                <h2 className="bg-zinc-900 absolute bottom-4 left-[50%] text-center leading-8 text-2xl font-bold w-full max-w-[90%] p-2"
                    style={{ transform: 'translate(-50%)' }}>
                    {noticia.titulo}
                </h2>
            </>
        )

        if (isDefault) {
            return (
                <div className="w-full h-full bg-zinc-950 relative">
                    {content}
                </div>
            )
        }

        return (
            <Link href={`/noticia/${noticia.slug}`} className="w-full h-full bg-zinc-950 relative">
                {content}
            </Link>
        )
    }

    return (
        <div className="hidden lg:flex flex-col relative">
            {/* SETA ESQUERDA */}
            <button
                onClick={anterior}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-4xl text-white font-black bg-magenta rounded-full p-2"
                aria-label="Notícia anterior"
            >
                <div className="w-8 h-8 relative">
                    <Image alt="arro left" src={'/default/seta/esquerda.png'} fill className="object-contain" unoptimized />
                </div>
            </button>

            {/* SETA DIREITA */}
            <button
                onClick={proximo}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-4xl text-white font-black bg-magenta rounded-full p-2"
                aria-label="Próxima notícia"
            >
                <div className="w-8 h-8 relative">
                    <Image alt="arro right" src={'/default/seta/direita.png'} fill className="object-contain" unoptimized />
                </div>
            </button>

            <div className="w-full h-125 grid grid-cols-2 gap-4 xl:h-150">
                {renderItem(pagina[0])}

                <div className="grid grid-rows-2 gap-4">
                    {renderItem(pagina[1])}
                    {renderItem(pagina[2])}
                </div>
            </div>

            {/* CONTROLES (já existentes) */}
            <div className="flex justify-center gap-4 py-2">
                {[0, 1, 2].map((index) => (
                    <button
                        key={index}
                        onClick={() => setPaginaAtual(index)}
                        style={{ boxShadow: '0 0 2px 1px black' }}
                        className={`h-2 w-10 cursor-pointer ${paginaAtual === index ? "bg-zinc-900" : "bg-white"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}