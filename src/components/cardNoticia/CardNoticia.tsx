import Link from "next/link"
import { Noticia } from "../../domain/Noticia"
import Image from "next/image"
import { IMAGEM_NOTICIA_DEFAULT } from "@/src/assets/imagens"

interface CardNoticiaProps {
    noticia: Noticia
    i: number
    tamanhoCard?: string
    fonteTitulo?: string
    fonteSubitulo?: string
}

export default function CardNoticia({ noticia, tamanhoCard, fonteTitulo, fonteSubitulo, i }: CardNoticiaProps) {
    return (
        <li className={`text-azul-escuro overflow-hidden mx-auto w-full lg:hover:scale-[1.02] transition-all duration-500`}>
            <Link href={`/noticia/${noticia.slug}`} className={`grid grid-rows-2 h-full w-full sm:flex sm:flex-col md:grid md:grid-rows-1 md:grid-cols-2 pt-2 ${i == 0 ? ('') : ('border-t-2 border-azul-escuro')}  ${tamanhoCard}`}>
                <div className="relative p-2 flex flex-col gap-2 md:p-3">
                    <h2 className={`font-bold text-lg ${fonteTitulo}`}>{noticia.titulo}</h2>
                    <h4 className={`text-sm ${fonteSubitulo}`}>{noticia.resumo}</h4>
                    <p className="text-xs mt-auto">
                        {noticia.autor}, {" "}
                        {new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })} {" ás "}
                        {new Date(noticia.dataPublicacao).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
                <div className="relative w-full h-full sm:h-50 md:h-full">
                    <Image alt={noticia.titulo} src={noticia.thumbnail || IMAGEM_NOTICIA_DEFAULT} fill className="object-cover" />
                </div>
            </Link>
        </li>
    )
}