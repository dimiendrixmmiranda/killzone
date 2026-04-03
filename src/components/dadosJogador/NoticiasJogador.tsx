import { Noticia } from "@/src/domain/Noticia"
import { titulo } from "@/src/utils/titulo"
import CardNoticia from "../cardNoticia/CardNoticia"


interface NoticiasJogadorProps {
    noticiasJogador: Noticia[]
}

export default function NoticiasJogador({ noticiasJogador }: NoticiasJogadorProps) {

    return (
        <div className="flex flex-col gap-4">
            {
                titulo('Notícias Relacionadas')
            }
            <ul className="flex flex-col gap-4">
                {
                    noticiasJogador.length <= 0 ? (
                        <li>
                            <h2>Nenhuma Notícia Encontrada</h2>
                        </li>
                    ) : (
                        noticiasJogador.map((noticia, i) => {
                            return (
                                <CardNoticia i={i} noticia={noticia} key={noticia.id} />
                            )
                        })
                    )
                }
            </ul>
        </div>
    )
}