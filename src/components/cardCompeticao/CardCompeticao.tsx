import { Campeonato } from "@/src/domain/Campeonato"
import { getSituacaoCampeonato } from "@/src/services/campeonato.service"
import { determinarDataPeriodo } from "@/src/utils/utils"
import Image from "next/image"
import Link from "next/link"
import { FaComputer } from "react-icons/fa6"
import { HiGlobeAlt } from "react-icons/hi"

interface CardCompeticaoProps {
    campeonato: Campeonato
}

export default function CardCompeticao({ campeonato }: CardCompeticaoProps) {
    function renderizarSituacao(situacao: string) {

        if (situacao === 'ocorrendo') {
            return <span className="bg-green-500 text-white px-2 py-1 rounded absolute top-2 left-2 text-sm" style={{ textShadow: '1px 1px 2px black' }}>Em Andamento</span>
        }

        if (situacao === 'futuro') {
            return <span className="bg-blue-500 text-white px-2 py-1 rounded absolute top-2 left-2 text-sm" style={{ textShadow: '1px 1px 2px black' }}>Em Breve</span>
        }

        return <span className="bg-zinc-950 text-white px-2 py-1 rounded absolute top-2 left-2 text-sm" style={{ textShadow: '1px 1px 2px black' }}>Encerrado</span>
    }

    return (
        <li key={campeonato.id} className="overflow-hidden rounded-lg">
            <Link href={`/menu/campeonato/${campeonato.slugId}`} className="flex flex-col relative">
                <div className="w-full h-50 relative">
                    <Image alt={campeonato.nome} src={campeonato.imagem} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-center items-center p-2 bg-white text-black">
                    <h2 className="font-heading text-3xl leading-6">{campeonato.nome}</h2>
                    {determinarDataPeriodo(campeonato.inicio, campeonato.fim)}
                </div>

                {
                    campeonato.tipo === 'lan' ? (
                        <div className="flex items-center justify-center gap-1 absolute top-2 right-2 text-white bg-zinc-950 p-1 rounded-md text-sm">
                            <FaComputer />
                            <p className="capitalize">{campeonato.tipo}</p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-1 absolute top-2 right-2 text-white bg-zinc-950 p-1 rounded-md text-sm">
                            <HiGlobeAlt />
                            <p className="capitalize">{campeonato.tipo}</p>
                        </div>
                    )
                }

                {
                    renderizarSituacao(
                        getSituacaoCampeonato(campeonato.inicio, campeonato.fim)
                    )
                }

            </Link>
        </li>
    )
}