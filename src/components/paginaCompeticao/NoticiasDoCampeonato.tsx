import { getAllNews } from "@/src/services/news.service"
import CardNoticia from "../cardNoticia/CardNoticia"
import { Paginator } from "primereact/paginator"
import { useEffect, useRef, useState } from "react"
import { Noticia } from "@/src/domain/Noticia"
import { Campeonato } from "@/src/domain/Campeonato"
import { useBreakpoints } from "@/src/utils/useTamanhoDeTela"

interface NoticiasDoCampeonatoProps {
    campeonato: Campeonato
}

export default function NoticiasDoCampeonato({ campeonato }: NoticiasDoCampeonatoProps) {
    const [first, setFirst] = useState(0)
    const [rows, setRows] = useState(2)
    const [noticias, setNoticias] = useState<Noticia[]>([])
    const { isSm, isMd, isLg, isXl, is2xl } = useBreakpoints()

    const topRef = useRef<HTMLDivElement | null>(null)

    const onPageChange = (event: any) => {
        setFirst(event.first)

        topRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    useEffect(() => {
        if (campeonato.formato === 'gsl-format') {
            setRows(4)
        } else if (campeonato.formato === 'gsl-format-playoff') {
            setRows(3)
        } else if (campeonato.formato === 'suico') {
            setRows(3)
        } else if (campeonato.formato === 'playoff') {
            setRows(3)
        } else {
            setRows(3)
        }
    }, [campeonato])

    useEffect(() => {
        setFirst(0)
    }, [noticias])

    useEffect(() => {
        async function fetchNews() {
            const res = await fetch("/api/news")
            const data = await res.json()

            if (!Array.isArray(data)) {
                setNoticias([])
                return
            }

            if (campeonato) {
                const noticiasFiltradas = data.filter(noticia => noticia.campeonatoId === campeonato.slugId)
                setNoticias(noticiasFiltradas)
            } else {
                setNoticias(data.filter(n => n && n.id))
            }
        }

        fetchNews()
    }, [campeonato])

    return (
        <div className={`flex flex-col text-white mt-6 w-full overflow-hidden lg:mt-0  ${campeonato.formato === 'gsl-format' || campeonato.formato === 'gsl-format-playoff' || campeonato.formato === 'playoff' ? 'col-start-3 col-end-4' : '2xl:col-start-2 2xl:col-end-4'}`}>
            <h3 className="font-heading text-3xl text-black">Notícias Do Campeonato</h3>
            <ul className="flex flex-col gap-4 ">
                {
                    noticias.length > 0 ? (
                        noticias
                            .slice(first, first + rows)
                            .map((noticia, i) => (
                                <CardNoticia
                                    i={i}
                                    key={noticia.id}
                                    noticia={noticia}
                                    fonteTitulo="xl:text-xl 2xl:text-2xl"
                                    fonteSubitulo="xl:text-sm xl:flex-1 2xl:text-base 2xl:line-clamp-2 2xl:flex-none"
                                    tamanhoCard="xl:h-[200px] max-w-[800px] mx-auto 2xl:max-w-[1000px]"
                                />
                            ))
                    ) : (
                        <li className="w-full h-[200px] bg-zinc-600 flex justify-center items-center rounded-md">
                            <p className="font-heading text-4xl text-center">Nenhuma notícia encontrada!</p>
                        </li>
                    )
                }
            </ul>
            <div className="mt-6">
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={noticias.length}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    )
}