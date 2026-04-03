"use client"

import { useState } from "react"
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
                max-w-[120px] h-[120px]
                w-full rounded-lg
                grid grid-rows-[1fr_15px] gap-1
                text-black font-bold
                touch-none z-20 relative
                bg-orange-400 p-2
                cursor-pointer
                md:max-w-[70px] md:h-[70px]
                lg:max-w-[110px] lg:h-[110px]
                xl:max-w-[130px] xl:h-[130px]
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
        <div className="flex flex-col gap-1 w-full">
            <div
                ref={setNodeRef}
                className={`
                w-full h-[80px]
                rounded-lg
                flex items-center justify-center
                transition-all z-10
                ${isOver ? "bg-azul-escuro border-2 border-white scale-105" : "bg-zinc-800"}
                lg:h-[120px]
                xl:h-[160px]
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
    const campeonato = getCampeonatoById(idCampeonato)
    const times = campeonato?.timesIds ?? []

    const [state, setState] = useState<RedondoState>({
        timesDisponiveis: times,
        slots: [
            { id: "3-0", tipo: "3-0" },
            { id: "0-3", tipo: "0-3" },
            { id: "adv-1", tipo: "advance" },
            { id: "adv-2", tipo: "advance" },
            { id: "adv-3", tipo: "advance" },
            { id: "adv-4", tipo: "advance" },
            { id: "adv-5", tipo: "advance" },
            { id: "adv-6", tipo: "advance" },
            { id: "adv-7", tipo: "advance" }
        ]
    })

    function removerTime(timeId: TimeID) {
        setState(prev => {
            const slotsAtualizados = prev.slots.map(slot =>
                slot.timeId === timeId ? { ...slot, timeId: undefined } : slot
            )

            const timesDisponiveisAtualizados = prev.timesDisponiveis.includes(timeId)
                ? prev.timesDisponiveis
                : [...prev.timesDisponiveis, timeId]

            return {
                ...prev,
                slots: slotsAtualizados,
                timesDisponiveis: timesDisponiveisAtualizados
            }
        })
    }

    function getSlotTime(slotId: string) {
        return state.slots.find(s => s.id === slotId)?.timeId
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over) return

        const timeId = active.id as TimeID
        const slotId = over.id as string

        setState(prev => {
            const slots = [...prev.slots]
            const targetSlotIndex = slots.findIndex(s => s.id === slotId)
            if (targetSlotIndex === -1) return prev
            const targetSlot = slots[targetSlotIndex]

            const existingSlotIndex = slots.findIndex(s => s.timeId === timeId)

            if (existingSlotIndex !== -1) {
                const oldSlot = slots[existingSlotIndex]
                const temp = targetSlot.timeId
                targetSlot.timeId = timeId
                oldSlot.timeId = temp
            } else {
                targetSlot.timeId = timeId
            }

            return { ...prev, slots }
        })
    }

    const timesUsados = state.slots.map(s => s.timeId).filter(Boolean) as string[]
    const timesDisponiveis = state.timesDisponiveis.filter(t => !timesUsados.includes(t))

    return (
        <Template>
            <DndContext onDragEnd={handleDragEnd}>
                <div className="bg-zinc-950 p-4 md:p-8">
                    <div className="flex flex-col gap-8 max-w-[1440px] w-full mx-auto min-h-screen lg:gap-12">
                        <div>
                            <h2 className="font-heading text-6xl text-center capitalize">
                                Pick’Em Challenge {campeonato?.id.replaceAll('-', ' ')}
                            </h2>
                            <p className="text-center">
                                O Pick’Em é um sistema de previsões para torneios em que os participantes escolhem quais equipes terão determinados desempenhos em cada fase da competição. Você precisa selecionar times que irão avançar invictos (3x0), equipes que serão eliminadas sem vencer (0x3) e os times que simplesmente passarão de fase. Cada acerto gera pontos, permitindo comparar seu desempenho com outros fãs ou desbloquear recompensas. A lógica pode ser adaptada para qualquer campeonato: você define as fases, os tipos de previsões e a pontuação para cada acerto, criando um desafio estratégico baseado no conhecimento sobre as equipes e seus resultados.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-8 lg:gap-10">
                            {/* TIMES DISPONÍVEIS */}
                            <div className="grid grid-cols-2 md:grid-cols-8 gap-4 w-full justify-items-center md:h-[150px] lg:h-[280px]">
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
                                <div className="col-start-1 col-end-2 row-start-1 row-end-2 flex justify-center items-center gap-2 max-w-[280px] mx-auto w-full">
                                    <p className="text-7xl text-white font-heading">3x0</p>
                                    <SlotDrop slot={state.slots.find(s => s.id === "3-0")!}>
                                        {getSlotTime("3-0") && (
                                            <TimeDraggable
                                                timeId={getSlotTime("3-0")!}
                                                onRemove={removerTime}
                                            />
                                        )}
                                    </SlotDrop>
                                </div>
                                <div></div>
                                <div className="col-start-2 col-end-3 row-start-1 row-end-2 flex justify-center items-center gap-2 max-w-[280px] mx-auto w-full md:col-start-3 md:col-end-4">
                                    <p className="text-7xl text-white font-heading">0x3</p>
                                    <SlotDrop slot={state.slots.find(s => s.id === "0-3")!}>
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
                            <div className="grid grid-cols-3 gap-4 w-full justify-items-center md:grid-cols-7">
                                {state.slots
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
                        <div className="flex w-full justify-center items-center">
                            <button className="font-bold bg-azul-escuro w-full text-center p-2 rounded-md text-xl">Salvar Minhas Escolhas!</button>
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