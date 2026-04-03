import { IMAGEM_TROFEU_DEFAULT } from "@/src/assets/imagens"
import { Campeonato } from "@/src/domain/Campeonato"
import { getCampeonatoById } from "@/src/services/campeonato.service"
import Image from "next/image"

interface CabecalhoCampeonatoProps {
    campeonato: Campeonato
}

export default function CabecalhoCampeonato({ campeonato }: CabecalhoCampeonatoProps) {


    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 justify-center items-center">
                <div className="relative w-full">
                    <div className="relative w-full h-[200px]">
                        <Image alt={`Banner do campeonato ${campeonato?.nome}`} src={campeonato?.imagem || '/default/noticia/noticia.png'} fill className="object-cover" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-center absolute bottom-0 left-[50%] w-full p-2" style={{ transform: 'translate(-50%)', textShadow: '1px 1px 2px black' }}>
                        {campeonato?.nome}.
                    </h2>
                </div>
            </div>
        </div>
    )
}