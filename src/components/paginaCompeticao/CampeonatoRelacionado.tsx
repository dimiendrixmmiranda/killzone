import { IMAGEM_TROFEU_DEFAULT } from "@/src/assets/imagens"
import { Campeonato } from "@/src/domain/Campeonato"
import { getCampeonatoById, getCampeonatosRelacionados, useCampeonatos } from "@/src/services/campeonato.service"
import Image from "next/image"
import Link from "next/link"

interface CampeonatoRelacionadoProps {
    campeonatoAtual: Campeonato
}

export default function CampeonatoRelacionado({ campeonatoAtual }: CampeonatoRelacionadoProps) {
    if (!campeonatoAtual.campeonatosRelacionados) return
    const campeonatos = useCampeonatos()

    const relacionados = getCampeonatosRelacionados(
        campeonatos,
        campeonatoAtual.campeonatosRelacionados ?? []
    )

    return (
        <div className="flex flex-col gap-2">
            <h3 className="font-heading text-3xl md:col-start-1 md:col-end-3">Campeonatos Relacionados</h3>
            <ul className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {
                    relacionados.map((camp, i) => {
                        return (
                            <li key={i} className="rounded-md overflow-hidden">
                                <Link href={`/menu/campeonato/${camp.slugId}`} className="relative">
                                    <div className="relative w-full h-[120px]">
                                        <Image alt={`${camp?.nome}`} src={camp?.imagem || IMAGEM_TROFEU_DEFAULT} fill className="object-cover" />
                                    </div>
                                    <h2 className="absolute bottom-2 font-heading text-2xl left-[50%] text-white truncate" style={{ transform: 'translate(-50%)' }}>{camp.nome}</h2>
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}