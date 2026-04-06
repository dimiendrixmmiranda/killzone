"use client"

import { useEffect, useState } from "react"
import {
    DndContext,
    useDraggable,
    useDroppable,
    DragEndEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCenter,
    DragOverlay
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"

import { IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"
import { getTeamById } from "@/src/services/team.service"
import { useSession } from "next-auth/react"
import { Countdown } from "@/src/utils/dataRegressiva"

type TimeID = string

interface Slot {
    id: string
    timeId?: TimeID
}

const TOTAL_SLOTS = 10

// ================= TIME =================
function TimeCard({
    timeId,
    listeners,
    attributes,
    setNodeRef,
    transform,
    isDragging,
    onRemove
}: any) {
    const time = getTeamById(timeId)

    const style = transform
        ? { transform: CSS.Translate.toString(transform) }
        : undefined

    return (
        <div
            key={time?.id}
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 p-2 rounded-md w-full
      touch-none select-none relative
      ${isDragging ? "opacity-40" : ""}`}
            {...listeners}
            {...attributes}
        >
            <div className="relative w-10 h-10">
                <Image
                    alt={time?.nome || ""}
                    src={time?.imagem || IMAGEM_TIME_DEFAULT}
                    fill
                    className="object-contain"
                />
            </div>

            <h3 className="font-heading text-3xl truncate mt-1">{time?.nome}</h3>

            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove(timeId)
                    }}
                    className="absolute right-2 top-1 text-red-500 font-bold"
                >
                    ✕
                </button>
            )}
        </div>
    )
}

// ================= DRAGGABLE =================
function TimeDraggable({
    timeId,
    onRemove
}: {
    timeId: TimeID
    onRemove?: (id: TimeID) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging
    } = useDraggable({
        id: timeId
    })

    return (
        <TimeCard
            timeId={timeId}
            listeners={listeners}
            attributes={attributes}
            setNodeRef={setNodeRef}
            transform={transform}
            isDragging={isDragging}
            onRemove={onRemove}
        />
    )
}

// ================= SLOT =================
function RankingSlot({
    slot,
    index,
    children
}: {
    slot: Slot
    index: number
    children?: React.ReactNode
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: slot.id
    })

    return (
        <li
            ref={setNodeRef}
            className={`bg-white grid grid-cols-[40px_1fr] min-h-[56px] rounded-md overflow-hidden
      ${isOver ? "ring-2 ring-white scale-[1.02]" : ""}`}
        >
            <div className="bg-azul-escuro flex items-center justify-center text-white font-bold">
                {index + 1}º
            </div>

            <div className="flex items-center bg-azul-escuro min-w-0">
                {children ?? (
                    <span className="text-white/40 text-sm">
                        Arraste um time
                    </span>
                )}
            </div>
        </li>
    )
}



// Componente
export default function RankingDaComunidade() {
    type Slot = {
        id: string
        timeId?: string
    }

    const { data: session, status } = useSession()
    const [user, setUser] = useState<any>(undefined)
    const [alreadyVoted, setAlreadyVoted] = useState<boolean | null>(null)
    const [rankingId, setRankingId] = useState<string | null>(null)
    const [resultado, setResultado] = useState<any[]>([])
    const [ranking, setRanking] = useState<any>(null)
    const [activeId, setActiveId] = useState<TimeID | null>(null)

    const [rankingState, setRankingState] = useState<{
        timesDisponiveis: string[]
        slots: Slot[]
    }>({
        timesDisponiveis: [],
        slots: []
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 }
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 150, tolerance: 8 }
        })
    )

    const timesUsados = rankingState.slots
        .map(s => s.timeId)
        .filter(Boolean) as string[]

    const timesDisponiveis = rankingState.timesDisponiveis.filter(
        t => !timesUsados.includes(t)
    )

    useEffect(() => {
        if (session?.user?.email) {
            fetch("/api/user")
                .then(res => res.json())
                .then(data => {
                    setUser(data)
                })
        }
    }, [session])


    useEffect(() => {
        async function loadRanking() {
            const res = await fetch("/api/rankingComunidade/active")
            const data = await res.json()

            setRanking(data)
        }

        loadRanking()
    }, [])

    useEffect(() => {
        if (!rankingId || !alreadyVoted) return

        async function fetchResultado() {
            const res = await fetch(
                `/api/rankingComunidade/result?rankingId=${rankingId}`
            )
            const data = await res.json()

            setResultado(data.ranking)
        }

        fetchResultado()
    }, [rankingId, alreadyVoted])

    useEffect(() => {
        if (!rankingId) return

        async function checkVote() {
            const res = await fetch(
                `/api/rankingComunidade/vote?rankingId=${rankingId}`
            )
            const data = await res.json()

            setAlreadyVoted(data.voted)
        }

        checkVote()
    }, [rankingId])

    useEffect(() => {
        async function fetchRanking() {
            const res = await fetch("/api/rankingComunidade/active")
            const data = await res.json()

            if (!res.ok) {
                console.error(data.error)
                return
            }

            setRankingId(data.id)

            if (data.status === "CLOSED") {
                setAlreadyVoted(true) // ou melhor: setIsClosed(true)
                return
            }

            setRankingState({
                timesDisponiveis: data.teams,
                slots: Array.from({ length: 10 }).map((_, i) => ({
                    id: `slot-${i}`
                }))
            })
        }

        fetchRanking()
    }, [])




    // ================= REMOVER =================
    function removerTime(timeId: TimeID) {
        setRankingState(prev => ({
            ...prev,
            slots: prev.slots.map(s =>
                s.timeId === timeId ? { ...s, timeId: undefined } : s
            )
        }))
    }
    // ================= DRAG END =================
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        setActiveId(null)
        if (!over) return

        const timeId = active.id as TimeID
        const slotId = over.id as string

        setRankingState(prev => {
            const slots = [...prev.slots]
            const targetIndex = slots.findIndex(s => s.id === slotId)
            if (targetIndex === -1) return prev

            const existingIndex = slots.findIndex(
                s => s.timeId === timeId
            )

            if (existingIndex !== -1) {
                const temp = slots[targetIndex].timeId
                slots[targetIndex].timeId = timeId
                slots[existingIndex].timeId = temp
            } else {
                slots[targetIndex].timeId = timeId
            }

            return { ...prev, slots }
        })
    }

    async function handleVote() {
        const positions = rankingState.slots
            .map((slot, index) => ({
                teamId: slot.timeId,
                position: index + 1
            }))
            .filter(p => p.teamId)

        // ✅ validação correta
        if (positions.length !== 10) {
            alert("Preencha todos os slots")
            return
        }

        const res = await fetch("/api/rankingComunidade/vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rankingId,
                positions
            })
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.error)
            return
        }

        setAlreadyVoted(true)
        alert("Voto enviado!")
    }

    // Ajustar
    // if (timesDisponiveis.length <= 0 && alreadyVoted) {
    //     return (
    //         <div className="bg-zinc-950 p-4 mt-4 flex flex-col gap-4">
    //             <h2 className="w-full h-6 bg-zinc-600"></h2>
    //             <div className="flex flex-col gap-2">
    //                 <p className="w-full h-4 bg-zinc-600"></p>
    //                 <p className="w-full h-4 bg-zinc-600"></p>
    //             </div>
    //             <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
    //                 <ul className="flex flex-col gap-2">
    //                     {
    //                         Array.from({ length: 10 }).map((_, i) => {
    //                             return (
    //                                 <li key={i} className="w-full h-[55px] bg-zinc-600 rounded-lg"></li>
    //                             )
    //                         })
    //                     }
    //                 </ul>
    //                 <ul className="flex flex-col gap-2">
    //                     {
    //                         Array.from({ length: 10 }).map((_, i) => {
    //                             return (
    //                                 <li key={i} className="w-full h-[55px] bg-zinc-600 rounded-lg"></li>
    //                             )
    //                         })
    //                     }
    //                 </ul>
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <div className="bg-orange-600 flex flex-col gap-4 p-4 mt-4 md:grid md:grid-cols-2">
            <div className="col-start-1 col-end-3" style={{ textShadow: '1px 1px 2px black' }}>
                <h2 className="font-heading text-4xl">
                    Ranking da Comunidade
                </h2>
                <p className="text-sm -mt-1">
                    O Ranking da Comunidade é uma funcionalidade interativa onde os usuários votam para definir a posição dos 10 times participantes. A votação fica aberta por 6 dias, permitindo que a comunidade influencie diretamente na classificação. No 7º dia, o sistema encerra a votação e exibe o ranking final consolidado com base nos votos recebidos.
                </p>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={(e) => setActiveId(e.active.id as TimeID)}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveId(null)}
            >
                {
                    alreadyVoted ? (
                        <div className="col-start-1 col-end-3 flex flex-col gap-4 md:grid md:grid-cols-2">
                            <div className="flex flex-col justify-center items-center col-start-1 col-end-3 md:flex-row md:justify-between">
                                <h3 className="font-heading text-2xl">Resultado até o momento:</h3>
                                <Countdown endDate={ranking.endDate} />
                                <div className="">
                                    <span className="font-heading text-2xl">
                                        {new Date(ranking.startDate).toLocaleDateString('pt-BR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    {" à "}
                                    <span className="font-heading text-2xl">
                                        {new Date(ranking.endDate).toLocaleDateString('pt-BR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>

                            <ul className="flex flex-col gap-2 col-start-1 col-end-3 md:grid md:grid-cols-2">
                                {resultado.map((item, index) => {
                                    const time = getTeamById(item.teamId)

                                    return (
                                        <li
                                            key={item.teamId}
                                            className="bg-white text-black grid grid-cols-[40px_1fr_auto] items-center p-2 rounded-md"
                                        >
                                            <div className="font-bold">{index + 1}º</div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-2 relative w-10 h-10">
                                                    <Image
                                                        src={time?.imagem || IMAGEM_TIME_DEFAULT}
                                                        alt={time?.nome || ""}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <span className="font-semibold">{time?.nome}</span>
                                            </div>

                                            <div className="font-bold">
                                                {item.points} pts
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ) : (
                        <div className="col-start-1 col-end-3 flex flex-col gap-4 md:grid md:grid-cols-2">
                            {/* ===== DISPONÍVEIS ===== */}
                            <ul className={`flex flex-col gap-2 ${timesDisponiveis.length <= 0 ? 'hidden' : ''}`}>
                                {timesDisponiveis.map(timeId => (
                                    <li key={timeId} className="bg-white rounded-md text-black">
                                        <TimeDraggable timeId={timeId} />
                                    </li>
                                ))}
                            </ul>

                            {/* ===== RANKING ===== */}
                            <ul className={`flex flex-col gap-2 mt-4 md:mt-0 ${timesDisponiveis.length <= 0 ? 'grid grid-cols-2 col-start-1 col-end-3' : ''}`}>
                                {rankingState.slots.map((slot, index) => (
                                    <RankingSlot key={slot.id} slot={slot} index={index}>
                                        {slot.timeId && (
                                            <TimeDraggable
                                                timeId={slot.timeId}
                                                onRemove={removerTime}
                                            />
                                        )}
                                    </RankingSlot>
                                ))}
                            </ul>

                            <button
                                onClick={handleVote}
                                className="col-start-1 col-end-3 bg-azul-escuro font-bold text-xl py-3 cursor-pointer"
                            >
                                Salvar Votação
                            </button>

                            {/* 🔥 ESSENCIAL PRO MOBILE */}
                            <DragOverlay>
                                {activeId ? <TimeCard timeId={activeId} /> : null}
                            </DragOverlay>
                        </div>
                    )
                }
            </DndContext>
        </div>
    )
}