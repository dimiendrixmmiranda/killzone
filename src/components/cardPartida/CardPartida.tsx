import { IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"
import { Partida } from "@/src/domain/Partida"
import { getTeamById } from "@/src/services/team.service"
import { determinarDataEHoraPartida } from "@/src/utils/utils"
import Image from "next/image"
import { TbDeviceTv } from "react-icons/tb"

interface CardPartidaProps {
    partida: Partida
    setMatchAberto?: React.Dispatch<React.SetStateAction<Partida | null>>
}

export default function CardPartida({ partida, setMatchAberto }: CardPartidaProps) {
    const timeA = getTeamById(partida.timeAId)
    const timeB = getTeamById(partida.timeBId)

    if (!timeA || !timeB) return null

    return (
        <li key={partida.id} className="mx-auto w-full rounded-md border border-azul-escuro p-2 grid grid-cols-[1fr_30px] gap-1 bg-azul-escuro text-white max-w-87.5 cursor-pointer overflow-hidden md:gap-2" onClick={() => setMatchAberto && setMatchAberto(prev => prev === partida ? null : partida)} >
            <div className="flex flex-col gap-1 w-full h-full overflow-hidden">
                <div className="grid grid-cols-[1fr_70px] gap-2">
                    <h3 className="text-xs capitalize truncate">{partida.campeonatoId?.replaceAll('-', ' ')} - {partida.fase.replaceAll('-', ' ')} </h3>
                    <span className={`capitalize text-xs px-1 truncate ${partida.situacao == 'em-andamento' ? 'bg-green-600' : ''} ${partida.situacao == 'finalizado' ? 'bg-red-600' : ''} ${partida.situacao == 'agendado' ? 'bg-yellow-600' : ''}`}>{partida.situacao.replaceAll('-', ' ')}</span>
                </div>
                <div className="grid grid-cols-[90px_1fr_20px] gap-2 relative sm:grid-cols-[140px_1fr_20px]">
                    <div className="flex flex-col gap-1 sm:gap-0">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-6 bg-cyan-600"></div>
                            <div className="relative w-6 h-6">
                                <Image alt={`${timeA?.nome}`} src={timeA?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                            </div>
                            <h4 className="capitalize font-bold text-xl font-heading truncate">{timeA?.id.replaceAll('-', ' ')}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-6 bg-orange-500"></div>
                            <div className="relative w-6 h-6">
                                <Image alt={`${timeB?.nome}`} src={timeB?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                            </div>
                            <h4 className="capitalize font-bold text-xl font-heading truncate">{timeB?.id.replaceAll('-', ' ')}</h4>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <ul className="flex items-center gap-1">
                            {
                                partida.mapas && partida.mapas.map((mapa, i) => {
                                    return (
                                        <li key={i} className="flex flex-col h-full w-full">
                                            <div className="flex flex-col mt-auto">
                                                {
                                                    mapa.resultado != null ? (
                                                        <div className="font-bold text-[.6em] text-center flex items-center justify-center">
                                                            <p className="text-cyan-600">{mapa.resultado?.timeA.total}</p>
                                                            <span>x</span>
                                                            <p className="text-orange-500">{mapa.resultado?.timeB.total}</p>
                                                        </div>
                                                    ) : ('')
                                                }
                                                <div className="relative rounded-md w-full overflow-hidden">
                                                    <div className="relative w-full h-4">
                                                        <Image alt={`${mapa.nome}`} src={`/jogos/cs2/mapas/${mapa.nome}.png`} fill className="object-cover" />
                                                    </div>
                                                    {
                                                        mapa.pick != 'decider' ? (
                                                            <div className="w-3 h-3 absolute top-[50%] left-[50%]" style={{ transform: 'translate(-50%,-50%)' }}>
                                                                <Image alt={mapa.pick} src={getTeamById(mapa.pick)?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-6 h-2 bg-zinc-500 text-white absolute top-[50%] left-[50%] text-[.4em] flex justify-center items-center" style={{ transform: 'translate(-50%,-50%)' }}>
                                                                Decider
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <p className="capitalize text-[.5em] text-center">{mapa.nome}</p>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="flex flex-col font-bold ml-auto">
                        <div>
                            <h3>
                                {partida.placar.timeA}
                            </h3>
                        </div>
                        <div>
                            <h3>
                                {partida.placar.timeB}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-full flex justify-center items-center bg-orange-600 rounded-r-sm row-start-1 row-end-3 col-start-2 col-end-3">
                <TbDeviceTv />
            </div>
            <div className="tracking-widest bg-orange-600 px-2">
                {determinarDataEHoraPartida(partida)}
            </div>
        </li>
    )
}