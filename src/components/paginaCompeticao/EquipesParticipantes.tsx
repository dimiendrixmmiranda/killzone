import { Time } from "@/src/domain/Time"
import Image from "next/image"
import Link from "next/link"

interface EquipesParticipantesProps {
    times: Time[]
}

export default function EquipesParticipantes({ times }: EquipesParticipantesProps) {
    return (
        <div className="flex flex-col gap-2 w-full mb-auto">
            <h3 className="font-heading text-3xl md:col-start-1 md:col-end-3">Equipes Participantes</h3>
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 max-w-200">
                {times.map(time => {
                    const cores = time.cor

                    let styleBg: React.CSSProperties = {}

                    if (cores?.length === 2) {
                        styleBg.background = `linear-gradient(135deg, ${cores[0]}, ${cores[1]})`
                    } else if (cores?.length === 1) {
                        styleBg.background = cores[0]
                    }

                    return (
                        <li
                            key={time.id}
                            style={styleBg}
                            className={`flex flex-col gap-1 justify-center items-center p-2 rounded-md text-white ${!cores?.length ? "bg-white" : ""
                                }`}
                        >
                            <Link href={`/times/${time.id}`} className={`min-w-0 flex flex-col gap-1 justify-center items-center p-2 rounded-md text-white ${!cores?.length ? "bg-white" : ""
                                }`}>
                                <div className="relative w-10 h-10">
                                    <Image alt={time.nome} src={time.imagem} fill className="object-contain" />
                                </div>

                                <div className="max-w-[80px] lg:max-w-[70px] xl:max-w-[90px]">
                                    <h2 className="capitalize font-bold truncate lg:text-xs 2xl:text-base" style={{ textShadow: '1px 1px 2px black' }}>
                                        {time.id.replaceAll('-', ' ')}
                                    </h2>
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}