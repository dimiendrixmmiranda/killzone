"use client"

import { useEffect, useState } from "react"
import Template from "@/src/components/template/Template"

import {
    DndContext,
    useDraggable,
    useDroppable,
    DragEndEvent
} from "@dnd-kit/core"
import { getTeamById } from "@/src/services/team.service"
import Image from "next/image"
import { IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"
import { getCampeonatoById } from "@/src/services/campeonato.service"
import { Campeonato } from "@/src/domain/Campeonato"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"

type TimeID = string

type SlotTipo =
    | "time"
    | "3-0"
    | "0-3"
    | "advance"

interface Slot {
    id: string
    tipo: SlotTipo
    timeId?: TimeID
}

interface RedondoState {
    timesDisponiveis: TimeID[]
    slots: Slot[]
}

// Time Arrastavel
function TimeDraggable({ timeId, onRemove }: { timeId: TimeID, onRemove?: (id: TimeID) => void }) {

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: timeId
    })

    const style = transform
        ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
        : undefined

    const dadosTime = getTeamById(timeId)

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="
                w-[120px] h-[120px]
                rounded-lg
                grid grid-rows-[1fr_15px] gap-1
                text-black font-bold
                touch-none z-20 relative
                bg-zinc-800 p-2
                cursor-pointer
                sm:w-[140px] sm:h-[140px]
                md:w-[80px] md:h-[80px]
                lg:w-[110px] lg:h-[110px]
                xl:w-[140px] xl:h-[140px]
                2xl:w-[150px] 2xl:h-[150px]
            "
        >
            <div
                className="relative w-full h-full"
                {...listeners}
                {...attributes}
            >
                <Image alt={`${dadosTime?.nome || timeId}`} src={dadosTime?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
            </div>
            <h3 className="text-xs font-heading truncate self-center justify-self-center max-w-full text-white xl:text-lg" style={{ textShadow: '1px 1px 2px black' }}>
                {dadosTime?.nome}
            </h3>
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove(timeId)
                    }}
                    className="
                        absolute top-[-12px] right-[-12px]
                        w-5 h-5
                        bg-red-500 text-white
                        rounded-full
                        text-xs font-bold
                        flex items-center justify-center
                        cursor-pointer
                        z-50
                    "
                >
                    x
                </button>
            )}
        </div>
    )
}

// Slot Dropavel
function SlotDrop({ slot, children }: { slot: Slot, children?: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id: slot.id })

    return (
        <div className="flex flex-col gap-1 w-full justify-center items-center">
            <div
                ref={setNodeRef}
                className={`
                w-[130px] h-[130px]
                rounded-lg
                flex items-center justify-center
                transition-all z-10
                md:w-[110px]
                md:h-[110px]
                ${isOver ? "bg-azul-escuro border-2 border-white scale-105" : "bg-zinc-800"}
                lg:w-[140px]
                lg:h-[140px]
                xl:w-[170px]
                xl:h-[170px]
                2xl:w-[190px]
                2xl:h-[190px]

            `}
            >
                {children}
            </div>
            <p className="text-center font-bold font-heading">Advanced</p>
        </div>
    )
}


interface PickemClientProps {
    idCampeonato: string
}



export default function PickemClient({ idCampeonato }: PickemClientProps) {
    const [campeonatos, setCampeonatos] = useState<any[]>([])
    const [campeonatoAtual, setCampeonatoAtual] = useState<Campeonato | null>(null)
    const [pickemDefinido, setPickemDefinido] = useState<boolean>(false)

    const { data: session } = useSession()
    const [user, setUser] = useState<any>(undefined)

    // 🔹 pegar usuário
    useEffect(() => {
        if (session?.user?.email) {
            fetch("/api/user")
                .then(res => res.json())
                .then(data => setUser(data))
        }
    }, [session])

    // 🔹 pegar campeonatos
    useEffect(() => {
        fetch("/api/campeonatos")
            .then(res => res.json())
            .then(setCampeonatos)
    }, [])

    // 🔹 definir campeonato atual
    useEffect(() => {
        const camp = campeonatos.find(c => c.slugId === idCampeonato)
        if (camp) setCampeonatoAtual(camp)
    }, [idCampeonato, campeonatos])

    const times = campeonatoAtual?.timesIds ?? []

    // 🔹 STATE (AGORA SÓ SLOTS)
    const [slots, setSlots] = useState<Slot[]>([
        { id: "3-0", tipo: "3-0" },
        { id: "0-3", tipo: "0-3" },
        { id: "adv-1", tipo: "advance" },
        { id: "adv-2", tipo: "advance" },
        { id: "adv-3", tipo: "advance" },
        { id: "adv-4", tipo: "advance" },
        { id: "adv-5", tipo: "advance" },
        { id: "adv-6", tipo: "advance" },
    ])

    // 🔥 carregar pickem salvo
    useEffect(() => {
        async function fetchPickem() {
            if (!user?.id || !campeonatoAtual?.id) return

            const res = await fetch(
                `/api/pickem?userId=${user.id}&campeonatoId=${campeonatoAtual.id}`
            )

            const data = await res.json()

            setPickemDefinido(false)

            if (data?.picks) {
                setSlots(data.picks)
                setPickemDefinido(true)
            }
        }

        fetchPickem()
    }, [user, campeonatoAtual])

    // 🔥 calcular automaticamente
    const timesUsados = slots.map(s => s.timeId).filter(Boolean) as string[]
    const timesDisponiveis = times.filter(t => !timesUsados.includes(t))

    function removerTime(timeId: TimeID) {
        setSlots(prev =>
            prev.map(slot =>
                slot.timeId === timeId ? { ...slot, timeId: undefined } : slot
            )
        )
    }

    function getSlotTime(slotId: string) {
        return slots.find(s => s.id === slotId)?.timeId
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over) return

        const timeId = active.id as TimeID
        const slotId = over.id as string

        setSlots(prev => {
            const newSlots = [...prev]

            const targetIndex = newSlots.findIndex(s => s.id === slotId)
            if (targetIndex === -1) return prev

            const existingIndex = newSlots.findIndex(s => s.timeId === timeId)

            if (existingIndex !== -1) {
                const temp = newSlots[targetIndex].timeId
                newSlots[targetIndex].timeId = timeId
                newSlots[existingIndex].timeId = temp
            } else {
                newSlots[targetIndex].timeId = timeId
            }

            return newSlots
        })
    }

    async function salvarPickem() {
        if (!user?.id || !campeonatoAtual?.id) return

        await fetch("/api/pickem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                campeonatoId: campeonatoAtual.id,
                slots
            })
        })
    }

    console.log(pickemDefinido)

    return (
        <Template>
            <DndContext onDragEnd={handleDragEnd}>
                <div className="bg-zinc-950 p-4 md:p-8">
                    <div className="flex flex-col gap-8 max-w-[1440px] w-full mx-auto min-h-screen lg:gap-12">
                        <div>
                            <h2 className="font-heading text-6xl text-center capitalize">
                                Pick’Em Challenge {campeonatoAtual?.slugId?.replaceAll('-', ' ')}
                            </h2>
                            <p className="text-center">
                                O Pick’Em é um sistema de previsões para torneios em que os participantes escolhem quais equipes terão determinados desempenhos em cada fase da competição. Você precisa selecionar times que irão avançar invictos (3x0), equipes que serão eliminadas sem vencer (0x3) e os times que simplesmente passarão de fase. Cada acerto gera pontos, permitindo comparar seu desempenho com outros fãs ou desbloquear recompensas. A lógica pode ser adaptada para qualquer campeonato: você define as fases, os tipos de previsões e a pontuação para cada acerto, criando um desafio estratégico baseado no conhecimento sobre as equipes e seus resultados.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-8 lg:gap-10">
                            {/* TIMES DISPONÍVEIS */}
                            <div className={`grid grid-cols-2 md:grid-cols-8 gap-4 w-full justify-items-center`}>
                                {timesDisponiveis.map(timeId => (
                                    <TimeDraggable
                                        key={timeId}
                                        timeId={timeId}
                                        onRemove={removerTime}
                                    />
                                ))}
                            </div>

                            {/* 3-0 e 0-3 */}
                            <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-3">
                                <div className="col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col justify-center items-center">
                                    <p className="text-7xl text-white font-heading">3x0</p>
                                    <SlotDrop slot={slots.find(s => s.id === "3-0")!}>
                                        {getSlotTime("3-0") && (
                                            <TimeDraggable
                                                timeId={getSlotTime("3-0")!}
                                                onRemove={removerTime}
                                            />
                                        )}
                                    </SlotDrop>
                                </div>
                                <div className="flex justify-center items-center col-start-1 col-end-3 md:col-start-2 md:col-end-3">
                                    {
                                        pickemDefinido ? (
                                            <h2 className="font-heading text-center text-4xl hidden md:block md:text-5xl lg:text-6xl ">Você ja definiu seus times no Pick'em!</h2>
                                        ) : (
                                            <h2 className="font-heading text-center text-4xl hidden md:block md:text-5xl lg:text-6xl ">Você ainda não definiu seus times no Pick'em!</h2>
                                        )
                                    }
                                </div>
                                <div className="col-start-2 col-end-3 row-start-1 row-end-2 flex flex-col justify-center items-center md:col-start-3 md:col-end-4">
                                    <p className="text-7xl text-white font-heading">0x3</p>
                                    <SlotDrop slot={slots.find(s => s.id === "0-3")!}>
                                        {getSlotTime("0-3") && (
                                            <TimeDraggable
                                                timeId={getSlotTime("0-3")!}
                                                onRemove={removerTime}
                                            />
                                        )}
                                    </SlotDrop>

                                </div>
                            </div>

                            {/* ADVANCE */}
                            <div className="grid grid-cols-2 gap-2 w-full justify-items-center md:grid-cols-6">
                                {slots
                                    .filter(s => s.tipo === "advance")
                                    .map(slot => (
                                        <SlotDrop key={slot.id} slot={slot}>
                                            {slot.timeId && (
                                                <TimeDraggable
                                                    timeId={slot.timeId}
                                                    onRemove={removerTime}
                                                />
                                            )}
                                        </SlotDrop>
                                    ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 max-w-125 ml-auto mr-4">
                            <button disabled={pickemDefinido ? true : false} className={`font-bold bg-green-600 w-full text-center p-2 rounded-md text-xl ${pickemDefinido ? 'opacity-40' : 'opacity-100'}`} onClick={salvarPickem} style={{ textShadow: '1px 1px 2px black' }}>Salvar!</button>
                            <button disabled={pickemDefinido ? true : false} className={`font-bold bg-red-600 w-full text-center p-2 rounded-md text-xl ${pickemDefinido ? 'opacity-40' : 'opacity-100'}`} onClick={salvarPickem} style={{ textShadow: '1px 1px 2px black' }}>Resetar!</button>
                        </div>
                        <div className="hidden">
                            <button>Simule as partidas</button>
                        </div>
                    </div>
                </div>
            </DndContext>
        </Template>
    )
}