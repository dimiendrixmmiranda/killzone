import { getAllNews } from "@/src/services/news.service"
import CardNoticia from "../cardNoticia/CardNoticia"
import { Paginator } from "primereact/paginator"
import { useEffect, useRef, useState } from "react"
import { Noticia } from "@/src/domain/Noticia"

export default function NoticiasDoCampeonato() {
    const [first, setFirst] = useState(0)
    const rows = 4 // vao ser 4 mais por enquanto vou deixar 2
    const [noticias, setNoticias] = useState<Noticia[]>([])

    const topRef = useRef<HTMLDivElement | null>(null)

    const onPageChange = (event: any) => {
        setFirst(event.first)

        topRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    useEffect(() => {
        setFirst(0)
    }, [noticias])

    useEffect(() => {
        const noticias = getAllNews()
        setNoticias(noticias)
    }, [])

    return (
        <div className="flex flex-col text-white mt-6 w-full overflow-hidden">
            <h3 className="font-heading text-3xl text-black">Notícias Do Campeonato</h3>
            <ul className="flex flex-col gap-4 md:grid md:grid-cols-2 xl:flex">
                {
                    noticias.length > 0 ? (
                        noticias
                            .slice(first, first + rows)
                            .map((noticia, i) => (
                                <CardNoticia
                                    i={i}
                                    key={noticia.id}
                                    noticia={noticia}
                                    fonteTitulo="xl:text-lg"
                                    fonteSubitulo="xl:text-sm xl:flex-1"
                                    tamanhoCard="xl:h-[175px]"
                                />
                            ))
                    ) : (
                        <li>
                            <p>Nenhuma notícia encontrada!</p>
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