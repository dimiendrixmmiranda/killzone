import { IMAGEM_MAPA_DEFAULT } from "@/src/assets/imagens"
import { Campeonato } from "@/src/domain/Campeonato"
import { getMapasMaisJogadas } from "@/src/services/campeonato.service"
import { getPartidasByCampeonato } from "@/src/services/partidas.service"
import Image from "next/image"
import { IoIosInformationCircle } from "react-icons/io"
import { Dialog } from 'primereact/dialog';
import { useState } from "react"

interface DadosDoCampeonatoProps {
    campeonato: Campeonato
}

export default function DadosDoCampeonato({ campeonato }: DadosDoCampeonatoProps) {
    if (!campeonato.slugId) return []

    const partidas = getPartidasByCampeonato(campeonato.slugId)
    const mapas = getMapasMaisJogadas(partidas)
    const [visible, setVisible] = useState(false)

    return (
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:gap-10">
            {
                mapas && mapas.length > 0 ? (
                    <div className="lg:col-start-1 lg:col-end-2">
                        <h3 className="font-heading text-3xl">Mapa Mais Jogado:</h3>
                        <div className="md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-1 xl:grid-cols-2">
                            <div className="w-full h-55 relative rounded-md overflow-hidden">
                                <Image alt={`${mapas[0].mapa}`} src={`${mapas[0].mapa != null ? `/jogos/cs2/mapas/${mapas[0].mapa}.png` : IMAGEM_MAPA_DEFAULT}`} fill className="object-cover" unoptimized />
                                <h2 className="absolute bottom-0 left-0 w-full h-8 bg-purple-800 text-white flex justify-center items-center capitalize font-bold">
                                    {mapas[0].mapa} - {mapas[0].quantidade}
                                </h2>
                                <span className="absolute top-0 right-0 text-white font-heading text-2xl bg-purple-800 p-1">#1</span>
                                <div className="absolute top-2 right-2 md:hidden lg:block xl:hidden">
                                    <button className="text-xl" onClick={() => setVisible(true)}><IoIosInformationCircle /></button>
                                </div>
                            </div>
                            <ul className="grid grid-cols-3 gap-4 mt-4 md:mt-0 lg:hidden xl:grid">
                                {
                                    mapas.slice(1).map((mapa, i) => {
                                        return (
                                            <li key={i} className="relative">
                                                <div className="w-full h-[78px] relative rounded-t-md overflow-hidden">
                                                    <Image alt={mapa.mapa} src={`/jogos/cs2/mapas/${mapa.mapa}.png`} fill className="object-cover" />
                                                </div>
                                                <h3 className="capitalize text-center bg-purple-800 text-white rounded-b-md text-xs p-1 truncate xl:text-[.6em] 2xl:text-[.7em]" style={{ textShadow: '1px 1px 2px black' }}>
                                                    #{i + 2} - {mapa.mapa} - {mapa.quantidade}
                                                </h3>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-start-1 lg:col-end-2">
                        <h3 className="font-heading text-3xl">Mapa Mais Jogado: Indisponível</h3>
                        <div className="w-full h-55 relative rounded-md overflow-hidden">
                            <Image alt={`Mapa Indisponível`} src={IMAGEM_MAPA_DEFAULT} fill className="object-cover" unoptimized />
                        </div>
                    </div>
                )
            }
            <div className="flex flex-col gap-2 lg:col-start-2 lg:col-end-4 lg:grid lg:grid-cols-2">
                {/* Premiação */}
                <div className="lg:col-start-1 lg:col-end-3">
                    <h3 className="font-heading text-3xl">Premiações</h3>
                    <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3">
                        {
                            campeonato.premiacoes?.map((premiacao, i) => {
                                return (
                                    <li key={i} className="text-sm">
                                        <p>{premiacao.colocacao} - <b>{premiacao.classificacaoProximoStage ? 'Próximo Stage' : `${premiacao.valor} ${premiacao.moeda}$`}</b></p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="">
                    <h3 className="font-heading text-3xl">Datas</h3>
                    <div className="flex flex-wrap gap-1">
                        <span>De</span>
                        <span>
                            {new Date(campeonato.inicio).toLocaleDateString('pt-BR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                        <span>
                            até
                        </span>
                        <span>
                            {new Date(campeonato.fim).toLocaleDateString('pt-BR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
                <div className="">
                    <h3 className="font-heading text-3xl">Local</h3>
                    <p>{campeonato.local}</p>
                </div>
            </div>
            <Dialog header="Mais informações" visible={visible} style={{ width: '90vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                <div>
                    <ul className="flex flex-col gap-5 sm:grid sm:grid-cols-2">
                        {
                            mapas.map((mapa, i) => {
                                return (
                                    <li key={i} className="relative">
                                        <div className="absolute top-2 right-2 z-10 bg-zinc-950 w-6 h-6 rounded-full flex justify-center items-center text-xs">
                                            <p>#{i + 1}</p>
                                        </div>
                                        <div className="w-full h-[100px] relative rounded-t-md overflow-hidden">
                                            <Image alt={mapa.mapa} src={`/jogos/cs2/mapas/${mapa.mapa}.png`} fill className="object-cover" />
                                        </div>
                                        <h3 className="capitalize text-center bg-purple-800 rounded-b-md py-1" style={{ textShadow: '1px 1px 2px black' }}>
                                            {mapa.mapa} - {mapa.quantidade}
                                        </h3>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </Dialog>
        </div>
    )
}



